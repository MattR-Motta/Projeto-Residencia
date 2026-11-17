import { readFileSync } from 'node:fs'

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
  console.log('Não encontrei GEMINI_API_KEY no .env.local (rode este arquivo na raiz do projeto).')
  process.exit(1)
}

console.log(`Node ${process.version} | chave com ${chave.length} caracteres, começa com "${chave.slice(0, 3)}"`)
console.log('Cada teste espera no máximo 30 segundos.\n')

const base = 'https://generativelanguage.googleapis.com/v1beta'
const corpoSimples = JSON.stringify({
  contents: [{ role: 'user', parts: [{ text: 'Responda apenas: ok' }] }],
})

async function testar(nome, url, opcoes = {}) {
  const inicio = Date.now()
  try {
    const resposta = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      ...opcoes,
      headers: { 'x-goog-api-key': chave, ...(opcoes.headers || {}) },
    })
    const texto = (await resposta.text()).replaceAll(chave, '***').replace(/\s+/g, ' ')
    console.log(`[${nome}] status ${resposta.status} em ${Date.now() - inicio} ms`)
    console.log(`    ${texto.slice(0, 250)}\n`)
  } catch (erro) {
    const motivo = [erro.name, erro.cause?.code].filter(Boolean).join(' / ')
    console.log(`[${nome}] FALHOU em ${Date.now() - inicio} ms: ${motivo}\n`)
  }
}

const postar = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpoSimples }

await testar('A) chave + rede (GET, lista de modelos)', `${base}/models?pageSize=1`)
await testar('B) gemini-3.8-flash (POST simples)', `${base}/models/gemini-3.8-flash:generateContent`, postar)
await testar('C) gemini-3.7-flash (POST simples)', `${base}/models/gemini-3.7-flash:generateContent`, postar)

console.log('Fim dos testes.')