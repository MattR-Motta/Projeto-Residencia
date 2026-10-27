import { NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CalendarClock,
  Bell,
  Settings,
  ClipboardList,
  LayoutDashboard,
  School,
  FileText,
  Network,
  GraduationCap,
} from 'lucide-react'
import '../styles/barraLateral.css'

import iconeDashboard from '../assets/dashboard.png'
import iconeTurmas from '../assets/turmas.png'
import iconeCalendario from '../assets/calendario.png'
import iconeCoordenador from '../assets/coordenador.png'
import iconeAulas from '../assets/aulas.png'
import iconeDocente from '../assets/docente.png'


function BarraLateral() {
  const navigate = useNavigate()

  let usuario = null

  try {
    usuario = JSON.parse(
      localStorage.getItem('usuarioEduGest') || 'null'
    )
  } catch {
    // Mantém o perfil padrão caso os dados sejam inválidos.
  }

  const perfil = usuario?.perfil?.toLowerCase() || 'coordenador'
  const ehGestor = perfil === 'gestor'
  const ehDocente = perfil === 'docente'

  const nomeUsuario =
    usuario?.nome ||
    (ehGestor ? 'Gestor' : ehDocente ? 'Docente' : 'Coordenador')

  const linksGestor = [
    { to: '/gestor', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/gestor/escolas', label: 'Escolas', Icon: School },
    { to: '/gestor/portarias', label: 'Portarias', Icon: FileText },
    { to: '/gestor/estrutura', label: 'Estrutura', Icon: Network },
    { to: '/gestor/grades', label: 'Grades', Icon: GraduationCap },
  ]

  const linksCoordenador = [
    { to: '/coordenador', label: 'Dashboard', icon: iconeDashboard, end: true },
    { to: '/coordenador/turmas', label: 'Turmas', icon: iconeTurmas },
    { to: '/coordenador/calendario', label: 'Calendário', icon: iconeCalendario },
    {
      to: '/coordenador/disciplinas-ementas',
      label: 'Disciplinas e Ementas',
      Icon: BookOpen,
    },
    {
      to: '/coordenador/aulas-reposicoes',
      label: 'Aulas e Reposições',
      Icon: CalendarClock,
    },
    {
      to: '/coordenador/solicitacoes',
      label: 'Solicitações',
      Icon: ClipboardList,
    },
    {
      to: '/coordenador/notificacoes',
      label: 'Notificações',
      Icon: Bell,
    },

    {
      to: '/coordenador/configuracoes',
      label: 'Configurações',
      Icon: Settings,
    },
  ]

  const linksDocente = [
    { to: '/docente', label: 'Início', icon: iconeDashboard, end: true },
    {
      to: '/docente/calendario',
      label: 'Meu calendário',
      icon: iconeCalendario,
    },
    {
      label: 'Minhas turmas',
      icon: iconeTurmas,
      disabled: true,
    },
    {
      to: '/docente/disciplinas',
      label: 'Minhas disciplinas',
      Icon: BookOpen,
    },
    {
      to: '/docente/aulas',
      label: 'Aulas e frequência',
      icon: iconeAulas,
    },
    {
      label: 'Aulas e frequência',
      icon: iconeAulas,
      disabled: true,
    },
  ]

  const links = ehGestor
    ? linksGestor
    : ehDocente
      ? linksDocente
      : linksCoordenador

  const iconePerfil = ehGestor
    ? iconeDashboard
    : ehDocente
      ? iconeDocente
      : iconeCoordenador

  const nomePerfil = ehGestor
    ? 'Gestor da rede'
    : ehDocente
      ? 'Docente'
      : 'Coordenador'

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

      {ehDocente && (
        <span className="eg-sidebar__section-title">
          MENU PRINCIPAL
        </span>
      )}

      <nav
        className="eg-sidebar__nav"
        aria-label="Navegação principal"
      >
        {links.map((link) => {
          const Icone = link.Icon

          if (link.disabled) {
            return (
              <span
                key={link.label}
                className="eg-sidebar__link eg-sidebar__link--disabled"
                title="Em breve"
                aria-disabled="true"
              >
                <img
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="eg-sidebar__icon"
                />
                <span className="eg-sidebar__label">
                  {link.label}
                </span>
              </span>
            )
          }

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `eg-sidebar__link${isActive ? ' eg-sidebar__link--active' : ''}`
              }
            >
              {link.icon ? (
                <img
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="eg-sidebar__icon"
                />
              ) : Icone ? (
                <Icone
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="eg-sidebar__icon"
                />
              ) : null}

              <span className="eg-sidebar__label">
                {link.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="eg-sidebar__footer">
        <img
          src={iconePerfil}
          alt=""
          aria-hidden="true"
          className="eg-sidebar__avatar"
        />

        <div className="eg-sidebar__user">
          <strong>{nomeUsuario}</strong>
          <span>{nomePerfil}</span>
        </div>

        <button
          type="button"
          className="eg-sidebar__logout"
          onClick={sair}
          title="Sair da conta"
          aria-label="Sair da conta"
        >
          ↪
        </button>
      </div>
    </aside>
  )
}

export default BarraLateral