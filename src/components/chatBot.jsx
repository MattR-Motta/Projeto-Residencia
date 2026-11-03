
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bot,
  X,
  Minus,
  Send,
  MessageCircle,
  CalendarDays,
  Bell,
  Users,
  ClipboardList,
} from 'lucide-react'

import { carregarSolicitacoes } from '../data/solicitacoes'
import '../styles/chatbotCoordenador.css'

const sugestoes = [
  'Resumo das solicitações',
  'Solicitações pendentes',
  'Total de solicitações',
  'Ir para o calendário',
]

function gerarResposta(pergunta) {
  const texto = pergunta
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const solicitacoes = carregarSolicitacoes()

  const totalSolicitacoes = solicitacoes.length

  const pendentes = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Pendente'
  )

  const aprovadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Aprovada'
  )

  const recusadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Recusada'
  )

  // Resumo geral das solicitações
  if (
    texto.includes('resumo') ||
    texto.includes('situacao das solicitacoes')
  ) {
    return `Aqui está o resumo atual:

• Total de solicitações: ${totalSolicitacoes}
• Pendentes: ${pendentes.length}
• Aprovadas: ${aprovadas.length}
• Recusadas: ${recusadas.length}`
  }

  // Total de solicitações
  if (
    texto.includes('total') ||
    texto.includes('quantidade de solicitacoes') ||
    texto.includes('quantas solicitacoes')
  ) {
    return `O sistema possui ${totalSolicitacoes} solicitação(ões) no total.`
  }

  // Solicitações pendentes
  if (texto.includes('pendente')) {
    if (pendentes.length === 0) {
      return 'Não há solicitações pendentes no momento.'
    }

    const lista = pendentes
      .map(
        (solicitacao) =>
          `• ${
            solicitacao.titulo ||
            solicitacao.tipo ||
            'Solicitação sem título'
          }`
      )
      .join('\n')

    return `Encontrei ${pendentes.length} solicitação(ões) pendente(s):

${lista}

Você pode abrir a área de solicitações para consultar os detalhes.`
  }

  // Solicitações aprovadas
  if (texto.includes('aprovad')) {
    return `Há ${aprovadas.length} solicitação(ões) aprovada(s).

Para saber quais foram aprovadas hoje, seria necessário registrar a data da decisão de cada solicitação.`
  }

  // Solicitações recusadas
  if (texto.includes('recusad') || texto.includes('rejeitad')) {
    return `Há ${recusadas.length} solicitação(ões) recusada(s). Você pode consultar os detalhes na área de solicitações.`
  }

  // Calendário
  if (texto.includes('calendario') || texto.includes('agenda')) {
    return 'Você pode acessar o calendário do coordenador pelo atalho abaixo.'
  }

  // Notificações
  if (texto.includes('notificacao')) {
    return 'Você pode consultar os avisos e as atualizações na área de notificações.'
  }

  // Turmas
  if (texto.includes('turma')) {
    return 'Você pode acessar a área de turmas para consultar as informações disponíveis.'
  }

  // Saudações
  if (
    texto.includes('oi') ||
    texto.includes('ola') ||
    texto.includes('bom dia') ||
    texto.includes('boa tarde') ||
    texto.includes('boa noite')
  ) {
    return 'Olá! Sou o assistente virtual do coordenador. Posso ajudar a consultar solicitações e encontrar as principais áreas do sistema.'
  }

  // Ajuda
  if (
    texto.includes('ajuda') ||
    texto.includes('o que voce faz')
  ) {
    return 'Posso consultar o total de solicitações, listar pendências, verificar aprovações e recusas e indicar atalhos para o calendário, notificações e turmas.'
  }

  return 'Ainda não consigo responder a essa pergunta. Experimente perguntar sobre o resumo, total de solicitações, pendências, aprovações, recusas, calendário, notificações ou turmas.'
}

