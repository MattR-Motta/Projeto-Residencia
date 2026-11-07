import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Download,
  TrendingUp,
  CalendarCheck,
  BookOpen,
  CalendarDays,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Clock,
} from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/dashboardResponsavel.css'

const alunos = [
  {
    id: 1,
    nome: 'Lucas Costa',
    turma: '8º ano A',
    escola: 'Escola Estadual Farol',
    media: '8,0',
    frequencia: '95,0%',
    presencas: '228 presenças em 240 aulas',
    atividades: '2',
    proximaAvaliacao: '07/10',
    disciplinaAvaliacao: 'Matemática',
    mediaAnterior: '7,5',
    mediaAtual: '8,0',
    disciplinas: [
      { nome: 'Matemática', media: '7,5', situacao: 'Acima da média' },
      { nome: 'Português', media: '8,0', situacao: 'Acima da média' },
      { nome: 'Ciências', media: '8,5', situacao: 'Acima da média' },
      { nome: 'História', media: '8,0', situacao: 'Acima da média' },
      { nome: 'Geografia', media: '9,0', situacao: 'Acima da média' },
      { nome: 'Inglês', media: '8,0', situacao: 'Acima da média' },
    ],
    eventos: [
      { dia: '07 OUT', titulo: 'Avaliação de Matemática', detalhe: '8º ano · Equações e proporcionalidade' },
      { dia: '08 OUT', titulo: 'Entrega de Geografia', detalhe: '8º ano · Mapa das bacias' },
      { dia: '09 OUT', titulo: 'Entrega de Português', detalhe: '8º ano · Redação de crônica' },
      { dia: '15 OUT', titulo: 'Reunião de responsáveis', detalhe: '18h30 · Auditório da escola' },
    ],
    alertas: [
      {
        tipo: 'Atenção necessária',
        titulo: 'Reunião de responsáveis · 15/10',
        descricao: 'Confira a pauta e confirme a leitura do comunicado enviado pela coordenação.',
      },
    ],
    aprendizagem: {
      titulo: 'Matemática: progresso consistente',
      descricao: 'Lucas passou de 6,0 para 7,5. A professora recomenda revisar problemas com proporcionalidade antes da avaliação de 07/10.',
    },
  },
  {
    id: 2,
    nome: 'Sofia Costa',
    turma: '9º ano B',
    escola: 'Escola Estadual Farol',
    media: '8,7',
    frequencia: '97,5%',
    presencas: '234 presenças em 240 aulas',
    atividades: '1',
    proximaAvaliacao: '09/10',
    disciplinaAvaliacao: 'Ciências',
    mediaAnterior: '8,2',
    mediaAtual: '8,7',
    disciplinas: [
      { nome: 'Matemática', media: '8,5', situacao: 'Acima da média' },
      { nome: 'Português', media: '9,0', situacao: 'Acima da média' },
      { nome: 'Ciências', media: '8,0', situacao: 'Acima da média' },
      { nome: 'História', media: '9,0', situacao: 'Acima da média' },
      { nome: 'Geografia', media: '8,5', situacao: 'Acima da média' },
      { nome: 'Inglês', media: '9,0', situacao: 'Acima da média' },
    ],
    eventos: [
      { dia: '09 OUT', titulo: 'Avaliação de Ciências', detalhe: '9º ano · Ecologia e meio ambiente' },
      { dia: '10 OUT', titulo: 'Entrega de História', detalhe: '9º ano · Pesquisa histórica' },
      { dia: '13 OUT', titulo: 'Atividade de Matemática', detalhe: '9º ano · Funções' },
      { dia: '15 OUT', titulo: 'Reunião de responsáveis', detalhe: '18h30 · Auditório da escola' },
    ],
    alertas: [
      {
        tipo: 'Informativo',
        titulo: 'Boletim atualizado',
        descricao: 'As notas do último período de Sofia já estão disponíveis para consulta.',
      },
    ],
    aprendizagem: {
      titulo: 'Português: excelente desempenho',
      descricao: 'Sofia mantém resultados consistentes nas atividades de interpretação e produção textual. Continue incentivando a leitura.',
    },
  },
]

