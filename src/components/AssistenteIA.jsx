import { useEffect, useRef, useState } from 'react'
import BotaoIA from './BotaoIA'
import '../styles/assistenteIA.css'

const sugestoes = [
  'Solicitações pendentes',
  'Aprovações de hoje',
  'Itens prioritários',
]

const respostaPadrao =
  'A integração com a inteligência artificial ainda está em desenvolvimento. Em breve vou poder responder perguntas sobre solicitações e aprovações.'

function AssistenteIA({ nomeUsuario }) {
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState([])
  const [texto, setTexto] = useState('')
  const proximoId = useRef(1)
  const listaMensagens = useRef(null)

  const saudacao = nomeUsuario
    ? `Olá, ${nomeUsuario}! Como posso ajudar com solicitações e aprovações hoje?`
    : 'Olá! Como posso ajudar com solicitações e aprovações hoje?'

  useEffect(() => {
    if (aberto && listaMensagens.current) {
      listaMensagens.current.scrollTop = listaMensagens.current.scrollHeight
    }
  }, [mensagens, aberto])

  function alternarPainel() {
    setAberto((estavaAberto) => !estavaAberto)
  }

  function minimizarPainel() {
    setAberto(false)
  }

  function fecharPainel() {
    setAberto(false)
    setMensagens([])
    setTexto('')
  }

  function enviarPergunta(pergunta) {
    const perguntaLimpa = pergunta.trim()
    if (!perguntaLimpa) return

    const idPergunta = proximoId.current
    proximoId.current += 2

    const novasMensagens = [
      { id: idPergunta, autor: 'usuario', texto: perguntaLimpa },
      { id: idPergunta + 1, autor: 'assistente', texto: respostaPadrao },
    ]

    setMensagens((anteriores) => [...anteriores, ...novasMensagens])
    setTexto('')
  }

  function handleSubmit(evento) {
    evento.preventDefault()
    enviarPergunta(texto)
  }

  return (
    <>
      {aberto && (
        <section
          className="assistente-ia"
          role="dialog"
          aria-label="Assistente de IA"
        >
          <header className="assistente-ia-cabecalho">
            <div className="assistente-ia-topo">
              <div className="assistente-ia-icone">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                  <path d="M20 2v4" />
                  <path d="M22 4h-4" />
                  <circle cx="4" cy="20" r="2" />
                </svg>
              </div>

              <div className="assistente-ia-controles">
                <button
                  type="button"
                  className="assistente-ia-controle"
                  onClick={minimizarPainel}
                  aria-label="Minimizar assistente"
                  title="Minimizar"
                >
                  −
                </button>
                <button
                  type="button"
                  className="assistente-ia-controle"
                  onClick={fecharPainel}
                  aria-label="Fechar assistente e limpar conversa"
                  title="Fechar"
                >
                  ×
                </button>
              </div>
            </div>

            <h2 className="assistente-ia-titulo">Assistente de IA</h2>
            <p className="assistente-ia-descricao">
              Pergunte sobre solicitações e aprovações.
            </p>
          </header>

          <div className="assistente-ia-corpo">
            <div
              className="assistente-ia-mensagens"
              ref={listaMensagens}
              aria-live="polite"
            >
              <div className="assistente-ia-balao">
                <span className="assistente-ia-rotulo">Mensagem inicial</span>
                <p>{saudacao}</p>
              </div>

              {mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`assistente-ia-balao${mensagem.autor === 'assistente' ? ' assistente-ia-balao--assistente' : ''}`}
                >
                  <span className="assistente-ia-rotulo">
                    {mensagem.autor === 'assistente' ? 'Assistente' : 'Você'}
                  </span>
                  <p>{mensagem.texto}</p>
                </div>
              ))}
            </div>

            <div className="assistente-ia-sugestoes">
              <span className="assistente-ia-rotulo">Sugestões</span>
              <div className="assistente-ia-sugestoes-lista">
                {sugestoes.map((sugestao) => (
                  <button
                    key={sugestao}
                    type="button"
                    className="assistente-ia-sugestao"
                    onClick={() => enviarPergunta(sugestao)}
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>

            <form className="assistente-ia-entrada" onSubmit={handleSubmit}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#98A2B3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>

              <input
                type="text"
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                placeholder="Pergunte algo..."
                aria-label="Digite sua pergunta"
                autoFocus
              />

              <button
                type="submit"
                className="assistente-ia-enviar"
                aria-label="Enviar pergunta"
                disabled={!texto.trim()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      )}

      <BotaoIA aoClicar={alternarPainel} />
    </>
  )
}

export default AssistenteIA