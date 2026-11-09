
import { useState } from 'react'
import {
  Bell,
  BookOpen,
  CalendarDays,
  Clock3,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageSquareText,
  ChevronRight,
  ClipboardList,
} from 'lucide-react'

import BarraLateral from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/atividadesResponsavel.css'

const alunos = [
  { id: 1, nome: 'Lucas Costa', turma: '8º ano A' },
  { id: 2, nome: 'Sofia Costa', turma: '9º ano B' },
]

const dadosPorAluno = {
  1: {
    escola: 'Escola Estadual Farol',

    atividades: [
      {
        id: 1,
        titulo: 'Lista de exercícios — Equações',
        disciplina: 'Matemática',
        professor: 'Prof.ª Ana Paula',
        tipo: 'Atividade',
        entrega: '12/11/2026',
        status: 'Pendente',
        descricao:
          'Resolver os exercícios da página 85 até a página 88 do livro didático. Apresentar os cálculos utilizados em cada questão.',
        pontuacao: '10 pontos',
        instrucoes: 'Entregar no caderno durante a próxima aula.',
      },
      {
        id: 2,
        titulo: 'Pesquisa sobre o meio ambiente',
        disciplina: 'Ciências',
        professor: 'Prof. Carlos Mendes',
        tipo: 'Trabalho',
        entrega: '14/11/2026',
        status: 'Em andamento',
        descricao:
          'Realizar uma pesquisa sobre sustentabilidade e preservação ambiental. O trabalho deve conter introdução, desenvolvimento e conclusão.',
        pontuacao: '10 pontos',
        instrucoes: 'A atividade poderá ser realizada individualmente.',
      },
      {
        id: 3,
        titulo: 'Interpretação de texto',
        disciplina: 'Português',
        professor: 'Prof.ª Juliana Lima',
        tipo: 'Atividade',
        entrega: '05/11/2026',
        status: 'Concluída',
        descricao:
          'Leitura e interpretação do texto trabalhado em sala, com respostas às questões propostas.',
        pontuacao: '8 pontos',
        instrucoes: 'Atividade corrigida pelo professor.',
      },
      {
        id: 4,
        titulo: 'Seminário de História',
        disciplina: 'História',
        professor: 'Prof. Roberto Alves',
        tipo: 'Trabalho',
        entrega: '18/11/2026',
        status: 'Pendente',
        descricao:
          'Preparar uma apresentação sobre os principais acontecimentos históricos estudados neste bimestre.',
        pontuacao: '10 pontos',
        instrucoes: 'Apresentação em grupo, conforme divisão feita em sala.',
      },
    ],

    feedback: {
      mensagem:
        'Bom desenvolvimento na atividade de interpretação de texto. Continue praticando a leitura e a organização das respostas.',
      professor: 'Prof.ª Juliana Lima',
      data: '06/11/2026',
    },

    avaliacoes: [
      {
        id: 1,
        disciplina: 'Matemática',
        titulo: 'Avaliação bimestral',
        data: '16/11/2026',
        horario: '08:00',
      },
      {
        id: 2,
        disciplina: 'Português',
        titulo: 'Prova de interpretação',
        data: '19/11/2026',
        horario: '10:00',
      },
      {
        id: 3,
        disciplina: 'Ciências',
        titulo: 'Avaliação de Ciências',
        data: '23/11/2026',
        horario: '08:00',
      },
    ],
  },

  2: {
    escola: 'Escola Estadual Farol',

    atividades: [
      {
        id: 1,
        titulo: 'Análise de fontes históricas',
        disciplina: 'História',
        professor: 'Prof. Roberto Alves',
        tipo: 'Trabalho',
        entrega: '13/11/2026',
        status: 'Pendente',
        descricao:
          'Analisar documentos e imagens históricas trabalhados em sala, identificando o contexto e a importância de cada fonte.',
        pontuacao: '10 pontos',
        instrucoes: 'Entregar a análise em folha separada.',
      },
      {
        id: 2,
        titulo: 'Produção de texto dissertativo',
        disciplina: 'Português',
        professor: 'Prof.ª Juliana Lima',
        tipo: 'Atividade',
        entrega: '07/11/2026',
        status: 'Concluída',
        descricao:
          'Produzir um texto dissertativo sobre a importância da educação e da tecnologia na sociedade atual.',
        pontuacao: '10 pontos',
        instrucoes: 'Texto corrigido pela professora.',
      },
      {
        id: 3,
        titulo: 'Exercícios de funções',
        disciplina: 'Matemática',
        professor: 'Prof.ª Ana Paula',
        tipo: 'Atividade',
        entrega: '17/11/2026',
        status: 'Em andamento',
        descricao:
          'Resolver os exercícios sobre funções de primeiro e segundo grau, demonstrando os cálculos.',
        pontuacao: '10 pontos',
        instrucoes: 'Entregar no caderno durante a aula.',
      },
    ],

    feedback: {
      mensagem:
        'Excelente participação nas atividades de produção textual. Sofia demonstrou boa argumentação e organização das ideias.',
      professor: 'Prof.ª Juliana Lima',
      data: '07/11/2026',
    },

    avaliacoes: [
      {
        id: 1,
        disciplina: 'História',
        titulo: 'Avaliação sobre Brasil República',
        data: '15/11/2026',
        horario: '09:00',
      },
      {
        id: 2,
        disciplina: 'Matemática',
        titulo: 'Prova de funções',
        data: '20/11/2026',
        horario: '08:00',
      },
      {
        id: 3,
        disciplina: 'Biologia',
        titulo: 'Avaliação de genética',
        data: '24/11/2026',
        horario: '10:00',
      },
    ],
  },
}

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioEduGest') || 'null')
  } catch {
    return null
  }
}

