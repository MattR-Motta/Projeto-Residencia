import { useEffect, useMemo, useState } from 'react'
import { Users, Building2, House, GitPullRequest, Search, Plus, ChevronDown, Pencil, Unlink, X } from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralGestor'
import '../../styles/Gestor/ProfessoresGestor.css'

const CHAVE_STORAGE = 'edugestProfessoresGestor'
const POR_PAGINA = 5

const ESCOLAS = [
  { nome: 'Colégio Dom Pedro II', municipio: 'Aracaju' },
  { nome: 'C. E. Profa. Maria das Graças', municipio: 'Itabaiana' },
  { nome: 'E. E. Dr. João de Oliveira', municipio: 'Lagarto' },
  { nome: 'C. E. Murilo Braga', municipio: 'Itabaiana' },
  { nome: 'C. E. Gov. Augusto Franco', municipio: 'Nossa Senhora do Socorro' },
  { nome: 'E. E. Pres. Costa e Silva', municipio: 'Estância' },
]

const CARGAS = [
  { valor: '40', rotulo: '40 horas' },
  { valor: '32', rotulo: '32 horas' },
  { valor: '20', rotulo: '20 horas' },
]

const PROFESSORES_INICIAIS = [
  { id: 1, nome: 'Carlos Henrique Silva', disciplina: 'Matemática', escola: 'Colégio Dom Pedro II', municipio: 'Aracaju', carga: 40, status: 'Alocado', observacao: '' },
  { id: 2, nome: 'Mariana Rezende Lemos', disciplina: 'Língua Portuguesa', escola: 'C. E. Profa. Maria das Graças', municipio: 'Itabaiana', carga: 32, status: 'Alocado', observacao: '' },
  { id: 3, nome: 'Ricardo Alves de Souza', disciplina: 'História', escola: null, municipio: 'Aracaju', carga: 20, status: 'Disponível', observacao: '' },
  { id: 4, nome: 'Patrícia Sales Mendes', disciplina: 'Geografia', escola: 'E. E. Dr. João de Oliveira', municipio: 'Lagarto', carga: 40, status: 'Alocado', observacao: '' },
  { id: 5, nome: 'Antônio Carlos Bezerra', disciplina: 'Física', escola: null, municipio: 'Aracaju', carga: 0, status: 'Afastado', observacao: 'Afastado por licença médica' },
  { id: 6, nome: 'Juliana Prado Santana', disciplina: 'Biologia', escola: 'Colégio Dom Pedro II', municipio: 'Aracaju', carga: 32, status: 'Alocado', observacao: '' },
  { id: 7, nome: 'Fernando Matos Teles', disciplina: 'Química', escola: 'C. E. Profa. Maria das Graças', municipio: 'Itabaiana', carga: 40, status: 'Alocado', observacao: '' },
  { id: 8, nome: 'Luciana Barreto Nunes', disciplina: 'Artes', escola: null, municipio: 'Itabaiana', carga: 20, status: 'Disponível', observacao: '' },
  { id: 9, nome: 'Eduardo Cardoso Pinto', disciplina: 'Educação Física', escola: 'E. E. Dr. João de Oliveira', municipio: 'Lagarto', carga: 20, status: 'Alocado', observacao: '' },
  { id: 10, nome: 'Renata Oliveira Freitas', disciplina: 'Inglês', escola: 'Colégio Dom Pedro II', municipio: 'Aracaju', carga: 32, status: 'Alocado', observacao: '' },
  { id: 11, nome: 'Marcelo Dantas Vieira', disciplina: 'Sociologia', escola: null, municipio: 'Lagarto', carga: 20, status: 'Disponível', observacao: '' },
  { id: 12, nome: 'Camila Andrade Lima', disciplina: 'Filosofia', escola: 'C. E. Profa. Maria das Graças', municipio: 'Itabaiana', carga: 20, status: 'Alocado', observacao: '' },
  { id: 13, nome: 'Paulo Sérgio Ramos', disciplina: 'Matemática', escola: null, municipio: 'Estância', carga: 40, status: 'Disponível', observacao: '' },
  { id: 14, nome: 'Teresa Cristina Moura', disciplina: 'Língua Portuguesa', escola: 'E. E. Dr. João de Oliveira', municipio: 'Lagarto', carga: 40, status: 'Alocado', observacao: '' },
  { id: 15, nome: 'Gustavo Neves Almeida', disciplina: 'Física', escola: null, municipio: 'Aracaju', carga: 0, status: 'Afastado', observacao: 'Afastado por licença' },
]

