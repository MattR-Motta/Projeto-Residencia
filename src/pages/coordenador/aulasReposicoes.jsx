import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BarraLateral from '../../components/barraLateral'
import '../../styles/telasCoordenador.css'
import { CalendarDays, Bell } from 'lucide-react'

const aulasBase = [
  { id: 1, horario: '08:00–09:40', disciplina: 'Matemática', turma: '1A', professor: 'Carlos Mendes', sala: 'Sala 101', status: 'Realizada', data: '2026-05-23' },
  { id: 2, horario: '10:00–11:40', disciplina: 'História', turma: '2B', professor: 'Ana Ribeiro', sala: 'Sala 204', status: 'Em andamento', data: '2026-05-23' },
  { id: 3, horario: '14:00–15:40', disciplina: 'Português', turma: '3A', professor: 'Juliana Freitas', sala: 'Sala 105', status: 'Confirmada', data: '2026-05-23' },
  { id: 4, horario: '16:00–17:40', disciplina: 'Física', turma: '3A', professor: 'Rafael Lima', sala: 'Laboratório 2', status: 'Reposição necessária', data: '2026-05-23' },
]

const reposicoesBase = [
  { id: 11, disciplina: 'Matemática', professor: 'Carlos Mendes', turma: '1A', original: '23 mai. • 08:00', motivo: 'Atestado médico', nova: '29 mai. • 13:30', status: 'Pendente' },
  { id: 12, disciplina: 'História', professor: 'Ana Ribeiro', turma: '2B', original: '20 mai. • 10:00', motivo: 'Formação pedagógica', nova: '30 mai. • 10:00', status: 'Aprovada' },
  { id: 13, disciplina: 'Física', professor: 'Rafael Lima', turma: '3A', original: '22 mai. • 16:00', motivo: 'Manutenção do laboratório', nova: '02 jun. • 14:00', status: 'Rejeitada' },
]

const classeStatus = s =>
  s === 'Realizada' || s === 'Confirmada' || s === 'Aprovada'
    ? 'green'
    : s === 'Reposição necessária' || s === 'Rejeitada'
      ? 'red'
      : 'yellow'

