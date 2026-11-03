import { useState } from 'react'
import BarraLateral from '../../components/barraLateral'
import ErrorState from '../../components/ErrorState'
import useErroPagina from '../../hooks/useErroPagina'
import '../../styles/coordenador.css'
import iconeVisualizar from '../../assets/visualizar.png'
import iconeEditar from '../../assets/editar.png'
import iconeAtivar from '../../assets/ativar.png'
import iconeDesativar from '../../assets/desativar.png'

const turmasIniciais = [
  {
    id: 1,
    codigo: 'TUR001',
    nome: 'Desenvolvimento de Sistemas',
    curso: 'Técnico em Desenvolvimento de Sistemas',
    periodo: 'Manhã',
    alunos: 32,
    docente: 'Carlos Oliveira',
    status: 'Ativa',
  },
  {
    id: 2,
    codigo: 'TUR002',
    nome: 'Informática',
    curso: 'Técnico em Informática',
    periodo: 'Tarde',
    alunos: 28,
    docente: 'Ana Santos',
    status: 'Ativa',
  },
  {
    id: 3,
    codigo: 'TUR003',
    nome: 'Administração',
    curso: 'Técnico em Administração',
    periodo: 'Noite',
    alunos: 30,
    docente: 'Mariana Costa',
    status: 'Ativa',
  },
  {
    id: 4,
    codigo: 'TUR004',
    nome: 'Desenvolvimento Web',
    curso: 'Formação complementar',
    periodo: 'Manhã',
    alunos: 25,
    docente: 'Pedro Almeida',
    status: 'Inativa',
  },
]

const textosErro = {
  carregar: {
    titulo: 'Não foi possível carregar as turmas',
    descricao: 'Ocorreu um erro ao buscar as informações das turmas. Verifique sua conexão com a internet e tente novamente.',
  },
  timeout: {
    titulo: 'A operação demorou muito para responder',
    descricao: 'Não foi possível concluir a solicitação dentro do tempo esperado. Verifique sua conexão com a internet e tente novamente.',
  },
  indisponibilidade: {
    titulo: 'Serviço indisponível no momento',
    descricao: 'O serviço de turmas está indisponível. Tente novamente em alguns instantes.',
  },
}

