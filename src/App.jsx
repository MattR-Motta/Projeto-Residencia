import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import BotaoTema from './components/BotaoTema'
import ProvedorTema from './contextos/TemaContexto'
import EduGestIA from './components/EduGestIA'
import './App.css'
import './styles/modoEscuro.css'

function App() {
  return (
    <ProvedorTema>
      <BrowserRouter>
        <div className="app">
          <AppRoutes />
          <EduGestIA />
          <BotaoTema />
        </div>
      </BrowserRouter>
    </ProvedorTema>
  )
}

export default App
