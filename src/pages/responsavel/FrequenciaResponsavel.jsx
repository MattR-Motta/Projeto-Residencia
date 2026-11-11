
import { useState } from 'react'
import {
  CalendarCheck, AlertCircle, CheckCircle2, Clock,
  FileText, Upload, Send, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/frequenciaResponsavel.css'

const dadosAlunos = {
  1: {
    nome: 'Lucas Costa',
    turma: '8º ano A',
    presencas: 228,
    faltas: 12,
    percentual: 95,
    faltasHistorico: [
      { data: '02/09/2026', disciplina: 'Matemática', horario: '08:00 - 08:50', situacao: 'Não justificada' },
      { data: '04/09/2026', disciplina: 'Português', horario: '09:00 - 09:50', situacao: 'Justificada' },
      { data: '08/09/2026', disciplina: 'Ciências', horario: '10:00 - 10:50', situacao: 'Justificada' },
      { data: '12/09/2026', disciplina: 'Matemática', horario: '08:00 - 08:50', situacao: 'Não justificada' },
      { data: '15/09/2026', disciplina: 'História', horario: '11:00 - 11:50', situacao: 'Em análise' },
    ],
  },
  2: {
    nome: 'Sofia Costa',
    turma: '9º ano B',
    presencas: 234,
    faltas: 6,
    percentual: 97.5,
    faltasHistorico: [
      { data: '03/09/2026', disciplina: 'Geografia', horario: '08:00 - 08:50', situacao: 'Justificada' },
      { data: '10/09/2026', disciplina: 'Matemática', horario: '09:00 - 09:50', situacao: 'Justificada' },
      { data: '14/09/2026', disciplina: 'Inglês', horario: '10:00 - 10:50', situacao: 'Em análise' },
    ],
  },
}

function FrequenciaResponsavel() {
  const [alunoId, setAlunoId] = useState('1')
  const [aba, setAba] = useState('historico')
  const [modalAberto, setModalAberto] = useState(false)
  const [faltas, setFaltas] = useState({
    1: dadosAlunos[1].faltasHistorico,
    2: dadosAlunos[2].faltasHistorico,
  })
  const [dataFalta, setDataFalta] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [motivo, setMotivo] = useState('')
  const [arquivo, setArquivo] = useState(null)
  const [mensagem, setMensagem] = useState('')

  const aluno = dadosAlunos[alunoId]
  const historico = faltas[alunoId]

  function enviarJustificativa(e) {
    e.preventDefault()

    if (!dataFalta || !disciplina || !motivo.trim()) {
      setMensagem('Preencha todos os campos obrigatórios.')
      return
    }

    const novaFalta = {
      data: dataFalta.split('-').reverse().join('/'),
      disciplina,
      horario: 'Não informado',
      situacao: 'Em análise',
      motivo,
      comprovante: arquivo?.name || null,
    }

    setFaltas((anterior) => ({
      ...anterior,
      [alunoId]: [novaFalta, ...anterior[alunoId]],
    }))

    setDataFalta('')
    setDisciplina('')
    setMotivo('')
    setArquivo(null)
    setMensagem('Justificativa registrada com sucesso! (Demonstração)')
    setAba('justificativas')
  }

  return (
    <div className="resp-frequencia-layout">
      <BarraLateral />

      <main className="resp-frequencia-main">
        <header className="resp-frequencia-topbar">
          <span>Portal do Responsável / Frequência e faltas</span>
          <div className="resp-frequencia-perfil">
            <div className="resp-frequencia-avatar">AC</div>
            <div><strong>Responsável</strong><span>Portal da família</span></div>
          </div>
        </header>

        <div className="resp-frequencia-conteudo">
          <section className="resp-frequencia-titulo">
            <div>
              <span className="resp-frequencia-subtitulo">ACOMPANHAMENTO ESCOLAR</span>
              <h1>Frequência e faltas</h1>
              <p>Consulte a presença do aluno e acompanhe suas justificativas.</p>
            </div>
            <button type="button" onClick={() => { setMensagem(''); setModalAberto(true) }}>
              <FileText size={16} /> Justificar falta
            </button>
          </section>

          <section className="resp-frequencia-seletor">
            <label htmlFor="resp-frequencia-aluno">Aluno selecionado</label>
            <select id="resp-frequencia-aluno" value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
              <option value="1">Lucas Costa · 8º ano A</option>
              <option value="2">Sofia Costa · 9º ano B</option>
            </select>
            <span>Ano letivo de 2026</span>
          </section>

          <section className="resp-frequencia-indicadores">
            <article>
              <div className="resp-frequencia-icone azul"><CalendarCheck size={20} /></div>
              <span>Frequência acumulada</span>
              <strong>{aluno.percentual.toLocaleString('pt-BR')}%</strong>
              <small>Presença no ano letivo</small>
            </article>
            <article>
              <div className="resp-frequencia-icone verde"><CheckCircle2 size={20} /></div>
              <span>Presenças registradas</span>
              <strong>{aluno.presencas}</strong>
              <small>Aulas frequentadas</small>
            </article>
            <article>
              <div className="resp-frequencia-icone laranja"><AlertCircle size={20} /></div>
              <span>Total de faltas</span>
              <strong>{aluno.faltas}</strong>
              <small>Ausências registradas</small>
            </article>
            <article>
              <div className="resp-frequencia-icone roxo"><Clock size={20} /></div>
              <span>Justificativas pendentes</span>
              <strong>{historico.filter((item) => item.situacao === 'Em análise').length}</strong>
              <small>Aguardando análise</small>
            </article>
          </section>

          <section className="resp-frequencia-painel resp-frequencia-resumo">
            <div className="resp-frequencia-painel-titulo">
              <div>
                <h2>Resumo da frequência</h2>
                <p>Percentual de presença de {aluno.nome}</p>
              </div>
              <strong>{aluno.percentual.toLocaleString('pt-BR')}%</strong>
            </div>

            <div className="resp-frequencia-barra-fundo">
              <div style={{ width: `${aluno.percentual}%` }} />
            </div>

            <div className="resp-frequencia-resumo-legenda">
              <span><i className="presenca" /> Presenças ({aluno.presencas})</span>
              <span><i className="falta" /> Faltas ({aluno.faltas})</span>
              <span className="resp-frequencia-minimo">Referência mínima: 75%</span>
            </div>

            {aluno.percentual < 75 ? (
              <div className="resp-frequencia-aviso critico">
                <AlertCircle size={17} />
                <span>A frequência está abaixo da referência mínima de 75%. Procure a coordenação.</span>
              </div>
            ) : (
              <div className="resp-frequencia-aviso positivo">
                <CheckCircle2 size={17} />
                <span>A frequência está acima da referência mínima de 75%.</span>
              </div>
            )}
          </section>

          <section className="resp-frequencia-painel">
            <div className="resp-frequencia-painel-titulo">
              <div>
                <h2>Acompanhamento de ausências</h2>
                <p>Consulte os registros e as justificativas do aluno.</p>
              </div>
            </div>

            <div className="resp-frequencia-abas">
              <button className={aba === 'historico' ? 'ativa' : ''} onClick={() => setAba('historico')}>
                Histórico de faltas
              </button>
              <button className={aba === 'justificativas' ? 'ativa' : ''} onClick={() => setAba('justificativas')}>
                Justificativas
              </button>
            </div>

            {aba === 'historico' && (
              <div className="resp-frequencia-tabela-scroll">
                <table className="resp-frequencia-tabela">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Disciplina</th>
                      <th>Horário</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <tr key={`${item.data}-${item.disciplina}-${index}`}>
                        <td>{item.data}</td>
                        <td>{item.disciplina}</td>
                        <td>{item.horario}</td>
                        <td>
                          <span className={`resp-frequencia-status ${item.situacao === 'Justificada' ? 'justificada' : item.situacao === 'Em análise' ? 'analise' : 'pendente'}`}>
                            {item.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {aba === 'justificativas' && (
              <div className="resp-frequencia-justificativas">
                {historico.filter((item) => item.motivo || item.situacao !== 'Não justificada').map((item, index) => (
                  <article key={`${item.data}-${index}`}>
                    <div className="resp-frequencia-justificativa-icone"><FileText size={18} /></div>
                    <div>
                      <strong>{item.disciplina} · {item.data}</strong>
                      <p>{item.motivo || 'Justificativa registrada no sistema.'}</p>
                      {item.comprovante && <small>Comprovante: {item.comprovante}</small>}
                    </div>
                    <span className={`resp-frequencia-status ${item.situacao === 'Justificada' ? 'justificada' : 'analise'}`}>
                      {item.situacao}
                    </span>
                  </article>
                ))}

                {historico.every((item) => !item.motivo && item.situacao === 'Não justificada') && (
                  <p className="resp-frequencia-vazio">Nenhuma justificativa registrada.</p>
                )}

                <button className="resp-frequencia-nova-justificativa" onClick={() => { setMensagem(''); setModalAberto(true) }}>
                  <FileText size={16} /> Nova justificativa
                </button>
              </div>
            )}
          </section>

          <footer className="resp-frequencia-rodape">
            EduGest · Dados demonstrativos · Ambiente de demonstração
          </footer>
        </div>
      </main>

      {modalAberto && (
        <div className="resp-frequencia-modal-fundo" onClick={() => setModalAberto(false)}>
          <section className="resp-frequencia-modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <div>
                <h2>Justificar ausência</h2>
                <p>Preencha as informações para registrar uma justificativa.</p>
              </div>
              <button type="button" aria-label="Fechar" onClick={() => setModalAberto(false)}><X size={19} /></button>
            </header>

            <form onSubmit={enviarJustificativa}>
              <label>
                Aluno
                <input value={aluno.nome} disabled />
              </label>
              <label>
                Data da falta *
                <input type="date" value={dataFalta} onChange={(e) => setDataFalta(e.target.value)} required />
              </label>
              <label>
                Disciplina *
                <select value={disciplina} onChange={(e) => setDisciplina(e.target.value)} required>
                  <option value="">Selecione a disciplina</option>
                  {['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês'].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Motivo da ausência *
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Descreva o motivo da ausência..." required rows={4} />
              </label>
              <label className="resp-frequencia-upload">
                <Upload size={18} />
                <span>{arquivo ? arquivo.name : 'Anexar comprovante (opcional)'}</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
              </label>

              {mensagem && <p className="resp-frequencia-mensagem">{mensagem}</p>}

              <div className="resp-frequencia-modal-acoes">
                <button type="button" className="cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                <button type="submit" className="enviar"><Send size={15} /> Registrar justificativa</button>
              </div>
              <small>Ambiente demonstrativo: o registro não será enviado à escola.</small>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default FrequenciaResponsavel