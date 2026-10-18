import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BarraLateral from '../../components/barraLateral'
import '../../styles/telasCoordenador.css'
import { Bell } from 'lucide-react'

const dadosIniciais = [
  { id: 1, nome: 'Matemática', codigo: 'MAT-101', professor: 'Carlos Mendes', turmas: '1A e 2B', carga: 80, curso: 'Ensino Médio', periodo: '1º período', status: 'Atualizada', ementa: 'Conjuntos numéricos, funções, geometria plana e espacial, estatística e resolução de problemas.' },
  { id: 2, nome: 'Língua Portuguesa', codigo: 'POR-102', professor: 'Ana Souza', turmas: '2B e 3A', carga: 80, curso: 'Ensino Médio', periodo: '2º período', status: 'Atualização pendente', ementa: 'Leitura e interpretação de textos, gêneros textuais, gramática, produção textual e literatura brasileira.' },
  { id: 3, nome: 'Física', codigo: 'FIS-201', professor: 'Rafael Lima', turmas: '3A', carga: 60, curso: 'Ensino Médio', periodo: '1º período', status: 'Atualizada', ementa: 'Mecânica, termologia, ondas, óptica, eletricidade e aplicações dos conceitos físicos.' },
  { id: 4, nome: 'Ciências', codigo: 'CIE-105', professor: 'Juliana Alves', turmas: '4C', carga: 60, curso: 'Ensino Fundamental', periodo: '3º período', status: 'Revisão necessária', ementa: 'Seres vivos, ecossistemas, corpo humano, matéria, energia e sustentabilidade.' },
]

