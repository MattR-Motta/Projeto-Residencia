import { useState } from 'react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/Coordenador.css'

const eventosIniciais = [
  {
    id: 1,
    titulo: 'Início do semestre letivo',
    data: '2026-10-05',
    tipo: 'Acadêmico',
    descricao: 'Início das atividades do semestre.',
  },
  {
    id: 2,
    titulo: 'Reunião pedagógica',
    data: '2026-10-12',
    tipo: 'Reunião',
    descricao: 'Reunião com os docentes e a coordenação.',
  },
  {
    id: 3,
    titulo: 'Prazo para lançamento de notas',
    data: '2026-10-20',
    tipo: 'Prazo',
    descricao: 'Data limite para registrar as notas dos alunos.',
  },
  {
    id: 4,
    titulo: 'Conselho de classe',
    data: '2026-10-23',
    tipo: 'Reunião',
    descricao: 'Análise do desempenho das turmas.',
  },
  {
    id: 5,
    titulo: 'Feriado escolar',
    data: '2026-10-28',
    tipo: 'Feriado',
    descricao: 'Não haverá atividades letivas.',
  },
]

const tiposEvento = ['Acadêmico', 'Reunião', 'Prazo', 'Feriado']

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function obterDataLocal(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

function Calendario() {
  const hoje = new Date()

  const [mesAtual, setMesAtual] = useState(hoje.getMonth())
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear())
  const [eventos, setEventos] = useState(eventosIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [mensagem, setMensagem] = useState('')

  const [formulario, setFormulario] = useState({
    titulo: '',
    data: '',
    tipo: 'Acadêmico',
    descricao: '',
  })

  function mudarMes(direcao) {
    const novaData = new Date(anoAtual, mesAtual + direcao, 1)
    setMesAtual(novaData.getMonth())
    setAnoAtual(novaData.getFullYear())
  }

  function abrirNovoEvento(dia = null) {
    setEventoSelecionado(null)
    setMensagem('')

    setFormulario({
      titulo: '',
      data: dia
        ? `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
        : `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-01`,
      tipo: 'Acadêmico',
      descricao: '',
    })

    setModalAberto(true)
  }

  function abrirEdicao(evento) {
    setEventoSelecionado(evento)
    setFormulario({
      titulo: evento.titulo,
      data: evento.data,
      tipo: evento.tipo,
      descricao: evento.descricao,
    })
    setMensagem('')
    setModalAberto(true)
  }

  function salvarEvento(e) {
    e.preventDefault()

    if (!formulario.titulo.trim() || !formulario.data) {
      setMensagem('Preencha o título e a data do evento.')
      return
    }

    if (eventoSelecionado) {
      setEventos((anteriores) => anteriores.map((evento) => evento.id === eventoSelecionado.id ? { ...evento, ...formulario } : evento))
    } else {
      setEventos((anteriores) => [...anteriores,{ id: Date.now(), ...formulario },])
    }

    setModalAberto(false)
    setMensagem('')
  }

  function excluirEvento(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir este evento?'
    )

    if (confirmar) {
      setEventos((anteriores) =>
        anteriores.filter((evento) => evento.id !== id)
      )
    }
  }

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay()
  const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate()

  const diasCalendario = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]

  const eventosDoMes = eventos
    .filter((evento) => {
      const data = obterDataLocal(evento.data)
      return (data.getMonth() === mesAtual && data.getFullYear() === anoAtual)
    })
    .sort((a, b) => a.data.localeCompare(b.data))

  function eventosDoDia(dia) {
    const data = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

    return eventos.filter((evento) => evento.data === data)
  }

  return (
    <div className="coordenador-layout">
      <BarraLateral />

      <main className="dashboard-main calendario-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-breadcrumb">
              Coordenador / Calendário
            </span>
            <h1>Calendário acadêmico</h1>
            <p>Organize os eventos e compromissos da instituição.</p>
          </div>

          <button type="button" className="calendario-botao-principal" onClick={() => abrirNovoEvento()}>
            + Novo evento
          </button>
        </header>

        <section className="calendario-painel">
          <div className="calendario-controles">
            <div>
              <h2>
                {nomesMeses[mesAtual]} de {anoAtual}
              </h2>
              <p>{eventosDoMes.length}{' '} {eventosDoMes.length === 1 ? 'evento neste mês' : 'eventos neste mês'}</p>
            </div>

            <div className="calendario-navegacao">
              <button type="button" onClick={() => mudarMes(-1)} aria-label="Mês anterior">
                ‹
              </button>

              <button type="button" onClick={() => {setMesAtual(hoje.getMonth()); setAnoAtual(hoje.getFullYear())}}>
                Hoje
              </button>

              <button type="button" onClick={() => mudarMes(1)} aria-label="Próximo mês">
                ›
              </button>
            </div>
          </div>

          <div className="calendario-grade">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(
              (dia) => (
                <div className="calendario-dia-semana" key={dia}>
                  {dia}
                </div>
              )
            )}

            {diasCalendario.map((dia, indice) => {
              if (dia === null) {
                return (<div className="calendario-celula vazia" key={`vazia-${indice}`}/>)
              }

              const eventosDia = eventosDoDia(dia)

              const ehHoje = dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()

              return (
                <div className={`calendario-celula ${ehHoje ? 'dia-hoje' : ''}`} key={dia}>
                  <div className="calendario-numero-dia">
                    <span>{dia}</span>

                    <button type="button" className="calendario-adicionar-dia"
                      onClick={() => abrirNovoEvento(dia)} aria-label={`Adicionar evento no dia ${dia}`} title="Adicionar evento">
                      +
                    </button>
                  </div>

                  <div className="calendario-eventos-dia">
                    {eventosDia.map((evento) => (
                      <button type="button" key={evento.id} className={`calendario-evento tipo-${evento.tipo.toLowerCase()}`}
                        onClick={() => abrirEdicao(evento)} title={`${evento.titulo} — clique para editar`}>
                        {evento.titulo}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="calendario-legenda">
            {tiposEvento.map((tipo) => (
              <span key={tipo}>
                <i className={`legenda-cor tipo-${tipo.toLowerCase()}`} />
                {tipo}
              </span>
            ))}
          </div>
        </section>

        <section className="calendario-lista">
          <div className="calendario-lista-cabecalho">
            <div>
              <h2>Eventos do mês</h2>
              <p>Consulte e gerencie os próximos compromissos.</p>
            </div>
          </div>

          {eventosDoMes.length === 0 ? (
            <div className="calendario-vazio">
              Nenhum evento cadastrado para este mês.
            </div>
          ) : (
            <div className="calendario-lista-itens">
              {eventosDoMes.map((evento) => (
                <article className="calendario-lista-item" key={evento.id}>
                  <div className="calendario-data-evento">
                    <strong>{formatarData(evento.data).slice(0, 2)}</strong>
                    <span>{nomesMeses[Number(evento.data.slice(5, 7)) - 1].slice(0, 3)}</span>
                  </div>

                  <div className="calendario-info-evento">
                    <strong>{evento.titulo}</strong>
                    <span>{evento.descricao || 'Sem descrição.'}</span>
                  </div>

                  <span className={`calendario-etiqueta tipo-${evento.tipo.toLowerCase()}`}>{evento.tipo}</span>

                  <div className="calendario-acoes-evento">
                    <button type="button" onClick={() => abrirEdicao(evento)}>Editar</button>
                    <button type="button" onClick={() => excluirEvento(evento.id)}>Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {modalAberto && (
        <div className="calendario-modal-fundo" onMouseDown={(e) => {if (e.target === e.currentTarget) {setModalAberto(false)}}}>
          <section className="calendario-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-calendario">
            <div className="calendario-modal-cabecalho">
              <div>
                <h2 id="titulo-modal-calendario">
                  {eventoSelecionado ? 'Editar evento' : 'Novo evento'}
                </h2>
                <p>Preencha os dados do compromisso acadêmico.</p>
              </div>

              <button type="button" onClick={() => setModalAberto(false)} aria-label="Fechar">×</button>
            </div>

            <form onSubmit={salvarEvento}>
              <label htmlFor="evento-titulo">Título do evento *</label>
              <input id="evento-titulo" type="text" value={formulario.titulo}
                onChange={(e) => setFormulario({...formulario, titulo: e.target.value,})} placeholder="Ex.: Reunião pedagógica" required/>

              <label htmlFor="evento-data">Data *</label>
              <input id="evento-data" type="date" value={formulario.data}
                onChange={(e) => setFormulario({...formulario, data: e.target.value,})} required
              />

              <label htmlFor="evento-tipo">Categoria</label>
              <select id="evento-tipo" value={formulario.tipo}
                onChange={(e) => setFormulario({...formulario,tipo: e.target.value,})}>
                {tiposEvento.map((tipo) => (<option key={tipo} value={tipo}>{tipo}</option>))}
              </select>

              <label htmlFor="evento-descricao">Descrição</label>
              <textarea id="evento-descricao" rows="3" value={formulario.descricao}
                onChange={(e) => setFormulario({...formulario, descricao: e.target.value,})} placeholder="Detalhes adicionais sobre o evento"/>

              {mensagem && (<p className="calendario-mensagem-erro">{mensagem}</p>
              )}

              <div className="calendario-modal-acoes">
                <button type="button" className="calendario-botao-secundario" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>

                <button type="submit" className="calendario-botao-principal">Salvar evento</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Calendario