import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/Gestor/PersonalizacaoGestor.css'

const CHAVE_STORAGE = 'edugestModelosPersonalizacao'
const POR_PAGINA = 4
const TIPOS_ENSINO = ['Médio', 'Integrado', 'Profissionalizante', 'Fundamental']
const VARIANTES = ['Noturno', 'Tempo Integral', 'EJA', 'Rural', 'Inclusivo']

const MODELOS_BASE = [
  { id: 1, nome: 'Modelo Médio Regular', tipo: 'Médio', criadoEm: '2025-04-10', status: 'Ativo' },
  { id: 2, nome: 'Modelo Integrado', tipo: 'Integrado', criadoEm: '2025-04-05', status: 'Ativo' },
  { id: 3, nome: 'Modelo Profissionalizante', tipo: 'Profissionalizante', criadoEm: '2025-03-18', status: 'Ativo' },
  { id: 4, nome: 'Modelo Fundamental', tipo: 'Fundamental', criadoEm: '2025-03-20', status: 'Inativo' },
]

const MODELOS_INICIAIS = [
  ...MODELOS_BASE,
  ...TIPOS_ENSINO.flatMap((tipo, i) =>
    VARIANTES.map((variante, j) => {
      const indice = i * VARIANTES.length + j
      const mes = String(1 + (indice % 12)).padStart(2, '0')
      const dia = String(1 + ((i * 7 + j * 3) % 28)).padStart(2, '0')
      return {
        id: 5 + indice,
        nome: `Modelo ${tipo} ${variante}`,
        tipo,
        criadoEm: `2025-${mes}-${dia}`,
        status: (i + j) % 4 === 3 ? 'Inativo' : 'Ativo',
      }
    }),
  ),
]

const FORM_VAZIO = { nome: '', tipo: 'Médio', status: 'Ativo' }