function DashboardResponsavel() {
  const navigate = useNavigate()
  const [alunoSelecionado, setAlunoSelecionado] = useState(1)

  const aluno = alunos.find((item) => item.id === alunoSelecionado) || alunos[0]

  const indicadores = [
    {
      titulo: 'Média geral',
      valor: aluno.media,
      detalhe: '+0,5 ponto em relação ao 1º bimestre',
      Icon: TrendingUp,
    },
    {
      titulo: 'Frequência acumulada',
      valor: aluno.frequencia,
      detalhe: aluno.presencas,
      Icon: CalendarCheck,
    },
    {
      titulo: 'Atividades pendentes',
      valor: aluno.atividades,
      detalhe: 'Precisam de atenção',
      Icon: BookOpen,
    },
    {
      titulo: 'Próxima avaliação',
      valor: aluno.proximaAvaliacao,
      detalhe: aluno.disciplinaAvaliacao,
      Icon: CalendarDays,
    },
  ]

  function acessarFrequencia() {
    navigate('/responsavel/frequencia')
  }

  return (
    <div className="responsavel-layout">
      <BarraLateral />

      <main className="responsavel-main">
        <header className="responsavel-header">
          <div className="responsavel-header__busca">
            <Search size={17} />
            <input type="text" placeholder="Buscar no portal..." aria-label="Buscar no portal" />
          </div>

          <div className="responsavel-header__usuario">
            <span className="responsavel-header__data">Seg, 05 de out. de 2026</span>
            <button type="button" className="responsavel-header__notificacao" aria-label="Notificações">
              <Bell size={19} />
              <span />
            </button>
            <div className="responsavel-header__avatar">AC</div>
            <div className="responsavel-header__identidade">
              <strong>{localStorage.getItem('usuarioEduGest') ? JSON.parse(localStorage.getItem('usuarioEduGest')).nome : 'Responsável'}</strong>
              <span>Responsável</span>
            </div>
          </div>
        </header>

        <div className="responsavel-conteudo">
          <section className="responsavel-boas-vindas">
            <div>
              <span className="responsavel-breadcrumb">Responsável / Início</span>
              <h1>Olá, Ana!</h1>
              <p>Acompanhe de perto cada conquista dos seus filhos e os próximos passos da vida escolar.</p>
            </div>

            <button
              type="button"
              className="responsavel-botao-boletim"
              onClick={() => navigate('/responsavel/desempenho')}
            >
              <Download size={16} />
              Ver boletim
            </button>
          </section>

          <section className="responsavel-seletor-aluno">
            {alunos.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`responsavel-aluno-opcao ${alunoSelecionado === item.id ? 'selecionado' : ''}`}
                onClick={() => setAlunoSelecionado(item.id)}
              >
                <span className="responsavel-aluno-indicador" />
                {item.nome} · {item.turma}
              </button>
            ))}

            <span className="responsavel-escola-periodo">
              Ano letivo 2026 · {aluno.escola}
            </span>
          </section>

          {aluno.id === 1 && (
            <section className="responsavel-aviso-atencao">
              <AlertCircle size={19} />
              <div>
                <strong>Uma ausência precisa da sua atenção</strong>
                <p>
                  Lucas tem 2 faltas em Matemática ainda não justificadas.
                  Acesse Frequência e Faltas para enviar o comprovante.
                </p>
              </div>
              <button type="button" onClick={acessarFrequencia}>
                Acessar <ArrowRight size={14} />
              </button>
            </section>
          )}

          <section className="responsavel-indicadores">
            {indicadores.map(({ titulo, valor, detalhe, Icon }) => (
              <article className="responsavel-indicador-card" key={titulo}>
                <div className="responsavel-indicador-topo">
                  <span>{titulo}</span>
                  <div className="responsavel-indicador-icone">
                    <Icon size={19} />
                  </div>
                </div>
                <strong className="responsavel-indicador-valor">{valor}</strong>
                <span className="responsavel-indicador-detalhe">{detalhe}</span>
              </article>
            ))}
          </section>

          <div className="responsavel-dashboard-grid">
            <section className="responsavel-painel responsavel-painel-grafico">
              <header className="responsavel-painel-cabecalho">
                <div>
                  <h2>Evolução das médias</h2>
                  <p>Desempenho escolar · Ano letivo 2026</p>
                </div>
                <span className="responsavel-periodo-tag">2º bim.</span>
              </header>

              <div className="responsavel-grafico">
                <div className="responsavel-grafico-eixo">
                  <span>10</span>
                  <span>8</span>
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>

                <svg viewBox="0 0 600 210" preserveAspectRatio="none" role="img" aria-label={`Evolução das médias de ${aluno.nome}`}>
                  {[20, 55, 90, 125, 160, 195].map((y) => (
                    <line key={y} x1="35" y1={y} x2="590" y2={y} className="responsavel-grafico-grade" />
                  ))}

                  <polyline
                    points={`35,${195 - Number(aluno.mediaAnterior.replace(',', '.')) * 17} 300,${195 - Number(aluno.mediaAnterior.replace(',', '.')) * 17} 590,${195 - Number(aluno.media.replace(',', '.')) * 17}`}
                    className="responsavel-grafico-linha"
                  />

                  <circle cx="35" cy={195 - Number(aluno.mediaAnterior.replace(',', '.')) * 17} r="5" className="responsavel-grafico-ponto" />
                  <circle cx="300" cy={195 - Number(aluno.mediaAnterior.replace(',', '.')) * 17} r="5" className="responsavel-grafico-ponto" />
                  <circle cx="590" cy={195 - Number(aluno.media.replace(',', '.')) * 17} r="5" className="responsavel-grafico-ponto" />

                  <text x="35" y={185 - Number(aluno.mediaAnterior.replace(',', '.')) * 17} className="responsavel-grafico-valor">{aluno.mediaAnterior}</text>
                  <text x="300" y={185 - Number(aluno.mediaAnterior.replace(',', '.')) * 17} className="responsavel-grafico-valor">{aluno.mediaAnterior}</text>
                  <text x="590" y={185 - Number(aluno.media.replace(',', '.')) * 17} textAnchor="end" className="responsavel-grafico-valor">{aluno.media}</text>
                </svg>

                <div className="responsavel-grafico-meses">
                  <span>1º bim.</span>
                  <span>2º bim.</span>
                  <span>3º bim.</span>
                </div>
              </div>

              <div className="responsavel-grafico-legenda">
                <span><i /> Média geral</span>
                <span className="responsavel-grafico-meta">Média escolar: 6,0</span>
              </div>

              <p className="responsavel-evolucao-positiva">
                <TrendingUp size={15} />
                Evolução positiva no desempenho escolar
              </p>
            </section>

            <section className="responsavel-painel">
              <header className="responsavel-painel-cabecalho">
                <div>
                  <h2>Próximos compromissos</h2>
                  <p>Agenda de {aluno.nome} · Outubro de 2026</p>
                </div>
              </header>

              <div className="responsavel-eventos-lista">
                {aluno.eventos.map((evento) => (
                  <article className="responsavel-evento" key={evento.dia + evento.titulo}>
                    <span className="responsavel-evento-data">{evento.dia}</span>
                    <div>
                      <strong>{evento.titulo}</strong>
                      <p>{evento.detalhe}</p>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="responsavel-link-painel"
                onClick={() => navigate('/responsavel/calendario')}
              >
                Ver calendário <ArrowRight size={14} />
              </button>
            </section>

            <section className="responsavel-painel">
              <header className="responsavel-painel-cabecalho">
                <div>
                  <h2>Resumo por disciplina</h2>
                  <p>2º bimestre encerrado · Média escolar 6,0</p>
                </div>
              </header>

              <div className="responsavel-tabela-container">
                <table className="responsavel-tabela">
                  <thead>
                    <tr>
                      <th>Disciplina</th>
                      <th>Média / 10</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aluno.disciplinas.map((disciplina) => (
                      <tr key={disciplina.nome}>
                        <td>{disciplina.nome}</td>
                        <td>{disciplina.media}</td>
                        <td>
                          <span className="responsavel-situacao">
                            {disciplina.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                className="responsavel-link-painel"
                onClick={() => navigate('/responsavel/desempenho')}
              >
                Ver desempenho completo <ArrowRight size={14} />
              </button>
            </section>

            <div className="responsavel-paineis-laterais">
              <section className="responsavel-painel">
                <header className="responsavel-painel-cabecalho">
                  <div>
                    <h2>Alertas importantes</h2>
                  </div>
                </header>

                {aluno.alertas.map((alerta) => (
                  <article className="responsavel-alerta" key={alerta.titulo}>
                    <span className="responsavel-alerta-tag">{alerta.tipo}</span>
                    <strong>{alerta.titulo}</strong>
                    <p>{alerta.descricao}</p>
                    <button
                      type="button"
                      className="responsavel-link-painel"
                      onClick={() => navigate('/responsavel/frequencia')}
                    >
                      Acessar informações <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </section>

              <section className="responsavel-painel responsavel-aprendizagem">
                <header className="responsavel-painel-cabecalho">
                  <div>
                    <h2>Aprendizagem em foco</h2>
                  </div>
                </header>

                <strong>{aluno.aprendizagem.titulo}</strong>
                <p>{aluno.aprendizagem.descricao}</p>

                <button
                  type="button"
                  className="responsavel-link-painel"
                  onClick={() => navigate('/responsavel/desempenho')}
                >
                  Ver progresso <ArrowUpRight size={15} />
                </button>
              </section>
            </div>
          </div>

          <footer className="responsavel-rodape">
            <span>EduGest · Dados demonstrativos · Ambiente de demonstração</span>
            <span>Privacidade e segurança dos dados</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default DashboardResponsavel