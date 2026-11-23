import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  Info,
  MoreVertical,
} from 'lucide-react'
import BarraLateral from '../../components/Barra Lateral/BarraLateralDocente'
import '../../styles/dashboarddocente.css'
import '../../styles/notificacoesDocente.css'

// Dados de exemplo (depois é só trocar por dados reais)
const notificacoesIniciais = [
  {
    id: 1,
    titulo: 'Reposição aprovada',
    mensagem: 'Sua solicitação de reposição de Matemática — Turma 1A foi aprovada para 18/09, às 10:00.',
    tempo: 'Há 12 min',
    cor: 'verde',
    Icone: CheckCircle2,
    lida: false,
  },
  {
    id: 2,
    titulo: 'Frequência pendente de registro',
    mensagem: 'A aula de Português — Turma 3A de hoje ainda não teve a frequência registrada.',
    tempo: 'Há 38 min',
    cor: 'vermelho',
    Icone: AlertTriangle,
    lida: false,
  },
  {
    id: 3,
    titulo: 'Ementa atualizada pela coordenação',
    mensagem: 'A ementa de Matemática — Turma 1A foi atualizada. Confira as alterações.',
    tempo: 'Hoje, 09:14',
    cor: 'azul',
    Icone: BookOpen,
    lida: false,
  },
  {
    id: 4,
    titulo: 'Atualização do sistema concluída',
    mensagem: 'O EduGest foi atualizado com melhorias no calendário acadêmico.',
    tempo: 'Ontem, 17:40',
    cor: 'azul',
    Icone: Info,
    lida: true,
  },
  {
    id: 5,
    titulo: 'Prazo de lançamento se aproxima',
    mensagem: 'Registre a frequência do bimestre das suas turmas até 18 de setembro.',
    tempo: 'Ontem, 14:22',
    cor: 'amarelo',
    Icone: CalendarDays,
    lida: true,
  },
]
function NotificacoesDocente() {
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais)
  const [aba, setAba] = useState('todas') // 'todas' ou 'naoLidas'
  const [menuAberto, setMenuAberto] = useState(null) // id da notificação com menu aberto

  const naoLidas = notificacoes.filter((item) => !item.lida).length
  const visiveis = aba === 'naoLidas' ? notificacoes.filter((item) => !item.lida) : notificacoes

  // Fecha o menu "⋮" ao clicar fora ou apertar Esc
  useEffect(() => {
    if (menuAberto === null) return

    function aoClicar(evento) {
      if (!evento.target.closest('.nd-menu-area')) setMenuAberto(null)
    }
    function aoApertar(evento) {
      if (evento.key === 'Escape') setMenuAberto(null)
    }

    document.addEventListener('mousedown', aoClicar)
    document.addEventListener('keydown', aoApertar)
    return () => {
      document.removeEventListener('mousedown', aoClicar)
      document.removeEventListener('keydown', aoApertar)
    }
  }, [menuAberto])

  function marcarTodasComoLidas() {
    setNotificacoes((atual) => atual.map((item) => ({ ...item, lida: true })))
  }

  function alternarLida(id) {
    setNotificacoes((atual) =>
      atual.map((item) => (item.id === id ? { ...item, lida: !item.lida } : item)),
    )
    setMenuAberto(null)
  }

  function excluir(id) {
    setNotificacoes((atual) => atual.filter((item) => item.id !== id))
    setMenuAberto(null)
  }

  return (
    <div className="docente-pagina">
      <BarraLateral />

      <main className="docente-conteudo">
        {/* Topo: usuário */}
        <header className="docente-topo nd-topo">
          <div className="docente-usuario">
            <span className="docente-sino">🔔</span>
            <div className="docente-avatar"></div>
            <strong>Joao Silva</strong>
          </div>
        </header>

        {/* Título e botão */}
        <section className="nd-cabecalho">
          <div className="nd-titulo">
            <h1>Notificações</h1>
            <p>
              {naoLidas === 0 ? (
                'Você não tem notificações não lidas'
              ) : (
                <>
                  Você tem{' '}
                  <strong className="nd-destaque">
                    {naoLidas} {naoLidas === 1 ? 'notificação não lida' : 'notificações não lidas'}
                  </strong>
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            className="nd-botao-lidas"
            onClick={marcarTodasComoLidas}
            disabled={naoLidas === 0}
          >
            <CheckCheck size={15} aria-hidden="true" />
            Marcar todas como lidas
          </button>
        </section>

        {/* Abas */}
        <div className="nd-abas" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={aba === 'todas'}
            className={aba === 'todas' ? 'ativa' : ''}
            onClick={() => setAba('todas')}
          >
            Todas <span>{notificacoes.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={aba === 'naoLidas'}
            className={aba === 'naoLidas' ? 'ativa' : ''}
            onClick={() => setAba('naoLidas')}
          >
            Não lidas <span>{naoLidas}</span>
          </button>
        </div>

        {/* Lista */}
        <section className="nd-lista">
          {visiveis.map((item) => {
            const Icone = item.Icone

            return (
              <article
                key={item.id}
                className={'nd-item ' + (item.lida ? 'lida' : 'nao-lida')}
              >
                <span className={'nd-icone ' + item.cor}>
                  <Icone size={18} aria-hidden="true" />
                </span>

                <div className="nd-texto">
                  <h2>
                    {item.titulo}
                    {!item.lida && <span className="nd-ponto" aria-label="Não lida" />}
                  </h2>
                  <p>{item.mensagem}</p>
                </div>

                <span className="nd-tempo">{item.tempo}</span>

                <div className="nd-menu-area">
                  <button
                    type="button"
                    className="nd-menu-botao"
                    aria-label={`Opções de "${item.titulo}"`}
                    aria-haspopup="menu"
                    aria-expanded={menuAberto === item.id}
                    onClick={() => setMenuAberto(menuAberto === item.id ? null : item.id)}
                  >
                    <MoreVertical size={16} aria-hidden="true" />
                  </button>

                  {menuAberto === item.id && (
                    <div className="nd-menu" role="menu">
                      <button type="button" role="menuitem" onClick={() => alternarLida(item.id)}>
                        {item.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="perigo"
                        onClick={() => excluir(item.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}

          {visiveis.length === 0 && (
            <p className="nd-vazio">
              {aba === 'naoLidas'
                ? 'Tudo em dia! Você não tem notificações não lidas.'
                : 'Nenhuma notificação por aqui.'}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default NotificacoesDocente
