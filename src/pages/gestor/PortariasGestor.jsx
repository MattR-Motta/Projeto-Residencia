import { useMemo, useState } from 'react'
import { FilePlus2, Search, Pencil, Trash2, Eye, Download } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/gestor/baseGestor.css'
import '../../styles/gestor/portariasGestor.css'

const portariasMock = [
  { id: 1, numero: '1.248/2026', titulo: 'Designação de equipe gestora', tipo: 'Designação', data: '10/10/2026', status: 'Publicada' },
  { id: 2, numero: '1.249/2026', titulo: 'Alteração do calendário letivo', tipo: 'Alteração', data: '12/10/2026', status: 'Em análise' },
  { id: 3, numero: '1.250/2026', titulo: 'Autorização de funcionamento', tipo: 'Autorização', data: '15/10/2026', status: 'Publicada' },
  { id: 4, numero: '1.251/2026', titulo: 'Atualização de matriz curricular', tipo: 'Atualização', data: '18/10/2026', status: 'Rascunho' },
]

function PortariasGestor() {
  const [portarias, setPortarias] = useState(portariasMock)
  const [pesquisa, setPesquisa] = useState('')
  const [status, setStatus] = useState('Todos')
  const [tipo, setTipo] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [selecionada, setSelecionada] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [form, setForm] = useState({ numero: '', titulo: '', tipo: 'Designação', data: '', status: 'Rascunho' })

  const filtradas = useMemo(() => portarias.filter((item) => [item.numero, item.titulo].some((valor) => valor.toLowerCase().includes(pesquisa.toLowerCase())) && (status === 'Todos' || item.status === status) && (tipo === 'Todos' || item.tipo === tipo)), [portarias, pesquisa, status, tipo])

  function nova() {
    setSelecionada(null)
    setForm({ numero: '', titulo: '', tipo: 'Designação', data: '', status: 'Rascunho' })
    setMensagem('')
    setModal(true)
  }

  function editar(item) {
    setSelecionada(item)
    const [dia, mes, ano] = item.data.split('/')
    setForm({ ...item, data: `${ano}-${mes}-${dia}` })
    setMensagem('')
    setModal(true)
  }

  function salvar(e) {
    e.preventDefault()
    if (!form.numero.trim() || !form.titulo.trim() || !form.data) {
      setMensagem('Preencha número, título e data.')
      return
    }
    const [ano, mes, dia] = form.data.split('-')
    const registro = { ...form, data: `${dia}/${mes}/${ano}` }
    if (selecionada) setPortarias((lista) => lista.map((item) => item.id === selecionada.id ? { ...item, ...registro } : item))
    else setPortarias((lista) => [...lista, { ...registro, id: Date.now() }])
    setModal(false)
    setSelecionada(null)
  }

  function excluir(item) {
    if (window.confirm(`Deseja excluir a portaria ${item.numero}?`)) setPortarias((lista) => lista.filter((registro) => registro.id !== item.id))
  }

  function baixar(item) {
    const conteudo = `PORTARIA ${item.numero}\n\n${item.titulo}\nTipo: ${item.tipo}\nData: ${item.data}\nSituação: ${item.status}\n\nDocumento demonstrativo gerado pelo EduGest.`
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `portaria-${item.numero.replaceAll('/', '-')}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="gestor-layout">
      <BarraLateral />
      <main className="gestor-main">
        <header className="gestor-header">
          <div>
            <span className="gestor-breadcrumb">EduGest / Portarias</span>
            <h1>Portarias</h1>
          </div>
        </header>

        <div className="gestor-conteudo">
          <section className="gestor-intro">
            <div>
              <h2>Gerenciamento de portarias</h2>
              <p>Consulte, organize e cadastre portarias da rede estadual.</p>
            </div>
            <button className="gestor-botao gestor-botao-primario" onClick={nova}><FilePlus2 size={16} /> Nova portaria</button>
          </section>

          <section className="portarias-resumo">
            <article>
              <span>Total cadastradas</span>
              <strong>{portarias.length}</strong>
            </article>
            <article>
              <span>Publicadas</span>
              <strong>{portarias.filter((item) => item.status === 'Publicada').length}</strong>
            </article>
            <article>
              <span>Em análise</span>
              <strong>{portarias.filter((item) => item.status === 'Em análise').length}</strong>
            </article>
            <article>
              <span>Rascunhos</span>
              <strong>{portarias.filter((item) => item.status === 'Rascunho').length}</strong>
            </article>
          </section>

          <section className="gestor-painel">
            <h3 className="gestor-painel-titulo">Portarias cadastradas</h3>
            <p className="gestor-painel-subtitulo">Pesquise por número ou título e utilize os filtros.</p>

            <div className="gestor-filtros">
              <label className="portarias-busca">
                <Search size={16} />
                <input className="gestor-campo gestor-busca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Buscar portaria..." aria-label="Buscar portarias" />
              </label>
              <select className="gestor-campo" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por situação">
                <option>Todos</option>
                <option>Publicada</option>
                <option>Em análise</option>
                <option>Rascunho</option>
              </select>
              <select className="gestor-campo" value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Filtrar por tipo">
                <option>Todos</option>
                {[...new Set(portarias.map((item) => item.tipo))].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div className="gestor-tabela-wrap">
              <table className="gestor-tabela">
                <thead>
                  <tr>
                    <th>Número / Título</th>
                    <th>Tipo</th>
                    <th>Data</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.numero}</strong>
                        <span className="gestor-texto-secundario">{item.titulo}</span>
                      </td>
                      <td>{item.tipo}</td>
                      <td>{item.data}</td>
                      <td>
                        <span className={`gestor-status gestor-status--${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                      </td>
                      <td>
                        <div className="gestor-acoes">
                          <button className="gestor-acao-icone" title="Visualizar" aria-label={`Visualizar ${item.numero}`} onClick={() => setSelecionada(item)}><Eye size={15} /></button>
                          <button className="gestor-acao-icone" title="Editar" aria-label={`Editar ${item.numero}`} onClick={() => editar(item)}><Pencil size={15} /></button>
                          <button className="gestor-acao-icone" title="Baixar documento demonstrativo" aria-label={`Baixar ${item.numero}`} onClick={() => baixar(item)}><Download size={15} /></button>
                          <button className="gestor-acao-icone" title="Excluir" aria-label={`Excluir ${item.numero}`} onClick={() => excluir(item)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtradas.length === 0 && <tr><td colSpan="5" className="gestor-vazio">Nenhuma portaria encontrada.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {modal && (
        <div className="gestor-modal-fundo" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(false) }}>
          <form className="gestor-modal" onSubmit={salvar}>
            <h2>{selecionada ? 'Editar portaria' : 'Cadastrar portaria'}</h2>
            <p>Os dados serão mantidos apenas no estado desta demonstração.</p>

            <div className="gestor-form-grid">
              <div className="gestor-form-campo">
                <label htmlFor="numero-portaria">Número *</label>
                <input id="numero-portaria" className="gestor-campo" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} required placeholder="Ex.: 1.252/2026" />
              </div>
              <div className="gestor-form-campo">
                <label htmlFor="data-portaria">Data *</label>
                <input id="data-portaria" type="date" className="gestor-campo" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
              </div>
              <div className="gestor-form-campo gestor-form-campo--largo">
                <label htmlFor="titulo-portaria">Título *</label>
                <input id="titulo-portaria" className="gestor-campo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
              </div>
              <div className="gestor-form-campo">
                <label htmlFor="tipo-portaria">Tipo</label>
                <select id="tipo-portaria" className="gestor-campo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <option>Designação</option>
                  <option>Alteração</option>
                  <option>Autorização</option>
                  <option>Atualização</option>
                  <option>Normativa</option>
                </select>
              </div>
              <div className="gestor-form-campo">
                <label htmlFor="status-portaria">Situação</label>
                <select id="status-portaria" className="gestor-campo" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Rascunho</option>
                  <option>Em análise</option>
                  <option>Publicada</option>
                </select>
              </div>
            </div>

            {mensagem && <p className="portaria-erro" role="alert">{mensagem}</p>}

            <div className="gestor-modal-acoes">
              <button type="button" className="gestor-botao gestor-botao-secundario" onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="gestor-botao gestor-botao-primario">Salvar portaria</button>
            </div>
          </form>
        </div>
      )}

      {selecionada && !modal && (
        <div className="gestor-modal-fundo" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelecionada(null) }}>
          <section className="gestor-modal">
            <h2>Portaria {selecionada.numero}</h2>
            <p>Resumo do documento cadastrado.</p>
            <div className="portaria-detalhe">
              <strong>{selecionada.titulo}</strong>
              <span>Tipo: {selecionada.tipo}</span>
              <span>Data: {selecionada.data}</span>
              <span>Situação: {selecionada.status}</span>
            </div>
            <div className="gestor-modal-acoes">
              <button className="gestor-botao gestor-botao-secundario" onClick={() => setSelecionada(null)}>Fechar</button>
              <button className="gestor-botao gestor-botao-primario" onClick={() => baixar(selecionada)}><Download size={15} /> Baixar resumo</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
export default PortariasGestor