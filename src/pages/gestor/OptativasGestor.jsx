import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/Gestor/baseGestor.css'
import '../../styles/Gestor/optativasGestor.css'

const CHAVE_STORAGE = 'optativasGestorEduGest'

const optativasIniciais = [
  { id: 1, nome: 'Robótica e Automação Básica', cargaHoraria: 60, area: 'Matemática e suas Tecnologias', escolas: ['Escola Estadual Modelo'], status: 'Ativa' },
  { id: 2, nome: 'Artes Visuais e Cultura Local', cargaHoraria: 40, area: 'Linguagens', escolas: ['Escola Estadual Modelo', 'Colégio Estadual Central'], status: 'Ativa' },
  { id: 3, nome: 'Música e Expressão Sonora', cargaHoraria: 40, area: 'Linguagens', escolas: ['Colégio Estadual Central'], status: 'Ativa' },
  { id: 4, nome: 'Empreendedorismo e Projetos', cargaHoraria: 60, area: 'Ciências Humanas', escolas: ['Escola Estadual Modelo', 'Centro de Excelência'], status: 'Ativa' },
  { id: 5, nome: 'Educação Financeira', cargaHoraria: 40, area: 'Matemática e suas Tecnologias', escolas: ['Centro de Excelência'], status: 'Ativa' },
  { id: 6, nome: 'Cinema e Produção Audiovisual', cargaHoraria: 40, area: 'Linguagens', escolas: ['Escola Estadual Modelo'], status: 'Ativa' },
  { id: 7, nome: 'Sustentabilidade e Meio Ambiente', cargaHoraria: 60, area: 'Ciências da Natureza', escolas: ['Colégio Estadual Central'], status: 'Ativa' },
  { id: 8, nome: 'Programação e Desenvolvimento Web', cargaHoraria: 60, area: 'Matemática e suas Tecnologias', escolas: ['Centro de Excelência', 'Escola Estadual Modelo'], status: 'Ativa' },
  { id: 9, nome: 'Cultura Sergipana', cargaHoraria: 40, area: 'Ciências Humanas', escolas: ['Colégio Estadual Central'], status: 'Ativa' },
  { id: 10, nome: 'Práticas Esportivas', cargaHoraria: 40, area: 'Linguagens', escolas: ['Centro de Excelência'], status: 'Inativa' },
  { id: 11, nome: 'Saúde e Qualidade de Vida', cargaHoraria: 40, area: 'Ciências da Natureza', escolas: ['Escola Estadual Modelo'], status: 'Ativa' },
  { id: 12, nome: 'Astronomia para Iniciantes', cargaHoraria: 60, area: 'Ciências da Natureza', escolas: ['Colégio Estadual Central', 'Centro de Excelência'], status: 'Ativa' }
]

const areasConhecimento = ['Linguagens', 'Matemática e suas Tecnologias', 'Ciências da Natureza', 'Ciências Humanas']

const normalizarTexto = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function carregarOptativas() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE)
    return dadosSalvos ? JSON.parse(dadosSalvos) : optativasIniciais
  } catch {
    return optativasIniciais
  }
}

