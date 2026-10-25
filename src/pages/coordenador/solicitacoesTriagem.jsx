import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Search,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/telasCoordenador.css'
import {
  carregarSolicitacoes,
  salvarSolicitacoes,
} from '../../data/solicitacoes'

function Solicitacoes() {
  const navigate = useNavigate()

  const [solicitacoes, setSolicitacoes] = useState(carregarSolicitacoes)

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

  const [pesquisa, setPesquisa] = useState('')
  const [tipo, setTipo] = useState('Todos')
  const [prioridade, setPrioridade] = useState('Todas')
  const [status, setStatus] = useState('Todos')

  const iniciais = (perfil.nome || 'Coordenadora')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte[0])
    .join('')
    .toUpperCase()

  const pendentes = solicitacoes.filter(s => s.status === 'Pendente').length
  const aprovadas = solicitacoes.filter(s => s.status === 'Aprovada').length
  const recusadas = solicitacoes.filter(s => s.status === 'Recusada').length

  const filtradas = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim()

    return solicitacoes.filter(s => {
      const texto = [
        s.codigo,
        s.solicitante,
        s.titulo,
        s.tipo,
        s.disciplina,
        s.turma,
      ].join(' ').toLowerCase()

      return (
        texto.includes(termo) &&
        (tipo === 'Todos' || s.tipo === tipo) &&
        (prioridade === 'Todas' || s.prioridade === prioridade) &&
        (status === 'Todos' || s.status === status)
      )
    })
  }, [solicitacoes, pesquisa, tipo, prioridade, status])

  function atualizarStatus(id, novoStatus) {
    const atualizadas = solicitacoes.map(s =>
      s.id === id ? { ...s, status: novoStatus } : s,
    )

    setSolicitacoes(atualizadas)
    salvarSolicitacoes(atualizadas)
  }

  function classeStatus(valor) {
    if (valor === 'Aprovada') return 'green'
    if (valor === 'Recusada') return 'red'
    return 'yellow'
  }

  return (
    <div className="coordenador-layout telas-prototipo">
      <BarraLateral />

      <main className="dashboard-main tp-main">
        <header className="tp-topbar">
          <div className="tp-user">
            <Bell className="tp-bell" size={20} strokeWidth={1.8} />
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

        <div className="tp-content">
          <div className="tp-page-title">
            <div>
              <h1>Solicitações</h1>
              <p>
                Analise, acompanhe e gerencie as solicitações acadêmicas.
              </p>
            </div>
          </div>

          <section className="tp-stats">
            <article>
              <span>Total de solicitações</span>
              <strong>{solicitacoes.length}</strong>
              <ClipboardList className="tp-stat-icon" />
            </article>

            <article>
              <span>Pendentes</span>
              <strong>{pendentes}</strong>
              <Clock3 className="tp-stat-icon stat-yellow" />
            </article>

            <article>
              <span>Aprovadas</span>
              <strong>{aprovadas}</strong>
              <CheckCircle2 className="tp-stat-icon stat-green" />
            </article>

            <article>
              <span>Recusadas</span>
              <strong>{recusadas}</strong>
              <XCircle className="tp-stat-icon stat-purple" />
            </article>
          </section>

          <div className="tp-filters solicitacoes-filters">
            <label className="tp-search">
              <Search size={18} />
              <input
                value={pesquisa}
                onChange={e => setPesquisa(e.target.value)}
                placeholder="Buscar por código, solicitante ou assunto..."
              />
            </label>

            <select
              aria-label="Filtrar por tipo"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Reposição de aula">Reposição de aula</option>
              <option value="Alteração de horário">Alteração de horário</option>
              <option value="Atualização acadêmica">Atualização acadêmica</option>
            </select>

            <select
              aria-label="Filtrar por prioridade"
              value={prioridade}
              onChange={e => setPrioridade(e.target.value)}
            >
              <option value="Todas">Todas as prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            <select
              aria-label="Filtrar por status"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="Todos">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Recusada">Recusada</option>
            </select>
          </div>

          <section className="tp-section-table">
            <header>
              <h2>Central de solicitações</h2>
              <span>{filtradas.length} registros</span>
            </header>

            <div className="tp-table-scroll">
              <table className="tp-table solicitacoes-table">
                <thead>
                  <tr>
                    <th>CÓDIGO / SOLICITANTE</th>
                    <th>SOLICITAÇÃO</th>
                    <th>TIPO</th>
                    <th>DATA</th>
                    <th>PRIORIDADE</th>
                    <th>STATUS</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>

                <tbody>
                  {filtradas.map(s => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.codigo}</strong>
                        <small>{s.solicitante}</small>
                      </td>

                      <td>
                        <strong>{s.titulo}</strong>
                        <small>
                          Turma {s.turma} · {s.disciplina}
                        </small>
                      </td>

                      <td>{s.tipo}</td>
                      <td>{s.dataEnvio}</td>

                      <td>
                        <span
                          className={`tp-pill ${
                            s.prioridade === 'Alta'
                              ? 'red'
                              : s.prioridade === 'Média'
                                ? 'yellow'
                                : 'green'
                          }`}
                        >
                          {s.prioridade}
                        </span>
                      </td>

                      <td>
                        <span className={`tp-pill ${classeStatus(s.status)}`}>
                          {s.status}
                        </span>
                      </td>

                      <td>
                        <div className="solicitacoes-actions">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/coordenador/solicitacoes/${s.id}`)
                            }
                          >
                            <Eye size={15} />
                            Detalhes
                          </button>

                          {s.status === 'Pendente' && (
                            <>
                              <button
                                type="button"
                                className="approve"
                                onClick={() => atualizarStatus(s.id, 'Aprovada')}
                              >
                                <CheckCircle2 size={15} />
                                Aprovar
                              </button>

                              <button
                                type="button"
                                className="reject"
                                onClick={() => atualizarStatus(s.id, 'Recusada')}
                              >
                                <XCircle size={15} />
                                Recusar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan="7" className="tp-empty">
                        Nenhuma solicitação encontrada com esses filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Solicitacoes