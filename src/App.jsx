import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App