const CLASSE_STATUS = {
  Alocado: 'alocado',
  Disponível: 'disponivel',
  Afastado: 'afastado',
}

const FORM_VAZIO = { professorId: '', escola: '', carga: '40' }

function carregarProfessores() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || 'null')
    if (Array.isArray(salvo) && salvo.length) return salvo
  } catch {
    // Usa os dados iniciais caso o armazenamento esteja inválido.
  }
  return PROFESSORES_INICIAIS
}

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function gerarPaginas(total, atual) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const numeros = [...new Set([1, total, atual - 1, atual, atual + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b)

  const saida = []
  numeros.forEach((n, i) => {
    if (i > 0 && n - numeros[i - 1] > 1) saida.push(`lacuna-${n}`)
    saida.push(n)
  })
  return saida
}

function ProfessoresGestor() {
  const [professores, setProfessores] = useState(carregarProfessores)
  const [busca, setBusca] = useState('')
  const [filtroCarga, setFiltroCarga] = useState('todas')
  const [filtroMunicipio, setFiltroMunicipio] = useState('todos')
  const [pagina, setPagina] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')
  const [professorDesvincular, setProfessorDesvincular] = useState(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(professores))
    } catch {
      // O armazenamento é opcional; a tela continua funcionando em memória.
    }
  }, [professores])

  useEffect(() => {
    if (!aviso) return undefined
    const timer = setTimeout(() => setAviso(''), 3500)
    return () => clearTimeout(timer)
  }, [aviso])

  useEffect(() => {
    if (!modal && !professorDesvincular) return undefined
    function aoTeclar(evento) {
      if (evento.key === 'Escape') {
        setModal(null)
        setProfessorDesvincular(null)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [modal, professorDesvincular])

  const indicadores = useMemo(() => {
    const alocados = professores.filter((p) => p.status === 'Alocado')
    const disponiveis = professores.filter((p) => p.status === 'Disponível')
    const escolasSemCobertura = ESCOLAS.filter(
      (escola) => !alocados.some((p) => p.escola === escola.nome),
    )
    const taxa = professores.length ? (alocados.length / professores.length) * 100 : 0

    return {
      total: professores.length,
      alocados: alocados.length,
      disponiveis: disponiveis.length,
      semCobertura: escolasSemCobertura.length,
      taxa: taxa.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
    }
  }, [professores])

  const municipios = useMemo(
    () => [...new Set(professores.map((p) => p.municipio).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [professores],
  )

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim())
    return professores.filter((p) => {
      const combinaBusca = !termo || normalizar(`${p.nome} ${p.disciplina}`).includes(termo)
      const combinaCarga = filtroCarga === 'todas' || String(p.carga) === filtroCarga
      const combinaMunicipio = filtroMunicipio === 'todos' || p.municipio === filtroMunicipio
      return combinaBusca && combinaCarga && combinaMunicipio
    })
  }, [professores, busca, filtroCarga, filtroMunicipio])

  const filtrando = busca.trim() !== '' || filtroCarga !== 'todas' || filtroMunicipio !== 'todos'
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * POR_PAGINA
  const visiveis = filtrados.slice(inicio, inicio + POR_PAGINA)
  const primeiroItem = filtrados.length ? inicio + 1 : 0
  const ultimoItem = Math.min(inicio + POR_PAGINA, filtrados.length)

  const professoresElegiveis = useMemo(
    () => professores.filter((p) => p.status !== 'Afastado').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [professores],
  )

  function limparFiltros() {
    setBusca('')
    setFiltroCarga('todas')
    setFiltroMunicipio('todos')
    setPagina(1)
  }

  function abrirAlocacao(professor) {
    setForm({
      professorId: professor ? String(professor.id) : '',
      escola: professor?.escola || '',
      carga: professor && professor.carga ? String(professor.carga) : '40',
    })
    setErro('')
    setModal({ editando: Boolean(professor) })
  }

  function atualizarForm(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErro('')
  }

  function confirmarAlocacao(evento) {
    evento.preventDefault()

    if (!form.professorId) {
      setErro('Selecione um professor.')
      return
    }
    if (!form.escola) {
      setErro('Selecione uma escola.')
      return
    }

    const escola = ESCOLAS.find((item) => item.nome === form.escola)
    const professor = professores.find((p) => String(p.id) === form.professorId)
    if (!escola || !professor) {
      setErro('Não foi possível localizar o professor ou a escola selecionada.')
      return
    }

    setProfessores((lista) =>
      lista.map((p) =>
        p.id === professor.id
          ? { ...p, escola: escola.nome, municipio: escola.municipio, carga: Number(form.carga), status: 'Alocado', observacao: '' }
          : p,
      ),
    )
    setModal(null)
    setAviso(`${professor.nome} alocado(a) em ${escola.nome}.`)
  }

  function confirmarDesvinculo() {
    if (!professorDesvincular) return
    const { id, nome } = professorDesvincular
    setProfessores((lista) => lista.map((p) => (p.id === id ? { ...p, escola: null, status: 'Disponível' } : p)))
    setProfessorDesvincular(null)
    setAviso(`${nome} agora está disponível para alocação.`)
  }

  return (
    <div className="eg-prof-shell">
      <BarraLateral />

      <main className="eg-prof-main">
        <header className="eg-prof-header">
          <div>
            <h1>Distribuição de Professores</h1>
            <p>Aloque docentes e controle a carga de trabalho de acordo com a demanda escolar.</p>
          </div>
          <button type="button" className="eg-prof-btn eg-prof-btn--primary" onClick={() => abrirAlocacao(null)}>
            <Plus size={18} aria-hidden="true" />
            Alocar professor
          </button>
        </header>

        <section className="eg-prof-stats" aria-label="Indicadores">
          <article className="eg-prof-stat">
            <div className="eg-prof-stat__top">
              <span>Total Professores</span>
              <span className="eg-prof-stat__icon eg-prof-stat__icon--azul"><Users size={16} aria-hidden="true" /></span>
            </div>
            <strong>{indicadores.total.toLocaleString('pt-BR')}</strong>
            <small className="eg-prof-stat__nota eg-prof-stat__nota--azul">Cadastro geral da rede</small>
          </article>

          <article className="eg-prof-stat">
            <div className="eg-prof-stat__top">
              <span>Alocados em Escola</span>
              <span className="eg-prof-stat__icon eg-prof-stat__icon--verde"><Building2 size={16} aria-hidden="true" /></span>
            </div>
            <strong>{indicadores.alocados.toLocaleString('pt-BR')}</strong>
            <small className="eg-prof-stat__nota eg-prof-stat__nota--verde">{indicadores.taxa}% de ocupação</small>
          </article>

          <article className="eg-prof-stat">
            <div className="eg-prof-stat__top">
              <span>Disponíveis para Alocação</span>
              <span className="eg-prof-stat__icon eg-prof-stat__icon--amarelo"><House size={16} aria-hidden="true" /></span>
            </div>
            <strong>{indicadores.disponiveis.toLocaleString('pt-BR')}</strong>
            <small className="eg-prof-stat__nota eg-prof-stat__nota--laranja">Cadastro reserva ativo</small>
          </article>

          <article className="eg-prof-stat">
            <div className="eg-prof-stat__top">
              <span>Escolas sem Cobertura</span>
              <span className="eg-prof-stat__icon eg-prof-stat__icon--vermelho"><GitPullRequest size={16} aria-hidden="true" /></span>
            </div>
            <strong>{indicadores.semCobertura.toLocaleString('pt-BR')}</strong>
            <small className="eg-prof-stat__nota eg-prof-stat__nota--vermelho">
              {indicadores.semCobertura > 0 ? 'Necessidade de triagem' : 'Todas as escolas cobertas'}
            </small>
          </article>
        </section>

        <section className="eg-prof-filtros" aria-label="Filtros">
          <label className="eg-prof-busca">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={busca}
              placeholder="Filtrar por nome do professor ou especialidade..."
              aria-label="Filtrar por nome do professor ou especialidade"
              onChange={(e) => {
                setBusca(e.target.value)
                setPagina(1)
              }}
            />
          </label>

          <label className="eg-prof-select">
            <span className="eg-prof-select__rotulo">Carga Horária:</span>
            <select
              value={filtroCarga}
              onChange={(e) => {
                setFiltroCarga(e.target.value)
                setPagina(1)
              }}
              aria-label="Filtrar por carga horária"
            >
              <option value="todas">Todas</option>
              {CARGAS.map((c) => (
                <option key={c.valor} value={c.valor}>{c.rotulo}</option>
              ))}
              <option value="0">0 horas</option>
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </label>

          <label className="eg-prof-select">
            <span className="eg-prof-select__rotulo">Município:</span>
            <select
              value={filtroMunicipio}
              onChange={(e) => {
                setFiltroMunicipio(e.target.value)
                setPagina(1)
              }}
              aria-label="Filtrar por município"
            >
              <option value="todos">Todos</option>
              {municipios.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </label>

          {filtrando && (
            <button type="button" className="eg-prof-btn eg-prof-btn--link" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </section>

        <section className="eg-prof-tabela-card">
          <div className="eg-prof-tabela-scroll">
            <table className="eg-prof-tabela">
              <thead>
                <tr>
                  <th scope="col">Nome do professor</th>
                  <th scope="col">Disciplina principal</th>
                  <th scope="col">Escola vinculada</th>
                  <th scope="col">Carga horária</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="eg-prof-tabela__acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="eg-prof-vazio">
                      Nenhum professor encontrado com esses filtros.
                      <button type="button" className="eg-prof-btn eg-prof-btn--link" onClick={limparFiltros}>
                        Limpar filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  visiveis.map((p) => (
                    <tr key={p.id}>
                      <td className="eg-prof-tabela__nome">{p.nome}</td>
                      <td>{p.disciplina}</td>
                      <td className="eg-prof-tabela__escola">
                        {p.status === 'Afastado' ? p.observacao || 'Afastado' : p.escola || 'Não vinculado'}
                      </td>
                      <td>{p.carga} horas</td>
                      <td>
                        <span className={`eg-prof-badge eg-prof-badge--${CLASSE_STATUS[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="eg-prof-tabela__acoes">
                        <button
                          type="button"
                          className="eg-prof-icone"
                          onClick={() => abrirAlocacao(p)}
                          disabled={p.status === 'Afastado'}
                          title={p.status === 'Alocado' ? 'Realocar professor' : 'Alocar professor'}
                          aria-label={`${p.status === 'Alocado' ? 'Realocar' : 'Alocar'} ${p.nome}`}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="eg-prof-icone eg-prof-icone--perigo"
                          onClick={() => setProfessorDesvincular(p)}
                          disabled={p.status !== 'Alocado'}
                          title="Desvincular da escola"
                          aria-label={`Desvincular ${p.nome} da escola`}
                        >
                          <Unlink size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="eg-prof-rodape">
            <span>
              Mostrando {primeiroItem}-{ultimoItem} de {filtrados.length.toLocaleString('pt-BR')} professores {filtrando ? 'encontrados' : 'cadastrados'}
            </span>
            <nav className="eg-prof-paginacao" aria-label="Paginação">
              {gerarPaginas(totalPaginas, paginaAtual).map((item) =>
                typeof item === 'number' ? (
                  <button
                    key={item}
                    type="button"
                    className={`eg-prof-pagina${item === paginaAtual ? ' eg-prof-pagina--ativa' : ''}`}
                    onClick={() => setPagina(item)}
                    aria-current={item === paginaAtual ? 'page' : undefined}
                    aria-label={`Página ${item}`}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="eg-prof-pagina eg-prof-pagina--reticencias" aria-hidden="true">…</span>
                ),
              )}
            </nav>
          </footer>
        </section>
      </main>

      {modal && (
        <div className="eg-prof-overlay" onMouseDown={() => setModal(null)}>
          <form
            className="eg-prof-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eg-prof-modal-titulo"
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={confirmarAlocacao}
            noValidate
          >
            <header className="eg-prof-modal__topo">
              <h2 id="eg-prof-modal-titulo">{modal.editando ? 'Realocar professor' : 'Alocar professor'}</h2>
              <button type="button" className="eg-prof-icone" onClick={() => setModal(null)} aria-label="Fechar">
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <label className="eg-prof-campo">
              <span>Professor</span>
              <select
                value={form.professorId}
                onChange={(e) => atualizarForm('professorId', e.target.value)}
                disabled={modal.editando}
                autoFocus={!modal.editando}
              >
                <option value="">Selecione um professor</option>
                {professoresElegiveis.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {p.disciplina}
                  </option>
                ))}
              </select>
            </label>

            <label className="eg-prof-campo">
              <span>Escola</span>
              <select value={form.escola} onChange={(e) => atualizarForm('escola', e.target.value)} autoFocus={modal.editando}>
                <option value="">Selecione uma escola</option>
                {ESCOLAS.map((escola) => (
                  <option key={escola.nome} value={escola.nome}>
                    {escola.nome} ({escola.municipio})
                  </option>
                ))}
              </select>
            </label>

            <label className="eg-prof-campo">
              <span>Carga horária</span>
              <select value={form.carga} onChange={(e) => atualizarForm('carga', e.target.value)}>
                {CARGAS.map((c) => (
                  <option key={c.valor} value={c.valor}>{c.rotulo}</option>
                ))}
              </select>
            </label>

            {erro && <p className="eg-prof-erro" role="alert">{erro}</p>}

            <footer className="eg-prof-modal__acoes">
              <button type="button" className="eg-prof-btn eg-prof-btn--neutro" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button type="submit" className="eg-prof-btn eg-prof-btn--primary">
                {modal.editando ? 'Salvar alocação' : 'Alocar professor'}
              </button>
            </footer>
          </form>
        </div>
      )}

      {professorDesvincular && (
        <div className="eg-prof-overlay" onMouseDown={() => setProfessorDesvincular(null)}>
          <div
            className="eg-prof-modal eg-prof-modal--pequeno"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="eg-prof-desvincular-titulo"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="eg-prof-modal__topo">
              <h2 id="eg-prof-desvincular-titulo">Desvincular professor</h2>
            </header>
            <p className="eg-prof-modal__texto">
              {professorDesvincular.nome} será removido(a) de {professorDesvincular.escola} e ficará disponível para nova alocação.
            </p>
            <footer className="eg-prof-modal__acoes">
              <button type="button" className="eg-prof-btn eg-prof-btn--neutro" onClick={() => setProfessorDesvincular(null)} autoFocus>
                Cancelar
              </button>
              <button type="button" className="eg-prof-btn eg-prof-btn--perigo" onClick={confirmarDesvinculo}>
                Desvincular
              </button>
            </footer>
          </div>
        </div>
      )}

      {aviso && (
        <div className="eg-prof-toast" role="status" aria-live="polite">
          {aviso}
        </div>
      )}
    </div>
  )
}

export default ProfessoresGestor