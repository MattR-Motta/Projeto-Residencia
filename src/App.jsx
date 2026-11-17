
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import ChatBot from './components/chatBot'
import ChatBotDocente from './components/chatBotDocente'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppRoutes />
        <ChatBot />
        <ChatBotDocente />
      </div>
    </BrowserRouter>
  )
}

export default App
