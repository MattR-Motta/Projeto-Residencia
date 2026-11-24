const raizProjeto = path.dirname(fileURLToPath(import.meta.url))
const arquivoEnv = path.join(raizProjeto, '.env.local')
const arquivoBaseIA = path.join(raizProjeto, 'src', 'services', 'ia', 'baseConhecimentoIA.json')

function carregarVariaveisAmbiente() {
  if (!existsSync(arquivoEnv)) return

carregarVariaveisAmbiente()

// Modelos tentados em ordem. Se um estiver sobrecarregado (503) ou sem resposta, tenta o próximo.
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

  res.end(JSON.stringify(dados))
}

async function consultarGemini(contents) {
async function consultarGemini(contents, systemInstruction) {
  let ultimoErro = { status: 502, mensagem: 'Não foi possível consultar o Gemini.' }

  for (const modelo of MODELOS) {
        method: 'POST',
        signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.3, maxOutputTokens: 2048 } }),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
        }),
      })
      const resultado = await resposta.json()

      if (resposta.ok) {
        const texto = resultado?.candidates?.[0]?.content?.parts?.map((parte) => parte.text || '').join('').trim()
        if (texto) return { texto, modelo }
        if (texto) return { texto: limparTextoResposta(texto), modelo }
        ultimoErro = { status: 502, mensagem: 'O Gemini não retornou uma resposta válida.' }
        console.warn(`${modelo}: resposta vazia, tentando o próximo modelo...`)
        continue
      }

      ultimoErro = { status: resposta.status, mensagem: resultado?.error?.message || 'Não foi possível consultar o Gemini.' }
      console.warn(`${modelo}: erro ${resposta.status}.`)
      // Problema de chave ou de pedido: trocar de modelo não resolve.
      if ([400, 401, 403].includes(resposta.status)) break
    } catch (erro) {
      ultimoErro = { status: 504, mensagem: 'O Gemini demorou demais para responder.' }
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
      const mensagem = String(dados.mensagem || '').trim()
      if (!mensagem) return responder(res, 400, { erro: 'Informe uma mensagem.' })

      const perfil = String(dados.perfil || 'usuário')
      const chavePerfil = normalizarPerfil(dados.perfil)
      if (!chavePerfil) {
        return responder(res, 400, { erro: 'Perfil de usuário inválido ou não informado.' })
      }

      const contextoPerfil = obterContextoExclusivoDoPerfil(chavePerfil)
      if (!contextoPerfil) {
        return responder(res, 500, { erro: `Dados do perfil "${chavePerfil}" não encontrados na base.` })
      }

      const historico = Array.isArray(dados.historico) ? dados.historico.slice(-10) : []
      const contexto = String(dados.contexto || '')
      const promptSistema = `Você é o assistente virtual do EduGest. Responda em português brasileiro, de forma clara e objetiva. O perfil informado é ${perfil}. Considere apenas o contexto fornecido pelo sistema; não invente dados nem afirme ter consultado informações que não recebeu. Se não houver dados suficientes, diga isso. Você não pode alterar, cadastrar ou excluir informações. Quando o usuário pedir uma alteração, explique que a ação não está disponível pelo assistente.`
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
        ...historico.map((item) => ({ role: item.autor === 'usuario' ? 'user' : 'model', parts: [{ text: String(item.texto || '') }] })),
        { role: 'user', parts: [{ text: `${promptSistema}\n\nContexto disponível:\n${contexto}\n\nMensagem: ${mensagem}` }] },
        ...historico.map((item) => ({
          role: item.autor === 'usuario' ? 'user' : 'model',
          parts: [{ text: String(item.texto || '') }],
        })),
        { role: 'user', parts: [{ text: mensagem }] },
      ]

      const resultado = await consultarGemini(contents)
      const resultado = await consultarGemini(contents, systemInstruction)
      if (resultado.erro) return responder(res, resultado.erro.status, { erro: resultado.erro.mensagem })

      console.log(`Resposta gerada com ${resultado.modelo}.`)
      console.log(`Resposta gerada com ${resultado.modelo} (perfil: ${chavePerfil}).`)
      return responder(res, 200, { resposta: resultado.texto })
    } catch (erro) {
      console.error('Erro no chatbot:', erro)
