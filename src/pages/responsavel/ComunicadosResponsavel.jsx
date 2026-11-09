
import { useMemo, useState } from 'react'
import {
  Bell,
  Megaphone,
  MessageCircle,
  Search,
  Send,
  Plus,
  Paperclip,
  CalendarDays,
  Clock3,
  UserRound,
  X,
} from 'lucide-react'

import BarraLateralResponsavel from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/comunicadosResponsavel.css'

const dadosPorAluno = {
  1: {
    nome: 'Lucas Costa',
    turma: '8º ano A',
    escola: 'Escola Estadual Modelo',
    comunicados: [
      {
        id: 1,
        categoria: 'Evento',
        titulo: 'Feira de Ciências 2026',
        descricao:
          'Convidamos as famílias para prestigiar a Feira de Ciências. Os alunos apresentarão os projetos desenvolvidos durante o semestre.',
        data: '06/11/2026',
        horario: '09:00',
        autor: 'Coordenação Pedagógica',
        destaque: true,
      },
      {
        id: 2,
        categoria: 'Acadêmico',
        titulo: 'Entrega dos resultados do bimestre',
        descricao:
          'Os resultados do 4º bimestre estarão disponíveis no portal a partir do dia 18 de novembro.',
        data: '05/11/2026',
        horario: '14:30',
        autor: 'Secretaria Escolar',
        destaque: false,
      },
      {
        id: 3,
        categoria: 'Aviso',
        titulo: 'Atualização do horário de saída',
        descricao:
          'Informamos que na próxima sexta-feira as aulas serão encerradas às 11h30 devido à reunião pedagógica.',
        data: '03/11/2026',
        horario: '10:00',
        autor: 'Direção Escolar',
        destaque: false,
      },
    ],
    conversas: [
      {
        id: 1,
        contato: 'Mariana Oliveira',
        cargo: 'Professora de Matemática',
        iniciais: 'MO',
        naoLidas: 1,
        mensagens: [
          {
            id: 1,
            remetente: 'outro',
            texto: 'Olá! Gostaria de conversar sobre o desempenho do Lucas nas últimas atividades de Matemática.',
            horario: '09:15',
            data: '07/11/2026',
          },
          {
            id: 2,
            remetente: 'outro',
            texto: 'Ele tem demonstrado evolução, mas ainda pode melhorar na resolução de problemas.',
            horario: '09:17',
            data: '07/11/2026',
          },
          {
            id: 3,
            remetente: 'eu',
            texto: 'Bom dia, professora! Obrigado pelo retorno. Vamos reforçar os estudos em casa.',
            horario: '10:02',
            data: '07/11/2026',
          },
        ],
      },
      {
        id: 2,
        contato: 'Carlos Mendes',
        cargo: 'Coordenador Pedagógico',
        iniciais: 'CM',
        naoLidas: 0,
        mensagens: [
          {
            id: 1,
            remetente: 'outro',
            texto: 'Boa tarde! A reunião de acompanhamento do Lucas está prevista para a próxima semana.',
            horario: '15:20',
            data: '04/11/2026',
          },
          {
            id: 2,
            remetente: 'eu',
            texto: 'Perfeito! Ficarei no aguardo da confirmação.',
            horario: '16:05',
            data: '04/11/2026',
          },
        ],
      },
      {
        id: 3,
        contato: 'Ana Beatriz Lima',
        cargo: 'Professora de Português',
        iniciais: 'AL',
        naoLidas: 0,
        mensagens: [
          {
            id: 1,
            remetente: 'outro',
            texto: 'Olá! Estou enviando algumas orientações para a próxima atividade de produção textual.',
            horario: '11:30',
            data: '30/10/2026',
          },
        ],
      },
    ],
  },

  2: {
    nome: 'Sofia Costa',
    turma: '9º ano B',
    escola: 'Escola Estadual Modelo',
    comunicados: [
      {
        id: 1,
        categoria: 'Acadêmico',
        titulo: 'Simulado preparatório',
        descricao:
          'A turma participará de um simulado preparatório na próxima semana. É importante que os alunos compareçam no horário habitual.',
        data: '07/11/2026',
        horario: '08:00',
        autor: 'Coordenação Pedagógica',
        destaque: true,
      },
      {
        id: 2,
        categoria: 'Evento',
        titulo: 'Cerimônia de encerramento',
        descricao:
          'As famílias estão convidadas para a cerimônia de encerramento das atividades do ano letivo.',
        data: '04/11/2026',
        horario: '13:00',
        autor: 'Direção Escolar',
        destaque: false,
      },
      {
        id: 3,
        categoria: 'Aviso',
        titulo: 'Documentação escolar',
        descricao:
          'Solicitamos que os responsáveis verifiquem a documentação escolar e atualizem os dados cadastrais, caso necessário.',
        data: '02/11/2026',
        horario: '09:30',
        autor: 'Secretaria Escolar',
        destaque: false,
      },
    ],
    conversas: [
      {
        id: 1,
        contato: 'Fernanda Souza',
        cargo: 'Professora de Ciências',
        iniciais: 'FS',
        naoLidas: 2,
        mensagens: [
          {
            id: 1,
            remetente: 'outro',
            texto: 'Olá! A Sofia apresentou um ótimo resultado no último trabalho de Ciências.',
            horario: '08:40',
            data: '07/11/2026',
          },
          {
            id: 2,
            remetente: 'outro',
            texto: 'Gostaria de recomendar que ela continue participando das atividades práticas.',
            horario: '08:42',
            data: '07/11/2026',
          },
        ],
      },
      {
        id: 2,
        contato: 'Roberto Almeida',
        cargo: 'Coordenador Pedagógico',
        iniciais: 'RA',
        naoLidas: 0,
        mensagens: [
          {
            id: 1,
            remetente: 'outro',
            texto: 'Boa tarde! Estamos organizando o acompanhamento pedagógico da turma.',
            horario: '14:10',
            data: '03/11/2026',
          },
        ],
      },
    ],
  },
}

