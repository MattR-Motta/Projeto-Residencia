import { useState } from 'react'
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Pencil,
  ArrowLeft,
  Check,
} from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/Gestor/gradesCurricularesGestor.css'

const GRADES_INICIAIS = [
  {
    id: 1,
    nome: 'Referencial Regular Sergipe - Médio',
    nomeCurto: 'Ref. Regular Sergipe - Médio',
    tipoEnsino: 'Ensino Médio',
    seriesAnos: '1º, 2º e 3º Ano',
    cargaHoraria: '3.000 horas',
    status: 'Ativa',
  },
  {
    id: 2,
    nome: 'Matriz Unificada Fundamental I',
    nomeCurto: 'Matriz Unificada Fundamental I',
    tipoEnsino: 'Ensino Fundamental',
    seriesAnos: '1º ao 5º Ano',
    cargaHoraria: '4.500 horas',
    status: 'Ativa',
  },
  {
    id: 3,
    nome: 'Base Integrada Agropecuária',
    nomeCurto: 'Base Integrada Agropecuária',
    tipoEnsino: 'Ensino Integrado',
    seriesAnos: '1º ao 4º Ano',
    cargaHoraria: '4.200 horas',
    status: 'Ativa',
  },
  {
    id: 4,
    nome: 'Matriz Fundamental II Regular',
    nomeCurto: 'Matriz Fundamental II Regular',
    tipoEnsino: 'Ensino Fundamental',
    seriesAnos: '6º ao 9º Ano',
    cargaHoraria: '3.600 horas',
    status: 'Ativa',
  },
  {
    id: 5,
    nome: 'Formação Técnica Administração',
    nomeCurto: 'Formação Técnica Administração',
    tipoEnsino: 'Profissionalizante',
    seriesAnos: '1º e 2º Módulo',
    cargaHoraria: '1.200 horas',
    status: 'Em Análise',
  },
  {
    id: 6,
    nome: 'EJA - Médio Exponencial',
    nomeCurto: 'EJA - Médio Exponencial',
    tipoEnsino: 'Outros / EJA',
    seriesAnos: 'Etapa I e II',
    cargaHoraria: '1.600 horas',
    status: 'Ativa',
  },
]

const MATRIZES_INICIAIS = [
  {
    id: 1,
    nome: 'Proposta Curricular Geral 2026',
    gradeVinculada: 'Ref. Regular Sergipe - Médio',
    tipoEnsino: 'Ensino Médio',
    disciplinas: '12 Disciplinas',
    cargaHoraria: '1.000h / ano',
  },
  {
    id: 2,
    nome: 'Matriz Piloto Agroecológica',
    gradeVinculada: 'Base Integrada Agropecuária',
    tipoEnsino: 'Ensino Integrado',
    disciplinas: '16 Disciplinas',
    cargaHoraria: '1.400h / ano',
  },
  {
    id: 3,
    nome: 'Fundamental Integral Formativa',
    gradeVinculada: 'Matriz Unificada Fundamental I',
    tipoEnsino: 'Ensino Fundamental',
    disciplinas: '10 Disciplinas',
    cargaHoraria: '900h / ano',
  },
  {
    id: 4,
    nome: 'Matriz Técnico em TI Integrado',
    gradeVinculada: 'Ref. Regular Sergipe - Médio',
    tipoEnsino: 'Ensino Integrado',
    disciplinas: '15 Disciplinas',
    cargaHoraria: '1.200h / ano',
  },
  {
    id: 5,
    nome: 'Formação Básica para EJA',
    gradeVinculada: 'EJA - Médio Exponencial',
    tipoEnsino: 'Outros / EJA',
    disciplinas: '8 Disciplinas',
    cargaHoraria: '800h / ano',
  },
]

