import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/login'
import Dashboard from '../pages/coordenador/dashboard'
import Turmas from '../pages/coordenador/turmas'
import Calendario from '../pages/coordenador/calendario'
import DashboardDocente from '../pages/Docente/dasboard'
import CalendarioDocente from '../pages/Docente/Calendariodocente'

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
  // Manda cada perfil de volta para a sua própria página inicial.
  if (usuario.perfil !== perfil) {
    if (usuario.perfil === 'coordenador') {
      return <Navigate to="/coordenador" replace />
    }
    if (usuario.perfil === 'docente') {
      return <Navigate to="/docente" replace />
    }
    return <Navigate to="/login" replace />
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
  let rotaInicial = '/login'
  if (usuario?.perfil === 'coordenador') {
    rotaInicial = '/coordenador'
  } else if (usuario?.perfil === 'docente') {
    rotaInicial = '/docente'
  }

  return (
    <Routes>
      {/* Redireciona a rota inicial para a página adequada ao usuário. */}
      <Route path="/" element={<Navigate to={rotaInicial} replace />} />
      <Route path="/login" element={<Login />} />
      {/* Restringe o acesso ao dashboard, às turmas e ao calendário aos coordenadores. */}
      <Route path="/coordenador" element={<ProtectedRoute perfil="coordenador"><Dashboard /></ProtectedRoute>} />
      <Route path="/coordenador/turmas" element={<ProtectedRoute perfil="coordenador"><Turmas /></ProtectedRoute>} />
      <Route path="/coordenador/calendario" element={<ProtectedRoute perfil="coordenador"><Calendario /></ProtectedRoute>} />
      {/* Restringe o acesso ao dashboard e ao calendário aos docentes. */}
      <Route path="/docente" element={<ProtectedRoute perfil="docente"><DashboardDocente /></ProtectedRoute>} />
      <Route path="/docente/calendario" element={<ProtectedRoute perfil="docente"><CalendarioDocente /></ProtectedRoute>} />
      {/* Redireciona endereços que não correspondem a nenhuma rota cadastrada. */}
      <Route path="*" element={<Navigate to={rotaInicial} replace />} />
    </Routes>
  )
}

export default AppRoutes