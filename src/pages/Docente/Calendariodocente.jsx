import { useState } from 'react'
import BarraLateralDocente from '../../components/BarraLateralDocente'
import '../../styles/dashboarddocente.css'
import "../../styles/Calendariodocente.css";

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const mesesCurtos = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
]
const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const nomesModos = { mes: 'Mês', semana: 'Semana', dia: 'Dia' }

// Aulas de exemplo (data no formato ANO-MES-DIA)
const aulas = [
  { data: '2025-05-26', horario: '08:00-08:40', disciplina: 'Matemática', turma: 'Turma 1A', status: 'Confirmada' },
  { data: '2025-05-26', horario: '10:00-11:40', disciplina: 'Matemática', turma: 'Turma 2B', status: 'Confirmada' },
  { data: '2025-05-26', horario: '14:00-15:40', disciplina: 'Português', turma: 'Turma 2A', status: 'Confirmada' },
  { data: '2025-05-26', horario: '16:00-17:40', disciplina: 'História', turma: 'Turma 1B', status: 'Confirmada' },
  { data: '2025-05-27', horario: '08:00-08:40', disciplina: 'Matemática', turma: 'Turma 1A', status: 'Confirmada' },
  { data: '2025-05-28', horario: '10:00-11:00', disciplina: 'Português', turma: 'Turma 3A', status: 'Confirmada' },
  { data: '2025-05-29', horario: '14:00-15:40', disciplina: 'História', turma: 'Turma 2C', status: 'Confirmada' },
  { data: '2025-05-30', horario: '08:00-09:40', disciplina: 'Matemática', turma: 'Turma 2B', status: 'Confirmada' },
  { data: '2025-06-02', horario: '10:00-11:40', disciplina: 'Português', turma: 'Turma 2A', status: 'Confirmada' },
]

// Transforma uma data em texto "2025-05-26" pra comparar com a lista de aulas
function criarChave(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return data.getFullYear() + '-' + mes + '-' + dia
}

function aulasDoDia(chave) {
  return aulas.filter((aula) => aula.data === chave)
}

