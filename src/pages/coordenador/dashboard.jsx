import { useNavigate } from 'react-router-dom'
import BarraLateral from '../../components/barraLateral'
import ErrorState from '../../components/ErrorState'
import useErroPagina from '../../hooks/useErroPagina'
import '../../styles/coordenador.css'
import iconeTurmas from '../../assets/turmas.png'
import iconeDocente from '../../assets/docente.png'
import iconeAulas from '../../assets/aulas.png'
import iconeOcorrencia from '../../assets/ocorrencia.png'

const indicadores = [
  {
    titulo: 'Turmas cadastradas',
    valor: '12',
    detalhe: 'Turmas ativas',
    icone: iconeTurmas,
  },
  {
    titulo: 'Docentes',
    valor: '08',
    detalhe: 'Profissionais cadastrados',
    icone: iconeDocente,
  },
  {
    titulo: 'Aulas programadas',
    valor: '24',
    detalhe: 'Nesta semana',
    icone: iconeAulas,
  },
  {
    titulo: 'Pendências',
    valor: '03',
    detalhe: 'Precisam de atenção',
    icone: iconeOcorrencia,
  },
]

const eventos = [
  {
    id: 1,
    dia: '19',
    mes: 'OUT',
    titulo: 'Reunião pedagógica',
    horario: '09:00',
    tipo: 'Reunião',
  },
  {
    id: 2,
    dia: '20',
    mes: 'OUT',
    titulo: 'Aula de Desenvolvimento Web',
    horario: '10:00',
    tipo: 'Aula',
  },
  {
    id: 3,
    dia: '22',
    mes: 'OUT',
    titulo: 'Reposição de aula',
    horario: '14:00',
    tipo: 'Reposição',
  },
]

const avisos = [
  {
    titulo: 'Frequências pendentes',
    descricao:
      'Existem registros de frequência que precisam ser conferidos.',
    tipo: 'Atenção',
  },
  {
    titulo: 'Calendário acadêmico',
    descricao:
      'Confira os próximos compromissos da instituição.',
    tipo: 'Informação',
  },
  {
    titulo: 'Organização das turmas',
    descricao:
      'Revise a distribuição de docentes por turma para este semestre.',
    tipo: 'Ação',
  },
]

const textosErro = {
  carregar: {
    titulo: 'Não foi possível carregar o painel',
    descricao: 'Ocorreu um erro ao buscar as informações do dashboard. Verifique sua conexão com a internet e tente novamente.',
  },
  timeout: {
    titulo: 'A operação demorou muito para responder',
    descricao: 'Não foi possível concluir a solicitação dentro do tempo esperado. Verifique sua conexão com a internet e tente novamente.',
  },
  indisponibilidade: {
    titulo: 'Serviço indisponível no momento',
    descricao: 'O serviço do dashboard está indisponível. Tente novamente em alguns instantes.',
  },
}

function Dashboard() {
  const navigate = useNavigate()
  const { tipo: erroPagina, limparErro } = useErroPagina()

  return (
    <div className="coordenador-layout">
      <BarraLateral />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="breadcrumb">Coordenador / Dashboard</span>
            <h1>Painel do Coordenador</h1>
          </div>
          <div className="header-usuario">
            <div className="perfil-avatar">MC</div>
            <div>
              <strong>Marina Costa</strong>
              <span>Coordenadora</span>
            </div>
          </div>
        </header>

        {erroPagina ? (
          <div className="dashboard-conteudo">
            <ErrorState
              tipo={erroPagina}
              titulo={textosErro[erroPagina].titulo}
              descricao={textosErro[erroPagina].descricao}
              onTentarNovamente={limparErro}
            />
          </div>
        ) : (
          <div className="dashboard-conteudo">
            <section className="boas-vindas">
              <div>
                <span className="boas-vindas-etiqueta">BEM-VINDA DE VOLTA</span>
                <h2>Olá, Marina Costa</h2>
                <p>
                  Acompanhe o desempenho da instituição e as principais ações
                  pendentes em um só lugar.
                </p>
              </div>
              <button
                type="button"
                className="boas-vindas-botao"
                onClick={() => navigate('/coordenador/turmas')}
              >
                Gerenciar turmas
              </button>
            </section>

            <section className="indicadores">
              {indicadores.map((item) => (
                <article key={item.titulo} className="indicador-card">
                  <div className="indicador-cabecalho">
                    <div>
                      <span className="indicador-titulo">{item.titulo}</span>
                      <strong className="indicador-valor">{item.valor}</strong>
                    </div>
                    <div className="indicador-icone">
                      <img src={item.icone} alt="" aria-hidden="true" />
                    </div>
                  </div>
                  <span className="indicador-detalhe">{item.detalhe}</span>
                </article>
              ))}
            </section>

            <div className="dashboard-grid">
              <section className="painel">
                <header className="painel-cabecalho">
                  <div>
                    <h3>Próximos eventos</h3>
                    <p>Compromissos agendados para os próximos dias</p>
                  </div>
                  <button
                    type="button"
                    className="painel-link"
                    onClick={() => navigate('/coordenador/calendario')}
                  >
                    Ver calendário
                  </button>
                </header>
                <ul className="eventos-lista">
                  {eventos.map((evento) => (
                    <li key={evento.id} className="evento-item">
                      <div className="evento-data">
                        <strong>{evento.dia}</strong>
                        <span>{evento.mes}</span>
                      </div>
                      <div className="evento-info">
                        <div className="evento-topo">
                          <h4>{evento.titulo}</h4>
                          <span className="evento-tipo">{evento.tipo}</span>
                        </div>
                        <span className="evento-horario">Horário: {evento.horario}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="painel">
                <header className="painel-cabecalho">
                  <div>
                    <h3>Avisos e pendências</h3>
                    <p>Atualizações importantes para a coordenação</p>
                  </div>
                </header>
                <ul className="avisos-lista">
                  {avisos.map((aviso) => (
                    <li key={aviso.titulo} className="aviso-item">
                      <div className="aviso-conteudo">
                        <h4>{aviso.titulo}</h4>
                        <p>{aviso.descricao}</p>
                      </div>
                      <span className={`aviso-tag aviso-tag--${aviso.tipo === 'Atenção' ? 'alerta' : aviso.tipo === 'Ação' ? 'acao' : 'info'}`}>
                        {aviso.tipo}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