function GradesCurricularesGestor() {
  // Listas em estado para permitir adicionar novas e editar as existentes
  const [grades, setGrades] = useState(GRADES_INICIAIS)
  const [matrizes, setMatrizes] = useState(MATRIZES_INICIAIS)

  // Controla a aba ('grades' | 'matrizes') e a tela ('lista' | 'formGrade' | 'formMatriz')
  const [abaAtiva, setAbaAtiva] = useState('grades')
  const [modoTela, setModoTela] = useState('lista')

  // Filtros de Grades
  const [buscaGrade, setBuscaGrade] = useState('')
  const [filtroEnsino, setFiltroEnsino] = useState('Todos')
  const [filtroStatus, setFiltroStatus] = useState('Todas')
  const [paginaGrades, setPaginaGrades] = useState(1)

  // Filtros de Matrizes
  const [buscaMatriz, setBuscaMatriz] = useState('')
  const [filtroGradeVinculada, setFiltroGradeVinculada] = useState('Todas')
  const [filtroCargaHoraria, setFiltroCargaHoraria] = useState('Todas')
  const [paginaMatrizes, setPaginaMatrizes] = useState(1)

  // Estado do formulário de Grade (Nova / Editar)
  const [formGrade, setFormGrade] = useState({
    id: null,
    nome: '',
    tipoEnsino: 'Ensino Médio',
    seriesAnos: '',
    cargaHoraria: '',
    status: 'Ativa',
  })

  // Estado do formulário de Matriz (Nova / Editar)
  const [formMatriz, setFormMatriz] = useState({
    id: null,
    nome: '',
    gradeVinculada: 'Ref. Regular Sergipe - Médio',
    tipoEnsino: 'Ensino Médio',
    disciplinas: '',
    cargaHoraria: '',
  })

  // Funções para abrir tela de Nova Grade ou Editar Grade
  function abrirNovaGrade() {
    setFormGrade({
      id: null,
      nome: '',
      tipoEnsino: 'Ensino Médio',
      seriesAnos: '',
      cargaHoraria: '',
      status: 'Ativa',
    })
    setModoTela('formGrade')
  }

  function abrirEdicaoGrade(grade, evento) {
    evento.stopPropagation()
    setFormGrade({
      id: grade.id,
      nome: grade.nome,
      tipoEnsino: grade.tipoEnsino,
      seriesAnos: grade.seriesAnos,
      cargaHoraria: grade.cargaHoraria,
      status: grade.status,
    })
    setModoTela('formGrade')
  }

  function salvarGrade(evento) {
    evento.preventDefault()

    if (formGrade.id) {
      // Atualiza grade existente
      setGrades((listaAtual) =>
        listaAtual.map((item) =>
          item.id === formGrade.id
            ? { ...item, ...formGrade, nomeCurto: formGrade.nome }
            : item
        )
      )
    } else {
      // Cria nova grade
      const novaGrade = {
        ...formGrade,
        id: Date.now(),
        nomeCurto: formGrade.nome,
      }
      setGrades((listaAtual) => [novaGrade, ...listaAtual])
    }

    setModoTela('lista')
  }

  // Funções para abrir tela de Nova Matriz ou Editar Matriz
  function abrirNovaMatriz() {
    const primeiraGrade =
      grades[0]?.nomeCurto || grades[0]?.nome || 'Ref. Regular Sergipe - Médio'
    setFormMatriz({
      id: null,
      nome: '',
      gradeVinculada: primeiraGrade,
      tipoEnsino: 'Ensino Médio',
      disciplinas: '',
      cargaHoraria: '',
    })
    setModoTela('formMatriz')
  }

  function abrirEdicaoMatriz(matriz) {
    setFormMatriz({
      id: matriz.id,
      nome: matriz.nome,
      gradeVinculada: matriz.gradeVinculada,
      tipoEnsino: matriz.tipoEnsino,
      disciplinas: matriz.disciplinas,
      cargaHoraria: matriz.cargaHoraria,
    })
    setModoTela('formMatriz')
  }

  function salvarMatriz(evento) {
    evento.preventDefault()

    if (formMatriz.id) {
      // Atualiza matriz existente
      setMatrizes((listaAtual) =>
        listaAtual.map((item) =>
          item.id === formMatriz.id ? { ...item, ...formMatriz } : item
        )
      )
    } else {
      // Cria nova matriz
      const novaMatriz = {
        ...formMatriz,
        id: Date.now(),
      }
      setMatrizes((listaAtual) => [novaMatriz, ...listaAtual])
    }

    setModoTela('lista')
  }

  // Ao selecionar uma Grade Vinculada no formulário de Matriz, sugere o Tipo de Ensino correspondente
  function alterarGradeVinculadaNoForm(valorGrade) {
    const gradeEncontrada = grades.find(
      (g) => g.nomeCurto === valorGrade || g.nome === valorGrade
    )
    setFormMatriz((prev) => ({
      ...prev,
      gradeVinculada: valorGrade,
      tipoEnsino: gradeEncontrada ? gradeEncontrada.tipoEnsino : prev.tipoEnsino,
    }))
  }

  // Filtros das tabelas
  const gradesFiltradas = grades.filter((grade) => {
    const correspondeBusca =
      grade.nome.toLowerCase().includes(buscaGrade.toLowerCase()) ||
      grade.tipoEnsino.toLowerCase().includes(buscaGrade.toLowerCase())

    const correspondeEnsino =
      filtroEnsino === 'Todos' || grade.tipoEnsino === filtroEnsino

    const correspondeStatus =
      filtroStatus === 'Todas' || grade.status === filtroStatus

    return correspondeBusca && correspondeEnsino && correspondeStatus
  })

  const matrizesFiltradas = matrizes.filter((matriz) => {
    const correspondeBusca =
      matriz.nome.toLowerCase().includes(buscaMatriz.toLowerCase()) ||
      matriz.gradeVinculada.toLowerCase().includes(buscaMatriz.toLowerCase())

    const correspondeGrade =
      filtroGradeVinculada === 'Todas' ||
      matriz.gradeVinculada === filtroGradeVinculada

    const correspondeCarga =
      filtroCargaHoraria === 'Todas' ||
      matriz.cargaHoraria === filtroCargaHoraria

    return correspondeBusca && correspondeGrade && correspondeCarga
  })

  function abrirMatrizesDaGrade(nomeCurtoGrade) {
    setFiltroGradeVinculada(nomeCurtoGrade)
    setAbaAtiva('matrizes')
  }

  return (
    <div className="gc-page">
      <BarraLateral />

      <div className="gc-content-wrapper">
        <header className="gc-topbar">
          <div className="gc-topbar__search">
            <Search size={18} className="gc-topbar__search-icon" />
            <input
              type="text"
              placeholder="Buscar em escolas, matrículas, portarias..."
              aria-label="Buscar no sistema"
            />
          </div>

          <div className="gc-topbar__actions">
            <button
              type="button"
              className="gc-topbar__notification"
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>

            <div className="gc-topbar__divider" />

            <div className="gc-topbar__profile">
              <div className="gc-topbar__profile-info">
                <strong>Ana Oliveira</strong>
                <span>Coordenadora Estadual</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Ana Oliveira"
                className="gc-topbar__avatar"
              />
            </div>
          </div>
        </header>

        <main className="gc-main">
          {/* ================= TELA 1: FORMULÁRIO NOVA / EDITAR GRADE ================= */}
          {modoTela === 'formGrade' && (
            <div className="gc-form-container">
              <button
                type="button"
                className="gc-back-btn"
                onClick={() => setModoTela('lista')}
              >
                <ArrowLeft size={18} />
                <span>Voltar para Grades Curriculares</span>
              </button>

              <div className="gc-header">
                <div className="gc-header__titles">
                  <h1>
                    {formGrade.id
                      ? 'Editar Grade Curricular'
                      : 'Nova Grade Curricular'}
                  </h1>
                  <p>
                    Preencha as diretrizes de tempo, ensino e séries para a
                    organização curricular.
                  </p>
                </div>
              </div>

              <form className="gc-form-card" onSubmit={salvarGrade}>
                <div className="gc-form-grid">
                  <div className="gc-form-group gc-form-group--full">
                    <label htmlFor="nomeGrade">Nome da grade</label>
                    <input
                      id="nomeGrade"
                      type="text"
                      required
                      placeholder="Ex: Referencial Regular Sergipe - Médio"
                      value={formGrade.nome}
                      onChange={(e) =>
                        setFormGrade({ ...formGrade, nome: e.target.value })
                      }
                    />
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="tipoEnsinoGrade">Tipo de ensino</label>
                    <div className="gc-select-wrapper gc-select-wrapper--full">
                      <select
                        id="tipoEnsinoGrade"
                        value={formGrade.tipoEnsino}
                        onChange={(e) =>
                          setFormGrade({
                            ...formGrade,
                            tipoEnsino: e.target.value,
                          })
                        }
                      >
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Ensino Fundamental">
                          Ensino Fundamental
                        </option>
                        <option value="Ensino Integrado">
                          Ensino Integrado
                        </option>
                        <option value="Profissionalizante">
                          Profissionalizante
                        </option>
                        <option value="Outros / EJA">Outros / EJA</option>
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="seriesAnosGrade">Séries/Anos</label>
                    <input
                      id="seriesAnosGrade"
                      type="text"
                      required
                      placeholder="Ex: 1º, 2º e 3º Ano"
                      value={formGrade.seriesAnos}
                      onChange={(e) =>
                        setFormGrade({
                          ...formGrade,
                          seriesAnos: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="cargaHorariaGrade">
                      Carga horária total
                    </label>
                    <input
                      id="cargaHorariaGrade"
                      type="text"
                      required
                      placeholder="Ex: 3.000 horas"
                      value={formGrade.cargaHoraria}
                      onChange={(e) =>
                        setFormGrade({
                          ...formGrade,
                          cargaHoraria: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="statusGrade">Status</label>
                    <div className="gc-select-wrapper gc-select-wrapper--full">
                      <select
                        id="statusGrade"
                        value={formGrade.status}
                        onChange={(e) =>
                          setFormGrade({ ...formGrade, status: e.target.value })
                        }
                      >
                        <option value="Ativa">Ativa</option>
                        <option value="Em Análise">Em Análise</option>
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>
                  </div>
                </div>

                <div className="gc-form-actions">
                  <button
                    type="button"
                    className="gc-btn-secondary"
                    onClick={() => setModoTela('lista')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="gc-btn-primary">
                    <Check size={18} strokeWidth={2.5} />
                    <span>
                      {formGrade.id ? 'Salvar alterações' : 'Cadastrar grade'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TELA 2: FORMULÁRIO NOVA / EDITAR MATRIZ ================= */}
          {modoTela === 'formMatriz' && (
            <div className="gc-form-container">
              <button
                type="button"
                className="gc-back-btn"
                onClick={() => setModoTela('lista')}
              >
                <ArrowLeft size={18} />
                <span>Voltar para Matrizes Curriculares</span>
              </button>

              <div className="gc-header">
                <div className="gc-header__titles">
                  <h1>
                    {formMatriz.id
                      ? 'Editar Matriz Curricular'
                      : 'Nova Matriz Curricular'}
                  </h1>
                  <p>
                    Configure e vincule o conjunto de disciplinas e carga
                    horária anual a uma grade oficial.
                  </p>
                </div>
              </div>

              <form className="gc-form-card" onSubmit={salvarMatriz}>
                <div className="gc-form-grid">
                  <div className="gc-form-group gc-form-group--full">
                    <label htmlFor="nomeMatriz">Nome da matriz</label>
                    <input
                      id="nomeMatriz"
                      type="text"
                      required
                      placeholder="Ex: Proposta Curricular Geral 2026"
                      value={formMatriz.nome}
                      onChange={(e) =>
                        setFormMatriz({ ...formMatriz, nome: e.target.value })
                      }
                    />
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="gradeVinculadaMatriz">
                      Grade vinculada
                    </label>
                    <div className="gc-select-wrapper gc-select-wrapper--full">
                      <select
                        id="gradeVinculadaMatriz"
                        value={formMatriz.gradeVinculada}
                        onChange={(e) =>
                          alterarGradeVinculadaNoForm(e.target.value)
                        }
                      >
                        {grades.map((g) => (
                          <option
                            key={g.id}
                            value={g.nomeCurto || g.nome}
                          >
                            {g.nomeCurto || g.nome}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="tipoEnsinoMatriz">Tipo de ensino</label>
                    <div className="gc-select-wrapper gc-select-wrapper--full">
                      <select
                        id="tipoEnsinoMatriz"
                        value={formMatriz.tipoEnsino}
                        onChange={(e) =>
                          setFormMatriz({
                            ...formMatriz,
                            tipoEnsino: e.target.value,
                          })
                        }
                      >
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Ensino Fundamental">
                          Ensino Fundamental
                        </option>
                        <option value="Ensino Integrado">
                          Ensino Integrado
                        </option>
                        <option value="Profissionalizante">
                          Profissionalizante
                        </option>
                        <option value="Outros / EJA">Outros / EJA</option>
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="disciplinasMatriz">
                      Quantidade de disciplinas
                    </label>
                    <input
                      id="disciplinasMatriz"
                      type="text"
                      required
                      placeholder="Ex: 12 Disciplinas"
                      value={formMatriz.disciplinas}
                      onChange={(e) =>
                        setFormMatriz({
                          ...formMatriz,
                          disciplinas: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="gc-form-group">
                    <label htmlFor="cargaHorariaMatriz">
                      Carga horária anual
                    </label>
                    <input
                      id="cargaHorariaMatriz"
                      type="text"
                      required
                      placeholder="Ex: 1.000h / ano"
                      value={formMatriz.cargaHoraria}
                      onChange={(e) =>
                        setFormMatriz({
                          ...formMatriz,
                          cargaHoraria: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="gc-form-actions">
                  <button
                    type="button"
                    className="gc-btn-secondary"
                    onClick={() => setModoTela('lista')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="gc-btn-primary">
                    <Check size={18} strokeWidth={2.5} />
                    <span>
                      {formMatriz.id ? 'Salvar alterações' : 'Cadastrar matriz'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TELA 3: LISTAGEM (GRADES E MATRIZES) ================= */}
          {modoTela === 'lista' && (
            <>
              <div className="gc-tabs">
                <button
                  type="button"
                  className={`gc-tab ${
                    abaAtiva === 'grades' ? 'gc-tab--active' : ''
                  }`}
                  onClick={() => setAbaAtiva('grades')}
                >
                  Grades Curriculares
                </button>
                <button
                  type="button"
                  className={`gc-tab ${
                    abaAtiva === 'matrizes' ? 'gc-tab--active' : ''
                  }`}
                  onClick={() => {
                    setFiltroGradeVinculada('Todas')
                    setAbaAtiva('matrizes')
                  }}
                >
                  Matrizes Curriculares
                </button>
              </div>

              {abaAtiva === 'grades' ? (
                <>
                  <div className="gc-header">
                    <div className="gc-header__titles">
                      <h1>Grades Curriculares</h1>
                      <p>
                        Gerencie as diretrizes de tempo e séries para a
                        organização curricular das escolas.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="gc-btn-primary"
                      onClick={abrirNovaGrade}
                    >
                      <Plus size={18} strokeWidth={2.5} />
                      <span>Nova grade</span>
                    </button>
                  </div>

                  <div className="gc-filters">
                    <div className="gc-filter-search">
                      <Search size={16} className="gc-filter-search__icon" />
                      <input
                        type="text"
                        placeholder="Pesquisar por nome ou modalidade da grade..."
                        value={buscaGrade}
                        onChange={(e) => setBuscaGrade(e.target.value)}
                      />
                    </div>

                    <div className="gc-select-wrapper">
                      <select
                        value={filtroEnsino}
                        onChange={(e) => setFiltroEnsino(e.target.value)}
                        aria-label="Filtrar por tipo de ensino"
                      >
                        <option value="Todos">Ensino: Todos</option>
                        <option value="Ensino Médio">Ensino: Médio</option>
                        <option value="Ensino Fundamental">
                          Ensino: Fundamental
                        </option>
                        <option value="Ensino Integrado">
                          Ensino: Integrado
                        </option>
                        <option value="Profissionalizante">
                          Ensino: Profissionalizante
                        </option>
                        <option value="Outros / EJA">Ensino: Outros / EJA</option>
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>

                    <div className="gc-select-wrapper">
                      <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        aria-label="Filtrar por status"
                      >
                        <option value="Todas">Status: Todas</option>
                        <option value="Ativa">Status: Ativa</option>
                        <option value="Em Análise">Status: Em Análise</option>
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>
                  </div>

                  <div className="gc-table-card">
                    <div className="gc-table-responsive">
                      <table className="gc-table">
                        <thead>
                          <tr>
                            <th>Nome da grade</th>
                            <th>Tipo de ensino</th>
                            <th>Séries/Anos</th>
                            <th>Carga horária total</th>
                            <th>Status</th>
                            <th className="gc-table__th-acoes">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gradesFiltradas.length > 0 ? (
                            gradesFiltradas.map((grade) => (
                              <tr
                                key={grade.id}
                                onClick={() =>
                                  abrirMatrizesDaGrade(
                                    grade.nomeCurto || grade.nome
                                  )
                                }
                                className="gc-table__row-clickable"
                                title="Clique na linha para ver as matrizes vinculadas ou no lápis para editar"
                              >
                                <td className="gc-table__nome">{grade.nome}</td>
                                <td className="gc-table__ensino">
                                  {grade.tipoEnsino}
                                </td>
                                <td className="gc-table__series">
                                  {grade.seriesAnos}
                                </td>
                                <td className="gc-table__carga">
                                  {grade.cargaHoraria}
                                </td>
                                <td>
                                  <span
                                    className={`gc-badge ${
                                      grade.status === 'Ativa'
                                        ? 'gc-badge--ativa'
                                        : 'gc-badge--analise'
                                    }`}
                                  >
                                    {grade.status}
                                  </span>
                                </td>
                                <td className="gc-table__acoes">
                                  <button
                                    type="button"
                                    className="gc-action-btn"
                                    onClick={(e) => abrirEdicaoGrade(grade, e)}
                                    title="Editar grade"
                                    aria-label={`Editar ${grade.nome}`}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="gc-table__empty">
                                Nenhuma grade curricular encontrada.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="gc-pagination">
                      <span className="gc-pagination__info">
                        Mostrando 1-{gradesFiltradas.length} de {grades.length}{' '}
                        grades curriculares
                      </span>

                      <div className="gc-pagination__controls">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setPaginaGrades(num)}
                            className={`gc-page-btn ${
                              paginaGrades === num ? 'gc-page-btn--active' : ''
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button type="button" className="gc-page-btn" disabled>
                          ...
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="gc-header">
                    <div className="gc-header__titles">
                      <h1>Matrizes Curriculares</h1>
                      <p>
                        Consulte e vincule o conjunto de disciplinas às grades
                        acadêmicas oficiais.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="gc-btn-primary"
                      onClick={abrirNovaMatriz}
                    >
                      <Plus size={18} strokeWidth={2.5} />
                      <span>Nova matriz</span>
                    </button>
                  </div>

                  <div className="gc-filters">
                    <div className="gc-filter-search">
                      <Search size={16} className="gc-filter-search__icon" />
                      <input
                        type="text"
                        placeholder="Pesquisar por nome ou grade vinculada..."
                        value={buscaMatriz}
                        onChange={(e) => setBuscaMatriz(e.target.value)}
                      />
                    </div>

                    <div className="gc-select-wrapper">
                      <select
                        value={filtroGradeVinculada}
                        onChange={(e) =>
                          setFiltroGradeVinculada(e.target.value)
                        }
                        aria-label="Filtrar por grade vinculada"
                      >
                        <option value="Todas">Grade: Todas</option>
                        {grades.map((g) => (
                          <option
                            key={g.id}
                            value={g.nomeCurto || g.nome}
                          >
                            Grade: {g.nomeCurto || g.nome}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>

                    <div className="gc-select-wrapper">
                      <select
                        value={filtroCargaHoraria}
                        onChange={(e) => setFiltroCargaHoraria(e.target.value)}
                        aria-label="Filtrar por carga horária"
                      >
                        <option value="Todas">Carga Horária: Todas</option>
                        <option value="800h / ano">
                          Carga Horária: 800h / ano
                        </option>
                        <option value="900h / ano">
                          Carga Horária: 900h / ano
                        </option>
                        <option value="1.000h / ano">
                          Carga Horária: 1.000h / ano
                        </option>
                        <option value="1.200h / ano">
                          Carga Horária: 1.200h / ano
                        </option>
                        <option value="1.400h / ano">
                          Carga Horária: 1.400h / ano
                        </option>
                      </select>
                      <ChevronDown size={16} className="gc-select-icon" />
                    </div>
                  </div>

                  <div className="gc-table-card">
                    <div className="gc-table-responsive">
                      <table className="gc-table">
                        <thead>
                          <tr>
                            <th>Nome da matriz</th>
                            <th>Grade vinculada</th>
                            <th>Tipo de ensino</th>
                            <th>Disciplinas</th>
                            <th>Carga horária</th>
                            <th className="gc-table__th-acoes">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matrizesFiltradas.length > 0 ? (
                            matrizesFiltradas.map((matriz) => (
                              <tr key={matriz.id}>
                                <td className="gc-table__nome">
                                  {matriz.nome}
                                </td>
                                <td className="gc-table__series">
                                  {matriz.gradeVinculada}
                                </td>
                                <td className="gc-table__ensino">
                                  {matriz.tipoEnsino}
                                </td>
                                <td className="gc-table__series">
                                  {matriz.disciplinas}
                                </td>
                                <td className="gc-table__carga">
                                  {matriz.cargaHoraria}
                                </td>
                                <td className="gc-table__acoes">
                                  <button
                                    type="button"
                                    className="gc-action-btn"
                                    onClick={() => abrirEdicaoMatriz(matriz)}
                                    title="Editar matriz"
                                    aria-label={`Editar ${matriz.nome}`}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="gc-table__empty">
                                Nenhuma matriz curricular encontrada para esta
                                grade.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="gc-pagination">
                      <span className="gc-pagination__info">
                        Mostrando 1-{matrizesFiltradas.length} de{' '}
                        {matrizes.length} matrizes curriculares
                      </span>

                      <div className="gc-pagination__controls">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setPaginaMatrizes(num)}
                            className={`gc-page-btn ${
                              paginaMatrizes === num
                                ? 'gc-page-btn--active'
                                : ''
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button type="button" className="gc-page-btn" disabled>
                          ...
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default GradesCurricularesGestor