function DisciplinasEmentas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [disciplinas, setDisciplinas] = useState(dadosIniciais)
  const [pesquisa, setPesquisa] = useState('')
  const [curso, setCurso] = useState('Todos os cursos')
  const [periodo, setPeriodo] = useState('Todos os períodos')
  const [modal, setModal] = useState(null)
  const [selecionada, setSelecionada] = useState(null)
  const [form, setForm] = useState({ nome: '', codigo: '', professor: '', turmas: '', carga: 60, curso: 'Ensino Médio', periodo: '1º período', ementa: '' })
  const erro = searchParams.get('erro') === '1'

  const filtradas = useMemo(() => disciplinas.filter(d => {
    const texto = `${d.nome} ${d.codigo} ${d.professor} ${d.turmas}`.toLowerCase()
    return texto.includes(pesquisa.toLowerCase()) &&
      (curso === 'Todos os cursos' || d.curso === curso) &&
      (periodo === 'Todos os períodos' || d.periodo === periodo)
  }), [disciplinas, pesquisa, curso, periodo])

  function abrir(tipo, disciplina = null) {
    setSelecionada(disciplina)
    setForm(disciplina ? { ...disciplina } : { nome: '', codigo: '', professor: '', turmas: '', carga: 60, curso: 'Ensino Médio', periodo: '1º período', ementa: '' })
    setModal(tipo)
  }
  function salvar(e) {
    e.preventDefault()
    const item = { ...form, carga: Number(form.carga), status: selecionada?.status || 'Atualizada' }
    if (selecionada) setDisciplinas(old => old.map(d => d.id === selecionada.id ? { ...d, ...item } : d))
    else setDisciplinas(old => [...old, { ...item, id: Date.now() }])
    setModal(null)
  }
  function atualizarEmenta(d) {
    setSelecionada(d)
    setForm({ ...d })
    setModal('ementa')
  }
  function salvarEmenta(e) {
    e.preventDefault()
    setDisciplinas(old => old.map(d => d.id === selecionada.id ? { ...d, ementa: form.ementa, status: 'Atualizada' } : d))
    setModal(null)
  }

  return <div className="coordenador-layout telas-prototipo">
    <BarraLateral />
    <main className="dashboard-main tp-main">
      <header className="tp-topbar">
        <div className="tp-global-search">⌕ <span>Buscar no EduGest...</span></div>
        <div className="tp-user"><Bell className="tp-bell" size={20} strokeWidth={1.8} /><span className="tp-avatar" /><div><strong>Marina Costa</strong><small>Coordenadora</small></div><span>⌄</span></div>
      </header>
      {erro ? <section className="tp-error">
        <div className="tp-error-art" aria-hidden="true"><div className="tp-error-window"><i/><i/><i/><b>▥</b></div><strong>×</strong><span>!</span></div>
        <h1>Não foi possível carregar o painel</h1>
        <p>Ocorreu um erro ao buscar as informações das disciplinas e ementas.<br/>Verifique sua conexão com a internet e tente novamente.</p>
        <button className="tp-retry" onClick={() => setSearchParams({})}>⟳ <span>Tente novamente</span></button>
      </section> : <div className="tp-content">
        <div className="tp-page-title"><div><h1>Disciplinas e Ementas</h1><p>Gerencie as disciplinas e seus conteúdos programáticos.</p></div><button className="tp-primary" onClick={() => abrir('nova')}>＋ Nova disciplina</button></div>
        <div className="tp-filters">
          <label className="tp-search">⌕ <input value={pesquisa} onChange={e => setPesquisa(e.target.value)} placeholder="Buscar disciplina, professor ou código..."/></label>
          <select value={curso} onChange={e => setCurso(e.target.value)}><option>Todos os cursos</option><option>Ensino Médio</option><option>Ensino Fundamental</option></select>
          <select value={periodo} onChange={e => setPeriodo(e.target.value)}><option>Todos os períodos</option><option>1º período</option><option>2º período</option><option>3º período</option></select>
        </div>
        <div className="tp-table-wrap"><table className="tp-table"><thead><tr><th>DISCIPLINA</th><th>PROFESSOR / TURMAS</th><th>CARGA</th><th>EMENTA</th><th>AÇÕES</th></tr></thead><tbody>
          {filtradas.map(d => <tr key={d.id}><td><strong>{d.nome}</strong><small>{d.codigo}</small></td><td>{d.professor}<small>Turma(s): {d.turmas}</small></td><td>{d.carga}h<small>Carga horária</small></td><td><span className={`tp-pill ${d.status === 'Atualizada' ? 'green' : d.status === 'Revisão necessária' ? 'red' : 'yellow'}`}>{d.status}</span></td><td>
            <div className="tp-actions">
                <button
                  type="button"
                  onClick={() => abrir('visualizar', d)}
                  title="Visualizar ementa"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M3 3 21 21" />
                  </svg>
                  Visualizar ementa
                </button>

                <button
                  type="button"
                  onClick={() => abrir('editar', d)}
                  title="Editar disciplina"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m15 5 4 4M4 20l4-.8L20 7a2.8 2.8 0 0 0-4-4L4 15l-0.8 4Z" />
                  </svg>
                  Editar disciplina
                </button>

                <button
                  type="button"
                  onClick={() => atualizarEmenta(d)}
                  title="Editar ementa"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6M8 13h8M8 17h5" />
                    <path d="m9 10 2-2" />
                  </svg>
                  Editar ementa
                </button>

                <button
                  type="button"
                  onClick={() => abrir('associar', d)}
                  title="Associar professor/turma"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9" cy="7" r="4" />
                    <path d="M2 21v-2a7 7 0 0 1 14 0v2M19 8v6M16 11h6" />
                  </svg>
                  Associar professor/turma
                </button>
              </div>
              </td></tr>)}
          {!filtradas.length && <tr><td colSpan="5" className="tp-empty">Nenhuma disciplina encontrada com esses filtros.</td></tr>}
        </tbody></table></div>
      </div>}
    </main>
    {modal && <div className="tp-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}><section className="tp-modal" role="dialog" aria-modal="true">
      <header><div><h2>{modal === 'nova' ? 'Nova disciplina' : modal === 'visualizar' ? `Ementa — ${selecionada?.nome}` : modal === 'ementa' ? `Editar ementa — ${selecionada?.nome}` : modal === 'associar' ? 'Associar professor/turma' : 'Editar disciplina'}</h2><p>Informações acadêmicas da disciplina.</p></div><button onClick={() => setModal(null)} aria-label="Fechar">×</button></header>
      {modal === 'visualizar' ? <><p className="tp-ementa-text">{selecionada?.ementa}</p><div className="tp-modal-actions"><button className="tp-secondary" onClick={() => setModal(null)}>Fechar</button><button className="tp-primary" onClick={() => atualizarEmenta(selecionada)}>Editar ementa</button></div></> :
      <form onSubmit={modal === 'ementa' ? salvarEmenta : salvar}>
        {modal !== 'ementa' && <div className="tp-form-grid">
          <label>Nome da disciplina *<input required value={form.nome} onChange={e => setForm({...form, nome:e.target.value})} disabled={modal === 'associar'}/></label>
          <label>Código *<input required value={form.codigo} onChange={e => setForm({...form, codigo:e.target.value})} disabled={modal === 'associar'}/></label>
          <label>Curso<select value={form.curso} onChange={e => setForm({...form, curso:e.target.value})} disabled={modal === 'associar'}><option>Ensino Médio</option><option>Ensino Fundamental</option></select></label>
          <label>Período<select value={form.periodo} onChange={e => setForm({...form, periodo:e.target.value})} disabled={modal === 'associar'}><option>1º período</option><option>2º período</option><option>3º período</option></select></label>
          <label>Professor<input value={form.professor} onChange={e => setForm({...form, professor:e.target.value})} placeholder="Nome do professor"/></label>
          <label>Turmas<input value={form.turmas} onChange={e => setForm({...form, turmas:e.target.value})} placeholder="Ex.: 1A e 2B"/></label>
          <label>Carga horária (h)<input type="number" min="1" value={form.carga} onChange={e => setForm({...form, carga:e.target.value})} disabled={modal === 'associar'}/></label>
        </div>}
        {(modal === 'ementa' || modal !== 'associar') && <label className="tp-full-label">Ementa / conteúdo programático<textarea rows="4" value={form.ementa} onChange={e => setForm({...form, ementa:e.target.value})} placeholder="Descreva os conteúdos programáticos..."/></label>}
        <div className="tp-modal-actions"><button type="button" className="tp-secondary" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="tp-primary">{modal === 'associar' ? 'Salvar associação' : 'Salvar alterações'}</button></div>
      </form>}
    </section></div>}
  </div>
}
export default DisciplinasEmentas
