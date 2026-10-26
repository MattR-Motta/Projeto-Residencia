import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/login'
import Dashboard from '../pages/coordenador/dashboard'
import Turmas from '../pages/coordenador/turmas'
import Calendario from '../pages/coordenador/calendario'
import DisciplinasEmentas from '../pages/coordenador/disciplinasEmentas'
import AulasReposicoes from '../pages/coordenador/aulasReposicoes'
import DashboardDocente from '../pages/Docente/dasboard'
import CalendarioDocente from '../pages/Docente/Calendariodocente'
import Notificacoes from '../pages/coordenador/notificacoes'
import Configuracoes from '../pages/coordenador/configuracoes'
import Solicitacoes from '../pages/coordenador/solicitacoesTriagem'
import DetalhesSolicitacao from '../pages/coordenador/solicitacoesDetalhes'

import DashboardGestor from '../pages/gestor/DashboardGestor'
import EscolasGestor from '../pages/gestor/EscolasGestor'
import PortariasGestor from '../pages/gestor/PortariasGestor'
import EstruturaGestor from '../pages/gestor/EstruturaGestor'
import GradesCurricularesGestor from '../pages/gestor/GradesCurricularesGestor'

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
    if (usuario.perfil === 'coordenador') {
      return <Navigate to="/coordenador" replace />
    }
    if (usuario.perfil === 'docente') {
      return <Navigate to="/docente" replace />
    }
    if (usuario.perfil === 'gestor') {
      return <Navigate to="/gestor" replace />
    }
    return <Navigate to="/login" replace />
  }

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
  } else if (usuario?.perfil === 'gestor') {
    rotaInicial = '/gestor'
  }

  return (
    <Routes>
      {/* Redireciona a rota inicial para a página adequada ao usuário. */}
      <Route path="/" element={<Navigate to={rotaInicial} replace />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas do coordenador. */}
      <Route
        path="/coordenador"
        element={<ProtectedRoute perfil="coordenador"><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/coordenador/turmas"
        element={<ProtectedRoute perfil="coordenador"><Turmas /></ProtectedRoute>}
      />
      <Route
        path="/coordenador/calendario"
        element={<ProtectedRoute perfil="coordenador"><Calendario /></ProtectedRoute>}
      />
      <Route
        path="/coordenador/disciplinas-ementas"
        element={<ProtectedRoute perfil="coordenador"><DisciplinasEmentas /></ProtectedRoute>}
      />
      <Route
        path="/coordenador/aulas-reposicoes"
        element={<ProtectedRoute perfil="coordenador"><AulasReposicoes /></ProtectedRoute>}
      />

      <Route
        path="/coordenador/notificacoes"
        element={
          <ProtectedRoute perfil="coordenador">
            <Notificacoes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordenador/configuracoes"
        element={
          <ProtectedRoute perfil="coordenador">
            <Configuracoes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordenador/solicitacoes"
        element={
          <ProtectedRoute perfil="coordenador">
            <Solicitacoes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coordenador/solicitacoes/:id"
        element={
          <ProtectedRoute perfil="coordenador">
            <DetalhesSolicitacao />
          </ProtectedRoute>
        }
      />

      {/* Rotas do docente. */}
      <Route
        path="/docente"
        element={<ProtectedRoute perfil="docente"><DashboardDocente /></ProtectedRoute>}
      />
      <Route
        path="/docente/calendario"
        element={<ProtectedRoute perfil="docente"><CalendarioDocente /></ProtectedRoute>}
      />

      {/* Rotas do gestor da rede. */}
      <Route path="/gestor" element={<ProtectedRoute perfil="gestor"><DashboardGestor /></ProtectedRoute>} />
      <Route path="/gestor/escolas" element={<ProtectedRoute perfil="gestor"><EscolasGestor /></ProtectedRoute>} />
      <Route path="/gestor/portarias" element={<ProtectedRoute perfil="gestor"><PortariasGestor /></ProtectedRoute>} />
      <Route path="/gestor/estrutura" element={<ProtectedRoute perfil="gestor"><EstruturaGestor /></ProtectedRoute>} />
      <Route path="/gestor/grades-curriculares" element={<ProtectedRoute perfil="gestor"><GradesCurricularesGestor /></ProtectedRoute>} />

      {/* Redireciona endereços que não correspondem a nenhuma rota cadastrada. */}
      <Route path="*" element={<Navigate to={rotaInicial} replace />} />
    </Routes>
  )
}

export default AppRoutes