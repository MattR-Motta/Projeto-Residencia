import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye, Bell, ChevronDown, X } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/gestor/baseGestor.css'
import '../../styles/gestor/gradesGestor.css'

// ---- Dados das grades (guardados no navegador) ----
const CHAVE = 'gradesEduGest'

const GRADES_INICIAIS = [
  { id: 1, nome: 'Referencial Regular Sergipe - Médio', ensino: 'Ensino Médio', series: '1º, 2º e 3º Ano', carga: 3000, status: 'Ativa' },
  { id: 2, nome: 'Matriz Unificada Fundamental I', ensino: 'Ensino Fundamental', series: '1º ao 5º Ano', carga: 4500, status: 'Ativa' },
  { id: 3, nome: 'Base Integrada Agropecuária', ensino: 'Ensino Integrado', series: '1º ao 4º Ano', carga: 4200, status: 'Ativa' },
  { id: 4, nome: 'Matriz Fundamental II Regular', ensino: 'Ensino Fundamental', series: '6º ao 9º Ano', carga: 3600, status: 'Ativa' },
  { id: 5, nome: 'Formação Técnica Administração', ensino: 'Profissionalizante', series: '1º e 2º Módulo', carga: 1200, status: 'Em Análise' },
  { id: 6, nome: 'EJA - Médio Exponencial', ensino: 'Outros / EJA', series: 'Etapa I e II', carga: 1600, status: 'Ativa' },
]

function listarGrades() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null')

    if (Array.isArray(salvo)) {
      return salvo
    }
  } catch {
    // Se os dados estiverem inválidos, volta pra lista inicial.
  }

  localStorage.setItem(CHAVE, JSON.stringify(GRADES_INICIAIS))
  return GRADES_INICIAIS
}

function salvarGrades(lista) {
  localStorage.setItem(CHAVE, JSON.stringify(lista))
}

function formatarCarga(horas) {
  return `${Number(horas).toLocaleString('pt-BR')} horas`
}

const OPCOES_ENSINO = ['Todos', 'Ensino Médio', 'Ensino Fundamental', 'Ensino Integrado', 'Profissionalizante', 'Outros / EJA']
const OPCOES_STATUS = ['Todas', 'Ativa', 'Em Análise']
const ITENS_POR_PAGINA = 6

