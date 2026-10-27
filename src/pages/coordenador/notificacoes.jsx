import { useMemo, useState } from 'react'
import {
  Bell,
  CheckCheck,
  CalendarDays,
  BookOpen,
  Users,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  Filter,
  Clock,
} from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/telasCoordenador.css'
import '../../styles/notificacoes.css'

const notificacoesIniciais = [
  {
    id: 1,
    titulo: 'Solicitação de reposição pendente',
    mensagem:
      'Carlos Mendes solicitou a reposição de uma aula de Matemática da turma 1A.',
    categoria: 'Solicitações',
    data: 'Hoje, 09:15',
    prioridade: 'Alta',
    lida: false,
    Icone: CalendarDays,
  },
  {
    id: 2,
    titulo: 'Atualização de ementa necessária',
    mensagem:
      'A ementa de Língua Portuguesa precisa ser revisada antes do próximo período.',
    categoria: 'Acadêmico',
    data: 'Hoje, 08:40',
    prioridade: 'Alta',
    lida: false,
    Icone: BookOpen,
  },
  {
    id: 3,
    titulo: 'Nova solicitação de matrícula',
    mensagem:
      'Existe uma solicitação de matrícula aguardando análise da coordenação.',
    categoria: 'Solicitações',
    data: 'Ontem, 16:30',
    prioridade: 'Média',
    lida: false,
    Icone: Users,
  },
  {
    id: 4,
    titulo: 'Alteração no calendário acadêmico',
    mensagem:
      'Uma alteração de horário foi registrada no calendário acadêmico.',
    categoria: 'Acadêmico',
    data: 'Ontem, 14:10',
    prioridade: 'Média',
    lida: true,
    Icone: CalendarDays,
  },
  {
    id: 5,
    titulo: 'Revisão de cadastro',
    mensagem:
      'Há informações cadastrais que precisam ser conferidas pela coordenação.',
    categoria: 'Sistema',
    data: '20 out., 11:20',
    prioridade: 'Baixa',
    lida: true,
    Icone: Info,
  },
]

