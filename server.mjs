import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const raizProjeto = path.dirname(fileURLToPath(import.meta.url))
const arquivoEnv = path.join(raizProjeto, '.env.local')
const arquivoBaseIA = path.join(raizProjeto, 'src', 'services', 'ia', 'baseConhecimentoIA.json')

function carregarVariaveisAmbiente() {
  if (!existsSync(arquivoEnv)) return
  const conteudo = readFileSync(arquivoEnv, 'utf8')
  conteudo.split(/\r?\n/).forEach((linha) => {
    const correspondencia = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!correspondencia || correspondencia[1].startsWith('#')) return
    const valor = correspondencia[2].replace(/^['"]|['"]$/g, '')
    process.env[correspondencia[1]] = valor.trim()
  })
}

carregarVariaveisAmbiente()

let baseConhecimento = null

function carregarBaseConhecimento() {
  if (!existsSync(arquivoBaseIA)) {
    console.error(`Base de conhecimento não encontrada em: ${arquivoBaseIA}`)
    return null
  }
  try {
    return JSON.parse(readFileSync(arquivoBaseIA, 'utf8'))
  } catch (erro) {
    console.error('Erro ao ler baseConhecimentoIA.json:', erro)
    return null
  }
}

baseConhecimento = carregarBaseConhecimento()

function normalizarPerfil(valor) {
  const texto = String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  if (texto.includes('gestor')) return 'gestor'
  if (texto.includes('coordenador')) return 'coordenador'
  if (texto.includes('docente') || texto.includes('professor')) return 'docente'
  if (texto.includes('responsavel')) return 'responsavel'
  return null
}

function removerRotasDoTexto(texto) {
  return String(texto || '').replace(/\s*\(\/[a-z0-9/_:-]+\)/gi, '')
}

function limparTextoResposta(texto) {
  return String(texto || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*\*\s+/gm, '- ')
    .replace(/\*/g, '')
    .trim()
}

function obterContextoExclusivoDoPerfil(chavePerfil) {
  if (!baseConhecimento) return null

  const infoPerfil = baseConhecimento.sistema?.perfis?.[chavePerfil]
  const dadosPerfil = baseConhecimento.dadosPorPerfil?.[chavePerfil]

  if (!infoPerfil || !dadosPerfil) return null

  const menusSemRota = (infoPerfil.menus || []).map((menu) => ({
    abaMenuLateral: menu.label,
    funcao: removerRotasDoTexto(menu.funcao),
  }))

  const exemplosDoPerfil = (baseConhecimento.sistema?.exemplosAtendimento || [])
    .filter((exemplo) => exemplo.perfil === chavePerfil)
    .map((exemplo) => ({
      pergunta: exemplo.pergunta,
      respostaIdeal: removerRotasDoTexto(exemplo.respostaIdeal),
    }))

  return {
    sistema: {
      nome: baseConhecimento.sistema.nome,
      descricao: baseConhecimento.sistema.descricao,
      versao: baseConhecimento.sistema.versao,
      ambiente: baseConhecimento.sistema.ambiente,
    },
    perfilAtivo: {
      chave: chavePerfil,
      titulo: infoPerfil.titulo,
      abasMenuLateral: menusSemRota,
    },
    exemplosAtendimento: exemplosDoPerfil,
    dadosDoPerfil: dadosPerfil,
  }
}

const MODELOS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite']
const ESPERA_MAXIMA_MS = 15000

function responder(res, status, dados) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(dados))
}