function GradesGestor() {
  const navigate = useNavigate()

  const [grades, setGrades] = useState(listarGrades)
  const [busca, setBusca] = useState('')
  const [ensino, setEnsino] = useState('Todos')
  const [status, setStatus] = useState('Todas')
  const [pagina, setPagina] = useState(1)

  // Controla a janelinha (modal): { tipo: 'ver' ou 'excluir', grade }
  const [modal, setModal] = useState(null)

  // Filtra a lista toda vez que grades, busca, ensino ou status mudam
  const gradesFiltradas = useMemo(() => {
    const texto = busca.toLowerCase()

    return grades.filter((grade) => {
      const bateBusca =
        grade.nome.toLowerCase().includes(texto) ||
        grade.ensino.toLowerCase().includes(texto)
      const bateEnsino = ensino === 'Todos' || grade.ensino === ensino
      const bateStatus = status === 'Todas' || grade.status === status

      return bateBusca && bateEnsino && bateStatus
    })
  }, [grades, busca, ensino, status])

  // Paginação
  const totalPaginas = Math.max(1, Math.ceil(gradesFiltradas.length / ITENS_POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const gradesDaPagina = gradesFiltradas.slice(inicio, inicio + ITENS_POR_PAGINA)

  // Sempre que um filtro muda, volta pra página 1
  function mudarFiltro(setter, valor) {
    setter(valor)
    setPagina(1)
  }

  function excluirGrade() {
    const novaLista = grades.filter((grade) => grade.id !== modal.grade.id)

    setGrades(novaLista)
    salvarGrades(novaLista)
    setModal(null)
  }

  return (
    <div className="grades-pagina">
      <BarraLateral />

      <div className="grades-conteudo">
        {/* Topo: sino e usuário */}
        <header className="grades-topo" style={{ justifyContent: 'flex-end' }}>
          <div className="grades-topo-direita" style={{ marginLeft: 'auto' }}>
            <button type="button" className="grades-sino" aria-label="Notificações">
              <Bell size={18} />
            </button>

            <div className="grades-usuario">
              <div className="grades-usuario-texto">
                <strong>Ana Oliveira</strong>
                <span>Coordenadora Estadual</span>
              </div>
              <div className="grades-avatar">AO</div>
            </div>
          </div>
        </header>

        <main className="grades-principal">
          {/* Título e botão */}
          <div className="grades-titulo-area">
            <div>
              <h1>Grades Curriculares</h1>
              <p>Gerencie as diretrizes de tempo e séries para a organização curricular das escolas.</p>
            </div>

            <button
              type="button"
              className="grades-botao-nova"
              onClick={() => navigate('/gestor/grades/nova')}
            >
              <Plus size={18} />
              Nova grade
            </button>
          </div>

          {/* Filtros */}
          <div className="grades-filtros">
            <div className="grades-campo-busca">
              <Search size={16} />
              <input
                type="text"
                placeholder="Pesquisar por nome ou modalidade da grade..."
                value={busca}
                onChange={(e) => mudarFiltro(setBusca, e.target.value)}
              />
            </div>

            <label className="grades-select">
              <span>Ensino:</span>
              <select value={ensino} onChange={(e) => mudarFiltro(setEnsino, e.target.value)}>
                {OPCOES_ENSINO.map((opcao) => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </label>

            <label className="grades-select">
              <span>Status:</span>
              <select value={status} onChange={(e) => mudarFiltro(setStatus, e.target.value)}>
                {OPCOES_STATUS.map((opcao) => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </label>
          </div>

          {/* Tabela */}
          <section className="grades-cartao">
            <div className="grades-tabela-scroll">
              <table className="grades-tabela">
                <thead>
                  <tr>
                    <th>Nome da grade</th>
                    <th>Tipo de ensino</th>
                    <th>Séries/Anos</th>
                    <th>Carga horária total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {gradesDaPagina.map((grade) => (
                    <tr key={grade.id}>
                      <td className="grades-nome">{grade.nome}</td>
                      <td>{grade.ensino}</td>
                      <td className="grades-suave">{grade.series}</td>
                      <td className="grades-suave">{formatarCarga(grade.carga)}</td>
                      <td>
                        <span className={grade.status === 'Ativa' ? 'grades-status ativa' : 'grades-status analise'}>
                          {grade.status}
                        </span>
                      </td>
                      <td>
                        <div className="grades-acoes">
                          <button
                            type="button"
                            aria-label="Ver grade"
                            title="Ver detalhes"
                            onClick={() => setModal({ tipo: 'ver', grade })}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            aria-label="Editar grade"
                            title="Editar"
                            onClick={() => navigate(`/gestor/grades/${grade.id}/editar`)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            aria-label="Excluir grade"
                            title="Excluir"
                            onClick={() => setModal({ tipo: 'excluir', grade })}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {gradesDaPagina.length === 0 && (
                    <tr>
                      <td colSpan="6" className="grades-vazio">
                        Nenhuma grade encontrada. Tente mudar a busca ou os filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé: contagem e páginas */}
            <div className="grades-rodape">
              <span>
                Mostrando {gradesFiltradas.length === 0 ? 0 : inicio + 1}-{inicio + gradesDaPagina.length} de {gradesFiltradas.length} grades curriculares
              </span>

              <div className="grades-paginas">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    type="button"
                    className={numero === paginaAtual ? 'ativa' : ''}
                    onClick={() => setPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Janelinha de ver detalhes */}
      {modal?.tipo === 'ver' && (
        <div className="grades-modal-fundo" onClick={() => setModal(null)}>
          <div
            className="grades-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grades-modal-topo">
              <h2>Detalhes da grade</h2>
              <button type="button" aria-label="Fechar" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <dl className="grades-detalhes">
              <div>
                <dt>Nome da grade</dt>
                <dd>{modal.grade.nome}</dd>
              </div>
              <div>
                <dt>Tipo de ensino</dt>
                <dd>{modal.grade.ensino}</dd>
              </div>
              <div>
                <dt>Séries/Anos</dt>
                <dd>{modal.grade.series}</dd>
              </div>
              <div>
                <dt>Carga horária total</dt>
                <dd>{formatarCarga(modal.grade.carga)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{modal.grade.status}</dd>
              </div>
            </dl>

            <div className="nova-botoes">
              <button type="button" className="nova-cancelar" onClick={() => setModal(null)}>
                Fechar
              </button>
              <button
                type="button"
                className="grades-botao-nova"
                onClick={() => navigate(`/gestor/grades/${modal.grade.id}/editar`)}
              >
                <Pencil size={16} />
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Janelinha de confirmar exclusão */}
      {modal?.tipo === 'excluir' && (
        <div className="grades-modal-fundo" onClick={() => setModal(null)}>
          <div
            className="grades-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grades-modal-topo">
              <h2>Excluir grade</h2>
              <button type="button" aria-label="Fechar" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="grades-modal-texto">
              Tem certeza que quer excluir a grade <strong>{modal.grade.nome}</strong>? Essa ação não pode ser desfeita.
            </p>

            <div className="nova-botoes">
              <button type="button" className="nova-cancelar" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button type="button" className="grades-botao-excluir" onClick={excluirGrade}>
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GradesGestor