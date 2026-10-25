import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bell,
  ArrowLeft,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  ClipboardList,
} from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/telasCoordenador.css'
import {
  carregarSolicitacoes,
  salvarSolicitacoes,
} from '../../data/solicitacoes'

function DetalhesSolicitacao() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [solicitacoes, setSolicitacoes] = useState(carregarSolicitacoes)

  const [perfil] = useState(() => {
    try {
      const dados = localStorage.getItem('edugest:coordenador:perfil')
      return dados
        ? { nome: 'Marina Costa', ...JSON.parse(dados) }
        : { nome: 'Marina Costa' }
    } catch {
      return { nome: 'Marina Costa' }
    }
  })

  const solicitacao = solicitacoes.find(s => s.id === Number(id))

  const [observacao, setObservacao] = useState(
    solicitacao?.observacao || '',
  )

  const iniciais = (perfil.nome || 'Coordenadora')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte[0])
    .join('')
    .toUpperCase()

  function decidir(novoStatus) {
    if (!solicitacao) return

    const atualizadas = solicitacoes.map(s =>
      s.id === solicitacao.id
        ? { ...s, status: novoStatus, observacao: observacao.trim() }
        : s,
    )

    setSolicitacoes(atualizadas)
    salvarSolicitacoes(atualizadas)
    navigate('/coordenador/solicitacoes')
  }

  if (!solicitacao) {
    return (
      <div className="coordenador-layout telas-prototipo">
        <BarraLateral />
        <main className="dashboard-main tp-main">
          <header className="tp-topbar">
            <div className="tp-user">
              <Bell className="tp-bell" size={20} />
              <span className="tp-avatar configuracoes-avatar">
                {iniciais}
              </span>
              <div>
                <strong>{perfil.nome || 'Coordenadora'}</strong>
                <small>Coordenadora</small>
              </div>
            </div>
          </header>

          <div className="tp-content">
            <h1>Solicitação não encontrada</h1>
            <p>O registro pode ter sido removido ou o endereço está incorreto.</p>
            <button
              type="button"
              className="tp-primary"
              onClick={() => navigate('/coordenador/solicitacoes')}
            >
              Voltar às solicitações
            </button>
          </div>
        </main>
      </div>
    )
  }

  const classeStatus =
    solicitacao.status === 'Aprovada'
      ? 'green'
      : solicitacao.status === 'Recusada'
        ? 'red'
        : 'yellow'

  return (
    <div className="coordenador-layout telas-prototipo">
      <BarraLateral />

      <main className="dashboard-main tp-main">
        <header className="tp-topbar">
          <div className="tp-user">
            <Bell className="tp-bell" size={20} strokeWidth={1.8} />
            <span className="tp-avatar configuracoes-avatar">
              {iniciais}
            </span>
            <div>
              <strong>{perfil.nome || 'Coordenadora'}</strong>
              <small>Coordenadora</small>
            </div>
            <span>⌄</span>
          </div>
        </header>

        <div className="tp-content">
          <button
            type="button"
            className="solicitacao-back"
            onClick={() => navigate('/coordenador/solicitacoes')}
          >
            <ArrowLeft size={17} />
            Voltar às solicitações
          </button>

          <div className="tp-page-title solicitacao-detail-title">
            <div>
              <h1>Detalhes da Solicitação</h1>
              <p>
                {solicitacao.codigo} · Enviada em {solicitacao.dataEnvio}
              </p>
            </div>

            <span className={`tp-pill ${classeStatus}`}>
              {solicitacao.status}
            </span>
          </div>

          <section className="solicitacao-detail-grid">
            <article className="solicitacao-card">
              <header>
                <FileText size={20} />
                <h2>Informações da solicitação</h2>
              </header>

              <div className="solicitacao-info">
                <span>Título</span>
                <strong>{solicitacao.titulo}</strong>
              </div>

              <div className="solicitacao-info">
                <span>Tipo</span>
                <strong>{solicitacao.tipo}</strong>
              </div>

              <div className="solicitacao-info">
                <span>Disciplina</span>
                <strong>{solicitacao.disciplina}</strong>
              </div>

              <div className="solicitacao-info">
                <span>Turma</span>
                <strong>{solicitacao.turma}</strong>
              </div>

              <div className="solicitacao-info">
                <span>Prioridade</span>
                <strong>{solicitacao.prioridade}</strong>
              </div>

              <div className="solicitacao-info">
                <span>Descrição</span>
                <p>{solicitacao.descricao}</p>
              </div>

              <div className="solicitacao-info">
                <span>Justificativa</span>
                <p>{solicitacao.justificativa}</p>
              </div>
            </article>

            <div className="solicitacao-detail-side">
              <article className="solicitacao-card">
                <header>
                  <ClipboardList size={20} />
                  <h2>Dados do solicitante</h2>
                </header>

                <div className="solicitacao-info">
                  <span>Nome</span>
                  <strong>{solicitacao.solicitante}</strong>
                </div>

                <div className="solicitacao-info">
                  <span>E-mail</span>
                  <strong>{solicitacao.email}</strong>
                </div>

                <div className="solicitacao-info">
                  <span>Data de envio</span>
                  <strong>{solicitacao.dataEnvio}</strong>
                </div>
              </article>

              <article className="solicitacao-card">
                <header>
                  <Clock3 size={20} />
                  <h2>Decisão da coordenação</h2>
                </header>

                {solicitacao.status === 'Pendente' ? (
                  <>
                    <label className="solicitacao-observacao">
                      Observação ou justificativa da decisão
                      <textarea
                        rows={4}
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                        placeholder="Registre uma observação para esta solicitação..."
                      />
                    </label>

                    <div className="solicitacao-decision-actions">
                      <button
                        type="button"
                        className="solicitacao-approve"
                        onClick={() => decidir('Aprovada')}
                      >
                        <CheckCircle2 size={17} />
                        Aprovar solicitação
                      </button>

                      <button
                        type="button"
                        className="solicitacao-reject"
                        onClick={() => decidir('Recusada')}
                      >
                        <XCircle size={17} />
                        Recusar solicitação
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="solicitacao-decision-message">
                      Esta solicitação já foi{' '}
                      <strong>{solicitacao.status.toLowerCase()}</strong>.
                    </p>

                    <div className="solicitacao-info">
                      <span>Observação registrada</span>
                      <p>{solicitacao.observacao || 'Nenhuma observação registrada.'}</p>
                    </div>
                  </>
                )}
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DetalhesSolicitacao