import { useEffect, useState } from 'react'
import { Info, Plus, X } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/dashboarddocente.css'
import '../../styles/aulasReposicoesDocente.css'

// Dados de exemplo (depois é só trocar por dados reais)
const aulasIniciais = [
  {
    id: 1,
    horario: '08:00–09:40',
    disciplina: 'Matemática',
    turma: '1A',
    sala: '101',
    status: 'realizada',
    conteudo: 'Equações do 1º grau: resolução e problemas do cotidiano.',
    presenca: '30 de 32 alunos presentes',
  },
  {
    id: 2,
    horario: '10:00–11:40',
    disciplina: 'Matemática',
    turma: '1B',
    sala: '203',
    status: 'realizada',
    conteudo: 'Equações do 1º grau: lista de exercícios.',
    presenca: '27 de 29 alunos presentes',
  },
  { id: 3, horario: '14:00–15:40', disciplina: 'Português', turma: '3A', sala: '105', status: 'proxima' },
  { id: 4, horario: '16:00–17:40', disciplina: 'História', turma: '2C', sala: '102', status: 'confirmada' },
]

const reposicoesIniciais = [
  {
    id: 1,
    disciplina: 'Matemática',
    turma: '1A',
    aulaOriginal: '2026-09-04',
    motivo: 'ausência justificada',
    novaData: '2026-09-18',
    novaHora: '10:00',
    status: 'Aguardando aprovação',
  },
]

const textoStatus = {
  realizada: 'Realizada',
  proxima: 'Próxima aula',
  confirmada: 'Confirmada',
}

const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

// '2026-09-18' -> '18/09/2026'
function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

// '2026-09-18' + '10:00' -> '18 SET 2026 · 10:00'
function formatarDataCurta(iso, hora) {
  const [ano, mes, dia] = iso.split('-')
  return `${dia} ${meses[Number(mes) - 1]} ${ano} · ${hora}`
}


