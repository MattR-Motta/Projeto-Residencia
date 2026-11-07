
import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, CalendarDays, Clock,
  MapPin, BookOpen, Users, ClipboardCheck
} from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/calendarioResponsavel.css'

const eventos = [
  { data: '2026-10-07', titulo: 'Avaliação de Matemática', tipo: 'avaliacao', horario: '08:00', local: 'Sala de aula', aluno: 'Lucas Costa', descricao: 'Avaliação sobre equações e proporcionalidade.' },
  { data: '2026-10-08', titulo: 'Entrega de atividade de Geografia', tipo: 'atividade', horario: '10:00', local: 'Sala de aula', aluno: 'Lucas Costa', descricao: 'Entrega do mapa das bacias hidrográficas.' },
  { data: '2026-10-09', titulo: 'Avaliação de Ciências', tipo: 'avaliacao', horario: '09:00', local: 'Sala de aula', aluno: 'Sofia Costa', descricao: 'Avaliação sobre ecologia e meio ambiente.' },
  { data: '2026-10-09', titulo: 'Entrega de redação', tipo: 'atividade', horario: '11:00', local: 'Sala de aula', aluno: 'Lucas Costa', descricao: 'Entrega da produção textual de crônica.' },
  { data: '2026-10-12', titulo: 'Feriado nacional', tipo: 'feriado', horario: 'Dia inteiro', local: 'Escola', aluno: 'Todos', descricao: 'Não haverá atividades escolares.' },
  { data: '2026-10-15', titulo: 'Reunião de responsáveis', tipo: 'reuniao', horario: '18:30', local: 'Auditório da escola', aluno: 'Todos', descricao: 'Encontro entre responsáveis, professores e coordenação.' },
  { data: '2026-10-20', titulo: 'Avaliação de História', tipo: 'avaliacao', horario: '08:00', local: 'Sala de aula', aluno: 'Sofia Costa', descricao: 'Avaliação sobre os conteúdos do bimestre.' },
  { data: '2026-10-23', titulo: 'Projeto interdisciplinar', tipo: 'atividade', horario: '13:00', local: 'Pátio escolar', aluno: 'Lucas Costa', descricao: 'Apresentação dos trabalhos interdisciplinares.' },
  { data: '2026-10-28', titulo: 'Conselho de classe', tipo: 'reuniao', horario: '14:00', local: 'Sala da coordenação', aluno: 'Todos', descricao: 'Reunião pedagógica de acompanhamento das turmas.' },
]

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const filtros = [
  { id: 'todos', nome: 'Todos os eventos' },
  { id: 'avaliacao', nome: 'Avaliações' },
  { id: 'atividade', nome: 'Atividades' },
  { id: 'reuniao', nome: 'Reuniões' },
  { id: 'feriado', nome: 'Feriados' },
]

const icones = {
  avaliacao: ClipboardCheck,
  atividade: BookOpen,
  reuniao: Users,
  feriado: CalendarDays,
}

