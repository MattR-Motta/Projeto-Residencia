import { useEffect, useState } from 'react'
import { CHAVE_TEMA, ContextoTema } from './contextoTema'

function obterTemaInicial() {
  try {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA)
    return temaSalvo === 'escuro' ? 'escuro' : 'claro'
  } catch {
    return 'claro'
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema)
  } catch {
    return
  }
}

export default function ProvedorTema({ children }) {
  const [tema, setTema] = useState(obterTemaInicial)

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    salvarTema(tema)
  }, [tema])

  function alternarTema() {
    setTema((atual) => (atual === 'escuro' ? 'claro' : 'escuro'))
  }

  return (
    <ContextoTema.Provider value={{ tema, definirTema: setTema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  )
}