// Janela (modal) genérica: fecha com Esc, com o X ou clicando fora
function Modal({ titulo, onFechar, children }) {
  useEffect(() => {
    function aoApertar(evento) {
      if (evento.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', aoApertar)
    return () => document.removeEventListener('keydown', aoApertar)
  }, [onFechar])

  return (
    <div
      className="aul-modal-fundo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onFechar()
      }}
    >
      <div className="aul-modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="aul-modal-topo">
          <h2>{titulo}</h2>
          <button
            type="button"
            className="aul-modal-fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Conteúdo da janela "Ver aula"
function DetalhesAula({ aula, onFechar }) {
  return (
    <Modal titulo="Detalhes da aula" onFechar={onFechar}>
      <h3 className="aul-modal-subtitulo">
        {aula.disciplina} — Turma {aula.turma}
      </h3>
      <span className={'aul-tag ' + aula.status}>{textoStatus[aula.status]}</span>

      <dl className="aul-detalhes">
        <div>
          <dt>Horário</dt>
          <dd>{aula.horario}</dd>
        </div>
        <div>
          <dt>Sala</dt>
          <dd>{aula.sala}</dd>
        </div>
        <div>
          <dt>Frequência</dt>
          <dd>{aula.presenca || 'Não informada'}</dd>
        </div>
        <div>
          <dt>Conteúdo ministrado</dt>
          <dd>{aula.conteudo || 'Não informado'}</dd>
        </div>
      </dl>

      <div className="aul-modal-acoes">
        <button type="button" className="aul-botao-principal" onClick={onFechar}>
          Fechar
        </button>
      </div>
    </Modal>
  )
}

// Conteúdo da janela "Solicitar reposição"
function FormularioReposicao({ aulas, onSalvar, onFechar }) {
  // Lista de disciplina + turma sem repetir
  const opcoes = []
  aulas.forEach((aula) => {
    const chave = `${aula.disciplina}|${aula.turma}`
    if (!opcoes.some((opcao) => opcao.chave === chave)) {
      opcoes.push({ chave, rotulo: `${aula.disciplina} — Turma ${aula.turma}` })
    }
  })

  const [aula, setAula] = useState(opcoes[0].chave)
  const [aulaOriginal, setAulaOriginal] = useState('')
  const [motivo, setMotivo] = useState('')
  const [novaData, setNovaData] = useState('')
  const [novaHora, setNovaHora] = useState('')
  const [erro, setErro] = useState('')

  function enviar(evento) {
    evento.preventDefault()

    if (!aulaOriginal || !motivo.trim() || !novaData || !novaHora) {
      setErro('Preencha todos os campos.')
      return
    }
    if (novaData <= aulaOriginal) {
      setErro('A nova data precisa ser depois da data da aula original.')
      return
    }

    const [disciplina, turma] = aula.split('|')
    onSalvar({
      id: Date.now(),
      disciplina,
      turma,
      aulaOriginal,
      motivo: motivo.trim(),
      novaData,
      novaHora,
      status: 'Aguardando aprovação',
    })
  }

  return (
    <Modal titulo="Solicitar reposição" onFechar={onFechar}>
      <form className="aul-form" onSubmit={enviar}>
        <label>
          Aula
          <select value={aula} onChange={(evento) => setAula(evento.target.value)}>
            {opcoes.map((opcao) => (
              <option key={opcao.chave} value={opcao.chave}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data da aula original
          <input
            type="date"
            value={aulaOriginal}
            onChange={(evento) => setAulaOriginal(evento.target.value)}
          />
        </label>

        <label>
          Motivo
          <textarea
            rows="3"
            placeholder="Ex.: ausência justificada"
            value={motivo}
            onChange={(evento) => setMotivo(evento.target.value)}
          />
        </label>

        <div className="aul-form-linha">
          <label>
            Nova data sugerida
            <input
              type="date"
              value={novaData}
              onChange={(evento) => setNovaData(evento.target.value)}
            />
          </label>

          <label>
            Horário
            <input
              type="time"
              value={novaHora}
              onChange={(evento) => setNovaHora(evento.target.value)}
            />
          </label>
        </div>

        {erro && <p className="aul-erro">{erro}</p>}

        <div className="aul-modal-acoes">
          <button type="button" className="aul-botao" onClick={onFechar}>
            Cancelar
          </button>
          <button type="submit" className="aul-botao-principal">
            Enviar solicitação
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AulasReposicoesDocente() {
  const [aulas, setAulas] = useState(aulasIniciais)
  const [reposicoes, setReposicoes] = useState(reposicoesIniciais)
  const [aulaAberta, setAulaAberta] = useState(null) // aula aberta no "Ver aula"
  const [formAberto, setFormAberto] = useState(false)

  // Os números dos cards são calculados a partir das listas
  const realizadas = aulas.filter((aula) => aula.status === 'realizada').length
  const proximaAula = aulas.find((aula) => aula.status !== 'realizada')
  const horaProxima = proximaAula ? proximaAula.horario.split('–')[0] : '—'

  // Próximas reposições: da data mais próxima pra mais distante
  const proximasReposicoes = [...reposicoes].sort((a, b) =>
    (a.novaData + a.novaHora).localeCompare(b.novaData + b.novaHora),
  )

  function registrarAula(id) {
    setAulas((atual) =>
      atual.map((aula) =>
        aula.id === id ? { ...aula, status: 'realizada' } : aula,
      ),
    )
  }

  function salvarReposicao(nova) {
    setReposicoes((atual) => [nova, ...atual])
    setFormAberto(false)
  }

  return (
    <div className="docente-pagina">
      <BarraLateral />

      <main className="docente-conteudo">
        {/* Topo: usuário */}
        <header className="docente-topo aul-topo">
          <div className="docente-usuario">
            <span className="docente-sino">🔔</span>
            <div className="docente-avatar"></div>
            <strong>Joao Silva</strong>
          </div>
        </header>

        {/* Título */}
        <section className="aul-titulo">
          <h1>Aulas e Reposições</h1>
          <p>Gerencie suas aulas e acompanhe suas reposições.</p>
        </section>

        {/* Resumo */}
        <section className="aul-resumo">
          <div className="docente-card">
            <span className="aul-resumo-label">Aulas hoje</span>
            <strong className="aul-resumo-valor azul">{aulas.length}</strong>
          </div>
          <div className="docente-card">
            <span className="aul-resumo-label">Aulas realizadas</span>
            <strong className="aul-resumo-valor verde">{realizadas}</strong>
          </div>
          <div className="docente-card">
            <span className="aul-resumo-label">Próxima aula</span>
            <strong className="aul-resumo-valor azul">{horaProxima}</strong>
          </div>
          <div className="docente-card">
            <span className="aul-resumo-label">Reposições</span>
            <strong className="aul-resumo-valor marrom">{reposicoes.length}</strong>
          </div>
        </section>

        {/* Aulas de hoje */}
        <section className="docente-card aul-bloco">
          <h2 className="aul-bloco-titulo">Minhas aulas de hoje</h2>

          <div className="aul-lista">
            {aulas.map((aula) => (
              <article key={aula.id} className="aul-item">
                <div className="aul-item-info">
                  <span className="aul-horario">{aula.horario}</span>
                  <h3>
                    {aula.disciplina} — Turma {aula.turma}
                  </h3>
                  <span className="aul-sala">Sala {aula.sala}</span>
                  <span className={'aul-tag ' + aula.status}>
                    {textoStatus[aula.status]}
                  </span>
                </div>

                {aula.status === 'proxima' && (
                  <button
                    type="button"
                    className="aul-botao"
                    onClick={() => registrarAula(aula.id)}
                  >
                    Registrar aula
                  </button>
                )}
                {aula.status === 'realizada' && (
                  <button
                    type="button"
                    className="aul-botao"
                    onClick={() => setAulaAberta(aula)}
                  >
                    Ver aula
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Reposições */}
        <section className="aul-reposicoes">
          <div className="docente-card aul-bloco">
            <div className="aul-bloco-cabecalho">
              <h2 className="aul-bloco-titulo">Reposições</h2>
              <button
                type="button"
                className="aul-botao-principal"
                onClick={() => setFormAberto(true)}
              >
                <Plus size={14} aria-hidden="true" />
                Solicitar reposição
              </button>
            </div>

            {reposicoes.length === 0 && (
              <p className="aul-vazio">Nenhuma reposição solicitada.</p>
            )}

            {reposicoes.map((item) => (
              <article key={item.id} className="aul-reposicao">
                <h3>
                  {item.disciplina} — Turma {item.turma}
                </h3>
                <span className="aul-sala">
                  Aula original: {formatarData(item.aulaOriginal)}
                </span>

                <div className="aul-campo">
                  <span>Motivo</span>
                  <p>{item.motivo}</p>
                </div>

                <div className="aul-campo">
                  <span>Nova data sugerida</span>
                  <p>
                    {formatarData(item.novaData)} — {item.novaHora}
                  </p>
                </div>

                <span className="aul-tag pendente">{item.status}</span>
              </article>
            ))}
          </div>

          <aside className="docente-card aul-bloco">
            <h2 className="aul-bloco-titulo">Próximas reposições</h2>

            {proximasReposicoes.length === 0 && (
              <p className="aul-vazio">Nenhuma reposição agendada.</p>
            )}

            {proximasReposicoes.map((item) => (
              <div key={item.id} className="aul-proxima">
                <span className="aul-horario">
                  {formatarDataCurta(item.novaData, item.novaHora)}
                </span>
                <h3>{item.disciplina}</h3>
                <span className="aul-sala">Turma {item.turma}</span>
                <span className="aul-tag pendente">{item.status}</span>
              </div>
            ))}

            <div className="aul-aviso">
              <Info size={14} aria-hidden="true" />
              <span>
                Você pode acompanhar aqui o status das solicitações enviadas à
                coordenação.
              </span>
            </div>
          </aside>
        </section>
      </main>

      {aulaAberta && (
        <DetalhesAula aula={aulaAberta} onFechar={() => setAulaAberta(null)} />
      )}

      {formAberto && (
        <FormularioReposicao
          aulas={aulas}
          onSalvar={salvarReposicao}
          onFechar={() => setFormAberto(false)}
        />
      )}
    </div>
  )
}

export default AulasReposicoesDocente
