import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/Barralateraldocente.css'
import iconeDashboard from '../assets/dashboard.png'
import iconeCalendario from '../assets/calendario.png'
import iconeTurmas from '../assets/turmas.png'
import iconeAulas from '../assets/aulas.png'
import iconeDocente from '../assets/docente.png'

function BarraLateralDocente() {
  const navigate = useNavigate()

  let nomeUsuario = 'Docente'

  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuarioEduGest') || 'null'
    )

    if (usuario?.nome) {
      nomeUsuario = usuario.nome
    }
  } catch {
    // Mantém o nome padrão se os dados salvos forem inválidos.
  }

  function sair() {
    localStorage.removeItem('usuarioEduGest')
    navigate('/login')
  }

  return (
    <aside className="docente-menu">
      <div className="docente-menu-marca">
        <div className="docente-menu-logo">E</div>

        <div className="docente-menu-nome">
          <strong>EduGest</strong>
          <span>Gestão acadêmica</span>
        </div>
      </div>

      <span className="docente-menu-titulo">
        MENU PRINCIPAL
      </span>

      <nav className="docente-menu-lista">
        <NavLink to="/docente" end className={({ isActive }) => `docente-menu-item ${isActive ? 'ativo' : ''}`}>
          <img src={iconeDashboard} alt=""/>
          <span>Início</span>
        </NavLink>

        <NavLink to="/docente/calendario" className={({ isActive }) => `docente-menu-item ${isActive ? 'ativo' : ''}`}>
          <img src={iconeCalendario} alt=""/>
          <span>Meu calendário</span>
        </NavLink>

        {/* Páginas ainda não criadas: quando existirem, troque o span por um NavLink */}
        <span className="docente-menu-item desativado" title="Em breve">
          <img src={iconeTurmas} alt=""/>
          <span>Minhas turmas</span>
        </span>

        <span className="docente-menu-item desativado" title="Em breve">
          <img src={iconeAulas} alt=""/>
          <span>Aulas e frequência</span>
        </span>
      </nav>

      <div className="docente-menu-rodape">
        <img src={iconeDocente} alt="" className="docente-menu-avatar"/>

        <div className="docente-menu-nome">
          <strong>{nomeUsuario}</strong>
          <span>Docente</span>
        </div>

        <button type="button" className="docente-menu-sair" onClick={sair} title="Sair da conta" aria-label="Sair da conta">
          ↪
        </button>
      </div>
    </aside>
  )
}

export default BarraLateralDocente