function carregarModelos() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || 'null')
    if (Array.isArray(salvo) && salvo.length) return salvo
  } catch {
    // Usa os dados iniciais caso o armazenamento esteja inválido.
  }
  return MODELOS_INICIAIS
}

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatarData(iso) {
  const [ano, mes, dia] = String(iso).split('-')
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso
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

function PersonalizacaoGestor() {
  const [modelos, setModelos] = useState(carregarModelos)
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')
  const [modeloExcluir, setModeloExcluir] = useState(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(modelos))
    } catch {
      // O armazenamento é opcional; a tela continua funcionando em memória.
    }
  }, [modelos])

  useEffect(() => {
    if (!aviso) return undefined
    const timer = setTimeout(() => setAviso(''), 3500)
    return () => clearTimeout(timer)
  }, [aviso])

  useEffect(() => {
    if (!modal && !modeloExcluir) return undefined
    function aoTeclar(evento) {
      if (evento.key === 'Escape') {
        setModal(null)
        setModeloExcluir(null)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [modal, modeloExcluir])

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim())
    if (!termo) return modelos
    return modelos.filter((m) => normalizar(m.nome).includes(termo))
  }, [modelos, busca])

  const filtrando = busca.trim() !== ''
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * POR_PAGINA
  const visiveis = filtrados.slice(inicio, inicio + POR_PAGINA)
  const primeiroItem = filtrados.length ? inicio + 1 : 0
  const ultimoItem = Math.min(inicio + POR_PAGINA, filtrados.length)

  function abrirNovo() {
    setForm(FORM_VAZIO)
    setErro('')
    setModal({ editandoId: null })
  }

  function abrirEdicao(modelo) {
    setForm({ nome: modelo.nome, tipo: modelo.tipo, status: modelo.status })
    setErro('')
    setModal({ editandoId: modelo.id })
  }

  function atualizarForm(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErro('')
  }

  function salvarModelo(evento) {
    evento.preventDefault()

    const nome = form.nome.trim()
    if (nome.length < 3) {
      setErro('Informe um nome com pelo menos 3 caracteres.')
      return
    }

    const duplicado = modelos.some(
      (m) => m.id !== modal.editandoId && normalizar(m.nome) === normalizar(nome),
    )
    if (duplicado) {
      setErro('Já existe um modelo com esse nome.')
      return
    }

    if (modal.editandoId === null) {
      const proximoId = modelos.reduce((maior, m) => Math.max(maior, m.id), 0) + 1
      setModelos((lista) => [
        { id: proximoId, nome, tipo: form.tipo, criadoEm: hojeISO(), status: form.status },
        ...lista,
      ])
      setBusca('')
      setPagina(1)
      setAviso(`Modelo "${nome}" criado.`)
    } else {
      setModelos((lista) =>
        lista.map((m) => (m.id === modal.editandoId ? { ...m, nome, tipo: form.tipo, status: form.status } : m)),
      )
      setAviso(`Modelo "${nome}" atualizado.`)
    }

    setModal(null)
  }

  function alternarStatus(modelo) {
    const novoStatus = modelo.status === 'Ativo' ? 'Inativo' : 'Ativo'
    setModelos((lista) => lista.map((m) => (m.id === modelo.id ? { ...m, status: novoStatus } : m)))
    setAviso(`Modelo "${modelo.nome}" ${novoStatus === 'Ativo' ? 'ativado' : 'inativado'}.`)
  }

  function confirmarExclusao() {
    if (!modeloExcluir) return
    const { id, nome } = modeloExcluir
    setModelos((lista) => lista.filter((m) => m.id !== id))
    setModeloExcluir(null)
    setAviso(`Modelo "${nome}" excluído.`)
  }

  return (
    <div className="eg-pers-shell">
      <BarraLateral />

      <main className="eg-pers-main">
        <header className="eg-pers-header">
          <div>
            <h1>Modelos de Personalização</h1>
            <p>Crie e gerencie modelos de configuração para as escolas.</p>
          </div>
          <button type="button" className="eg-pers-btn eg-pers-btn--primary" onClick={abrirNovo}>
            <Plus size={18} aria-hidden="true" />
            Novo modelo
          </button>
        </header>

        <label className="eg-pers-busca">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={busca}
            placeholder="Pesquisar por nome do modelo..."
            aria-label="Pesquisar por nome do modelo"
            onChange={(e) => {
              setBusca(e.target.value)
              setPagina(1)
            }}
          />
        </label>

        <section className="eg-pers-card">
          <div className="eg-pers-scroll">
            <table className="eg-pers-tabela">
              <thead>
                <tr>
                  <th scope="col">Nome do modelo</th>
                  <th scope="col">Tipo de ensino</th>
                  <th scope="col">Data de criação</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="eg-pers-tabela__acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="eg-pers-vazio">
                      {filtrando ? 'Nenhum modelo encontrado para essa pesquisa.' : 'Nenhum modelo cadastrado ainda.'}
                      {filtrando ? (
                        <button type="button" className="eg-pers-btn eg-pers-btn--link" onClick={() => setBusca('')}>
                          Limpar pesquisa
                        </button>
                      ) : (
                        <button type="button" className="eg-pers-btn eg-pers-btn--link" onClick={abrirNovo}>
                          Criar primeiro modelo
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  visiveis.map((modelo) => (
                    <tr key={modelo.id}>
                      <td className="eg-pers-tabela__nome">{modelo.nome}</td>
                      <td>{modelo.tipo}</td>
                      <td className="eg-pers-tabela__data">{formatarData(modelo.criadoEm)}</td>
                      <td>
                        <button
                          type="button"
                          className={`eg-pers-badge eg-pers-badge--${modelo.status === 'Ativo' ? 'ativo' : 'inativo'}`}
                          onClick={() => alternarStatus(modelo)}
                          title={modelo.status === 'Ativo' ? 'Clique para inativar' : 'Clique para ativar'}
                          aria-label={`${modelo.nome}: ${modelo.status}. Alterar status`}
                        >
                          {modelo.status}
                        </button>
                      </td>
                      <td className="eg-pers-tabela__acoes">
                        <button
                          type="button"
                          className="eg-pers-icone"
                          onClick={() => abrirEdicao(modelo)}
                          title="Editar modelo"
                          aria-label={`Editar ${modelo.nome}`}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="eg-pers-icone eg-pers-icone--perigo"
                          onClick={() => setModeloExcluir(modelo)}
                          title="Excluir modelo"
                          aria-label={`Excluir ${modelo.nome}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="eg-pers-rodape">
            <span>
              Mostrando {primeiroItem}-{ultimoItem} de {filtrados.length} modelos
            </span>
            <nav className="eg-pers-paginacao" aria-label="Paginação">
              {gerarPaginas(totalPaginas, paginaAtual).map((item) =>
                typeof item === 'number' ? (
                  <button
                    key={item}
                    type="button"
                    className={`eg-pers-pagina${item === paginaAtual ? ' eg-pers-pagina--ativa' : ''}`}
                    onClick={() => setPagina(item)}
                    aria-current={item === paginaAtual ? 'page' : undefined}
                    aria-label={`Página ${item}`}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="eg-pers-pagina eg-pers-pagina--reticencias" aria-hidden="true">…</span>
                ),
              )}
            </nav>
          </footer>
        </section>
      </main>

      {modal && (
        <div className="eg-pers-overlay" onMouseDown={() => setModal(null)}>
          <form
            className="eg-pers-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eg-pers-modal-titulo"
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={salvarModelo}
            noValidate
          >
            <header className="eg-pers-modal__topo">
              <h2 id="eg-pers-modal-titulo">{modal.editandoId === null ? 'Novo modelo' : 'Editar modelo'}</h2>
              <button type="button" className="eg-pers-icone" onClick={() => setModal(null)} aria-label="Fechar">
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <label className="eg-pers-campo">
              <span>Nome do modelo</span>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => atualizarForm('nome', e.target.value)}
                placeholder="Ex.: Modelo Médio Noturno"
                maxLength={80}
                autoFocus
              />
            </label>

            <label className="eg-pers-campo">
              <span>Tipo de ensino</span>
              <select value={form.tipo} onChange={(e) => atualizarForm('tipo', e.target.value)}>
                {TIPOS_ENSINO.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </label>

            <label className="eg-pers-campo">
              <span>Status</span>
              <select value={form.status} onChange={(e) => atualizarForm('status', e.target.value)}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </label>

            {erro && <p className="eg-pers-erro" role="alert">{erro}</p>}

            <footer className="eg-pers-modal__acoes">
              <button type="button" className="eg-pers-btn eg-pers-btn--neutro" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button type="submit" className="eg-pers-btn eg-pers-btn--primary">
                {modal.editandoId === null ? 'Criar modelo' : 'Salvar alterações'}
              </button>
            </footer>
          </form>
        </div>
      )}

      {modeloExcluir && (
        <div className="eg-pers-overlay" onMouseDown={() => setModeloExcluir(null)}>
          <div
            className="eg-pers-modal eg-pers-modal--pequeno"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="eg-pers-excluir-titulo"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="eg-pers-modal__topo">
              <h2 id="eg-pers-excluir-titulo">Excluir modelo</h2>
            </header>
            <p className="eg-pers-modal__texto">
              O modelo "{modeloExcluir.nome}" será excluído e não poderá mais ser usado nas escolas. Essa ação não pode ser desfeita.
            </p>
            <footer className="eg-pers-modal__acoes">
              <button type="button" className="eg-pers-btn eg-pers-btn--neutro" onClick={() => setModeloExcluir(null)} autoFocus>
                Cancelar
              </button>
              <button type="button" className="eg-pers-btn eg-pers-btn--perigo" onClick={confirmarExclusao}>
                Excluir modelo
              </button>
            </footer>
          </div>
        </div>
      )}

      {aviso && (
        <div className="eg-pers-toast" role="status" aria-live="polite">
          {aviso}
        </div>
      )}
    </div>
  )
}

export default PersonalizacaoGestor