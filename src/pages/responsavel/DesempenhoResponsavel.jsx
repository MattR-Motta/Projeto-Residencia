
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Download, BookOpen, Award, ChevronDown,
  ArrowUpRight, CheckCircle2, AlertCircle
} from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/desempenhoResponsavel.css'

const dadosAlunos = {
  1: {
    nome: 'Lucas Costa',
    turma: '8º ano A',
    disciplinas: [
      { nome: 'Matemática', notas: [7, 8, 7.5], media: 7.5 },
      { nome: 'Português', notas: [8, 8.5, 7.5], media: 8 },
      { nome: 'Ciências', notas: [8, 9, 8], media: 8.5 },
      { nome: 'História', notas: [7.5, 8, 8.5], media: 8 },
      { nome: 'Geografia', notas: [9, 8.5, 9.5], media: 9 },
      { nome: 'Inglês', notas: [8, 8, 8], media: 8 },
    ],
  },
  2: {
    nome: 'Sofia Costa',
    turma: '9º ano B',
    disciplinas: [
      { nome: 'Matemática', notas: [8, 8.5, 9], media: 8.5 },
      { nome: 'Português', notas: [9, 9.5, 8.5], media: 9 },
      { nome: 'Ciências', notas: [8, 8, 8], media: 8 },
      { nome: 'História', notas: [9, 8.5, 9.5], media: 9 },
      { nome: 'Geografia', notas: [8, 9, 8.5], media: 8.5 },
      { nome: 'Inglês', notas: [9, 9, 9], media: 9 },
    ],
  },
}

