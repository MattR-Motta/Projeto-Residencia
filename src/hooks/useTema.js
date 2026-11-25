import { useContext } from 'react'
import { ContextoTema } from '../contextos/contextoTema'

export default function useTema() {
  const contexto = useContext(ContextoTema)

  if (!contexto) {
    throw new Error('useTema precisa ser usado dentro de ProvedorTema')
  }

  return contexto
}
