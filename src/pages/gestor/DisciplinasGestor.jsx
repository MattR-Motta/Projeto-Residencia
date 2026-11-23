import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralGestor'
import '../../styles/Gestor/baseGestor.css'
import '../../styles/Gestor/disciplinasGestor.css'

const CHAVE_STORAGE = 'disciplinasGestorEduGest'

const disciplinasIniciais = [
  { id: 1, nome: 'Matemática', cargaHoraria: 120, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 2, nome: 'Língua Portuguesa', cargaHoraria: 120, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 3, nome: 'História', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 4, nome: 'Geografia', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 5, nome: 'Física', cargaHoraria: 120, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 6, nome: 'Química', cargaHoraria: 120, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 7, nome: 'Biologia', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 8, nome: 'Filosofia', cargaHoraria: 40, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 9, nome: 'Sociologia', cargaHoraria: 40, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 10, nome: 'Educação Física', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 11, nome: 'Arte', cargaHoraria: 40, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 12, nome: 'Inglês', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 13, nome: 'Espanhol', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 14, nome: 'Educação Financeira', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 15, nome: 'Programação', cargaHoraria: 80, tipo: 'Optativa', status: 'Ativa' },
  { id: 16, nome: 'Robótica', cargaHoraria: 60, tipo: 'Optativa', status: 'Ativa' },
  { id: 17, nome: 'Empreendedorismo', cargaHoraria: 60, tipo: 'Optativa', status: 'Ativa' },
  { id: 18, nome: 'Música', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 19, nome: 'Literatura Brasileira', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 20, nome: 'Estatística', cargaHoraria: 60, tipo: 'Optativa', status: 'Ativa' },
  { id: 21, nome: 'Química Ambiental', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 22, nome: 'Astronomia', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 23, nome: 'Direitos Humanos', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 24, nome: 'Cultura Sergipana', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 25, nome: 'Desenho Técnico', cargaHoraria: 60, tipo: 'Optativa', status: 'Ativa' },
  { id: 26, nome: 'Geometria', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 27, nome: 'Ciências', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 28, nome: 'Redação', cargaHoraria: 80, tipo: 'Obrigatória', status: 'Ativa' },
  { id: 29, nome: 'Informática Básica', cargaHoraria: 60, tipo: 'Optativa', status: 'Ativa' },
  { id: 30, nome: 'Educação Ambiental', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 31, nome: 'Teatro', cargaHoraria: 40, tipo: 'Optativa', status: 'Ativa' },
  { id: 32, nome: 'Projeto de Vida', cargaHoraria: 40, tipo: 'Obrigatória', status: 'Ativa' }
]

const normalizarTexto = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function carregarDisciplinas() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE)
    return dadosSalvos ? JSON.parse(dadosSalvos) : disciplinasIniciais
  } catch {
    return disciplinasIniciais
  }
}