function DesempenhoResponsavel() {
  const navigate = useNavigate()
  const [alunoId, setAlunoId] = useState('1')
  const [bimestre, setBimestre] = useState('2º bimestre')

  const aluno = dadosAlunos[alunoId]
  const mediaGeral = (
    aluno.disciplinas.reduce((total, item) => total + item.media, 0) /
    aluno.disciplinas.length
  ).toFixed(1)

  const disciplinas = aluno.disciplinas
  const aprovadas = disciplinas.filter((item) => item.media >= 6).length
  const abaixoDaMedia = disciplinas.filter((item) => item.media < 6)

  return (
    <div className="resp-desempenho-layout">
      <BarraLateral />

      <main className="resp-desempenho-main">
        <header className="resp-desempenho-topbar">
          <span>Portal do Responsável / Desempenho e boletim</span>
          <div className="resp-desempenho-perfil">
            <div className="resp-desempenho-avatar">AC</div>
            <div>
              <strong>Responsável</strong>
              <span>Portal da família</span>
            </div>
          </div>
        </header>

        <div className="resp-desempenho-conteudo">
          <section className="resp-desempenho-titulo">
            <div>
              <span className="resp-desempenho-subtitulo">ACOMPANHAMENTO ESCOLAR</span>
              <h1>Desempenho e boletim</h1>
              <p>Acompanhe as notas, médias e evolução acadêmica do aluno.</p>
            </div>

            <button
              className="resp-desempenho-download"
              onClick={() => window.print()}
              type="button"
            >
              <Download size={17} />
              Imprimir boletim
            </button>
          </section>

          <section className="resp-desempenho-filtros">
            <label>
              Aluno
              <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
                <option value="1">Lucas Costa · 8º ano A</option>
                <option value="2">Sofia Costa · 9º ano B</option>
              </select>
            </label>

            <label>
              Período letivo
              <select value={bimestre} onChange={(e) => setBimestre(e.target.value)}>
                <option>1º bimestre</option>
                <option>2º bimestre</option>
                <option>3º bimestre</option>
                <option>4º bimestre</option>
              </select>
            </label>
          </section>

          <section className="resp-desempenho-resumo">
            <article className="resp-desempenho-card">
              <div className="resp-desempenho-card-icone azul"><Award size={20} /></div>
              <span>Média geral</span>
              <strong>{mediaGeral}</strong>
              <small>De 10 pontos</small>
            </article>

            <article className="resp-desempenho-card">
              <div className="resp-desempenho-card-icone verde"><CheckCircle2 size={20} /></div>
              <span>Disciplinas acima da média</span>
              <strong>{aprovadas}/{disciplinas.length}</strong>
              <small>Média mínima: 6,0</small>
            </article>

            <article className="resp-desempenho-card">
              <div className="resp-desempenho-card-icone roxo"><BookOpen size={20} /></div>
              <span>Disciplinas cursadas</span>
              <strong>{disciplinas.length}</strong>
              <small>{aluno.turma}</small>
            </article>

            <article className="resp-desempenho-card">
              <div className="resp-desempenho-card-icone laranja"><TrendingUp size={20} /></div>
              <span>Situação acadêmica</span>
              <strong className="resp-desempenho-situacao">
                {abaixoDaMedia.length === 0 ? 'Regular' : 'Atenção'}
              </strong>
              <small>Resultado demonstrativo</small>
            </article>
          </section>

          <section className="resp-desempenho-painel">
            <div className="resp-desempenho-painel-titulo">
              <div>
                <h2>Boletim escolar</h2>
                <p>Notas e médias por disciplina · {aluno.nome}</p>
              </div>
              <span>{bimestre}</span>
            </div>

            <div className="resp-desempenho-tabela-scroll">
              <table className="resp-desempenho-tabela">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>1ª avaliação</th>
                    <th>2ª avaliação</th>
                    <th>3ª avaliação</th>
                    <th>Média</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplinas.map((item) => (
                    <tr key={item.nome}>
                      <td>{item.nome}</td>
                      {item.notas.map((nota, index) => (
                        <td key={index}>{nota.toFixed(1).replace('.', ',')}</td>
                      ))}
                      <td>
                        <strong>{item.media.toFixed(1).replace('.', ',')}</strong>
                      </td>
                      <td>
                        <span className={`resp-desempenho-status ${item.media >= 6 ? 'aprovado' : 'recuperacao'}`}>
                          {item.media >= 6 ? 'Acima da média' : 'Em recuperação'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="resp-desempenho-legenda">
              <span><i className="verde" /> Média igual ou superior a 6,0</span>
              <span><i className="vermelho" /> Média inferior a 6,0</span>
            </div>
          </section>

          <section className="resp-desempenho-painel">
            <div className="resp-desempenho-painel-titulo">
              <div>
                <h2>Evolução por disciplina</h2>
                <p>Comparação das médias obtidas</p>
              </div>
            </div>

            <div className="resp-desempenho-barras">
              {disciplinas.map((item) => (
                <div className="resp-desempenho-barra-item" key={item.nome}>
                  <div className="resp-desempenho-barra-info">
                    <strong>{item.nome}</strong>
                    <span>{item.media.toFixed(1).replace('.', ',')}</span>
                  </div>
                  <div className="resp-desempenho-barra-fundo">
                    <div
                      className="resp-desempenho-barra-preenchimento"
                      style={{ width: `${item.media * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {abaixoDaMedia.length > 0 && (
            <section className="resp-desempenho-alerta">
              <AlertCircle size={19} />
              <div>
                <strong>Disciplinas que precisam de atenção</strong>
                <p>{abaixoDaMedia.map((item) => item.nome).join(', ')}</p>
              </div>
            </section>
          )}

          <section className="resp-desempenho-observacao">
            <div>
              <h2>Orientações pedagógicas</h2>
              <p>
                Consulte os resultados e acompanhe a evolução do aluno.
                Em caso de dúvidas sobre as avaliações, entre em contato com a coordenação.
              </p>
            </div>
            <button type="button" onClick={() => navigate('/responsavel/calendario')}>
              Ver calendário <ArrowUpRight size={15} />
            </button>
          </section>

          <footer className="resp-desempenho-rodape">
            EduGest · Dados demonstrativos · Ambiente de demonstração
          </footer>
        </div>
      </main>
    </div>
  )
}

export default DesempenhoResponsavel