import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye, ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/Gestor/baseGestor.css'
import '../../styles/Gestor/escolasGestor.css'
import '../../styles/Gestor/novaEscolaGestor.css'

const escolasMock = [
  { id: 1, codigo: 'ESC001', nome: 'Escola Estadual Professor José Alves', municipio: 'Aracaju', tipo: 'Ensino Médio', alunos: 842, status: 'Ativa', regime: 'Tempo integral' },
  { id: 2, codigo: 'ESC002', nome: 'Centro de Excelência Maria das Graças', municipio: 'Nossa Senhora do Socorro', tipo: 'Ensino Fundamental', alunos: 615, status: 'Ativa', regime: 'Tempo parcial' },
  { id: 3, codigo: 'ESC003', nome: 'Colégio Estadual Tobias Barreto', municipio: 'Itabaiana', tipo: 'Ensino Médio', alunos: 734, status: 'Ativa', regime: 'Tempo integral' },
  { id: 4, codigo: 'ESC004', nome: 'Escola Estadual Caminhos do Saber', municipio: 'Lagarto', tipo: 'Ensino Integrado', alunos: 398, status: 'Inativa', regime: 'Tempo parcial' },
  { id: 5, codigo: 'ESC005', nome: 'Centro Educacional do Sul', municipio: 'Estância', tipo: 'Profissionalizante', alunos: 526, status: 'Ativa', regime: 'Tempo integral' },
]

const etapasCadastro = ['Dados da escola', 'Estrutura', 'Confirmação']
const formularioVazio = {
  nome: '', codigo: '', municipio: 'Aracaju', tipo: 'Ensino Médio', alunos: '',
  status: 'Ativa', regime: 'Tempo integral', arquivo: '',
}

function lerEscolasSalvas() {
  try {
    const salvas = JSON.parse(localStorage.getItem('escolasGestorDemo'))
    return Array.isArray(salvas) ? salvas : escolasMock
  } catch {
    return escolasMock
  }
}

