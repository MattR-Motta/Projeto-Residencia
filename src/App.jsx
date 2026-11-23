import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import BotaoTema from './components/BotaoTema'
import ProvedorTema from './contextos/TemaContexto'
import './App.css'
import './styles/modoEscuro.css'

function App() {
  return (
    <ProvedorTema>
      <BrowserRouter>
        <div className="app">
          <AppRoutes />
          <BotaoTema />
        </div>
      </BrowserRouter>
    </ProvedorTema>
  )
}

export default App