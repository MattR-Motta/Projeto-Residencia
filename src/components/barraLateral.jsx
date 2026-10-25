
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CalendarClock,
  Bell,
  Settings,
  ClipboardList,
} from 'lucide-react'

import '../styles/barraLateral.css'

import iconeDashboard from '../assets/dashboard.png'
import iconeTurmas from '../assets/turmas.png'
import iconeCalendario from '../assets/calendario.png'
import iconeCoordenador from '../assets/coordenador.png'


function BarraLateral() {
  const navigate = useNavigate()

  let nomeUsuario = 'Coordenador'

  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuarioEduGest') || 'null'
    )

    if (usuario?.nome) {
      nomeUsuario = usuario.nome
    }
  } catch {
    // Usa o nome padrão se os dados salvos forem inválidos.
  }

  function sair() {
    localStorage.removeItem('usuarioEduGest')
    navigate('/login')
  }

  const links = [
    {
      to: '/coordenador',
      label: 'Dashboard',
      icon: iconeDashboard,
      end: true,
    },
    {
      to: '/coordenador/turmas',
      label: 'Turmas',
      icon: iconeTurmas,
    },
    {
      to: '/coordenador/calendario',
      label: 'Calendário',
      icon: iconeCalendario,
    },
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

  return (
    <aside className="eg-sidebar">
      <div className="eg-sidebar__brand">
        <div className="eg-sidebar__logo">E</div>

        <div className="eg-sidebar__brand-text">
          <h2>EduGest</h2>
          <span>Gestão acadêmica</span>
        </div>
      </div>

      <nav
        className="eg-sidebar__nav"
        aria-label="Navegação principal"
      >
        {links.map((link) => {
          const Icone = link.Icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `eg-sidebar__link${
                  isActive ? ' eg-sidebar__link--active' : ''
                }`
              }
            >
              {link.icon ? (
                <img
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="eg-sidebar__icon"
                />
              ) : (
                <Icone
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="eg-sidebar__icon"
                />
              )}

              <span className="eg-sidebar__label">
                {link.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="eg-sidebar__footer">
        <img
          src={iconeCoordenador}
          alt=""
          className="eg-sidebar__avatar"
        />

        <div className="eg-sidebar__user">
          <strong>{nomeUsuario}</strong>
          <span>Coordenador</span>
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
