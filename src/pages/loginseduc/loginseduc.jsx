// src/pages/loginseduc/loginseduc.jsx
import { useState } from 'react';
import './loginseduc.css';

export function LoginSeduc() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarMe, setLembrarMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Payload pronto para integração futura na branch de desenvolvimento
    const payload = { usuario, senha, lembrarMe };
    console.info('Tentativa de autenticação:', payload);
  };

  return (
    <main className="seduc-login">
      {/* Left Column: Banner */}
      <section className="seduc-login__banner">
        <header className="seduc-login__brand">
          <div className="seduc-login__logo" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="seduc-login__brand-text">
            <span className="seduc-login__brand-title">GOVERNO DE SERGIPE</span>
            <span className="seduc-login__brand-subtitle">
              Secretaria de Estado da Educação
            </span>
          </div>
        </header>

        <div className="seduc-login__hero">
          <h1 className="seduc-login__hero-title">
            Juntos por uma educação mais forte em Sergipe
          </h1>
          <p className="seduc-login__hero-desc">
            Acesse a plataforma de monitoramento, gestão escolar e portarias pedagógicas do estado.
          </p>
        </div>

        <footer>
          <p className="seduc-login__footer-text">
            © 2026 Secretaria de Estado da Educação e da Cultura de Sergipe.
          </p>
        </footer>
      </section>

      {/* Right Column: Login Form */}
      <section className="seduc-login__form-section">
        <div className="seduc-login__form-container">
          <header className="seduc-login__form-header">
            <h2 className="seduc-login__form-title">Acesse sua conta</h2>
            <p className="seduc-login__form-subtitle">
              Faça login para continuar na plataforma
            </p>
          </header>

          <form onSubmit={handleSubmit} className="seduc-login__form">
            <div className="seduc-login__field">
              <label htmlFor="seduc-usuario" className="seduc-login__label">
                Usuário
              </label>
              <div className="seduc-login__input-wrapper">
                <span className="seduc-login__input-icon" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="seduc-usuario"
                  type="text"
                  className="seduc-login__input"
                  placeholder="CPF ou e-mail corporativo"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="seduc-login__field">
              <label htmlFor="seduc-senha" className="seduc-login__label">
                Senha
              </label>
              <div className="seduc-login__input-wrapper">
                <span className="seduc-login__input-icon" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="seduc-senha"
                  type="password"
                  className="seduc-login__input"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="seduc-login__options">
              <label className="seduc-login__remember">
                <input
                  type="checkbox"
                  className="seduc-login__checkbox"
                  checked={lembrarMe}
                  onChange={(e) => setLembrarMe(e.target.checked)}
                />
                <span>Lembrar-me</span>
              </label>

              <a href="#recuperar-senha" className="seduc-login__forgot-link">
                Esqueceu sua senha?
              </a>
            </div>

            <button type="submit" className="seduc-login__submit-btn">
              Entrar no sistema
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginSeduc;