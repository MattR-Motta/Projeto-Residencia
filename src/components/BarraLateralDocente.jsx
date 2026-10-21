import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/barraLateral.css'
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

  // Estilo dos itens que ainda não têm página
  const estiloEmBreve = { opacity: 0.45, cursor: 'not-allowed' }

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
        <NavLink to="/docente" end className={({ isActive }) => `barra-lateral-link ${isActive ? 'ativo' : ''}`}>
          <img src={iconeDashboard} alt="" className="barra-lateral-icone"/>
          <span>Início</span>
        </NavLink>

        <NavLink to="/docente/calendario" className={({ isActive }) => `barra-lateral-link ${isActive ? 'ativo' : ''}`}>
          <img src={iconeCalendario} alt="" className="barra-lateral-icone"/>
          <span>Meu calendário</span>
        </NavLink>

        {/* Páginas ainda não criadas: quando existirem, troque o span por um NavLink */}
        <span className="barra-lateral-link" style={estiloEmBreve} title="Em breve">
          <img src={iconeTurmas} alt="" className="barra-lateral-icone"/>
          <span>Minhas turmas</span>
        </span>

        <span className="barra-lateral-link" style={estiloEmBreve} title="Em breve">
          <img src={iconeAulas} alt="" className="barra-lateral-icone"/>
          <span>Aulas e frequência</span>
        </span>
      </nav>

      <div className="barra-lateral-rodape">
        <img src={iconeDocente} alt="" className="barra-lateral-avatar-imagem"/>

        <div className="barra-lateral-usuario">
          <strong>{nomeUsuario}</strong>
          <span>Docente</span>
        </div>

        <button type="button" className="barra-lateral-sair" onClick={sair} title="Sair da conta" aria-label="Sair da conta">
          ↪
        </button>
      </div>
    </aside>
  )
}

export default BarraLateralDocente