function Turmas() {
  const { tipo: erroPagina, limparErro } = useErroPagina()
  const [turmas, setTurmas] = useState(turmasIniciais)
  const [pesquisa, setPesquisa] = useState('')
  const [filtroPeriodo, setFiltroPeriodo] = useState('Todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [turmaSelecionada, setTurmaSelecionada] = useState(null)
  const [modoModal, setModoModal] = useState('nova')
  const [mensagem, setMensagem] = useState('')

  const [formulario, setFormulario] = useState({
    nome: '',
    curso: '',
    periodo: 'Manhã',
    alunos: '',
    docente: '',
  })

  const turmasFiltradas = turmas.filter((turma) => {
    const termo = pesquisa.toLowerCase()

    const correspondePesquisa =
      turma.nome.toLowerCase().includes(termo) ||
      turma.codigo.toLowerCase().includes(termo) ||
      turma.curso.toLowerCase().includes(termo)

    const correspondePeriodo =
      filtroPeriodo === 'Todos' ||
      turma.periodo === filtroPeriodo

    return correspondePesquisa && correspondePeriodo
  })

  function abrirNovaTurma() {
    setModoModal('nova')
    setTurmaSelecionada(null)

    setFormulario({
      nome: '',
      curso: '',
      periodo: 'Manhã',
      alunos: '',
      docente: '',
    })

    setMensagem('')
    setModalAberto(true)
  }

  function abrirEdicao(turma) {
    setModoModal('editar')
    setTurmaSelecionada(turma)

    setFormulario({
      nome: turma.nome,
      curso: turma.curso,
      periodo: turma.periodo,
      alunos: String(turma.alunos),
      docente: turma.docente,
    })

    setMensagem('')
    setModalAberto(true)
  }

  function alterarFormulario(event) {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  function salvarTurma(event) {
    event.preventDefault()

    if (
      !formulario.nome.trim() ||
      !formulario.curso.trim() ||
      !formulario.docente.trim() ||
      formulario.alunos === '' ||
      Number(formulario.alunos) < 0
    ) {
      setMensagem('Preencha os campos corretamente.')
      return
    }

    if (modoModal === 'editar' && turmaSelecionada) {
      setTurmas((anteriores) =>
        anteriores.map((turma) => turma.id === turmaSelecionada.id ? {...turma, ...formulario, alunos: Number(formulario.alunos),} : turma)
      )
    } else {
      const novaTurma = {
        id: Date.now(), codigo: `TUR${String(turmas.length + 1).padStart(3, '0')}`, ...formulario, alunos: Number(formulario.alunos), status: 'Ativa',
      }

      setTurmas((anteriores) => [...anteriores, novaTurma])
    }

    setModalAberto(false)
    setMensagem('')
  }

  function alterarStatus(turma) {
    setTurmas((anteriores) =>
      anteriores.map((item) =>
        item.id === turma.id ? {...item, status: item.status === 'Ativa' ? 'Inativa' : 'Ativa',} : item
      )
    )
  }

  function visualizarTurma(turma) {
    setTurmaSelecionada(turma)
    setModoModal('visualizar')

    setFormulario({
      nome: turma.nome,
      curso: turma.curso,
      periodo: turma.periodo,
      alunos: String(turma.alunos),
      docente: turma.docente,
    })

    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setTurmaSelecionada(null)
    setMensagem('')
  }

  return (
    <div className="coordenador-layout">
      <BarraLateral />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="breadcrumb">EduGest / Turmas</span>
            <h1>Turmas</h1>
          </div>
        </header>

        {erroPagina ? (
          <div className="dashboard-conteudo">
            <ErrorState
              tipo={erroPagina}
              titulo={textosErro[erroPagina].titulo}
              descricao={textosErro[erroPagina].descricao}
              onTentarNovamente={limparErro}
            />
          </div>
        ) : (
          <>
        <div className="dashboard-conteudo">
          <section className="turmas-intro">
            <div>
              <h2>Gerenciamento de turmas</h2>
              <p>Consulte e organize as turmas da instituição em um só lugar.</p>
            </div>

            <button className="turmas-botao-principal" onClick={abrirNovaTurma}>
              + Nova turma
            </button>
          </section>

          <section className="turmas-resumo">
            <article className="turmas-resumo-card">
              <span>Total de turmas</span>
              <strong>{turmas.length}</strong>
            </article>

            <article className="turmas-resumo-card">
              <span>Turmas ativas</span>
              <strong>
                {turmas.filter((turma) => turma.status === 'Ativa').length}
              </strong>
            </article>

            <article className="turmas-resumo-card">
              <span>Total de alunos</span>
              <strong>
                {turmas.filter((turma) => turma.status === 'Ativa').reduce((total, turma) => total + turma.alunos, 0)}
              </strong>
            </article>
          </section>

          <section className="turmas-painel">
            <div className="turmas-filtros">
              <div className="turmas-pesquisa">
                <span aria-hidden="true">⌕</span>
                <input type="search" placeholder="Pesquisar por nome, código ou curso..."
                  value={pesquisa} onChange={(event) => setPesquisa(event.target.value)} aria-label="Pesquisar turmas"/>
              </div>

              <select value={filtroPeriodo} onChange={(event) => setFiltroPeriodo(event.target.value)} aria-label="Filtrar por período" className="turmas-select">
                <option value="Todos">Todos os períodos</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>

            <div className="turmas-tabela-cabecalho">
              <div>
                <h3>Turmas cadastradas</h3>
                <p>{turmasFiltradas.length}{' '} {turmasFiltradas.length === 1 ? 'turma encontrada' : 'turmas encontradas'}</p>
              </div>
            </div>

            <div className="turmas-tabela-container">
              <table className="turmas-tabela">
                <thead>
                  <tr>
                    <th>Turma</th>
                    <th>Período</th>
                    <th>Alunos</th>
                    <th>Docente responsável</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {turmasFiltradas.map((turma) => (
                    <tr key={turma.id}>
                      <td>
                        <div className="turma-identificacao">
                          <div className="turma-avatar">
                            {turma.nome.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{turma.nome}</strong>
                            <span>
                              {turma.codigo} · {turma.curso}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{turma.periodo}</td>
                      <td>{turma.alunos}</td>
                      <td>{turma.docente}</td>

                      <td>
                        <span
                          className={`turma-status ${turma.status === 'Ativa' ? 'status-ativa' : 'status-inativa'}`}>
                          {turma.status}
                        </span>
                      </td>

                      <td>
                        <div className="turma-acoes">
                          <button type="button" title="Visualizar turma"
                            aria-label={`Visualizar ${turma.nome}`} onClick={() => visualizarTurma(turma)}>
                            <img src={iconeVisualizar} alt="" className="turma-acao-icone"/>
                          </button>

                          <button type="button" title="Editar turma" aria-label={`Editar ${turma.nome}`} onClick={() => abrirEdicao(turma)}>
                            <img src={iconeEditar} alt="" className="turma-acao-icone"/>
                          </button>

                          <button type="button" title={turma.status === 'Ativa' ? 'Desativar turma' : 'Ativar turma'}
                            aria-label={`Alterar status de ${turma.nome}`} onClick={() => alterarStatus(turma)}>
                            <img src={turma.status === 'Ativa' ? iconeDesativar : iconeAtivar} alt="" className="turma-acao-icone"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {turmasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan="6" className="turmas-vazio">
                        Nenhuma turma encontrada com esses filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>EduGest · Plataforma de gestão acadêmica</span>
            <span>Dados demonstrativos para prototipação</span>
          </footer>
        </div>
          </>
        )}
      </main>

      {modalAberto && (
        <div className="turmas-modal-fundo" onMouseDown={(event) => {if (event.target === event.currentTarget) fecharModal()}}>
          <section className="turmas-modal" role="dialog" aria-modal="true" aria-labelledby="turmas-modal-titulo">
            <div className="turmas-modal-cabecalho">
              <div>
                <h2 id="turmas-modal-titulo">
                  {modoModal === 'nova' ? 'Cadastrar nova turma' : modoModal === 'editar' ? 'Editar turma' : 'Detalhes da turma'}
                </h2>
                <p>{modoModal === 'visualizar' ? 'Consulte as informações cadastradas.' : 'Preencha as informações da turma.'}</p>
              </div>

              <button type="button" className="turmas-modal-fechar" onClick={fecharModal} aria-label="Fechar janela">×</button>
            </div>

            <form onSubmit={salvarTurma}>
              <div className="turmas-formulario">
                <label>
                  Nome da turma *
                  <input name="nome" value={formulario.nome} onChange={alterarFormulario} placeholder="Ex.: Desenvolvimento de Sistemas" required
                    disabled={modoModal === 'visualizar'}/>
                </label>

                <label>
                  Curso *
                  <input name="curso" value={formulario.curso} onChange={alterarFormulario} placeholder="Nome do curso" required 
                  disabled={modoModal === 'visualizar'}/>
                </label>

                <label>
                  Período *
                  <select name="periodo" value={formulario.periodo} onChange={alterarFormulario} disabled={modoModal === 'visualizar'}>
                    <option>Manhã</option>
                    <option>Tarde</option>
                    <option>Noite</option>
                  </select>
                </label>

                <label>
                  Quantidade de alunos *
                  <input name="alunos" type="number" min="0" step="1" value={formulario.alunos} onChange={alterarFormulario} 
                  placeholder="Ex.: 30" required disabled={modoModal === 'visualizar'}/>
                </label>

                <label className="turmas-campo-completo">
                  Docente responsável *
                  <input name="docente" value={formulario.docente} 
                    onChange={alterarFormulario} placeholder="Nome do docente" required disabled={modoModal === 'visualizar'}/>
                </label>
              </div>

              {mensagem && (
                <p className="turmas-mensagem-erro">{mensagem}</p>
              )}

              <div className="turmas-modal-acoes">
                <button type="button" className="turmas-botao-secundario" onClick={fecharModal}>
                  {modoModal === 'visualizar' ? 'Fechar' : 'Cancelar'}
                </button>

                {modoModal !== 'visualizar' && (
                  <button type="submit" className="turmas-botao-principal"> {modoModal === 'nova' ? 'Cadastrar turma' : 'Salvar alterações'}</button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
export default Turmas