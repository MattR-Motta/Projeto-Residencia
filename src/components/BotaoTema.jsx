import { Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import useTema from '../hooks/useTema'
import '../styles/botaoTema.css'

const ROTAS_COM_TEMA = [
  '/login',
  '/coordenador',
  '/coordenador/turmas',
  '/coordenador/aulas-reposicoes',
  '/coordenador/configuracoes',
  '/docente',
  '/docente/calendario',
  '/gestor',
]

export default function BotaoTema() {
  const { tema, alternarTema } = useTema()
  const { pathname } = useLocation()

  if (!ROTAS_COM_TEMA.includes(pathname)) {
    return null
  }

  const escuro = tema === 'escuro'
  const rotulo = escuro ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <button
      type="button"
      className="botao-tema"
      onClick={alternarTema}
      aria-label={rotulo}
      aria-pressed={escuro}
      title={rotulo}
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