function AtividadesResponsavel() {
  const usuario = obterUsuario()

  const [alunoSelecionado, setAlunoSelecionado] = useState(1)
  const [filtroStatus, setFiltroStatus] = useState('Todas')
  const [filtroDisciplina, setFiltroDisciplina] = useState('Todas')
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(1)

  const aluno = alunos.find((item) => item.id === alunoSelecionado)
  const dadosAluno = dadosPorAluno[alunoSelecionado]

  const atividades = dadosAluno.atividades

  const atividadesFiltradas = atividades.filter((atividade) => {
    const correspondeStatus =
      filtroStatus === 'Todas' || atividade.status === filtroStatus

    const correspondeDisciplina =
      filtroDisciplina === 'Todas' ||
      atividade.disciplina === filtroDisciplina

    return correspondeStatus && correspondeDisciplina
  })

  const atividadeAtual =
    atividadesFiltradas.find(
      (atividade) => atividade.id === atividadeSelecionada
    ) || atividadesFiltradas[0]

  const totalPendentes = atividades.filter(
    (item) => item.status === 'Pendente'
  ).length

  const totalConcluidas = atividades.filter(
    (item) => item.status === 'Concluída'
  ).length

  const iniciais = usuario?.nome
    ? usuario.nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
    : 'AC'

  function trocarAluno(id) {
    setAlunoSelecionado(id)
    setFiltroStatus('Todas')
    setFiltroDisciplina('Todas')
    setAtividadeSelecionada(1)
  }

  return (
    <div className="resp-atividades-layout">
      <BarraLateral />

      <main className="resp-atividades-main">
        <header className="resp-atividades-topbar">
          <span>Portal do Responsável / Atividades e avaliações</span>

          <div className="resp-atividades-perfil">
            <span className="resp-atividades-data">
              Ano letivo de 2026
            </span>

            <button
              type="button"
              className="resp-atividades-notificacao"
              aria-label="Notificações"
            >
              <Bell size={17} />
              <span />
            </button>

            <div className="resp-atividades-avatar">{iniciais}</div>

            <div className="resp-atividades-identidade">
              <strong>{usuario?.nome || 'Responsável'}</strong>
              <span>Responsável</span>
            </div>
          </div>
        </header>

        <div className="resp-atividades-conteudo">
          <section className="resp-atividades-titulo">
            <div>
              <span className="resp-atividades-subtitulo">
                ACOMPANHAMENTO ESCOLAR
              </span>
              <h1>Atividades e avaliações</h1>
              <p>
                Acompanhe as tarefas, os trabalhos e as próximas avaliações
                do estudante.
              </p>
            </div>
          </section>

          <section className="resp-atividades-alunos">
            {alunos.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`resp-atividades-aluno ${
                  alunoSelecionado === item.id ? 'selecionado' : ''
                }`}
                onClick={() => trocarAluno(item.id)}
              >
                <span className="resp-atividades-indicador" />
                <span>
                  <strong>{item.nome}</strong>
                  <small>{item.turma}</small>
                </span>
              </button>
            ))}

            <span className="resp-atividades-escola">
              {aluno?.turma} · {dadosAluno.escola}
            </span>
          </section>

          <section className="resp-atividades-resumo">
            <article className="resp-atividades-resumo-card">
              <div className="resp-atividades-resumo-icone azul">
                <ClipboardList size={19} />
              </div>
              <span>Atividades cadastradas</span>
              <strong>{atividades.length}</strong>
              <small>No período atual</small>
            </article>

            <article className="resp-atividades-resumo-card">
              <div className="resp-atividades-resumo-icone laranja">
                <AlertCircle size={19} />
              </div>
              <span>Pendentes</span>
              <strong>{totalPendentes}</strong>
              <small>Precisam de atenção</small>
            </article>

            <article className="resp-atividades-resumo-card">
              <div className="resp-atividades-resumo-icone verde">
                <CheckCircle2 size={19} />
              </div>
              <span>Concluídas</span>
              <strong>{totalConcluidas}</strong>
              <small>Atividades finalizadas</small>
            </article>
          </section>

          <section className="resp-atividades-filtros">
            <label>
              Situação
              <select
                value={filtroStatus}
                onChange={(event) => setFiltroStatus(event.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="Pendente">Pendente</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluída">Concluída</option>
              </select>
            </label>

            <label>
              Disciplina
              <select
                value={filtroDisciplina}
                onChange={(event) => setFiltroDisciplina(event.target.value)}
              >
                <option value="Todas">Todas as disciplinas</option>
                {[...new Set(atividades.map((item) => item.disciplina))].map(
                  (disciplina) => (
                    <option key={disciplina} value={disciplina}>
                      {disciplina}
                    </option>
                  )
                )}
              </select>
            </label>
          </section>

          <div className="resp-atividades-grid">
            <section className="resp-atividades-painel">
              <div className="resp-atividades-painel-titulo">
                <div>
                  <h2>Lista de atividades</h2>
                  <p>Atividades e trabalhos de {aluno.nome}</p>
                </div>
                <span>{atividadesFiltradas.length} registros</span>
              </div>

              <div className="resp-atividades-lista">
                {atividadesFiltradas.length > 0 ? (
                  atividadesFiltradas.map((atividade) => (
                    <button
                      type="button"
                      key={atividade.id}
                      className={`resp-atividades-item ${
                        atividadeAtual?.id === atividade.id ? 'ativo' : ''
                      }`}
                      onClick={() =>
                        setAtividadeSelecionada(atividade.id)
                      }
                    >
                      <div className="resp-atividades-item-icone">
                        <FileText size={18} />
                      </div>

                      <div className="resp-atividades-item-conteudo">
                        <strong>{atividade.titulo}</strong>
                        <span>
                          {atividade.disciplina} · {atividade.tipo}
                        </span>
                        <small>
                          <CalendarDays size={12} />
                          Entrega: {atividade.entrega}
                        </small>
                      </div>

                      <span
                        className={`resp-atividades-status ${atividade.status
                          .toLowerCase()
                          .replace(' ', '-')}`}
                      >
                        {atividade.status}
                      </span>

                      <ChevronRight size={16} />
                    </button>
                  ))
                ) : (
                  <div className="resp-atividades-vazio">
                    Nenhuma atividade encontrada para os filtros selecionados.
                  </div>
                )}
              </div>
            </section>

            <div className="resp-atividades-coluna-lateral">
              <section className="resp-atividades-painel resp-atividades-detalhes">
                <div className="resp-atividades-painel-titulo">
                  <div>
                    <h2>Detalhes da atividade</h2>
                    <p>Informações da atividade selecionada</p>
                  </div>
                  <BookOpen size={19} />
                </div>

                {atividadeAtual ? (
                  <>
                    <span className="resp-atividades-detalhe-disciplina">
                      {atividadeAtual.disciplina}
                    </span>

                    <h3>{atividadeAtual.titulo}</h3>

                    <p className="resp-atividades-descricao">
                      {atividadeAtual.descricao}
                    </p>

                    <div className="resp-atividades-informacoes">
                      <div>
                        <span>Professor</span>
                        <strong>{atividadeAtual.professor}</strong>
                      </div>

                      <div>
                        <span>Data de entrega</span>
                        <strong>{atividadeAtual.entrega}</strong>
                      </div>

                      <div>
                        <span>Pontuação</span>
                        <strong>{atividadeAtual.pontuacao}</strong>
                      </div>

                      <div>
                        <span>Orientação</span>
                        <strong>{atividadeAtual.instrucoes}</strong>
                      </div>
                    </div>

                    <span
                      className={`resp-atividades-status detalhe ${atividadeAtual.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {atividadeAtual.status}
                    </span>
                  </>
                ) : (
                  <p className="resp-atividades-vazio">
                    Selecione uma atividade para visualizar os detalhes.
                  </p>
                )}
              </section>

              <section className="resp-atividades-feedback">
                <div className="resp-atividades-feedback-icone">
                  <MessageSquareText size={18} />
                </div>
                <div>
                  <strong>Último feedback recebido</strong>
                  <p>{dadosAluno.feedback.mensagem}</p>
                  <small>
                    {dadosAluno.feedback.professor} · {dadosAluno.feedback.data}
                  </small>
                </div>
              </section>
            </div>
          </div>

          <section className="resp-atividades-painel resp-atividades-provas">
            <div className="resp-atividades-painel-titulo">
              <div>
                <h2>Próximas avaliações</h2>
                <p>
                  Avaliações previstas para {aluno.nome}
                </p>
              </div>
              <CalendarDays size={19} />
            </div>

            <div className="resp-atividades-provas-lista">
              {dadosAluno.avaliacoes.map((prova) => (
                <article
                  className="resp-atividades-prova"
                  key={prova.id}
                >
                  <div className="resp-atividades-prova-icone">
                    <BookOpen size={17} />
                  </div>

                  <div>
                    <strong>{prova.titulo}</strong>
                    <span>{prova.disciplina}</span>
                  </div>

                  <div className="resp-atividades-prova-data">
                    <CalendarDays size={14} />
                    {prova.data}
                  </div>

                  <div className="resp-atividades-prova-horario">
                    <Clock3 size={14} />
                    {prova.horario}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="resp-atividades-rodape">
            <span>EduGest · Portal do Responsável</span>
            <span>Dados demonstrativos para visualização da interface</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default AtividadesResponsavel
