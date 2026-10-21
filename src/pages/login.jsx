import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { usuariosMock } from '../data/usuarios'
import iconeOlhoAberto from '../assets/olhoAberto.png'
import iconeOlhoFechado from '../assets/olhoFechado.png'

function Login() {
    const navigate = useNavigate()

    const [perfil, setPerfil] = useState('coordenador')
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
            setErro('Preencha o e-mail e a senha para continuar.')
            return
        }

        const usuario = usuariosMock.find(
            (u) =>
                u.email.toLowerCase() === email.trim().toLowerCase() &&
                u.senha === senha &&
                u.perfil === perfil
        )

        if (!usuario) {
            setErro('E-mail, senha ou perfil incorreto.')
            return
        }

        localStorage.setItem(
            'usuarioEduGest',
            JSON.stringify({
                email: usuario.email,
                nome: usuario.nome,
                perfil: usuario.perfil,
            })
        )

        if (lembrar) {
            localStorage.setItem('lembrarUsuarioEduGest', 'true')
        } else {
            localStorage.removeItem('lembrarUsuarioEduGest')
        }

        if (usuario.perfil === 'coordenador') {
            navigate('/coordenador')
        } else {
            navigate('/docente')
        }
    }

    function handleEsqueciSenha() {
        setMensagem('A recuperação de senha será disponibilizada quando a autenticação estiver implementada.')
        setErro('')
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <header className="login-brand">
                    <div className="login-brand-icon" aria-hidden="true">
                        <svg viewBox="0 0 48 48" fill="none">
                            <path d="M4 15 24 5l20 10-20 10L4 15Z" fill="currentColor" />
                            <path d="M11 20v10c0 4 8 9 13 9s13-5 13-9V20L24 27 11 20Z" fill="currentColor" />
                            <path d="M44 16v13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="login-brand-name">
                            Edu<span>Gest</span>
                        </h1>
                        <p className="login-brand-subtitle">
                            Gestão Acadêmica Simplificada
                        </p>
                    </div>
                </header>

                <div className="login-heading">
                    <h2>Bem-vindo!</h2>
                    <p>Faça seu login para acessar o sistema.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <fieldset className="profile-fieldset">
                        <legend>Acesso como</legend>
                        <div className="profile-options">
                            <button type="button"
                                className={`profile-option ${perfil === 'coordenador' ? 'selected' : ''}`}
                                onClick={() => { setPerfil('coordenador'); setErro(''); setMensagem('') }} aria-pressed={perfil === 'coordenador'}>
                                <span className="profile-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M12 3 20 6v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                Coordenador
                            </button>

                            <button type="button"
                                className={`profile-option ${perfil === 'docente' ? 'selected' : ''}`}
                                onClick={() => {
                                    setPerfil('docente')
                                    setErro('')
                                    setMensagem('')
                                }} aria-pressed={perfil === 'docente'}>
                                <span className="profile-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="m2 9 10-5 10 5-10 5L2 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                                        <path d="M6 11v5c3.5 3 8.5 3 12 0v-5M22 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                                Docente
                            </button>
                        </div>
                    </fieldset>

                    <div className="login-field">
                        <label htmlFor="email">E-mail</label>
                        <div className="login-input-wrapper">
                            <span className="input-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="5" width="18" height="14"rx="2" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                                </svg>
                            </span>

                            <input id="email" name="email" type="email" placeholder="Digite seu e-mail" value={email} 
                                onChange={(event) => setEmail(event.target.value)} autoComplete="email" aria-invalid={Boolean(erro)} required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label htmlFor="senha">Senha</label>
                        <div className="login-input-wrapper">
                            <span className="input-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                    <path d="M12 14v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                            </span>

                            <input id="senha" name="senha" type={mostrarSenha ? 'text' : 'password'} placeholder="Digite sua senha"
                                value={senha} onChange={(event) => setSenha(event.target.value)} autoComplete="current-password" required
                            />

                            <button type="button" className="toggle-password"
                                onClick={() => setMostrarSenha(!mostrarSenha)} aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'} 
                                aria-pressed={mostrarSenha}>
                                <img src={mostrarSenha ? iconeOlhoFechado : iconeOlhoAberto} alt="" className="login-icone-senha"/>
                            </button>
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="remember-option">
                            <input type="checkbox" checked={lembrar} onChange={(event) => setLembrar(event.target.checked)}/>
                            <span>Lembrar de mim</span>
                        </label>
                        <button type="button" className="forgot-password" onClick={handleEsqueciSenha}>Esqueci minha senha</button>
                    </div>

                    {erro && (<p className="login-feedback error" role="alert">{erro}</p>)}
                    {mensagem && (<p className="login-feedback info" role="status">{mensagem}</p>)}

                    <button type="submit" className="login-submit"> Entrar <span aria-hidden="true">→</span></button>
                </form>

                <footer className="login-footer">
                    <span className="footer-info-icon" aria-hidden="true">i</span>
                    <p>COLOCAR AQUI A PARTE PRA IR PRO LOGIN DE GESTOR</p>
                </footer>
            </section>
        </main>
    )
}
export default Login