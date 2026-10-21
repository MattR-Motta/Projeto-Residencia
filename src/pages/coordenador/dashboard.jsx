import { useNavigate } from 'react-router-dom'
import BarraLateral from '../../components/barraLateral'
import '../../styles/coordenador.css'
import iconeTurmas from '../../assets/turmas.png'
import iconeCalendario from '../../assets/calendario.png'
import iconeDocente from '../../assets/docente.png'
import iconeAulas from '../../assets/aulas.png'
import iconeOcorrencia from '../../assets/ocorrencia.png'
import iconeDashboard from '../../assets/dashboard.png'

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
      'Consulte as turmas e seus respectivos períodos.',
    tipo: 'Informação',
  },
]

function Dashboard() {
  const navigate = useNavigate()
  let nomeUsuario = 'Coordenador'

  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuarioEduGest') || 'null'
    )

    if (usuario?.nome) {
      nomeUsuario = usuario.nome
    }
  } catch {
    // Mantém o nome padrão se os dados salvos forem inválidos.
  }

  return (
    <div className="coordenador-layout">
      <BarraLateral />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="breadcrumb">
              EduGest / Dashboard
            </span>
            <h1>Dashboard</h1>
          </div>

          <div className="header-usuario">
            <div className="perfil-avatar">
              {nomeUsuario.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{nomeUsuario}</strong>
              <span>Coordenação acadêmica</span>
            </div>
          </div>
        </header>

        <div className="dashboard-conteudo">
          <section className="boas-vindas">
            <div>
              <span className="boas-vindas-etiqueta">
                PAINEL DE CONTROLE
              </span>

              <h2>Olá, {nomeUsuario}!</h2>

              <p>
                Acompanhe as principais informações acadêmicas
                da instituição.
              </p>
            </div>

            <div className="boas-vindas-icone">
              <img
                src={iconeDashboard}
                alt=""
                className="dashboard-boas-vindas-icone"
              />
            </div>
          </section>

          <section className="indicadores-grid">
            {indicadores.map((item) => (
              <article
                className="indicador-card"
                key={item.titulo}
              >
                <div className="indicador-topo">
                  <span>{item.titulo}</span>
                  <div className="indicador-icone">
                    <img src={item.icone} alt={item.titulo} className="dashboard-indicador-icone" />
                  </div>
                </div>

                <strong className="indicador-valor">
                  {item.valor}
                </strong>

                <span className="indicador-detalhe">
                  {item.detalhe}
                </span>
              </article>
            ))}
          </section>

          <section className="dashboard-secoes">
            <article className="painel-card agenda-card">
              <div className="painel-cabecalho">
                <div>
                  <h3>Próximos compromissos</h3>
                  <p>
                    Confira os eventos da agenda acadêmica.
                  </p>
                </div>

                <button
                  type="button"
                  className="botao-texto"
                  onClick={() =>
                    navigate('/coordenador/calendario')
                  }
                >
                  Ver calendário →
                </button>
              </div>

              <div className="eventos-lista">
                {eventos.map((evento) => (
                  <div
                    className="evento-item"
                    key={evento.id}
                  >
                    <div className="evento-data">
                      <strong>{evento.dia}</strong>
                      <span>{evento.mes}</span>
                    </div>

                    <div className="evento-info">
                      <strong>{evento.titulo}</strong>
                      <span>
                        {evento.horario} · {evento.tipo}
                      </span>
                    </div>

                    <span className="evento-seta">›</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="painel-card avisos-card">
              <div className="painel-cabecalho">
                <div>
                  <h3>Avisos e pendências</h3>
                  <p>
                    Informações para acompanhar.
                  </p>
                </div>

                <span className="aviso-contador">
                  {avisos.length}
                </span>
              </div>

              <div className="avisos-lista">
                {avisos.map((aviso) => (
                  <div
                    className="aviso-item"
                    key={aviso.titulo}
                  >
                    <div className="aviso-ponto">!</div>

                    <div>
                      <strong>{aviso.titulo}</strong>
                      <p>{aviso.descricao}</p>
                      <span className="aviso-tipo">
                        {aviso.tipo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="atalhos-section">
            <h3>Acesso rápido</h3>

            <div className="atalhos-grid">
              <button
                type="button"
                className="atalho-card"
                onClick={() =>
                  navigate('/coordenador/turmas')
                }
              >
                <span className="atalho-icone">
                  <img
                    src={iconeTurmas}
                    alt=""
                    className="dashboard-atalho-icone"
                  />
                </span>

                <span>
                  <strong>Gerenciar turmas</strong>
                  <small>
                    Consultar turmas cadastradas
                  </small>
                </span>

                <span className="atalho-seta">→</span>
              </button>

              <button
                type="button"
                className="atalho-card"
                onClick={() =>
                  navigate('/coordenador/calendario')
                }
              >
                <span className="atalho-icone">
                  <img
                    src={iconeCalendario}
                    alt=""
                    className="dashboard-atalho-icone"
                  />
                </span>

                <span>
                  <strong>Consultar calendário</strong>
                  <small>
                    Ver aulas e compromissos
                  </small>
                </span>

                <span className="atalho-seta">→</span>
              </button>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>
              EduGest · Plataforma de gestão acadêmica
            </span>

            <span>
              Dados demonstrativos para prototipação
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default Dashboard