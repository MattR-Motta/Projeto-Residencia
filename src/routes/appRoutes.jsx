import { Routes, Route, Navigate } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/login'
import Dashboard from '../pages/coordenador/dashboard'
import Turmas from '../pages/coordenador/turmas'
import Calendario from '../pages/coordenador/calendario'
import DisciplinasEmentas from '../pages/coordenador/disciplinasEmentas'
import AulasReposicoes from '../pages/coordenador/aulasReposicoes'
import DashboardDocente from '../pages/Docente/dasboard'
import CalendarioDocente from '../pages/Docente/Calendariodocente'
import MinhasDisciplinas from '../pages/Docente/MinhasDisciplinas'
import AulasReposicoesDocente from '../pages/Docente/AulasReposicoesDocente'
import Notificacoes from '../pages/coordenador/notificacoes'
import Configuracoes from '../pages/coordenador/configuracoes'
import Solicitacoes from '../pages/coordenador/solicitacoesTriagem'
import DetalhesSolicitacao from '../pages/coordenador/solicitacoesDetalhes'

import DashboardGestor from '../pages/gestor/DashboardGestor'
import EscolasGestor from '../pages/gestor/EscolasGestor'
import PortariasGestor from '../pages/gestor/PortariasGestor'
import EstruturaGestor from '../pages/gestor/EstruturaGestor'
import GradesGestor from '../pages/gestor/GradesGestor'
import NovaGradeGestor from '../pages/gestor/NovaGradeGestor'

import IndiceErros from '../pages/erros/index'
import Erro400 from '../pages/erros/erro400'
import Erro401 from '../pages/erros/erro401'
import Erro403 from '../pages/erros/erro403'
import Erro404 from '../pages/erros/erro404'
import Erro408 from '../pages/erros/erro408'
import Erro500 from '../pages/erros/erro500'
import Erro503 from '../pages/erros/erro503'
import SemConexao from '../pages/erros/semConexao'

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
      <Route
        path="/docente/disciplinas"
        element={<ProtectedRoute perfil="docente"><MinhasDisciplinas /></ProtectedRoute>}
      />
      <Route
        path="/docente/aulas"
        element={<ProtectedRoute perfil="docente"><AulasReposicoesDocente /></ProtectedRoute>}
      />
      {/* Rotas do gestor da rede. */}
      <Route path="/gestor" element={<ProtectedRoute perfil="gestor"><DashboardGestor /></ProtectedRoute>} />
      <Route path="/gestor/escolas" element={<ProtectedRoute perfil="gestor"><EscolasGestor /></ProtectedRoute>} />
      <Route path="/gestor/portarias" element={<ProtectedRoute perfil="gestor"><PortariasGestor /></ProtectedRoute>} />
      <Route path="/gestor/estrutura" element={<ProtectedRoute perfil="gestor"><EstruturaGestor /></ProtectedRoute>} />
      <Route path="/gestor/grades" element={<ProtectedRoute perfil="gestor"><GradesGestor /></ProtectedRoute>} />
      <Route path="/gestor/grades/nova" element={<ProtectedRoute perfil="gestor"><NovaGradeGestor /></ProtectedRoute>} />

      {/* Telas de erro. A página /erros lista todas para facilitar a apresentação. */}
      <Route path="/erros" element={<IndiceErros />} />
      <Route path="/erro/400" element={<Erro400 />} />
      <Route path="/erro/401" element={<Erro401 />} />
      <Route path="/erro/403" element={<Erro403 />} />
      <Route path="/erro/404" element={<Erro404 />} />
      <Route path="/erro/408" element={<Erro408 />} />
      <Route path="/erro/500" element={<Erro500 />} />
      <Route path="/erro/503" element={<Erro503 />} />
      <Route path="/erro/sem-conexao" element={<SemConexao />} />

      {/* Endereços que não correspondem a nenhuma rota mostram a tela 404. */}
      <Route path="*" element={<Erro404 />} />
    </Routes>
  )
}

export default AppRoutes