function EscolasGestor() {
  const location = useLocation()
  const [escolas, setEscolas] = useState(lerEscolasSalvas)
  const [pesquisa, setPesquisa] = useState('')
  const [municipio, setMunicipio] = useState('Todos')
  const [tipo, setTipo] = useState('Todos')
  const [status, setStatus] = useState('Todos')
  const [selecionada, setSelecionada] = useState(null)
  const [modoFormulario, setModoFormulario] = useState(Boolean(location.state?.abrirCadastro))
  const [escolaEdicao, setEscolaEdicao] = useState(null)
  const [etapa, setEtapa] = useState(0)
  const [mensagem, setMensagem] = useState('')
  const [form, setForm] = useState(formularioVazio)

  const filtradas = useMemo(() => escolas.filter((escola) => {
    const termo = pesquisa.toLocaleLowerCase('pt-BR')
    return [escola.nome, escola.codigo, escola.municipio].some((valor) => valor.toLocaleLowerCase('pt-BR').includes(termo))
      && (municipio === 'Todos' || escola.municipio === municipio)
      && (tipo === 'Todos' || escola.tipo === tipo)
      && (status === 'Todos' || escola.status === status)
  }), [escolas, pesquisa, municipio, tipo, status])

  function persistirEscolas(atualizadas) {
    setEscolas(atualizadas)
    localStorage.setItem('escolasGestorDemo', JSON.stringify(atualizadas))
  }

  function abrirCadastro(escola = null) {
    setEscolaEdicao(escola)
    setForm(escola ? {
      ...formularioVazio,
      ...escola,
      alunos: String(escola.alunos ?? ''),
      arquivo: escola.arquivo || '',
      regime: escola.regime || 'Tempo integral',
    } : formularioVazio)
    setEtapa(0)
    setMensagem('')
    setSelecionada(null)
    setModoFormulario(true)
  }

  function fecharCadastro() {
    setModoFormulario(false)
    setEscolaEdicao(null)
    setEtapa(0)
    setMensagem('')
    setForm(formularioVazio)
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  function continuarCadastro(evento) {
    evento.preventDefault()
    setMensagem('')
    if (etapa === 0 && (!form.nome.trim() || !form.codigo.trim() || !form.municipio)) {
      setMensagem('Preencha o nome, o código e o município da escola.')
      return
    }
    if (etapa === 1 && (!form.tipo || !form.regime || form.alunos === '' || Number(form.alunos) < 0)) {
      setMensagem('Informe o tipo de ensino, o regime e uma quantidade válida de alunos.')
      return
    }
    setEtapa((anterior) => Math.min(2, anterior + 1))
  }

  function salvarCadastro() {
    const registro = { ...form, alunos: Number(form.alunos) }
    const atualizadas = escolaEdicao
      ? escolas.map((item) => item.id === escolaEdicao.id ? { ...item, ...registro } : item)
      : [...escolas, { ...registro, id: Date.now() }]
    persistirEscolas(atualizadas)
    fecharCadastro()
  }

  function excluir(escola) {
    if (window.confirm(`Deseja excluir a escola "${escola.nome}"?`)) {
      persistirEscolas(escolas.filter((item) => item.id !== escola.id))
    }
  }

  return (
    <div className="gestor-layout">
      <BarraLateral />
      <main className="gestor-main">
        <header className="gestor-header">
          <div>
            <span className="gestor-breadcrumb">EduGest / Escolas{modoFormulario ? ` / ${escolaEdicao ? 'Editar escola' : 'Adicionar escola'}` : ''}</span>
            <h1>{modoFormulario ? (escolaEdicao ? 'Editar escola' : 'Adicionar escola') : 'Escolas'}</h1>
          </div>
        </header>

        <div className="gestor-conteudo">
          {modoFormulario ? (
            <>
              <section className="gestor-intro">
                <div>
                  <h2>{escolaEdicao ? 'Atualização de unidade escolar' : 'Cadastro de unidade escolar'}</h2>
                  <p>Preencha as informações em três etapas.</p>
                </div>
              </section>
              <div className="escola-etapas">
                {etapasCadastro.map((nome, indice) => (
                  <div key={nome} className={`escola-etapa ${indice === etapa ? 'escola-etapa--atual' : ''} ${indice < etapa ? 'escola-etapa--concluida' : ''}`}>
                    <span>{indice < etapa ? <Check size={15} /> : indice + 1}</span>
                    <div><strong>Etapa {indice + 1}</strong><small>{nome}</small></div>
                  </div>
                ))}
              </div>
              <form className="gestor-painel escola-formulario" onSubmit={continuarCadastro}>
                <h3 className="gestor-painel-titulo">{etapasCadastro[etapa]}</h3>
                <p className="gestor-painel-subtitulo">
                  {etapa === 0 ? 'Informe os dados de identificação da unidade.' : etapa === 1 ? 'Defina a oferta de ensino e o funcionamento.' : 'Revise os dados antes de concluir.'}
                </p>
                {etapa === 0 && (
                  <div className="gestor-form-grid">
                    <div className="gestor-form-campo gestor-form-campo--largo"><label htmlFor="nome-escola">Nome da escola *</label><input id="nome-escola" className="gestor-campo" name="nome" value={form.nome} onChange={alterarCampo} required placeholder="Nome oficial da unidade" /></div>
                    <div className="gestor-form-campo"><label htmlFor="codigo-escola">Código da escola *</label><input id="codigo-escola" className="gestor-campo" name="codigo" value={form.codigo} onChange={alterarCampo} required placeholder="Ex.: ESC006" /></div>
                    <div className="gestor-form-campo"><label htmlFor="municipio-escola">Município *</label><select id="municipio-escola" className="gestor-campo" name="municipio" value={form.municipio} onChange={alterarCampo} required>{['Aracaju', 'Nossa Senhora do Socorro', 'Itabaiana', 'Lagarto', 'Estância', 'Nossa Senhora da Glória', 'Outro'].map((item) => <option key={item}>{item}</option>)}</select></div>
                    <div className="gestor-form-campo gestor-form-campo--largo"><label htmlFor="arquivo-escola">Documento da escola (PDF, opcional)</label><label className="escola-upload" htmlFor="arquivo-escola"><Upload size={19} /><span>{form.arquivo || 'Selecione um arquivo PDF'}</span><input id="arquivo-escola" type="file" accept="application/pdf,.pdf" onChange={(evento) => setForm((anterior) => ({ ...anterior, arquivo: evento.target.files?.[0]?.name || '' }))} /></label></div>
                  </div>
                )}
                {etapa === 1 && (
                  <div className="gestor-form-grid">
                    <div className="gestor-form-campo"><label htmlFor="tipo-escola">Tipo de ensino *</label><select id="tipo-escola" name="tipo" className="gestor-campo" value={form.tipo} onChange={alterarCampo}>{['Ensino Médio', 'Ensino Fundamental', 'Ensino Integrado', 'Profissionalizante', 'Outros / EJA'].map((item) => <option key={item}>{item}</option>)}</select></div>
                    <div className="gestor-form-campo"><label htmlFor="regime-escola">Regime de funcionamento *</label><select id="regime-escola" name="regime" className="gestor-campo" value={form.regime} onChange={alterarCampo}>{['Tempo integral', 'Tempo parcial', 'Matutino', 'Vespertino', 'Noturno'].map((item) => <option key={item}>{item}</option>)}</select></div>
                    <div className="gestor-form-campo"><label htmlFor="alunos-escola">Quantidade de alunos *</label><input id="alunos-escola" type="number" min="0" className="gestor-campo" name="alunos" value={form.alunos} onChange={alterarCampo} required placeholder="Ex.: 450" /></div>
                    <div className="gestor-form-campo"><label htmlFor="status-escola">Situação</label><select id="status-escola" className="gestor-campo" name="status" value={form.status} onChange={alterarCampo}><option>Ativa</option><option>Inativa</option></select></div>
                    <div className="gestor-form-campo gestor-form-campo--largo escola-info-curricular"><strong>Grade e matriz curricular</strong><span>A validação da grade e da matriz curricular é demonstrativa nesta versão, sem integração com serviços externos.</span></div>
                  </div>
                )}
                {etapa === 2 && (
                  <div className="escola-revisao">{[['Nome da escola', form.nome], ['Código', form.codigo], ['Município', form.municipio], ['Tipo de ensino', form.tipo], ['Regime de funcionamento', form.regime], ['Quantidade de alunos', form.alunos], ['Situação', form.status], ['Documento', form.arquivo || 'Nenhum arquivo selecionado']].map(([label, valor]) => <div key={label}><span>{label}</span><strong>{valor}</strong></div>)}</div>
                )}
                {mensagem && <p className="gestor-notificacao escola-mensagem" role="alert">{mensagem}</p>}
                <div className="gestor-modal-acoes escola-form-acoes">
                  <button type="button" className="gestor-botao gestor-botao-secundario" onClick={() => etapa === 0 ? fecharCadastro() : setEtapa((anterior) => anterior - 1)}><ArrowLeft size={15} />{etapa === 0 ? 'Cancelar' : 'Voltar'}</button>
                  {etapa < 2 ? <button type="submit" className="gestor-botao gestor-botao-primario">Continuar <ArrowRight size={15} /></button> : <button type="button" className="gestor-botao gestor-botao-primario" onClick={salvarCadastro}><Check size={15} /> {escolaEdicao ? 'Salvar alterações' : 'Concluir cadastro'}</button>}
                </div>
              </form>
            </>
          ) : (
            <>
              <section className="gestor-intro"><div><h2>Gerenciamento de escolas</h2><p>Consulte, cadastre e mantenha os dados das unidades escolares.</p></div><button className="gestor-botao gestor-botao-primario" onClick={() => abrirCadastro()}><Plus size={16} /> Adicionar escola</button></section>
              <section className="escolas-resumo"><article><span>Total de escolas</span><strong>{escolas.length}</strong></article><article><span>Escolas ativas</span><strong>{escolas.filter((item) => item.status === 'Ativa').length}</strong></article><article><span>Municípios atendidos</span><strong>{new Set(escolas.map((item) => item.municipio)).size}</strong></article></section>
              <section className="gestor-painel">
                <div className="escolas-cabecalho-tabela"><div><h3 className="gestor-painel-titulo">Unidades escolares</h3><p className="gestor-painel-subtitulo">{filtradas.length} resultado(s) encontrados</p></div></div>
                <div className="gestor-filtros">
                  <label className="escolas-busca"><Search size={16} /><input className="gestor-campo gestor-busca" value={pesquisa} onChange={(evento) => setPesquisa(evento.target.value)} placeholder="Buscar por escola, código ou município..." aria-label="Buscar escolas" /></label>
                  <select className="gestor-campo" value={municipio} onChange={(evento) => setMunicipio(evento.target.value)} aria-label="Filtrar por município"><option>Todos</option>{[...new Set(escolas.map((item) => item.municipio))].map((item) => <option key={item}>{item}</option>)}</select>
                  <select className="gestor-campo" value={tipo} onChange={(evento) => setTipo(evento.target.value)} aria-label="Filtrar por tipo"><option>Todos</option>{[...new Set(escolas.map((item) => item.tipo))].map((item) => <option key={item}>{item}</option>)}</select>
                  <select className="gestor-campo" value={status} onChange={(evento) => setStatus(evento.target.value)} aria-label="Filtrar por situação"><option>Todos</option><option>Ativa</option><option>Inativa</option></select>
                </div>
                <div className="gestor-tabela-wrap"><table className="gestor-tabela"><thead><tr><th>Código / Escola</th><th>Município</th><th>Tipo de ensino</th><th>Alunos</th><th>Situação</th><th>Ações</th></tr></thead><tbody>
                  {filtradas.map((escola) => <tr key={escola.id}><td><strong>{escola.nome}</strong><span className="gestor-texto-secundario">{escola.codigo}</span></td><td>{escola.municipio}</td><td>{escola.tipo}</td><td>{Number(escola.alunos).toLocaleString('pt-BR')}</td><td><span className={`gestor-status gestor-status--${escola.status.toLowerCase()}`}>{escola.status}</span></td><td><div className="gestor-acoes"><button className="gestor-acao-icone" title="Visualizar" aria-label={`Visualizar ${escola.nome}`} onClick={() => setSelecionada(escola)}><Eye size={15} /></button><button className="gestor-acao-icone" title="Editar" aria-label={`Editar ${escola.nome}`} onClick={() => abrirCadastro(escola)}><Pencil size={15} /></button><button className="gestor-acao-icone" title="Excluir" aria-label={`Excluir ${escola.nome}`} onClick={() => excluir(escola)}><Trash2 size={15} /></button></div></td></tr>)}
                  {filtradas.length === 0 && <tr><td colSpan="6" className="gestor-vazio">Nenhuma escola corresponde aos filtros.</td></tr>}
                </tbody></table></div>
              </section>
            </>
          )}
        </div>
      </main>
      {selecionada && !modoFormulario && <div className="gestor-modal-fundo" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setSelecionada(null) }}><section className="gestor-modal" role="dialog" aria-modal="true" aria-labelledby="escola-modal-titulo"><h2 id="escola-modal-titulo">Detalhes da escola</h2><p>Visualização dos dados demonstrativos da unidade selecionada.</p><dl className="escola-detalhes"><dt>Nome</dt><dd>{selecionada.nome}</dd><dt>Código</dt><dd>{selecionada.codigo}</dd><dt>Município</dt><dd>{selecionada.municipio}</dd><dt>Tipo de ensino</dt><dd>{selecionada.tipo}</dd><dt>Regime</dt><dd>{selecionada.regime || 'Não informado'}</dd><dt>Quantidade de alunos</dt><dd>{selecionada.alunos}</dd><dt>Situação</dt><dd>{selecionada.status}</dd></dl><div className="gestor-modal-acoes"><button className="gestor-botao gestor-botao-secundario" onClick={() => setSelecionada(null)}>Fechar</button><button className="gestor-botao gestor-botao-primario" onClick={() => abrirCadastro(selecionada)}><Pencil size={15} /> Editar escola</button></div></section></div>}
    </div>
  )
}

export default EscolasGestor