export default function DisciplinasGestor() {
  const [disciplinas, setDisciplinas] = useState(carregarDisciplinas)
  const [busca, setBusca] = useState('')
  const [filtroCarga, setFiltroCarga] = useState('Todas')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [disciplinaEditando, setDisciplinaEditando] = useState(null)
  const [formulario, setFormulario] = useState({ nome: '', cargaHoraria: '', tipo: 'Obrigatória', status: 'Ativa' })
  const [erro, setErro] = useState('')

  const itensPorPagina = 5

  useEffect(() => {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(disciplinas))
  }, [disciplinas])

  const disciplinasFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca.trim())

    return disciplinas.filter((disciplina) => {
      const correspondeBusca = normalizarTexto(disciplina.nome).includes(termo)
      const correspondeCarga = filtroCarga === 'Todas' || String(disciplina.cargaHoraria) === filtroCarga
      const correspondeTipo = filtroTipo === 'Todos' || disciplina.tipo === filtroTipo

      return correspondeBusca && correspondeCarga && correspondeTipo
    })
  }, [disciplinas, busca, filtroCarga, filtroTipo])

  const totalPaginas = Math.max(1, Math.ceil(disciplinasFiltradas.length / itensPorPagina))
  const inicio = (paginaAtual - 1) * itensPorPagina
  const disciplinasExibidas = disciplinasFiltradas.slice(inicio, inicio + itensPorPagina)
  const totalAtivas = disciplinas.filter((disciplina) => disciplina.status === 'Ativa').length

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [paginaAtual, totalPaginas])

  function abrirCadastro() {
    setDisciplinaEditando(null)
    setFormulario({ nome: '', cargaHoraria: '', tipo: 'Obrigatória', status: 'Ativa' })
    setErro('')
    setModalAberto(true)
  }

  function abrirEdicao(disciplina) {
    setDisciplinaEditando(disciplina)
    setFormulario({
      nome: disciplina.nome,
      cargaHoraria: String(disciplina.cargaHoraria),
      tipo: disciplina.tipo,
      status: disciplina.status
    })
    setErro('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setDisciplinaEditando(null)
    setErro('')
  }

  function salvarDisciplina(evento) {
    evento.preventDefault()

    const nome = formulario.nome.trim()
    const cargaHoraria = Number(formulario.cargaHoraria)

    if (!nome || !cargaHoraria || cargaHoraria <= 0) {
      setErro('Preencha todos os campos corretamente.')
      return
    }

    const nomeDuplicado = disciplinas.some((disciplina) =>
      normalizarTexto(disciplina.nome) === normalizarTexto(nome) && disciplina.id !== disciplinaEditando?.id
    )

    if (nomeDuplicado) {
      setErro('Já existe uma disciplina cadastrada com esse nome.')
      return
    }

    const dadosDisciplina = {
      nome,
      cargaHoraria,
      tipo: formulario.tipo,
      status: formulario.status
    }

    if (disciplinaEditando) {
      setDisciplinas((atuais) => atuais.map((disciplina) =>
        disciplina.id === disciplinaEditando.id ? { ...disciplina, ...dadosDisciplina } : disciplina
      ))
    } else {
      setDisciplinas((atuais) => [...atuais, { id: Date.now(), ...dadosDisciplina }])
    }

    setPaginaAtual(1)
    fecharModal()
  }

  function excluirDisciplina(id) {
    if (window.confirm('Tem certeza de que deseja excluir esta disciplina?')) {
      setDisciplinas((atuais) => atuais.filter((disciplina) => disciplina.id !== id))
    }
  }

  function alterarStatus(disciplina) {
    setDisciplinas((atuais) => atuais.map((item) =>
      item.id === disciplina.id
        ? { ...item, status: item.status === 'Ativa' ? 'Inativa' : 'Ativa' }
        : item
    ))
  }

  return (
    <div className="gestor-layout">
      <BarraLateral />
      <main className="gestor-main">
        <header className="gestor-header">
          <div>
            <span className="gestor-breadcrumb">Gestor / Disciplinas</span>
            <h1>Disciplinas</h1>
          </div>
          <div className="gestor-header-usuario">
            <span>Gestor</span>
            <div className="gestor-avatar">G</div>
          </div>
        </header>

        <section className="gestor-conteudo">
          <div className="gestor-intro">
            <div>
              <h2>Gerenciamento de disciplinas</h2>
              <p>Cadastre e gerencie as disciplinas da rede de ensino.</p>
            </div>
            <button className="gestor-botao" onClick={abrirCadastro}>
              <Plus size={18} /> Nova disciplina
            </button>
          </div>

          <div className="disciplinas-resumo">
            <div>
              <span>Total de disciplinas cadastradas</span>
              <strong>{disciplinas.length}</strong>
            </div>
            <div>
              <span>Disciplinas ativas</span>
              <strong>{totalAtivas}</strong>
            </div>
          </div>

          <section className="gestor-painel">
            <div className="gestor-filtros">
              <label className="gestor-campo disciplinas-busca">
                <span>Pesquisar disciplina</span>
                <div className="disciplinas-input-busca">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar pelo nome..."
                    value={busca}
                    onChange={(evento) => { setBusca(evento.target.value); setPaginaAtual(1) }}
                  />
                </div>
              </label>

              <label className="gestor-campo">
                <span>Carga horária</span>
                <select value={filtroCarga} onChange={(evento) => { setFiltroCarga(evento.target.value); setPaginaAtual(1) }}>
                  <option value="Todas">Todas</option>
                  <option value="40">40 horas</option>
                  <option value="60">60 horas</option>
                  <option value="80">80 horas</option>
                  <option value="120">120 horas</option>
                </select>
              </label>

              <label className="gestor-campo">
                <span>Tipo</span>
                <select value={filtroTipo} onChange={(evento) => { setFiltroTipo(evento.target.value); setPaginaAtual(1) }}>
                  <option value="Todos">Todos</option>
                  <option value="Obrigatória">Obrigatória</option>
                  <option value="Optativa">Optativa</option>
                </select>
              </label>
            </div>

            <div className="gestor-tabela-wrap">
              <table className="gestor-tabela">
                <thead>
                  <tr>
                    <th>Nome da disciplina</th>
                    <th>Carga horária</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplinasExibidas.length > 0 ? disciplinasExibidas.map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td className="disciplinas-nome">{disciplina.nome}</td>
                      <td>{disciplina.cargaHoraria}h</td>
                      <td>{disciplina.tipo}</td>
                      <td>
                        <button
                          className={`gestor-status ${disciplina.status === 'Ativa' ? 'disciplinas-status-ativa' : 'disciplinas-status-inativa'}`}
                          onClick={() => alterarStatus(disciplina)}
                          title="Clique para alterar o status"
                          aria-label={`Alterar status de ${disciplina.nome}. Status atual: ${disciplina.status}`}
                        >
                          {disciplina.status}
                        </button>
                      </td>
                      <td>
                        <div className="gestor-acoes">
                          <button className="gestor-acao-icone" onClick={() => abrirEdicao(disciplina)} title="Editar">
                            <Pencil size={17} />
                          </button>
                          <button className="gestor-acao-icone disciplinas-acao-excluir" onClick={() => excluirDisciplina(disciplina.id)} title="Excluir">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="gestor-vazio">Nenhuma disciplina encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="disciplinas-paginacao">
              <span>
                Exibindo {disciplinasFiltradas.length === 0 ? 0 : inicio + 1}–{Math.min(inicio + itensPorPagina, disciplinasFiltradas.length)} de {disciplinasFiltradas.length} disciplinas
              </span>
              <div>
                <button onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))} disabled={paginaAtual === 1} title="Página anterior">
                  <ChevronLeft size={18} />
                </button>
                <span>Página {paginaAtual} de {totalPaginas}</span>
                <button onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))} disabled={paginaAtual === totalPaginas} title="Próxima página">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>

      {modalAberto && (
        <div className="gestor-modal-fundo" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) fecharModal() }}>
          <section className="gestor-modal disciplinas-modal">
            <div className="disciplinas-modal-cabecalho">
              <div>
                <h2>{disciplinaEditando ? 'Editar disciplina' : 'Nova disciplina'}</h2>
                <p>Informe os dados da disciplina.</p>
              </div>
              <button type="button" className="disciplinas-fechar-modal" onClick={fecharModal} title="Fechar">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvarDisciplina}>
              <div className="gestor-form-grid">
                <label className="gestor-form-campo disciplinas-campo-completo">
                  <span>Nome da disciplina</span>
                  <input value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} placeholder="Ex.: Matemática" />
                </label>

                <label className="gestor-form-campo">
                  <span>Carga horária (horas)</span>
                  <input type="number" min="1" value={formulario.cargaHoraria} onChange={(evento) => setFormulario({ ...formulario, cargaHoraria: evento.target.value })} placeholder="Ex.: 120" />
                </label>

                <label className="gestor-form-campo">
                  <span>Tipo</span>
                  <select value={formulario.tipo} onChange={(evento) => setFormulario({ ...formulario, tipo: evento.target.value })}>
                    <option value="Obrigatória">Obrigatória</option>
                    <option value="Optativa">Optativa</option>
                  </select>
                </label>

                <label className="gestor-form-campo">
                  <span>Status</span>
                  <select value={formulario.status} onChange={(evento) => setFormulario({ ...formulario, status: evento.target.value })}>
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </label>
              </div>

              {erro && <p className="disciplinas-erro">{erro}</p>}

              <div className="gestor-modal-acoes">
                <button type="button" className="disciplinas-botao-cancelar" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="gestor-botao">{disciplinaEditando ? 'Salvar alterações' : 'Cadastrar disciplina'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}