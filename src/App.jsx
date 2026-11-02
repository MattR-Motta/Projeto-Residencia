
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import ChatBot from './components/chatBot'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppRoutes />
        <ChatBot />
      </div>
    </BrowserRouter>
  )
}

export default App
