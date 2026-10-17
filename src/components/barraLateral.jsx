import { NavLink, useNavigate } from 'react-router-dom'
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
    // Mantém o nome padrão se os dados salvos forem inválidos.
  }

  function sair() {
    localStorage.removeItem('usuarioEduGest')
    navigate('/login')
  }

  return (
    <aside className="barra-lateral">
      <div className="barra-lateral-logo">
        <div className="barra-lateral-simbolo">E</div>

        <div>
          <h2>EduGest</h2>
          <span>Gestão acadêmica</span>
        </div>
      </div>

      <span className="barra-lateral-titulo">
        MENU PRINCIPAL
      </span>

      <nav className="barra-lateral-navegacao">
        <NavLink to="/coordenador" end className={({ isActive }) => `barra-lateral-link ${isActive ? 'ativo' : ''}`}>
          <img src={iconeDashboard} alt="" className="barra-lateral-icone"/>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/coordenador/turmas" className={({ isActive }) => `barra-lateral-link ${isActive ? 'ativo' : ''}`}>
          <img src={iconeTurmas} alt="" className="barra-lateral-icone"/>
          <span>Turmas</span>
        </NavLink>

        <NavLink to="/coordenador/calendario" className={({ isActive }) => `barra-lateral-link ${isActive ? 'ativo' : ''}`}>
          <img src={iconeCalendario} alt="" className="barra-lateral-icone"/>
          <span>Calendário</span>
        </NavLink>
      </nav>

      <div className="barra-lateral-rodape">
        <img src={iconeCoordenador} alt="" className="barra-lateral-avatar-imagem"/>

        <div className="barra-lateral-usuario">
          <strong>{nomeUsuario}</strong>
          <span>Coordenador</span>
        </div>

        <button type="button" className="barra-lateral-sair" onClick={sair} title="Sair da conta" aria-label="Sair da conta">
          ↪
        </button>
      </div>
    </aside>
  )
}

export default BarraLateral