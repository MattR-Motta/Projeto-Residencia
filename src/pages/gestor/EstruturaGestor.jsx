import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Power, Search } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import "../../styles/Gestor/baseGestor.css";
import "../../styles/Gestor/estruturaGestor.css";

const estruturaGestorMock = [
  { id: 1, nome: 'Ensino Médio', descricao: 'Formação geral básica', categoria: 'Modalidade de ensino', status: 'Ativa' },
  { id: 2, nome: 'Ensino Fundamental', descricao: 'Anos iniciais e finais', categoria: 'Modalidade de ensino', status: 'Ativa' },
  { id: 3, nome: 'Ensino Integrado', descricao: 'Ensino médio integrado à formação técnica', categoria: 'Modalidade de ensino', status: 'Ativa' },
  { id: 4, nome: 'Tempo integral', descricao: 'Jornada ampliada', categoria: 'Regime de funcionamento', status: 'Ativa' },
  { id: 5, nome: 'Tempo parcial', descricao: 'Jornada regular', categoria: 'Regime de funcionamento', status: 'Inativa' },
]

function EstruturaGestor() {
  const [itens, setItens] = useState(estruturaGestorMock)
  const [categoria, setCategoria] = useState('Todas')
  const [pesquisa, setPesquisa] = useState('')
  const [modal, setModal] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [form, setForm] = useState({ nome: '', descricao: '', categoria: 'Modalidade de ensino', status: 'Ativa' })

  const filtrados = useMemo(() => itens.filter((item) => (categoria === 'Todas' || item.categoria === categoria) && `${item.nome} ${item.descricao}`.toLowerCase().includes(pesquisa.toLowerCase())), [itens, categoria, pesquisa])

  function abrir(item = null) {
    setSelecionado(item)
    setForm(item ? { nome: item.nome, descricao: item.descricao, categoria: item.categoria, status: item.status } : { nome: '', descricao: '', categoria: 'Modalidade de ensino', status: 'Ativa' })
    setMensagem('')
    setModal(true)
  }

  function salvar(e) {
    e.preventDefault()
    if (!form.nome.trim() || !form.descricao.trim()) {
      setMensagem('Informe o nome e a descrição.')
      return
    }
    if (selecionado) setItens((lista) => lista.map((item) => item.id === selecionado.id ? { ...item, ...form } : item))
    else setItens((lista) => [...lista, { ...form, id: Date.now() }])
    setModal(false)
  }

  function excluir(item) {
    if (window.confirm(`Excluir "${item.nome}"?`)) setItens((lista) => lista.filter((registro) => registro.id !== item.id))
  }

  function alternar(item) {
    setItens((lista) => lista.map((registro) => registro.id === item.id ? { ...registro, status: registro.status === 'Ativa' ? 'Inativa' : 'Ativa' } : registro))
  }

  return (
    <div className="gestor-layout">
      <BarraLateral />
      <main className="gestor-main">
        <header className="gestor-header">
          <div>
            <span className="gestor-breadcrumb">EduGest / Estrutura</span>
            <h1>Estrutura</h1>
          </div>
        </header>

        <div className="gestor-conteudo">
          <section className="gestor-intro">
            <div>
              <h2>Estrutura da rede</h2>
              <p>Gerencie modalidades de ensino e regimes de funcionamento.</p>
            </div>
            <button className="gestor-botao gestor-botao-primario" onClick={() => abrir()}><Plus size={16} /> Adicionar item</button>
          </section>

          <section className="estrutura-resumo">
            <article>
              <span>Itens cadastrados</span>
              <strong>{itens.length}</strong>
            </article>
            <article>
              <span>Itens ativos</span>
              <strong>{itens.filter((item) => item.status === 'Ativa').length}</strong>
            </article>
            <article>
              <span>Modalidades</span>
              <strong>{itens.filter((item) => item.categoria === 'Modalidade de ensino').length}</strong>
            </article>
            <article>
              <span>Regimes</span>
              <strong>{itens.filter((item) => item.categoria === 'Regime de funcionamento').length}</strong>
            </article>
          </section>

          <section className="gestor-painel">
            <div className="gestor-filtros">
              <label className="estrutura-busca">
                <Search size={16} />
                <input className="gestor-campo gestor-busca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Buscar na estrutura..." aria-label="Buscar estrutura" />
              </label>
              <select className="gestor-campo" value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoria">
                <option>Todas</option>
                <option>Modalidade de ensino</option>
                <option>Regime de funcionamento</option>
              </select>
            </div>

            <div className="estrutura-lista">
              {filtrados.map((item) => (
                <article className="estrutura-item" key={item.id}>
                  <div className="estrutura-item-simbolo">{item.categoria === 'Modalidade de ensino' ? 'ME' : 'RF'}</div>
                  <div className="estrutura-item-conteudo">
                    <div className="estrutura-item-titulo">
                      <h3>{item.nome}</h3>
                      <span className={`gestor-status gestor-status--${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                    <p>{item.descricao}</p>
                    <small>{item.categoria}</small>
                  </div>
                  <div className="gestor-acoes">
                    <button className="gestor-acao-icone" title="Editar" aria-label={`Editar ${item.nome}`} onClick={() => abrir(item)}><Pencil size={15} /></button>
                    <button className="gestor-acao-icone" title={item.status === 'Ativa' ? 'Desativar' : 'Ativar'} aria-label={`${item.status === 'Ativa' ? 'Desativar' : 'Ativar'} ${item.nome}`} onClick={() => alternar(item)}><Power size={15} /></button>
                    <button className="gestor-acao-icone" title="Excluir" aria-label={`Excluir ${item.nome}`} onClick={() => excluir(item)}><Trash2 size={15} /></button>
                  </div>
                </article>
              ))}
              {filtrados.length === 0 && <p className="gestor-vazio">Nenhum item encontrado.</p>}
            </div>
          </section>
        </div>
      </main>

      {modal && (
        <div className="gestor-modal-fundo" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(false) }}>
          <form className="gestor-modal" onSubmit={salvar}>
            <h2>{selecionado ? 'Editar item da estrutura' : 'Adicionar à estrutura'}</h2>
            <p>Configure uma modalidade de ensino ou regime de funcionamento.</p>

            <div className="gestor-form-grid">
              <div className="gestor-form-campo gestor-form-campo--largo">
                <label htmlFor="estrutura-nome">Nome *</label>
                <input id="estrutura-nome" className="gestor-campo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Nome da modalidade ou regime" />
              </div>
              <div className="gestor-form-campo gestor-form-campo--largo">
                <label htmlFor="estrutura-descricao">Descrição *</label>
                <textarea id="estrutura-descricao" className="gestor-campo" rows="3" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required placeholder="Descreva este item" />
              </div>
              <div className="gestor-form-campo">
                <label htmlFor="estrutura-categoria">Categoria</label>
                <select id="estrutura-categoria" className="gestor-campo" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                  <option>Modalidade de ensino</option>
                  <option>Regime de funcionamento</option>
                </select>
              </div>
              <div className="gestor-form-campo">
                <label htmlFor="estrutura-status">Situação</label>
                <select id="estrutura-status" className="gestor-campo" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Ativa</option>
                  <option>Inativa</option>
                </select>
              </div>
            </div>

            {mensagem && <p className="estrutura-erro" role="alert">{mensagem}</p>}

            <div className="gestor-modal-acoes">
              <button type="button" className="gestor-botao gestor-botao-secundario" onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="gestor-botao gestor-botao-primario">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default EstruturaGestor