function AulasReposicoes() {
  const [params, setParams] = useSearchParams()
  const [aulas, setAulas] = useState(aulasBase)
  const [reposicoes, setReposicoes] = useState(reposicoesBase)
  const [pesquisa, setPesquisa] = useState('')
  const [turma, setTurma] = useState('Todas')
  const [professor, setProfessor] = useState('Todos')
  const [status, setStatus] = useState('Todos')
  const [data, setData] = useState('Todas')
  const [menuAberto, setMenuAberto] = useState(null)
  const [detalhe, setDetalhe] = useState(null)
  const [modalNova, setModalNova] = useState(false)
  const [novaReposicao, setNovaReposicao] = useState({
    disciplina: '',
    professor: '',
    turma: '',
    original: '',
    motivo: '',
    nova: ''
  })

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

  const erro = params.get('erro') === '1'

  const filtradas = useMemo(() => aulas.filter(a => {
    const txt = `${a.disciplina} ${a.professor} ${a.turma}`.toLowerCase()

    return txt.includes(pesquisa.toLowerCase()) &&
      (turma === 'Todas' || a.turma === turma) &&
      (professor === 'Todos' || a.professor === professor) &&
      (status === 'Todos' || a.status === status) &&
      (data === 'Todas' || a.data === data)
  }), [aulas, pesquisa, turma, professor, status, data])

  function atualizarReposicao(id, novoStatus) {
    setReposicoes(old =>
      old.map(r => r.id === id ? { ...r, status: novoStatus } : r)
    )
  }

  function criarReposicao(e) {
    e.preventDefault()

    setReposicoes(old => [
      ...old,
      { ...novaReposicao, id: Date.now(), status: 'Pendente' }
    ])

    setNovaReposicao({
      disciplina: '',
      professor: '',
      turma: '',
      original: '',
      motivo: '',
      nova: ''
    })

    setModalNova(false)
  }

  return (
    <div className="coordenador-layout telas-prototipo">
      <BarraLateral />

      <main className="dashboard-main tp-main">
        <header className="tp-topbar">
          <div className="tp-user">
            <Bell className="tp-bell" size={20} strokeWidth={1.8} />

            <span className="tp-avatar configuracoes-avatar">
              {perfil.nome
                ? perfil.nome
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(p => p[0])
                    .join('')
                    .toUpperCase()
                : 'MC'}
            </span>

            <div>
              <strong>{perfil.nome || 'Coordenadora'}</strong>
              <small>Coordenadora</small>
            </div>

            <span>⌄</span>
          </div>
        </header>

        {erro ? (
          <section className="tp-error">
            <div className="tp-error-art" aria-hidden="true">
              <div className="tp-error-window">
                <i />
                <i />
                <i />
                <b>▥</b>
              </div>
              <strong>×</strong>
              <span>!</span>
            </div>

            <h1>Não foi possível carregar o painel</h1>

            <p>
              Ocorreu um erro ao buscar as informações das aulas e reposições.
              <br />
              Verifique sua conexão com a internet e tente novamente.
            </p>

            <button className="tp-retry" onClick={() => setParams({})}>
              ⟳ <span>Tente novamente</span>
            </button>
          </section>
        ) : (
          <div className="tp-content tp-aulas-content">
            <div className="tp-page-title">
              <div>
                <h1>Aulas e Reposições</h1>
                <p>
                  Acompanhe aulas programadas, realizadas e necessidades de reposição.
                </p>
              </div>
            </div>

            <section className="tp-stats">
              <article>
                <span>Aulas hoje</span>
                <strong>{aulas.length * 2}</strong>
                <CalendarDays className="tp-stat-icon" size={22} />
              </article>

              <article>
                <span>Realizadas</span>
                <strong>
                  {aulas.filter(a => a.status === 'Realizada').length + 4}
                </strong>
                <CalendarDays className="tp-stat-icon stat-green" size={22} />
              </article>

              <article>
                <span>Reposições pendentes</span>
                <strong>
                  {reposicoes.filter(r => r.status === 'Pendente').length + 2}
                </strong>
                <CalendarDays className="tp-stat-icon stat-yellow" size={22} />
              </article>

              <article>
                <span>Alterações de horário</span>
                <strong>2</strong>
                <CalendarDays className="tp-stat-icon stat-purple" size={22} />
              </article>
            </section>

            <div className="tp-filters tp-aula-filters">
              <label className="tp-search">
                ⌕
                <input
                  value={pesquisa}
                  onChange={e => setPesquisa(e.target.value)}
                  placeholder="Buscar professor, turma ou disciplina..."
                />
              </label>

              <select
                aria-label="Filtrar por turma"
                value={turma}
                onChange={e => setTurma(e.target.value)}
              >
                <option value="Todas">Turma</option>
                {[...new Set(aulas.map(a => a.turma))].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                aria-label="Filtrar por professor"
                value={professor}
                onChange={e => setProfessor(e.target.value)}
              >
                <option value="Todos">Professor</option>
                {[...new Set(aulas.map(a => a.professor))].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select
                aria-label="Filtrar por status"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Todos">Status</option>
                {[...new Set(aulas.map(a => a.status))].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                aria-label="Filtrar por data"
                value={data}
                onChange={e => setData(e.target.value)}
              >
                <option value="Todas">Data</option>
                <option value="2026-05-23">23 mai.</option>
              </select>
            </div>

            <section className="tp-section-table">
              <header>
                <h2>Aulas programadas</h2>
              </header>

              <div className="tp-table-scroll">
                <table className="tp-table tp-aula-table">
                  <thead>
                    <tr>
                      <th>HORÁRIO</th>
                      <th>DISCIPLINA</th>
                      <th>TURMA</th>
                      <th>PROFESSOR</th>
                      <th>SALA</th>
                      <th>STATUS</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtradas.map(a => (
                      <tr key={a.id}>
                        <td>{a.horario}</td>
                        <td><strong>{a.disciplina}</strong></td>
                        <td>{a.turma}</td>
                        <td>{a.professor}</td>
                        <td>{a.sala}</td>
                        <td>
                          <span className={`tp-pill ${classeStatus(a.status)}`}>
                            {a.status}
                          </span>
                        </td>

                        <td className="tp-menu-cell">
                          <button
                            className="tp-dots"
                            onClick={() => setMenuAberto(menuAberto === a.id ? null : a.id)}
                            aria-label="Ações da aula"
                          >
                            •••
                          </button>

                          {menuAberto === a.id && (
                            <div className="tp-action-menu">
                              <button onClick={() => {
                                setDetalhe({ tipo: 'Aula', ...a })
                                setMenuAberto(null)
                              }}>
                                Ver detalhes
                              </button>

                              <button onClick={() => {
                                setAulas(old =>
                                  old.map(x => x.id === a.id
                                    ? { ...x, status: 'Realizada' }
                                    : x
                                  )
                                )
                                setMenuAberto(null)
                              }}>
                                Marcar realizada
                              </button>

                              <button onClick={() => {
                                setDetalhe({ tipo: 'Reposição', ...a })
                                setMenuAberto(null)
                              }}>
                                Solicitar reposição
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {!filtradas.length && (
                      <tr>
                        <td colSpan="7" className="tp-empty">
                          Nenhuma aula encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="tp-section-table tp-repo-section">
              <header>
                <h2>Reposições</h2>
                <span>{reposicoes.length} solicitações</span>

                <button className="tp-link-button" onClick={() => setModalNova(true)}>
                  ＋ Nova solicitação
                </button>
              </header>

              <div className="tp-table-scroll">
                <table className="tp-table tp-repo-table">
                  <thead>
                    <tr>
                      <th>DISCIPLINA / PROFESSOR</th>
                      <th>TURMA</th>
                      <th>AULA ORIGINAL</th>
                      <th>MOTIVO</th>
                      <th>NOVA DATA/HORÁRIO</th>
                      <th>STATUS</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reposicoes.map(r => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.disciplina}</strong>
                          <small>{r.professor}</small>
                        </td>

                        <td>{r.turma}</td>
                        <td>{r.original || 'A definir'}</td>
                        <td>{r.motivo}</td>
                        <td>{r.nova || 'A definir'}</td>

                        <td>
                          <span className={`tp-pill ${classeStatus(r.status)}`}>
                            {r.status}
                          </span>
                        </td>

                        <td>
                          <div className="tp-repo-actions">
                            <button onClick={() => setDetalhe({ tipo: 'Reposição', ...r })}>
                              Ver detalhes
                            </button>

                            <button className="approve" onClick={() => atualizarReposicao(r.id, 'Aprovada')}>
                              Aprovar
                            </button>

                            <button className="reject" onClick={() => atualizarReposicao(r.id, 'Rejeitada')}>
                              Rejeitar
                            </button>

                            <button onClick={() => {
                              setNovaReposicao({
                                disciplina: r.disciplina,
                                professor: r.professor,
                                turma: r.turma,
                                original: r.original,
                                motivo: r.motivo,
                                nova: ''
                              })
                              setModalNova(true)
                            }}>
                              Reagendar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!reposicoes.length && (
                      <tr>
                        <td colSpan="7" className="tp-empty">
                          Nenhuma reposição cadastrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {(detalhe || modalNova) && (
        <div
          className="tp-modal-backdrop"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setDetalhe(null)
              setModalNova(false)
            }
          }}
        >
          <section className="tp-modal" role="dialog" aria-modal="true">
            <header>
              <div>
                <h2>
                  {detalhe
                    ? `Detalhes — ${detalhe.tipo}`
                    : 'Nova solicitação de reposição'}
                </h2>
                <p>Gerenciamento de aulas e reposições.</p>
              </div>

              <button
                onClick={() => {
                  setDetalhe(null)
                  setModalNova(false)
                }}
                aria-label="Fechar"
              >
                ×
              </button>
            </header>

            {detalhe ? (
              <div className="tp-detail-list">
                {Object.entries(detalhe)
                  .filter(([k]) => k !== 'id')
                  .map(([k, v]) => (
                    <p key={k}>
                      <strong>
                        {({
                          horario: 'Horário',
                          disciplina: 'Disciplina',
                          turma: 'Turma',
                          professor: 'Professor',
                          sala: 'Sala',
                          status: 'Status',
                          data: 'Data',
                          original: 'Aula original',
                          motivo: 'Motivo',
                          nova: 'Nova data/horário',
                          tipo: 'Tipo'
                        })[k] || k}:
                      </strong>{' '}
                      {v}
                    </p>
                  ))}

                <div className="tp-modal-actions">
                  <button className="tp-primary" onClick={() => setDetalhe(null)}>
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={criarReposicao}>
                <div className="tp-form-grid">
                  <label>
                    Disciplina *
                    <input
                      required
                      value={novaReposicao.disciplina}
                      onChange={e => setNovaReposicao({
                        ...novaReposicao,
                        disciplina: e.target.value
                      })}
                    />
                  </label>

                  <label>
                    Professor *
                    <input
                      required
                      value={novaReposicao.professor}
                      onChange={e => setNovaReposicao({
                        ...novaReposicao,
                        professor: e.target.value
                      })}
                    />
                  </label>

                  <label>
                    Turma *
                    <input
                      required
                      value={novaReposicao.turma}
                      onChange={e => setNovaReposicao({
                        ...novaReposicao,
                        turma: e.target.value
                      })}
                    />
                  </label>

                  <label>
                    Aula original
                    <input
                      value={novaReposicao.original}
                      onChange={e => setNovaReposicao({
                        ...novaReposicao,
                        original: e.target.value
                      })}
                      placeholder="Ex.: 23 mai. • 08:00"
                    />
                  </label>

                  <label>
                    Motivo *
                    <input
                      required
                      value={novaReposicao.motivo}
                      onChange={e => setNovaReposicao({
                        ...novaReposicao,
                        motivo: e.target.value
                      })}
                    />
                  </label>

                  <label>
                    Nova data/horário
                    <input
                      value={novaReposicao.nova}
                      onChange={e => setNovaReposicao({
                        ...novaReposicao,
                        nova: e.target.value
                      })}
                      placeholder="Ex.: 29 mai. • 13:30"
                    />
                  </label>
                </div>

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary"
                    onClick={() => setModalNova(false)}
                  >
                    Cancelar
                  </button>

                  <button className="tp-primary" type="submit">
                    Salvar solicitação
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default AulasReposicoes