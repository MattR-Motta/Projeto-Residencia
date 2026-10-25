import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { usuariosMock } from '../data/usuarios'
import iconeOlhoAberto from '../assets/olhoAberto.png'
import iconeOlhoFechado from '../assets/olhoFechado.png'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [lembrar, setLembrar] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setMensagem('')

    if (!email.trim() || !senha) {
      setErro('Preencha o usuário e a senha para continuar.')
      return
    }

    // A demonstração aceita o e-mail cadastrado. O perfil é identificado
    // automaticamente, sem exigir que o usuário selecione seu tipo de acesso.
    const usuario = usuariosMock.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.senha === senha,
    )

    if (!usuario) {
      setErro('Usuário ou senha incorretos. Confira os dados e tente novamente.')
      return
    }

    localStorage.setItem(
      'usuarioEduGest',
      JSON.stringify({ email: usuario.email, nome: usuario.nome, perfil: usuario.perfil }),
    )

    if (lembrar) {
      localStorage.setItem('lembrarUsuarioEduGest', 'true')
    } else {
      localStorage.removeItem('lembrarUsuarioEduGest')
    }

    if (usuario.perfil === 'coordenador') navigate('/coordenador')
    else if (usuario.perfil === 'gestor') navigate('/gestor')
    else navigate('/docente')
  }

  function handleEsqueciSenha() {
    setMensagem('A recuperação de senha estará disponível quando a autenticação real for implementada.')
    setErro('')
  }

  return (
    <main className="login-page">
      <section className="login-apresentacao" aria-label="Secretaria de Estado da Educação de Sergipe">
        <header className="login-governo-marca">
          <span className="login-governo-simbolo" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 5 38 10v12c0 9-5.8 16-14 20C15.8 38 10 31 10 22V10L24 5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M17 17h14M24 12v21" stroke="currentColor" strokeWidth="1.5" opacity=".65" />
            </svg>
          </span>
          <span className="login-governo-texto">
            <strong>GOVERNO DE SERGIPE</strong>
            <span>Secretaria de Estado da Educação</span>
          </span>
        </header>

        <div className="login-apresentacao-mensagem">
          <h1>Juntos por uma educação mais forte em Sergipe</h1>
          <p>Acesse a plataforma de monitoramento, gestão escolar e portarias pedagógicas do estado.</p>
        </div>

        <footer className="login-apresentacao-rodape">
          © 2026 Secretaria de Estado da Educação e da Cultura de Sergipe.
        </footer>
      </section>

      <section className="login-acesso" aria-labelledby="login-titulo">
        <div className="login-formulario-container">
          <header className="login-heading">
            <h2 id="login-titulo">Acesse sua conta</h2>
            <p>Faça login para continuar na plataforma</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="email">Usuário</label>
              <div className="login-input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M5.5 20v-1.8a6.5 6.5 0 0 1 13 0V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="CPF ou e-mail corporativo"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  aria-invalid={Boolean(erro)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="senha">Senha</label>
              <div className="login-input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4.5" y="10" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                >
                  <img src={mostrarSenha ? iconeOlhoFechado : iconeOlhoAberto} alt="" className="login-icone-senha" />
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" checked={lembrar} onChange={(event) => setLembrar(event.target.checked)} />
                <span>Lembrar-me</span>
              </label>
              <button type="button" className="forgot-password" onClick={handleEsqueciSenha}>Esqueceu sua senha?</button>
            </div>

            {erro && <p className="login-feedback error" role="alert">{erro}</p>}
            {mensagem && <p className="login-feedback info" role="status">{mensagem}</p>}

            <button type="submit" className="login-submit">Entrar no sistema</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login