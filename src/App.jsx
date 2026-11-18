import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import EduGestIA from './components/EduGestIA'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppRoutes />
        <EduGestIA />
      </div>
    </BrowserRouter>
  )
}

export default App