function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais)
  const [pesquisa, setPesquisa] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [leitura, setLeitura] = useState('Todas')

  // Carrega o perfil salvo nas Configurações
  const [perfil] = useState(() => {
    try {
      const dados = localStorage.getItem('edugest:coordenador:perfil')

      return dados
        ? { nome: 'Marina Costa', ...JSON.parse(dados) }
        : { nome: 'Marina Costa' }
    } catch {
      return { nome: 'Marina Costa' }
    }
  })

  const iniciais = (perfil.nome || 'Coordenadora')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte[0])
    .join('')
    .toUpperCase()

  const naoLidas = notificacoes.filter(n => !n.lida).length

  const prioritarias = notificacoes.filter(
    n => n.prioridade === 'Alta' && !n.lida,
  ).length

  const filtradas = useMemo(() => {
    return notificacoes.filter(n => {
      const texto = `${n.titulo} ${n.mensagem} ${n.categoria}`.toLowerCase()

      return (
        texto.includes(pesquisa.toLowerCase()) &&
        (categoria === 'Todas' || n.categoria === categoria) &&
        (leitura === 'Todas' ||
          (leitura === 'Não lidas' && !n.lida) ||
          (leitura === 'Lidas' && n.lida))
      )
    })
  }, [notificacoes, pesquisa, categoria, leitura])

  function marcarComoLida(id) {
    setNotificacoes(anteriores =>
      anteriores.map(n => (n.id === id ? { ...n, lida: true } : n)),
    )
  }

  function marcarTodasComoLidas() {
    setNotificacoes(anteriores =>
      anteriores.map(n => ({ ...n, lida: true })),
    )
  }

  function excluirNotificacao(id) {
    setNotificacoes(anteriores =>
      anteriores.filter(n => n.id !== id),
    )
  }

  return (
    <div className="coordenador-layout telas-prototipo">
      <BarraLateral />

      <main className="dashboard-main tp-main">
        <header className="tp-topbar">
          <div className="tp-user">
            <Bell className="tp-bell" size={20} />

            <span className="tp-avatar configuracoes-avatar">
              {iniciais}
            </span>

            <div>
              <strong>{perfil.nome || 'Coordenadora'}</strong>
              <small>Coordenadora</small>
            </div>

            <span>⌄</span>
          </div>
        </header>

        <div className="tp-content notif-content">
          <div className="tp-page-title">
            <div>
              <h1>Notificações</h1>
              <p>
                Acompanhe avisos e atualizações importantes do EduGest.
              </p>
            </div>

            <button
              type="button"
              className="tp-primary"
              onClick={marcarTodasComoLidas}
              disabled={naoLidas === 0}
            >
              <CheckCheck size={17} />
              Marcar todas como lidas
            </button>
          </div>

          <section className="notif-stats">
            <article>
              <span>Total de notificações</span>
              <strong>{notificacoes.length}</strong>
              <Bell size={21} />
            </article>

            <article>
              <span>Não lidas</span>
              <strong>{naoLidas}</strong>
              <Clock size={21} />
            </article>

            <article>
              <span>Alta prioridade</span>
              <strong>{prioritarias}</strong>
              <AlertTriangle size={21} />
            </article>
          </section>

          <section className="notif-panel">
            <header className="notif-panel-header">
              <div>
                <h2>Central de notificações</h2>
                <p>Consulte e gerencie seus avisos.</p>
              </div>

              <Filter size={20} />
            </header>

            <div className="notif-filters">
              <label className="tp-search">
                ⌕
                <input
                  value={pesquisa}
                  onChange={e => setPesquisa(e.target.value)}
                  placeholder="Buscar notificação..."
                />
              </label>

              <select
                aria-label="Filtrar categoria"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
              >
                <option value="Todas">Todas as categorias</option>
                <option value="Solicitações">Solicitações</option>
                <option value="Acadêmico">Acadêmico</option>
                <option value="Sistema">Sistema</option>
              </select>

              <select
                aria-label="Filtrar estado de leitura"
                value={leitura}
                onChange={e => setLeitura(e.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="Não lidas">Não lidas</option>
                <option value="Lidas">Lidas</option>
              </select>
            </div>

            <div className="notif-list">
              {filtradas.map(n => {
                const Icone = n.Icone

                return (
                  <article
                    key={n.id}
                    className={`notif-item ${n.lida ? 'is-read' : 'is-unread'}`}
                  >
                    <div
                      className={`notif-item-icon ${n.prioridade.toLowerCase()}`}
                    >
                      <Icone size={21} />
                    </div>

                    <div className="notif-item-body">
                      <div className="notif-item-heading">
                        <h3>{n.titulo}</h3>
                        {!n.lida && (
                          <span className="notif-unread-dot" />
                        )}
                      </div>

                      <p>{n.mensagem}</p>

                      <div className="notif-item-meta">
                        <span>{n.categoria}</span>
                        <span>{n.data}</span>

                        <span
                          className={`notif-priority ${n.prioridade.toLowerCase()}`}
                        >
                          {n.prioridade === 'Alta'
                            ? 'Alta prioridade'
                            : n.prioridade === 'Média'
                              ? 'Média prioridade'
                              : 'Baixa prioridade'}
                        </span>
                      </div>
                    </div>

                    <div className="notif-item-actions">
                      {!n.lida && (
                        <button
                          type="button"
                          title="Marcar como lida"
                          aria-label={`Marcar "${n.titulo}" como lida`}
                          onClick={() => marcarComoLida(n.id)}
                        >
                          <Check size={18} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="Excluir notificação"
                        aria-label={`Excluir "${n.titulo}"`}
                        onClick={() => excluirNotificacao(n.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                )
              })}

              {filtradas.length === 0 && (
                <div className="notif-empty">
                  <Bell size={30} />
                  <h3>Nenhuma notificação encontrada</h3>
                  <p>
                    Tente alterar os filtros ou o termo de busca.
                  </p>
                </div>
              )}
            </div>

            <footer className="notif-panel-footer">
              Exibindo {filtradas.length} de {notificacoes.length}{' '}
              notificações
            </footer>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Notificacoes