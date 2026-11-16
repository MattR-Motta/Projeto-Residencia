import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const raizProjeto = path.dirname(fileURLToPath(import.meta.url))
const arquivoEnv = path.join(raizProjeto, '.env.local')

function carregarVariaveisAmbiente() {
  if (!existsSync(arquivoEnv)) return
  const conteudo = readFileSync(arquivoEnv, 'utf8')
  conteudo.split(/\r?\n/).forEach((linha) => {
    const correspondencia = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!correspondencia || correspondencia[1].startsWith('#')) return
    const valor = correspondencia[2].replace(/^['"]|['"]$/g, '')
    if (!process.env[correspondencia[1]]) process.env[correspondencia[1]] = valor
  })
}

carregarVariaveisAmbiente()

function responder(res, status, dados) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(dados))
}

const servidor = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  if (req.method !== 'POST' || req.url !== '/api/chatbot') {
    return responder(res, 404, { erro: 'Rota não encontrada.' })
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'sua_chave_aqui') {
    return responder(res, 500, { erro: 'Configure GEMINI_API_KEY no arquivo .env.local.' })
  }

  let corpo = ''
  req.on('data', (parte) => {
    corpo += parte
    if (corpo.length > 1_000_000) req.destroy()
  })

  req.on('end', async () => {
    try {
      const dados = JSON.parse(corpo || '{}')
      const mensagem = String(dados.mensagem || '').trim()
      if (!mensagem) return responder(res, 400, { erro: 'Informe uma mensagem.' })

      const perfil = String(dados.perfil || 'usuário')
      const historico = Array.isArray(dados.historico) ? dados.historico.slice(-10) : []
      const contexto = String(dados.contexto || '')
      const promptSistema = `Você é o assistente virtual do EduGest. Responda em português brasileiro, de forma clara e objetiva. O perfil informado é ${perfil}. Considere apenas o contexto fornecido pelo sistema; não invente dados nem afirme ter consultado informações que não recebeu. Se não houver dados suficientes, diga isso. Você não pode alterar, cadastrar ou excluir informações. Quando o usuário pedir uma alteração, explique que a ação não está disponível pelo assistente.`
      const contents = [
        ...historico.map((item) => ({ role: item.autor === 'usuario' ? 'user' : 'model', parts: [{ text: String(item.texto || '') }] })),
        { role: 'user', parts: [{ text: `${promptSistema}\n\nContexto disponível:\n${contexto}\n\nMensagem: ${mensagem}` }] },
      ]

      const respostaGemini = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.3, maxOutputTokens: 800 } }),
      })
      const resultado = await respostaGemini.json()
      if (!respostaGemini.ok) {
        const mensagemErro = resultado?.error?.message || 'Não foi possível consultar o Gemini.'
        return responder(res, respostaGemini.status, { erro: mensagemErro })
      }
      const textoResposta = resultado?.candidates?.[0]?.content?.parts?.map((parte) => parte.text || '').join('').trim()
      if (!textoResposta) return responder(res, 502, { erro: 'O Gemini não retornou uma resposta válida.' })
      return responder(res, 200, { resposta: textoResposta })
    } catch (erro) {
      console.error('Erro no chatbot:', erro)
      return responder(res, 500, { erro: 'Ocorreu um erro ao processar a mensagem.' })
    }
  })
})

const porta = Number(process.env.PORT || 3001)
servidor.listen(porta, () => console.log(`Servidor EduGest IA disponível em http://localhost:${porta}`))