function ChatBot() {
  const location = useLocation()
  const navigate = useNavigate()

  const [aberto, setAberto] = useState(false)
  const [minimizado, setMinimizado] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const [mensagens, setMensagens] = useState([
    {
      id: 'mensagem-inicial',
      autor: 'bot',
      texto:
        'Olá! Sou o assistente virtual do coordenador. Como posso ajudar?',
    },
  ])

  const estaNaAreaCoordenador =
    location.pathname.startsWith('/coordenador')

  if (!estaNaAreaCoordenador) {
    return null
  }

  function enviarMensagem(texto = mensagem) {
    const conteudo = texto.trim()

    if (!conteudo) return

    const mensagemUsuario = {
      id: crypto.randomUUID(),
      autor: 'usuario',
      texto: conteudo,
    }

    const respostaBot = {
      id: crypto.randomUUID(),
      autor: 'bot',
      texto: gerarResposta(conteudo),
    }

    setMensagens((anteriores) => [
      ...anteriores,
      mensagemUsuario,
      respostaBot,
    ])

    setMensagem('')
  }

  function navegarPara(caminho) {
    navigate(caminho)
    setAberto(false)
    setMinimizado(false)
  }

  return (
    <div className="chatbot-container">
      {aberto && !minimizado && (
        <section
          className="chatbot-painel"
          aria-label="Assistente virtual do coordenador"
        >
          <header className="chatbot-cabecalho">
            <div className="chatbot-identidade">
              <div className="chatbot-avatar">
                <Bot size={22} />
              </div>

              <div>
                <h2>Assistente virtual</h2>
                <span>Área do coordenador</span>
              </div>
            </div>

            <div className="chatbot-controles">
              <button
                type="button"
                aria-label="Minimizar chatbot"
                title="Minimizar"
                onClick={() => setMinimizado(true)}
              >
                <Minus size={18} />
              </button>

              <button
                type="button"
                aria-label="Fechar chatbot"
                title="Fechar"
                onClick={() => setAberto(false)}
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div
            className="chatbot-mensagens"
            aria-live="polite"
          >
            {mensagens.map((item) => (
              <div
                key={item.id}
                className={`chatbot-mensagem ${
                  item.autor === 'usuario'
                    ? 'chatbot-mensagem-usuario'
                    : 'chatbot-mensagem-bot'
                }`}
              >
                {item.autor === 'bot' && (
                  <span className="chatbot-icone-mensagem">
                    <Bot size={16} />
                  </span>
                )}

                <p>{item.texto}</p>
              </div>
            ))}
          </div>

          <div className="chatbot-sugestoes">
            <span>Sugestões</span>

            {sugestoes.map((sugestao) => (
              <button
                type="button"
                key={sugestao}
                onClick={() => enviarMensagem(sugestao)}
              >
                {sugestao}
              </button>
            ))}
          </div>

          <form
            className="chatbot-formulario"
            onSubmit={(evento) => {
              evento.preventDefault()
              enviarMensagem()
            }}
          >
            <input
              type="text"
              value={mensagem}
              onChange={(evento) =>
                setMensagem(evento.target.value)
              }
              placeholder="Digite sua pergunta..."
              aria-label="Digite sua pergunta"
            />

            <button
              type="submit"
              aria-label="Enviar mensagem"
              disabled={!mensagem.trim()}
            >
              <Send size={18} />
            </button>
          </form>

          <nav
            className="chatbot-atalhos"
            aria-label="Atalhos do coordenador"
          >
            <button
              type="button"
              onClick={() =>
                navegarPara('/coordenador/solicitacoes')
              }
              title="Solicitações"
            >
              <ClipboardList size={18} />
              <span>Solicitações</span>
            </button>

            <button
              type="button"
              onClick={() =>
                navegarPara('/coordenador/calendario')
              }
              title="Calendário"
            >
              <CalendarDays size={18} />
              <span>Calendário</span>
            </button>

            <button
              type="button"
              onClick={() =>
                navegarPara('/coordenador/notificacoes')
              }
              title="Notificações"
            >
              <Bell size={18} />
              <span>Notificações</span>
            </button>

            <button
              type="button"
              onClick={() =>
                navegarPara('/coordenador/turmas')
              }
              title="Turmas"
            >
              <Users size={18} />
              <span>Turmas</span>
            </button>
          </nav>
        </section>
      )}

      {aberto && minimizado && (
        <button
          type="button"
          className="chatbot-minimizado"
          onClick={() => setMinimizado(false)}
        >
          <Bot size={18} />
          Assistente virtual
        </button>
      )}

      {!aberto && (
        <button
          type="button"
          className="chatbot-botao-flutuante"
          aria-label="Abrir assistente virtual"
          title="Assistente virtual"
          onClick={() => {
            setAberto(true)
            setMinimizado(false)
          }}
        >
          <MessageCircle size={25} />
        </button>
      )}
    </div>
  )
}

export default ChatBot
