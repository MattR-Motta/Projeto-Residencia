import '../styles/errorState.css'

// Componente reutilizável para telas de erro nos temas light/dark
// Tipos suportados: 'carregar' | 'timeout' | 'indisponibilidade'
function ErrorState({
  tipo = 'carregar',
  titulo,
  descricao,
  textoBotao = 'Tentar novamente',
  onTentarNovamente,
  tema = 'light',
}) {
  const temaAtual = tema === 'dark' ? 'dark' : 'light'

  // Ícone: Erro ao carregar - janela de navegador com gráfico de barras
  const iconeCarregar = (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="10" y="14" width="44" height="28" rx="4" />
      <line x1="10" y1="22" x2="54" y2="22" />
      <rect x="16" y="28" width="6" height="8" />
      <rect x="26" y="30" width="6" height="6" />
      <rect x="36" y="26" width="6" height="10" />
      <rect x="46" y="24" width="6" height="12" />
    </svg>
  )

  // Ícone: Timeout - relógio azul
  const iconeTimeout = (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="32" cy="32" r="22" />
      <polyline points="32 18 32 32 42 38" />
    </svg>
  )

  // Ícone: Indisponibilidade - servidor
  const iconeIndisponibilidade = (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="12" y="16" width="40" height="12" rx="3" />
      <rect x="12" y="36" width="40" height="12" rx="3" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
      <circle cx="20" cy="42" r="1.5" fill="currentColor" />
    </svg>
  )

  let icone
  if (tipo === 'timeout') {
    icone = iconeTimeout
  } else if (tipo === 'indisponibilidade') {
    icone = iconeIndisponibilidade
  } else {
    icone = iconeCarregar
  }

  const handleClick = () => {
    if (typeof onTentarNovamente === 'function') {
      onTentarNovamente()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className={`error-state error-state--${temaAtual} error-state--${tipo}`} role="alert" aria-live="polite">
      <div className="error-state__container">
        <div className="error-state__icon-wrapper">
          <div className="error-state__icon">
            {icone}
          </div>
          <div className="error-state__badge error-state__badge--x" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </div>
          <div className="error-state__badge error-state__badge--exclamacao" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 12 5Zm0 11a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Z" />
            </svg>
          </div>
        </div>

        <h2 className="error-state__title">{titulo}</h2>
        <p className="error-state__description">{descricao}</p>

        <button className="error-state__button" onClick={handleClick} type="button">
          <svg className="error-state__button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {textoBotao}
        </button>
      </div>
    </div>
  )
}

export default ErrorState
