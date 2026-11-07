import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  ChartNoAxesCombined,
  ClipboardCheck,
  CalendarDays,
  BookOpen,
  MessagesSquare,
  UserRound,
  CircleHelp,
  LogOut,
} from 'lucide-react'
import '../../styles/Barra Lateral/barraLateralResponsavel.css'

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioEduGest') || 'null')
  } catch {
    return null
  }
}

function BarraLateral() {
  const navigate = useNavigate()
  const usuario = obterUsuario()

  const links = [
    { to: '/responsavel', label: 'Início', Icon: Home, end: true },
    { to: '/responsavel/desempenho', label: 'Desempenho e boletim', Icon: ChartNoAxesCombined },
    { to: '/responsavel/frequencia', label: 'Frequência e faltas', Icon: ClipboardCheck },
    { to: '/responsavel/calendario', label: 'Calendário acadêmico', Icon: CalendarDays },
  ]

  const linksFuturos = [
    { label: 'Atividades e avaliações', Icon: BookOpen },
    { label: 'Comunicados e mensagens', Icon: MessagesSquare },
    { label: 'Perfil e configurações', Icon: UserRound },
  ]

  function sair() {
    localStorage.removeItem('usuarioEduGest')
    navigate('/login')
  }

  return (
    <aside className="responsavel-sidebar">
      <div className="responsavel-sidebar__marca">
        <div className="responsavel-sidebar__logo">E</div>
        <div>
          <h2>EduGest</h2>
          <span>Gestão Acadêmica Inteligente</span>
        </div>
      </div>

      <div className="responsavel-sidebar__identificacao">
        <strong>PORTAL DO RESPONSÁVEL</strong>
        <span>Família e escola, juntas.</span>
      </div>

      <nav className="responsavel-sidebar__navegacao" aria-label="Menu do responsável">
        {links.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `responsavel-sidebar__link${isActive ? ' ativo' : ''}`
            }
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}

        {linksFuturos.map(({ label, Icon }) => (
          <div
            key={label}
            className="responsavel-sidebar__link responsavel-sidebar__link--futuro"
            aria-disabled="true"
            title="Funcionalidade ainda em desenvolvimento"
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      <div className="responsavel-sidebar__rodape">
        <button type="button" className="responsavel-sidebar__ajuda">
          <CircleHelp size={17} />
          <span>Ajuda da secretaria</span>
        </button>

        <button
          type="button"
          className="responsavel-sidebar__sair"
          onClick={sair}
        >
          <LogOut size={17} />
          <span>Sair da conta</span>
        </button>

        <div className="responsavel-sidebar__instituicao">
          <span>AMBIENTE DE ENSINO</span>
          <strong>SEDUC-SE</strong>
        </div>
      </div>
    </aside>
  )
}
export default BarraLateral