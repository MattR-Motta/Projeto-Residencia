import { useNavigate } from 'react-router-dom'
import BarraLateralDocente from '../../components/BarraLateralDocente'
import '../../styles/dashboardDocente.css'

// Dados de exemplo (depois você pode trocar por dados reais)
const resumo = [
  { titulo: 'Aulas hoje', valor: 4, cor: 'azul' },
  { titulo: 'Minhas turmas', valor: 6, cor: 'azul' },
  { titulo: 'Frequências pendentes', valor: 2, cor: 'laranja' },
  { titulo: 'Solicitações', valor: 1, cor: 'verde' },
]

const aulas = [
  { horario: '08:00-08:40', disciplina: 'Matemática', turma: 'Turma 1A · Sala 101', botao: 'Registrar aula' },
  { horario: '10:00-11:40', disciplina: 'Matemática', turma: 'Turma 2B · Sala 203', botao: 'Ver aula' },
  { horario: '14:00-15:40', disciplina: 'Português', turma: 'Turma 2A · Sala 105', botao: 'Ver aula' },
  { horario: '16:00-17:40', disciplina: 'História', turma: 'Turma 1B · Sala 102', botao: 'Ver aula' },
]

const pendencias = [
  'Frequência da Turma 1A · Aguardando registro',
  'Conteúdo da aula de ontem · Registrar conteúdo',
  'Solicitação de reposição · Em análise',
]

const notificacoes = [
  'Sua solicitação de reposição foi aprovada · Hoje, 10:24',
  'Nova mensagem da coordenação · Hoje, 09:17',
  'Lançamento da aula de amanhã (Turma 2B) · Ontem, 18:32',
]

function DashboardDocente() {
  const navigate = useNavigate()

  return (
    <div className="docente-pagina">
      <BarraLateralDocente />

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

        {/* Saudação */}
        <section className="docente-saudacao">
          <div>
            <h1>Olá, João!</h1>
            <p>Aqui está o resumo da sua rotina de hoje.</p>
          </div>
          <span className="docente-data">Seg, 26 de mai. de 2025</span>
        </section>

        {/* Cards de resumo */}
        <section className="docente-resumo">
          {resumo.map((item) => (
            <div className="docente-card" key={item.titulo}>
              <p className="docente-card-titulo">{item.titulo}</p>
              <span className={'docente-numero ' + item.cor}>{item.valor}</span>
            </div>
          ))}
        </section>

        {/* Parte de baixo: aulas à esquerda, pendências à direita */}
        <section className="docente-baixo">
          <div className="docente-card docente-aulas">
            <div className="docente-card-cabecalho">
              <h2>Próximas aulas</h2>
              <button
                className="docente-link"
                onClick={() => navigate('/docente/calendario')}
              >
                Ver calendário &gt;
              </button>
            </div>

            {aulas.map((aula) => (
              <div className="docente-aula" key={aula.horario}>
                <span className="docente-horario">{aula.horario}</span>
                <div className="docente-aula-info">
                  <strong>{aula.disciplina}</strong>
                  <span>{aula.turma}</span>
                </div>
                <button
                  className={
                    aula.botao === 'Registrar aula'
                      ? 'docente-botao azul-claro'
                      : 'docente-botao verde-claro'
                  }
                >
                  {aula.botao}
                </button>
              </div>
            ))}
          </div>

          <div className="docente-lateral">
            <div className="docente-card">
              <div className="docente-card-cabecalho">
                <h2>Pendências</h2>
                <button
                  className="docente-link"
                  onClick={() => navigate('/docente/pendencias')}
                >
                  Ver todas &gt;
                </button>
              </div>
              {pendencias.map((texto) => (
                <p className="docente-item" key={texto}>{texto}</p>
              ))}
            </div>

            <div className="docente-card">
              <h2>Últimas notificações</h2>
              {notificacoes.map((texto) => (
                <p className="docente-item" key={texto}>{texto}</p>
              ))}
            </div>

            <div className="docente-ajuda">
              <span>Precisa de ajuda? Pergunte algo para nossa IA...</span>
              <button className="docente-ajuda-botao">→</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardDocente