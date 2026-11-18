import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { request } from 'node:https'
import { execFile } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let chave = process.env.GEMINI_API_KEY
if (!chave) {
  try {
    const texto = readFileSync(new URL('./.env.local', import.meta.url), 'utf8')
    const achou = texto.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)\s*$/m)
    if (achou) chave = achou[1].replace(/^['"]|['"]$/g, '').trim()
  } catch {
    // sem .env.local: cai no aviso abaixo
  }
}
if (!chave) {
  console.log('Não encontrei GEMINI_API_KEY no .env.local (rode na raiz do projeto).')
  process.exit(1)
}

const LIMITE = 20000
const host = 'generativelanguage.googleapis.com'
const caminho = (modelo) => `/v1beta/models/${modelo}:generateContent`
const corpo = JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Responda apenas: ok' }] }] })

function limpar(texto) {
  return String(texto).replaceAll(chave, '***').replace(/\s+/g, ' ').slice(0, 200)
}

async function viaFetch(modelo) {
  const resposta = await fetch(`https://${host}${caminho(modelo)}`, {
    method: 'POST',
    signal: AbortSignal.timeout(LIMITE),
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
    body: corpo,
  })
  return `status ${resposta.status} | ${limpar(await resposta.text())}`
}

function viaHttps(modelo, extra = {}) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        host,
        path: caminho(modelo),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(corpo),
          'x-goog-api-key': chave,
        },
        timeout: LIMITE,
        ...extra,
      },
      (res) => {
        let dados = ''
        res.on('data', (parte) => (dados += parte))
        res.on('end', () => resolve(`status ${res.statusCode} | ${limpar(dados)}`))
      },
    )
    req.on('timeout', () => req.destroy(new Error('sem resposta no tempo limite')))
    req.on('error', reject)
    req.write(corpo)
    req.end()
  })
}

const arquivoCorpo = join(tmpdir(), 'corpo-teste-gemini.json')
writeFileSync(arquivoCorpo, corpo)

function viaCurl(modelo) {
  const exe = process.platform === 'win32' ? 'curl.exe' : 'curl'
  const args = [
    '-sS', '--max-time', String(LIMITE / 1000),
    '-X', 'POST', `https://${host}${caminho(modelo)}`,
    '-H', 'Content-Type: application/json',
    '-H', `x-goog-api-key: ${chave}`,
    '--data-binary', `@${arquivoCorpo}`,
    '-w', '\nHTTP=%{http_code}',
  ]
  return new Promise((resolve, reject) => {
    execFile(exe, args, { timeout: LIMITE + 5000 }, (erro, saida, saidaErro) => {
      if (erro) return reject(new Error(limpar(saidaErro || erro.message)))
      resolve(limpar(saida))
    })
  })
}

console.log(`Node ${process.version} | chave com ${chave.length} caracteres`)
console.log(`Rodando 5 testes ao mesmo tempo (espera no máximo ${LIMITE / 1000} segundos)...\n`)

const testes = [
  ['1) Node fetch, gemini-2.5-flash', () => viaFetch('gemini-2.5-flash')],
  ['2) Node https, gemini-3.8-flash', () => viaHttps('gemini-3.8-flash')],
  ['3) Node https forçando IPv4, gemini-3.8-flash', () => viaHttps('gemini-3.8-flash', { family: 4 })],
  ['4) curl, gemini-3.8-flash', () => viaCurl('gemini-3.8-flash')],
  ['5) curl, gemini-2.5-flash', () => viaCurl('gemini-2.5-flash')],
]

const resultados = await Promise.all(
  testes.map(async ([nome, executar]) => {
    const inicio = Date.now()
    try {
      const saida = await executar()
      return `[${nome}] ${Date.now() - inicio} ms -> ${saida}`
    } catch (erro) {
      return `[${nome}] FALHOU em ${Date.now() - inicio} ms -> ${limpar(erro.message)}`
    }
  }),
)

resultados.forEach((linha) => console.log(linha + '\n'))
try { unlinkSync(arquivoCorpo) } catch { /* ignora */ }
console.log('Fim dos testes.')