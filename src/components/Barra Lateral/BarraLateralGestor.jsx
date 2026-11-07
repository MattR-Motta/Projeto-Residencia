import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, CalendarClock, Bell, Settings, ClipboardList, LayoutDashboard, School, FileText, Network, GraduationCap } from 'lucide-react'
import '../../styles/Barra Lateral/barraLateralGestor.css'
import iconeDashboard from '../../assets/dashboard.png'
import iconeTurmas from '../../assets/turmas.png'
import iconeCalendario from '../../assets/calendario.png'
import iconeCoordenador from '../../assets/coordenador.png'
import iconeAulas from '../../assets/aulas.png'
import iconeDocente from '../../assets/docente.png'

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
  const nomeUsuario = usuario?.nome || 'Gestor'
  const nomePerfil = 'Gestor'
  const iconePerfil = iconeDashboard

  const links = [
    { to: '/gestor', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/gestor/escolas', label: 'Escolas', Icon: School },
    { to: '/gestor/portarias', label: 'Portarias', Icon: FileText },
    { to: '/gestor/estrutura', label: 'Estrutura', Icon: Network },
    { to: '/gestor/solicitacoes', label: 'Solicitações', Icon: ClipboardList },
    { to: '/gestor/grades', label: 'Grades', Icon: GraduationCap },
    { to: '/gestor/disciplinas', label: 'Disciplinas', Icon: BookOpen },
    { to: '/gestor/optativas', label: 'Optativas', Icon: BookOpen },
  ]

  function sair() {
    localStorage.removeItem('usuarioEduGest')
    navigate('/login')
  }

  return (
    <aside className="eg-sidebar">
      <div className="eg-sidebar__brand">
        <div className="eg-sidebar__logo">E</div>
        <div className="eg-sidebar__brand-text">
          <h2>EduGest</h2>
          <span>Gestão acadêmica</span>
        </div>
      </div>
      <nav className="eg-sidebar__nav" aria-label="Navegação principal">
        {links.map((link) => {
          const Icone = link.Icon
          return (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `eg-sidebar__link${isActive ? ' eg-sidebar__link--active' : ''}`}>
              {link.icon ? (
                <img src={link.icon} alt="" aria-hidden="true" className="eg-sidebar__icon" />
              ) : Icone ? (
                <Icone size={20} strokeWidth={1.8} aria-hidden="true" className="eg-sidebar__icon" />
              ) : null}
              <span className="eg-sidebar__label">{link.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="eg-sidebar__footer">
        <img src={iconePerfil} alt="" aria-hidden="true" className="eg-sidebar__avatar" />
        <div className="eg-sidebar__user">
          <strong>{nomeUsuario}</strong>
          <span>{nomePerfil}</span>
        </div>
        <button type="button" className="eg-sidebar__logout" onClick={sair} title="Sair da conta" aria-label="Sair da conta">↪</button>
      </div>
    </aside>
  )
}

export default BarraLateral