const contatosDisponiveis = [
  { nome: 'Mariana Oliveira', cargo: 'Professora de Matemática', iniciais: 'MO' },
  { nome: 'Carlos Mendes', cargo: 'Coordenador Pedagógico', iniciais: 'CM' },
  { nome: 'Ana Beatriz Lima', cargo: 'Professora de Português', iniciais: 'AL' },
  { nome: 'Fernanda Souza', cargo: 'Professora de Ciências', iniciais: 'FS' },
  { nome: 'Roberto Almeida', cargo: 'Coordenador Pedagógico', iniciais: 'RA' },
]

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioEduGest') || 'null')
  } catch {
    return null
  }
}

function ComunicadosResponsavel() {
  const usuario = obterUsuario()

  const [alunoSelecionado, setAlunoSelecionado] = useState(1)
  const [dadosLocais, setDadosLocais] = useState(dadosPorAluno)
  const [conversaSelecionada, setConversaSelecionada] = useState(1)
  const [busca, setBusca] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [modalNovaMensagem, setModalNovaMensagem] = useState(false)
  const [contatoSelecionado, setContatoSelecionado] = useState('')

  const dados = dadosLocais[alunoSelecionado]

  const conversasFiltradas = useMemo(() => {
    return dados.conversas.filter((conversa) =>
      conversa.contato.toLowerCase().includes(busca.toLowerCase())
    )
  }, [dados.conversas, busca])

  const conversaAtual = dados.conversas.find(
    (conversa) => conversa.id === conversaSelecionada
  )

  function selecionarAluno(id) {
    setAlunoSelecionado(id)
    setConversaSelecionada(dadosLocais[id].conversas[0]?.id ?? null)
    setBusca('')
    setMensagem('')
    setModalNovaMensagem(false)
  }

  function selecionarConversa(id) {
    setConversaSelecionada(id)

    setDadosLocais((atual) => ({
      ...atual,
      [alunoSelecionado]: {
        ...atual[alunoSelecionado],
        conversas: atual[alunoSelecionado].conversas.map((conversa) =>
          conversa.id === id ? { ...conversa, naoLidas: 0 } : conversa
        ),
      },
    }))
  }

  function enviarMensagem(event) {
    event.preventDefault()

    const texto = mensagem.trim()

    if (!texto || !conversaAtual) return

    const novaMensagem = {
      id: Date.now(),
      remetente: 'eu',
      texto,
      horario: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      data: new Date().toLocaleDateString('pt-BR'),
    }

    setDadosLocais((atual) => ({
      ...atual,
      [alunoSelecionado]: {
        ...atual[alunoSelecionado],
        conversas: atual[alunoSelecionado].conversas.map((conversa) =>
          conversa.id === conversaSelecionada
            ? { ...conversa, mensagens: [...conversa.mensagens, novaMensagem] }
            : conversa
        ),
      },
    }))

    setMensagem('')
  }

  function iniciarNovaConversa(event) {
    event.preventDefault()

    if (!contatoSelecionado) return

    const contato = contatosDisponiveis.find(
      (item) => item.nome === contatoSelecionado
    )

    if (!contato) return

    const existente = dados.conversas.find(
      (conversa) => conversa.contato === contato.nome
    )

    if (existente) {
      setConversaSelecionada(existente.id)
    } else {
      const novoId = Date.now()

      const novaConversa = {
        id: novoId,
        contato: contato.nome,
        cargo: contato.cargo,
        iniciais: contato.iniciais,
        naoLidas: 0,
        mensagens: [],
      }

      setDadosLocais((atual) => ({
        ...atual,
        [alunoSelecionado]: {
          ...atual[alunoSelecionado],
          conversas: [novaConversa, ...atual[alunoSelecionado].conversas],
        },
      }))

      setConversaSelecionada(novoId)
    }

    setBusca('')
    setContatoSelecionado('')
    setModalNovaMensagem(false)
  }

  const totalNaoLidas = dados.conversas.reduce(
    (total, conversa) => total + conversa.naoLidas,
    0
  )

  return (
    <div className="resp-comunicados-layout">
      <BarraLateralResponsavel />

      <main className="resp-comunicados-main">
        <header className="resp-comunicados-topbar">
          <span>PORTAL DO RESPONSÁVEL</span>

          <div className="resp-comunicados-perfil">
            <span className="resp-comunicados-data">
              Ano letivo 2026
            </span>

            <button
              type="button"
              className="resp-comunicados-notificacao"
              aria-label="Notificações"
              title="Notificações"
            >
              <Bell size={17} />
              {totalNaoLidas > 0 && <span />}
            </button>

            <div className="resp-comunicados-avatar">
              {(usuario?.nome || 'Responsável')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((parte) => parte[0])
                .join('')
                .toUpperCase()}
            </div>

            <div className="resp-comunicados-identidade">
              <strong>{usuario?.nome || 'Responsável'}</strong>
              <span>Responsável legal</span>
            </div>
          </div>
        </header>

        <div className="resp-comunicados-conteudo">
          <section className="resp-comunicados-titulo">
            <div>
              <span className="resp-comunicados-subtitulo">
                COMUNICAÇÃO ESCOLAR
              </span>
              <h1>Comunicados e mensagens</h1>
              <p>
                Acompanhe os avisos da escola e converse com a equipe pedagógica.
              </p>
            </div>

            <button
              type="button"
              className="resp-comunicados-novo"
              onClick={() => setModalNovaMensagem(true)}
            >
              <Plus size={16} />
              Nova mensagem
            </button>
          </section>

          <section className="resp-comunicados-alunos">
            <button
              type="button"
              className={`resp-comunicados-aluno ${alunoSelecionado === 1 ? 'selecionado' : ''}`}
              onClick={() => selecionarAluno(1)}
            >
              <span className="resp-comunicados-indicador" />
              <span>
                <strong>Lucas Costa</strong>
                <small>8º ano A</small>
              </span>
            </button>

            <button
              type="button"
              className={`resp-comunicados-aluno ${alunoSelecionado === 2 ? 'selecionado' : ''}`}
              onClick={() => selecionarAluno(2)}
            >
              <span className="resp-comunicados-indicador" />
              <span>
                <strong>Sofia Costa</strong>
                <small>9º ano B</small>
              </span>
            </button>

            <span className="resp-comunicados-escola">
              {dados.escola}
            </span>
          </section>

          <section className="resp-comunicados-avisos">
            <div className="resp-comunicados-secao-titulo">
              <div>
                <h2>Comunicados da escola</h2>
                <p>Informações e avisos importantes para a família.</p>
              </div>
              <span>{dados.comunicados.length} comunicados</span>
            </div>

            <div className="resp-comunicados-avisos-grid">
              {dados.comunicados.map((comunicado) => (
                <article
                  key={comunicado.id}
                  className={`resp-comunicados-aviso ${comunicado.destaque ? 'destaque' : ''}`}
                >
                  <div className="resp-comunicados-aviso-topo">
                    <span className="resp-comunicados-aviso-icone">
                      <Megaphone size={17} />
                    </span>
                    <span className="resp-comunicados-categoria">
                      {comunicado.categoria}
                    </span>
                  </div>

                  <h3>{comunicado.titulo}</h3>
                  <p>{comunicado.descricao}</p>

                  <div className="resp-comunicados-aviso-rodape">
                    <span>
                      <CalendarDays size={13} />
                      {comunicado.data}
                    </span>
                    <span>
                      <Clock3 size={13} />
                      {comunicado.horario}
                    </span>
                  </div>

                  <small className="resp-comunicados-autor">
                    Publicado por {comunicado.autor}
                  </small>
                </article>
              ))}
            </div>
          </section>

          <section className="resp-comunicados-mensagens">
            <div className="resp-comunicados-secao-titulo">
              <div>
                <h2>Mensagens privadas</h2>
                <p>Converse diretamente com professores e coordenação.</p>
              </div>
              {totalNaoLidas > 0 && (
                <span>{totalNaoLidas} não lidas</span>
              )}
            </div>

            <div className="resp-comunicados-chat">
              <aside className="resp-comunicados-conversas">
                <div className="resp-comunicados-busca">
                  <Search size={15} />
                  <input
                    type="search"
                    placeholder="Buscar conversa..."
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    aria-label="Buscar conversa"
                  />
                </div>

                <div className="resp-comunicados-contatos">
                  {conversasFiltradas.length > 0 ? (
                    conversasFiltradas.map((conversa) => {
                      const ultimaMensagem =
                        conversa.mensagens[conversa.mensagens.length - 1]

                      return (
                        <button
                          type="button"
                          key={conversa.id}
                          className={`resp-comunicados-contato ${conversaSelecionada === conversa.id ? 'ativo' : ''}`}
                          onClick={() => selecionarConversa(conversa.id)}
                        >
                          <span className="resp-comunicados-contato-avatar">
                            {conversa.iniciais}
                          </span>

                          <span className="resp-comunicados-contato-info">
                            <strong>{conversa.contato}</strong>
                            <small>{conversa.cargo}</small>
                            <span>
                              {ultimaMensagem?.texto || 'Inicie uma conversa'}
                            </span>
                          </span>

                          {conversa.naoLidas > 0 && (
                            <span className="resp-comunicados-nao-lidas">
                              {conversa.naoLidas}
                            </span>
                          )}
                        </button>
                      )
                    })
                  ) : (
                    <div className="resp-comunicados-vazio">
                      Nenhuma conversa encontrada.
                    </div>
                  )}
                </div>
              </aside>

              <div className="resp-comunicados-painel-chat">
                {conversaAtual ? (
                  <>
                    <header className="resp-comunicados-chat-cabecalho">
                      <span className="resp-comunicados-contato-avatar">
                        {conversaAtual.iniciais}
                      </span>
                      <div>
                        <strong>{conversaAtual.contato}</strong>
                        <small>{conversaAtual.cargo}</small>
                      </div>
                    </header>

                    <div className="resp-comunicados-historico">
                      {conversaAtual.mensagens.length > 0 ? (
                        conversaAtual.mensagens.map((item) => (
                          <div
                            key={item.id}
                            className={`resp-comunicados-mensagem ${item.remetente === 'eu' ? 'minha' : 'recebida'}`}
                          >
                            <p>{item.texto}</p>
                            <small>
                              {item.horario} · {item.data}
                            </small>
                          </div>
                        ))
                      ) : (
                        <div className="resp-comunicados-vazio">
                          Esta conversa ainda não possui mensagens. Envie a primeira!
                        </div>
                      )}
                    </div>

                    <form
                      className="resp-comunicados-enviar"
                      onSubmit={enviarMensagem}
                    >
                      <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={mensagem}
                        onChange={(event) => setMensagem(event.target.value)}
                        aria-label="Digite sua mensagem"
                      />

                      <button
                        type="submit"
                        disabled={!mensagem.trim()}
                        aria-label="Enviar mensagem"
                        title="Enviar mensagem"
                      >
                        <Send size={17} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="resp-comunicados-chat-vazio">
                    <MessageCircle size={35} />
                    <strong>Selecione uma conversa</strong>
                    <span>Escolha um contato para visualizar as mensagens.</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <footer className="resp-comunicados-rodape">
            <span>EduGest · Sistema de Gestão Acadêmica</span>
            <span>Ambiente de Ensino · SEDUC-SE</span>
          </footer>
        </div>
      </main>

      {modalNovaMensagem && (
        <div
          className="resp-comunicados-modal-fundo"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalNovaMensagem(false)
            }
          }}
        >
          <section
            className="resp-comunicados-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-nova-mensagem"
          >
            <div className="resp-comunicados-modal-cabecalho">
              <div>
                <h2 id="titulo-nova-mensagem">Nova mensagem</h2>
                <p>Escolha um contato da equipe escolar.</p>
              </div>

              <button
                type="button"
                onClick={() => setModalNovaMensagem(false)}
                aria-label="Fechar"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={iniciarNovaConversa}>
              <label htmlFor="contato-mensagem">Destinatário</label>

              <select
                id="contato-mensagem"
                value={contatoSelecionado}
                onChange={(event) => setContatoSelecionado(event.target.value)}
                required
              >
                <option value="">Selecione um contato</option>

                {contatosDisponiveis.map((contato) => (
                  <option key={contato.nome} value={contato.nome}>
                    {contato.nome} — {contato.cargo}
                  </option>
                ))}
              </select>

              <div className="resp-comunicados-modal-acoes">
                <button
                  type="button"
                  className="resp-comunicados-modal-cancelar"
                  onClick={() => setModalNovaMensagem(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="resp-comunicados-modal-confirmar"
                  disabled={!contatoSelecionado}
                >
                  <MessageCircle size={15} />
                  Abrir conversa
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default ComunicadosResponsavel