function CalendarioDocente() {
  // Dia selecionado (começa em 26/05/2025 igual ao protótipo)
  const [dataSelecionada, setDataSelecionada] = useState(new Date(2025, 4, 26))
  // Tipo de visualização: 'mes', 'semana' ou 'dia'
  const [modo, setModo] = useState('mes')

  const ano = dataSelecionada.getFullYear()
  const mes = dataSelecionada.getMonth()
  const dia = dataSelecionada.getDate()
  const chaveSelecionada = criarChave(dataSelecionada)

  // Início e fim da semana do dia selecionado
  const inicioSemana = new Date(ano, mes, dia - dataSelecionada.getDay())
  const fimSemana = new Date(ano, mes, dia - dataSelecionada.getDay() + 6)

  // Setas: andam um mês, uma semana ou um dia, dependendo do modo
  function mover(direcao) {
    if (modo === 'mes') {
      setDataSelecionada(new Date(ano, mes + direcao, 1))
    } else if (modo === 'semana') {
      setDataSelecionada(new Date(ano, mes, dia + 7 * direcao))
    } else {
      setDataSelecionada(new Date(ano, mes, dia + direcao))
    }
  }

  // Clicar num card de "Próximos dias" abre aquele dia
  function irParaData(textoData) {
    const partes = textoData.split('-')
    setDataSelecionada(new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2])))
    setModo('dia')
  }

  function textoTitulo() {
    if (modo === 'mes') {
      return nomesMeses[mes] + ' de ' + ano
    }
    if (modo === 'semana') {
      return (
        inicioSemana.getDate() + '/' + (inicioSemana.getMonth() + 1) +
        ' a ' +
        fimSemana.getDate() + '/' + (fimSemana.getMonth() + 1)
      )
    }
    return dia + ' de ' + nomesMeses[mes].toLowerCase() + ' de ' + ano
  }

  // Células do mês: espaços vazios antes do dia 1 + os dias do mês
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const celulas = []
  for (let i = 0; i < primeiroDiaSemana; i++) {
    celulas.push(null)
  }
  for (let d = 1; d <= totalDias; d++) {
    celulas.push(d)
  }

  // Próximas 3 aulas depois do dia selecionado
  const proximos = aulas
    .filter((aula) => aula.data > chaveSelecionada)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3)

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

        <h1 className="cal-titulo-pagina">Meu calendário</h1>

        <section className="docente-card cal-calendario">
          {/* Cabeçalho: setas, título e botões Mês/Semana/Dia */}
          <div className="cal-cabecalho">
            <div className="cal-navegacao">
              <button className="cal-seta" aria-label="Anterior" onClick={() => mover(-1)}>
                ‹
              </button>
              <strong>{textoTitulo()}</strong>
              <button className="cal-seta" aria-label="Próximo" onClick={() => mover(1)}>
                ›
              </button>
            </div>

            <div className="cal-modos">
              {['mes', 'semana', 'dia'].map((opcao) => (
                <button
                  key={opcao}
                  className={modo === opcao ? 'cal-modo ativo' : 'cal-modo'}
                  onClick={() => setModo(opcao)}
                >
                  {nomesModos[opcao]}
                </button>
              ))}
            </div>
          </div>

          {/* Visualização por mês */}
          {modo === 'mes' && (
            <div>
              <div className="cal-grade cal-nomes-dias">
                {diasSemana.map((nome) => (
                  <span key={nome}>{nome}</span>
                ))}
              </div>

              <div className="cal-grade">
                {celulas.map((numero, indice) => {
                  if (numero === null) {
                    return <div className="cal-celula vazia" key={'vazio' + indice}></div>
                  }

                  const data = new Date(ano, mes, numero)
                  const chave = criarChave(data)
                  const selecionado = chave === chaveSelecionada
                  const temAula = aulasDoDia(chave).length > 0

                  return (
                    <button
                      key={chave}
                      className="cal-celula"
                      onClick={() => setDataSelecionada(data)}
                    >
                      <span className={selecionado ? 'cal-numero selecionado' : 'cal-numero'}>
                        {numero}
                      </span>
                      {temAula && <span className="cal-ponto"></span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Visualização por semana */}
          {modo === 'semana' && (
            <div className="cal-grade">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const data = new Date(
                  inicioSemana.getFullYear(),
                  inicioSemana.getMonth(),
                  inicioSemana.getDate() + i
                )
                const chave = criarChave(data)
                const selecionado = chave === chaveSelecionada

                return (
                  <div className="cal-coluna-semana" key={chave}>
                    <span className="cal-nome-semana">{diasSemana[i]}</span>
                    <button
                      className={selecionado ? 'cal-numero selecionado' : 'cal-numero'}
                      onClick={() => setDataSelecionada(data)}
                    >
                      {data.getDate()}
                    </button>
                    {aulasDoDia(chave).map((aula) => (
                      <div className="cal-mini-aula" key={aula.horario}>
                        {aula.horario.slice(0, 5)} {aula.disciplina}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* Visualização por dia */}
          {modo === 'dia' && (
            <div className="cal-dia">
              {aulasDoDia(chaveSelecionada).length === 0 ? (
                <p className="cal-vazio">Nenhuma aula neste dia.</p>
              ) : (
                aulasDoDia(chaveSelecionada).map((aula) => (
                  <div className="cal-aula-dia" key={aula.horario}>
                    <span className="cal-horario">{aula.horario}</span>
                    <strong>{aula.disciplina}</strong>
                    <span className="cal-turma">{aula.turma}</span>
                    <span className="cal-status">{aula.status}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Próximos dias */}
        <section className="cal-proximos">
          <h2>Próximos dias</h2>

          <div className="cal-proximos-lista">
            {proximos.length === 0 && (
              <p className="cal-vazio">Nenhuma aula marcada para os próximos dias.</p>
            )}

            {proximos.map((aula) => {
              const partes = aula.data.split('-')
              return (
                <button
                  key={aula.data + aula.horario}
                  className="cal-proximo"
                  onClick={() => irParaData(aula.data)}
                >
                  <span className="cal-proximo-data">
                    {Number(partes[2])} {mesesCurtos[Number(partes[1]) - 1]}
                  </span>
                  <span className="cal-proximo-info">
                    <span className="cal-horario">{aula.horario}</span>
                    <strong>{aula.disciplina} · {aula.turma}</strong>
                  </span>
                  <span className="cal-status">{aula.status}</span>
                </button>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CalendarioDocente