export default function OptativasGestor() {
  const [optativas, setOptativas] = useState(carregarOptativas)
  const [busca, setBusca] = useState('')
  const [filtroArea, setFiltroArea] = useState('Todas')
  const [filtroOferta, setFiltroOferta] = useState('Todas')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [optativaEditando, setOptativaEditando] = useState(null)
  const [formulario, setFormulario] = useState({ nome: '', cargaHoraria: '', area: '', escolas: '', status: 'Ativa' })
  const [erro, setErro] = useState('')

  const itensPorPagina = 5

  useEffect(() => {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(optativas))
  }, [optativas])

  const escolasDisponiveis = useMemo(
    () => [...new Set(optativas.flatMap((optativa) => optativa.escolas))].sort(),
    [optativas]
  )

  const optativasFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca.trim())

    return optativas.filter((optativa) => {
      const correspondeBusca = normalizarTexto(`${optativa.nome} ${optativa.area}`).includes(termo)
      const correspondeArea = filtroArea === 'Todas' || optativa.area === filtroArea
      const correspondeOferta = filtroOferta === 'Todas' || optativa.escolas.includes(filtroOferta)

      return correspondeBusca && correspondeArea && correspondeOferta
    })
  }, [optativas, busca, filtroArea, filtroOferta])

  const totalPaginas = Math.max(1, Math.ceil(optativasFiltradas.length / itensPorPagina))
  const inicio = (paginaAtual - 1) * itensPorPagina
  const optativasExibidas = optativasFiltradas.slice(inicio, inicio + itensPorPagina)
  const totalAtivas = optativas.filter((optativa) => optativa.status === 'Ativa').length

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas)
  }, [paginaAtual, totalPaginas])

  function abrirCadastro() {
    setOptativaEditando(null)
    setFormulario({ nome: '', cargaHoraria: '', area: '', escolas: '', status: 'Ativa' })
    setErro('')
    setModalAberto(true)
  }

  function abrirEdicao(optativa) {
    setOptativaEditando(optativa)
    setFormulario({
      nome: optativa.nome,
      cargaHoraria: String(optativa.cargaHoraria),
      area: optativa.area,
      escolas: optativa.escolas.join(', '),
      status: optativa.status
    })
    setErro('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setOptativaEditando(null)
    setErro('')
  }

  function salvarOptativa(evento) {
    evento.preventDefault()

    const nome = formulario.nome.trim()
    const cargaHoraria = Number(formulario.cargaHoraria)
    const escolas = formulario.escolas.split(',').map((escola) => escola.trim()).filter(Boolean)

    if (!nome || !formulario.area || !cargaHoraria || cargaHoraria <= 0 || escolas.length === 0) {
      setErro('Preencha todos os campos corretamente.')
      return
    }

    const nomeDuplicado = optativas.some((optativa) =>
      normalizarTexto(optativa.nome) === normalizarTexto(nome) && optativa.id !== optativaEditando?.id
    )

    if (nomeDuplicado) {
      setErro('Já existe uma optativa cadastrada com esse nome.')
      return
    }

    const dadosOptativa = { nome, cargaHoraria, area: formulario.area, escolas, status: formulario.status }

    if (optativaEditando) {
      setOptativas((atuais) => atuais.map((optativa) =>
        optativa.id === optativaEditando.id ? { ...optativa, ...dadosOptativa } : optativa
      ))
    } else {
      setOptativas((atuais) => [...atuais, { id: Date.now(), ...dadosOptativa }])
    }

    setPaginaAtual(1)
    fecharModal()
  }

  function excluirOptativa(id) {
    if (window.confirm('Tem certeza de que deseja excluir esta optativa?')) {
      setOptativas((atuais) => atuais.filter((optativa) => optativa.id !== id))
    }
  }

  function alterarStatus(optativa) {
    setOptativas((atuais) => atuais.map((item) =>
      item.id === optativa.id ? { ...item, status: item.status === 'Ativa' ? 'Inativa' : 'Ativa' } : item
    ))
  }

  return (
    <div className="gestor-layout">
      <BarraLateral />
      <main className="gestor-main">
        <header className="gestor-header">
          <div>
            <span className="gestor-breadcrumb">Gestor / Optativas</span>
            <h1>Optativas</h1>
          </div>
          <div className="gestor-header-usuario">
            <span>Gestor</span>
            <div className="gestor-avatar">G</div>
          </div>
        </header>

        <section className="gestor-conteudo">
          <div className="gestor-intro">
            <div>
              <h2>Disciplinas optativas</h2>
              <p>Gerencie as disciplinas optativas e eletivas ofertadas pelas escolas.</p>
            </div>
            <button className="gestor-botao" onClick={abrirCadastro}>
              <Plus size={18} /> Nova optativa
            </button>
          </div>

          <div className="optativas-resumo">
            <div>
              <span>Total de optativas cadastradas</span>
              <strong>{optativas.length}</strong>
            </div>
            <div>
              <span>Optativas ativas</span>
              <strong>{totalAtivas}</strong>
            </div>
          </div>

          <section className="gestor-painel">
            <div className="gestor-filtros">
              <label className="gestor-campo optativas-busca">
                <span>Pesquisar optativa</span>
                <div className="optativas-input-busca">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou área..."
                    value={busca}
                    onChange={(evento) => { setBusca(evento.target.value); setPaginaAtual(1) }}
                  />
                </div>
              </label>

              <label className="gestor-campo">
                <span>Área de conhecimento</span>
                <select value={filtroArea} onChange={(evento) => { setFiltroArea(evento.target.value); setPaginaAtual(1) }}>
                  <option value="Todas">Todas</option>
                  {areasConhecimento.map((area) => <option key={area} value={area}>{area}</option>)}
                </select>
              </label>

              <label className="gestor-campo">
                <span>Escola ofertante</span>
                <select value={filtroOferta} onChange={(evento) => { setFiltroOferta(evento.target.value); setPaginaAtual(1) }}>
                  <option value="Todas">Todas</option>
                  {escolasDisponiveis.map((escola) => <option key={escola} value={escola}>{escola}</option>)}
                </select>
              </label>
            </div>

            <div className="gestor-tabela-wrap">
              <table className="gestor-tabela">
                <thead>
                  <tr>
                    <th>Nome da optativa/eletiva</th>
                    <th>Carga horária</th>
                    <th>Área de conhecimento</th>
                    <th>Escolas ofertantes</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {optativasExibidas.length > 0 ? optativasExibidas.map((optativa) => (
                    <tr key={optativa.id}>
                      <td className="optativas-nome">{optativa.nome}</td>
                      <td>{optativa.cargaHoraria}h</td>
                      <td>{optativa.area}</td>
                      <td>
                        <div className="optativas-escolas" title={optativa.escolas.join(', ')}>
                          {optativa.escolas.join(', ')}
                        </div>
                      </td>
                      <td>
                        <button
                          className={`gestor-status ${optativa.status === 'Ativa' ? 'optativas-status-ativa' : 'optativas-status-inativa'}`}
                          onClick={() => alterarStatus(optativa)}
                          title="Clique para alterar o status"
                        >
                          {optativa.status}
                        </button>
                      </td>
                      <td>
                        <div className="gestor-acoes">
                          <button className="gestor-acao-icone" onClick={() => abrirEdicao(optativa)} title="Editar">
                            <Pencil size={17} />
                          </button>
                          <button className="gestor-acao-icone optativas-acao-excluir" onClick={() => excluirOptativa(optativa.id)} title="Excluir">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="gestor-vazio">Nenhuma optativa encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="optativas-paginacao">
              <span>
                Exibindo {optativasFiltradas.length === 0 ? 0 : inicio + 1}–{Math.min(inicio + itensPorPagina, optativasFiltradas.length)} de {optativasFiltradas.length} optativas
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
          <section className="gestor-modal optativas-modal">
            <div className="optativas-modal-cabecalho">
              <div>
                <h2>{optativaEditando ? 'Editar optativa' : 'Nova optativa'}</h2>
                <p>Informe os dados da disciplina optativa.</p>
              </div>
              <button type="button" className="optativas-fechar-modal" onClick={fecharModal} title="Fechar">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvarOptativa}>
              <div className="gestor-form-grid">
                <label className="gestor-form-campo optativas-campo-completo">
                  <span>Nome da optativa</span>
                  <input value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} placeholder="Ex.: Robótica e Automação Básica" />
                </label>

                <label className="gestor-form-campo">
                  <span>Carga horária (horas)</span>
                  <input type="number" min="1" value={formulario.cargaHoraria} onChange={(evento) => setFormulario({ ...formulario, cargaHoraria: evento.target.value })} placeholder="Ex.: 60" />
                </label>

                <label className="gestor-form-campo">
                  <span>Área de conhecimento</span>
                  <select value={formulario.area} onChange={(evento) => setFormulario({ ...formulario, area: evento.target.value })}>
                    <option value="">Selecione uma área</option>
                    {areasConhecimento.map((area) => <option key={area} value={area}>{area}</option>)}
                  </select>
                </label>

                <label className="gestor-form-campo optativas-campo-completo">
                  <span>Escolas ofertantes</span>
                  <input value={formulario.escolas} onChange={(evento) => setFormulario({ ...formulario, escolas: evento.target.value })} placeholder="Separe os nomes das escolas por vírgula" />
                  <small>Ex.: Escola Estadual Modelo, Colégio Estadual Central</small>
                </label>

                <label className="gestor-form-campo">
                  <span>Status</span>
                  <select value={formulario.status} onChange={(evento) => setFormulario({ ...formulario, status: evento.target.value })}>
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </label>
              </div>

              {erro && <p className="optativas-erro">{erro}</p>}

              <div className="gestor-modal-acoes">
                <button type="button" className="optativas-botao-cancelar" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="gestor-botao">{optativaEditando ? 'Salvar alterações' : 'Cadastrar optativa'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}