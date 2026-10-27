import { useNavigate } from 'react-router-dom'
import BarraLateral from '../../components/barraLateral'
import ErrorState from '../../components/ErrorState'
import useErroPagina from '../../hooks/useErroPagina'
import '../../styles/dashboarddocente.css'

// Dados de exemplo (depois você pode trocar por dados reais)
const resumo = [
  { titulo: 'Aulas hoje', valor: 4, cor: 'azul' },
  { titulo: 'Minhas turmas', valor: 6, cor: 'azul' },
  { titulo: 'Frequências pendentes', valor: 2, cor: 'laranja' },
  { titulo: 'Solicitações', valor: 1, cor: 'verde' },
]

const aulas = [
  { horario: '08:00-08:40', disciplina: 'Matemática', turma: 'Turma 1A - Sala 101', botao: 'Registrar aula' },
  { horario: '10:00-11:40', disciplina: 'Matemática', turma: 'Turma 2B - Sala 203', botao: 'Ver aula' },
  { horario: '14:00-15:40', disciplina: 'Português', turma: 'Turma 2A - Sala 105', botao: 'Ver aula' },
  { horario: '16:00-17:40', disciplina: 'História', turma: 'Turma 1B - Sala 102', botao: 'Ver aula' },
]

const pendencias = [
  'Frequência da Turma 1A - Aguardando registro',
  'Conteúdo da aula de ontem - Registrar conteúdo',
  'Solicitação de reposição - Em análise',
]

const notificacoes = [
  'Sua solicitação de reposição foi aprovada - Hoje, 10:24',
  'Nova mensagem da coordenação - Hoje, 09:17',
  'Lançamento da aula de amanhã (Turma 2B) - Ontem, 18:32',
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

function DashboardDocente() {
  const navigate = useNavigate()
  const { tipo: erroPagina, limparErro } = useErroPagina()

  return (
    <div className="docente-pagina">
      <BarraLateral />

      <main className="docente-conteudo">
        {/* Topo: busca e usuário */}
        <header className="docente-topo">
          <input
            className="docente-busca"
            type="text"
            placeholder="Buscar informações..."
          />
          <div className="docente-usuario">
            <span className="docente-sino">🔔</span>
            <div className="docente-avatar"></div>
            <strong>João Silva</strong>
          </div>
        </header>

        {erroPagina ? (
          <ErrorState
            tipo={erroPagina}
            titulo={textosErro[erroPagina].titulo}
            descricao={textosErro[erroPagina].descricao}
            onTentarNovamente={limparErro}
          />
        ) : (
          <>
            {/* Saudação */}
            <section className="docente-saudacao">
              <div>
                <h1>Olá, João!</h1>
                <p>Aqui está o resumo da sua rotina de hoje.</p>
              </div>
              <span className="docente-data">Seg, 26 de mai. de 2025</span>
            </section>

            {/* Cards resumo */}
            <section className="docente-resumo">
              {resumo.map((item) => (
                <article key={item.titulo} className={`resumo-card resumo-card--${item.cor}`}>
                  <span className="resumo-card-titulo">{item.titulo}</span>
                  <strong className="resumo-card-valor">{item.valor}</strong>
                </article>
              ))}
            </section>

            {/* Grade principal */}
            <div className="docente-grade">
              <section className="docente-painel">
                <header className="docente-painel-cabecalho">
                  <h2>Aulas de hoje</h2>
                  <button className="docente-link" onClick={() => navigate('/docente/calendario')}>
                    Ver calendário completo
                  </button>
                </header>
                <div className="docente-tabela-wrapper">
                  <table className="docente-tabela">
                    <thead>
                      <tr>
                        <th>Horário</th>
                        <th>Disciplina</th>
                        <th>Turma / Sala</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aulas.map((aula, index) => (
                        <tr key={index}>
                          <td>{aula.horario}</td>
                          <td>{aula.disciplina}</td>
                          <td>{aula.turma}</td>
                          <td>
                            <button className="docente-botao-tabela">{aula.botao}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="docente-lateral">
                <section className="docente-painel">
                  <header className="docente-painel-cabecalho">
                    <h2>Pendências</h2>
                  </header>
                  <ul className="docente-lista">
                    {pendencias.map((pendencia, index) => (
                      <li key={index} className="docente-lista-item">
                        <span className="docente-lista-marcador"></span>
                        <span>{pendencia}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="docente-painel">
                  <header className="docente-painel-cabecalho">
                    <h2>Notificações</h2>
                  </header>
                  <ul className="docente-lista docente-lista--notificacoes">
                    {notificacoes.map((notificacao, index) => (
                      <li key={index} className="docente-lista-item">
                        <span className="docente-notificacao-ponto"></span>
                        <span>{notificacao}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default DashboardDocente
