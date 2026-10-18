import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/login'
import Dashboard from '../pages/coordenador/dashboard'
import Turmas from '../pages/coordenador/turmas'
import Calendario from '../pages/coordenador/calendario'
import DisciplinasEmentas from '../pages/coordenador/disciplinasEmentas'
import AulasReposicoes from '../pages/coordenador/aulasReposicoes'

// Verifica se o usuário tem permissão para acessar uma página.
function ProtectedRoute({ children, perfil }) {
  const usuarioSalvo = localStorage.getItem('usuarioEduGest')

  // Se não houver usuário salvo, redireciona para o login.
  if (!usuarioSalvo) {
    return <Navigate to="/login" replace />
  }

  let usuario

  try {
    // Transforma os dados salvos em um objeto JavaScript.
    usuario = JSON.parse(usuarioSalvo)
  } catch {
    // Remove os dados inválidos e redireciona para o login.
    localStorage.removeItem('usuarioEduGest')
    return <Navigate to="/login" replace />
  }

  // Impede o acesso quando o perfil não tem permissão para a página.
  if (usuario.perfil !== perfil) {
    return (<Navigate to={usuario.perfil === 'coordenador' ? '/coordenador' : '/login'} replace />)
  }

  // Exibe a página solicitada se o usuário tiver permissão.
  return children
}

function AppRoutes() {
  const usuarioSalvo = localStorage.getItem('usuarioEduGest')
  let usuario = null

  try {
    usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null
  } catch {
    localStorage.removeItem('usuarioEduGest')
  }

  // Define a página inicial de acordo com o perfil do usuário.
  const rotaInicial = usuario?.perfil === 'coordenador' ? '/coordenador' : '/login'

  return (
    <Routes>
      {/* Redireciona a rota inicial para a página adequada ao usuário. */}
      <Route path="/" element={<Navigate to={rotaInicial} replace />} />
      <Route path="/login" element={<Login />} />
      {/* Restringe o acesso ao dashboard, às turmas e ao calendário aos coordenadores. */}
      <Route path="/coordenador" element={<ProtectedRoute perfil="coordenador"><Dashboard /></ProtectedRoute>} />
      <Route path="/coordenador/turmas" element={<ProtectedRoute perfil="coordenador"><Turmas /></ProtectedRoute>} />
      <Route path="/coordenador/calendario" element={<ProtectedRoute perfil="coordenador"><Calendario /></ProtectedRoute>} />
      <Route path="/coordenador/disciplinas-ementas" element={<ProtectedRoute perfil="coordenador"><DisciplinasEmentas /></ProtectedRoute>} />
      <Route path="/coordenador/aulas-reposicoes" element={<ProtectedRoute perfil="coordenador"><AulasReposicoes /></ProtectedRoute>} />
      {/* Redireciona endereços que não correspondem a nenhuma rota cadastrada. */}
      <Route path="*" element={<Navigate to={rotaInicial} replace />} />
    </Routes>
  )
}

export default AppRoutes