async function consultarGemini(contents, systemInstruction) {
  let ultimoErro = { status: 502, mensagem: 'Não foi possível consultar o Gemini.' }

  for (const modelo of MODELOS) {
    try {
      const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
        method: 'POST',
        signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
        }),
      })
      const resultado = await resposta.json()

      if (resposta.ok) {
        const texto = resultado?.candidates?.[0]?.content?.parts?.map((parte) => parte.text || '').join('').trim()
        if (texto) return { texto: limparTextoResposta(texto), modelo }
        ultimoErro = { status: 502, mensagem: 'O Gemini não retornou uma resposta válida.' }
        console.warn(`${modelo}: resposta vazia, tentando o próximo modelo...`)
        continue
      }

      ultimoErro = { status: resposta.status, mensagem: resultado?.error?.message || 'Não foi possível consultar o Gemini.' }
      console.warn(`${modelo}: erro ${resposta.status}.`)
      if ([400, 401, 403].includes(resposta.status)) break
    } catch (erro) {
      ultimoErro = { status: 504, mensagem: 'O Gemini demorou demais para responder.' }
      console.warn(`${modelo}: sem resposta (${erro.name}), tentando o próximo modelo...`)
    }
  }

  if ([429, 503, 504].includes(ultimoErro.status)) {
    ultimoErro = { status: 503, mensagem: 'O assistente está com muita demanda agora. Tente novamente em instantes.' }
  }
  return { erro: ultimoErro }
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

  if (!baseConhecimento) {
    baseConhecimento = carregarBaseConhecimento()
    if (!baseConhecimento) {
      return responder(res, 500, {
        erro: 'Arquivo src/services/ia/baseConhecimentoIA.json não encontrado ou inválido.',
      })
    }
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

      const chavePerfil = normalizarPerfil(dados.perfil)
      if (!chavePerfil) {
        return responder(res, 400, { erro: 'Perfil de usuário inválido ou não informado.' })
      }

      const contextoPerfil = obterContextoExclusivoDoPerfil(chavePerfil)
      if (!contextoPerfil) {
        return responder(res, 500, { erro: `Dados do perfil "${chavePerfil}" não encontrados na base.` })
      }

      const historico = Array.isArray(dados.historico) ? dados.historico.slice(-10) : []
      const contextoTela = String(dados.contexto || '').trim()

      const systemInstruction = `Você é o assistente virtual oficial do EduGest.
Responda em português brasileiro, de forma clara, natural, educada e objetiva.

REGRAS DE FORMATAÇÃO E LINGUAGEM:
- Escreva sempre em texto simples. NUNCA use formatação Markdown como asteriscos (** ou *), crases (\`), underscores (_) ou cerquilhas (#).
- Para listas, use apenas hífen (-) no início de cada linha.
- NUNCA mencione rotas técnicas, URLs, endereços ou caminhos com barra (como /gestor/escolas).
- Quando precisar orientar o usuário a acessar alguma tela, cite apenas o nome da aba no menu lateral de forma natural (exemplo: "você pode ir na aba Escolas no menu lateral").

ESCOPO ESTRITO DO PERFIL ATIVO:
- O usuário está autenticado exclusivamente no perfil: ${chavePerfil} (${contextoPerfil.perfilAtivo.titulo}).
- Baseie suas respostas APENAS na BASE DE CONHECIMENTO DO PERFIL ATIVO e no CONTEXTO DA TELA ATUAL abaixo.
- Nunca invente informações e nunca responda sobre dados, telas ou funcionalidades de outros perfis. Se o usuário perguntar algo fora do perfil ${chavePerfil}, informe educadamente que essa informação não está disponível para o perfil atual.
- Você é apenas consultivo: não pode cadastrar, editar, aprovar, rejeitar ou excluir dados. Quando solicitado, explique isso de forma breve e indique qual aba do menu lateral o usuário deve acessar.

=== BASE DE CONHECIMENTO DO PERFIL ATIVO (${chavePerfil.toUpperCase()}) ===
${JSON.stringify(contextoPerfil)}

=== CONTEXTO DA SESSÃO ATUAL ===
${contextoTela || 'Nenhum contexto adicional enviado.'}`

      const contents = [
        ...historico.map((item) => ({
          role: item.autor === 'usuario' ? 'user' : 'model',
          parts: [{ text: String(item.texto || '') }],
        })),
        { role: 'user', parts: [{ text: mensagem }] },
      ]

      const resultado = await consultarGemini(contents, systemInstruction)
      if (resultado.erro) return responder(res, resultado.erro.status, { erro: resultado.erro.mensagem })

      console.log(`Resposta gerada com ${resultado.modelo} (perfil: ${chavePerfil}).`)
      return responder(res, 200, { resposta: resultado.texto })
    } catch (erro) {
      console.error('Erro no chatbot:', erro)
      return responder(res, 500, { erro: 'Ocorreu um erro ao processar a mensagem.' })
    }
  })
})

const porta = Number(process.env.PORT || 3001)
servidor.listen(porta, () => console.log(`Servidor EduGest IA disponível em http://localhost:${porta}`))