function CalendarioResponsavel() {
  const [mes, setMes] = useState(9)
  const [ano, setAno] = useState(2026)
  const [filtro, setFiltro] = useState('todos')
  const [dataSelecionada, setDataSelecionada] = useState('2026-10-07')
  const [aluno, setAluno] = useState('todos')

  const primeiroDia = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()

  const eventosFiltrados = eventos.filter((evento) => {
    const correspondeTipo = filtro === 'todos' || evento.tipo === filtro
    const correspondeAluno = aluno === 'todos' || evento.aluno === 'Todos' || evento.aluno === aluno
    return correspondeTipo && correspondeAluno
  })

  const eventosDoDia = eventosFiltrados.filter((evento) => evento.data === dataSelecionada)

  function mudarMes(direcao) {
    let novoMes = mes + direcao
    let novoAno = ano

    if (novoMes < 0) {
      novoMes = 11
      novoAno--
    } else if (novoMes > 11) {
      novoMes = 0
      novoAno++
    }

    setMes(novoMes)
    setAno(novoAno)
    setDataSelecionada(`${novoAno}-${String(novoMes + 1).padStart(2, '0')}-01`)
  }

  function selecionarDia(dia) {
    setDataSelecionada(`${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
  }

  function eventosDoMes(dia) {
    const data = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return eventosFiltrados.filter((evento) => evento.data === data)
  }

  function formatarData(data) {
    const [y, m, d] = data.split('-')
    return `${d}/${m}/${y}`
  }

  const dias = Array.from({ length: primeiroDia + totalDias }, (_, index) =>
    index < primeiroDia ? null : index - primeiroDia + 1
  )

  return (
    <div className="resp-calendario-layout">
      <BarraLateral />

      <main className="resp-calendario-main">
        <header className="resp-calendario-topbar">
          <span>Portal do Responsável / Calendário acadêmico</span>
          <div className="resp-calendario-perfil">
            <div className="resp-calendario-avatar">AC</div>
            <div><strong>Responsável</strong><span>Portal da família</span></div>
          </div>
        </header>

        <div className="resp-calendario-conteudo">
          <section className="resp-calendario-titulo">
            <div>
              <span className="resp-calendario-subtitulo">ORGANIZAÇÃO ESCOLAR</span>
              <h1>Calendário acadêmico</h1>
              <p>Acompanhe avaliações, atividades, reuniões e datas importantes.</p>
            </div>
          </section>

          <section className="resp-calendario-filtros">
            <label>
              Aluno
              <select value={aluno} onChange={(e) => setAluno(e.target.value)}>
                <option value="todos">Todos os alunos</option>
                <option value="Lucas Costa">Lucas Costa</option>
                <option value="Sofia Costa">Sofia Costa</option>
              </select>
            </label>

            <label>
              Tipo de evento
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                {filtros.map((item) => (
                  <option key={item.id} value={item.id}>{item.nome}</option>
                ))}
              </select>
            </label>
          </section>

          <div className="resp-calendario-grid">
            <section className="resp-calendario-painel">
              <div className="resp-calendario-navegacao">
                <div>
                  <h2>{meses[mes]} {ano}</h2>
                  <p>Agenda acadêmica</p>
                </div>
                <div className="resp-calendario-setas">
                  <button type="button" aria-label="Mês anterior" onClick={() => mudarMes(-1)}><ChevronLeft size={19} /></button>
                  <button type="button" aria-label="Próximo mês" onClick={() => mudarMes(1)}><ChevronRight size={19} /></button>
                </div>
              </div>

              <div className="resp-calendario-semana">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                  <span key={dia}>{dia}</span>
                ))}
              </div>

              <div className="resp-calendario-dias">
                {dias.map((dia, index) => {
                  if (!dia) return <div className="resp-calendario-dia vazio" key={`vazio-${index}`} />

                  const data = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                  const eventosDia = eventosDoMes(dia)
                  const selecionado = data === dataSelecionada

                  return (
                    <button
                      type="button"
                      key={data}
                      className={`resp-calendario-dia ${selecionado ? 'selecionado' : ''} ${eventosDia.length ? 'com-evento' : ''}`}
                      onClick={() => selecionarDia(dia)}
                    >
                      <span>{dia}</span>
                      <div className="resp-calendario-marcadores">
                        {eventosDia.slice(0, 3).map((evento, i) => (
                          <i key={i} className={evento.tipo} />
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="resp-calendario-legenda">
                <span><i className="avaliacao" /> Avaliações</span>
                <span><i className="atividade" /> Atividades</span>
                <span><i className="reuniao" /> Reuniões</span>
                <span><i className="feriado" /> Feriados</span>
              </div>
            </section>

            <section className="resp-calendario-painel resp-calendario-agenda">
              <div className="resp-calendario-agenda-titulo">
                <div>
                  <h2>Compromissos do dia</h2>
                  <p>{formatarData(dataSelecionada)}</p>
                </div>
                <CalendarDays size={20} />
              </div>

              {eventosDoDia.length > 0 ? (
                <div className="resp-calendario-eventos">
                  {eventosDoDia.map((evento, index) => {
                    const Icon = icones[evento.tipo]
                    return (
                      <article key={`${evento.titulo}-${index}`} className="resp-calendario-evento">
                        <div className={`resp-calendario-evento-icone ${evento.tipo}`}>
                          <Icon size={18} />
                        </div>
                        <div className="resp-calendario-evento-info">
                          <span className={`resp-calendario-tipo ${evento.tipo}`}>
                            {filtros.find((item) => item.id === evento.tipo)?.nome}
                          </span>
                          <strong>{evento.titulo}</strong>
                          <p>{evento.descricao}</p>
                          <small><Clock size={12} /> {evento.horario}</small>
                          <small><MapPin size={12} /> {evento.local}</small>
                          <small><Users size={12} /> {evento.aluno}</small>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="resp-calendario-vazio">
                  <CalendarDays size={30} />
                  <strong>Nenhum compromisso encontrado</strong>
                  <p>Não há eventos para esta data com os filtros selecionados.</p>
                </div>
              )}
            </section>
          </div>

          <section className="resp-calendario-proximos resp-calendario-painel">
            <div className="resp-calendario-agenda-titulo">
              <div>
                <h2>Próximos eventos</h2>
                <p>Compromissos acadêmicos programados</p>
              </div>
            </div>

            <div className="resp-calendario-lista-proximos">
              {eventosFiltrados
                .filter((evento) => evento.data >= `${ano}-${String(mes + 1).padStart(2, '0')}-01`)
                .sort((a, b) => a.data.localeCompare(b.data))
                .slice(0, 5)
                .map((evento, index) => {
                  const Icon = icones[evento.tipo]
                  return (
                    <article key={`${evento.data}-${index}`}>
                      <div className={`resp-calendario-proximo-icone ${evento.tipo}`}><Icon size={17} /></div>
                      <div>
                        <strong>{evento.titulo}</strong>
                        <p>{evento.aluno} · {evento.horario}</p>
                      </div>
                      <span>{formatarData(evento.data)}</span>
                    </article>
                  )
                })}
            </div>
          </section>

          <footer className="resp-calendario-rodape">
            EduGest · Dados demonstrativos · Ambiente de demonstração
          </footer>
        </div>
      </main>
    </div>
  )
}

export default CalendarioResponsavel