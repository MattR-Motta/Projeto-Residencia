import { Link } from 'react-router-dom'
import '../../styles/telaErro.css'

// Lista usada para montar os cards desta página índice.
const telas = [
  {
    codigo: '400',
    titulo: 'Requisição inválida',
    descricao: 'Os dados enviados não puderam ser processados.',
    para: '/erro/400',
    tom: 'ambar',
  },
  {
    codigo: '401',
    titulo: 'Acesso não autorizado',
    descricao: 'É necessário fazer login para acessar a página.',
    para: '/erro/401',
    tom: 'azul',
  },
  {
    codigo: '403',
    titulo: 'Acesso negado',
    descricao: 'O perfil do usuário não possui permissão.',
    para: '/erro/403',
    tom: 'vermelho',
  },
  {
    codigo: '404',
    titulo: 'Página não encontrada',
    descricao: 'O endereço acessado não existe no sistema.',
    para: '/erro/404',
    tom: 'azul',
  },
  {
    codigo: '408',
    titulo: 'Tempo esgotado',
    descricao: 'O servidor demorou demais para responder.',
    para: '/erro/408',
    tom: 'cinza',
  },
  {
    codigo: '500',
    titulo: 'Erro interno',
    descricao: 'Ocorreu uma falha inesperada no servidor.',
    para: '/erro/500',
    tom: 'vermelho',
  },
  {
    codigo: '503',
    titulo: 'Em manutenção',
    descricao: 'O sistema está temporariamente indisponível.',
    para: '/erro/503',
    tom: 'ambar',
  },
  {
    codigo: 'Offline',
    titulo: 'Sem conexão',
    descricao: 'O dispositivo está sem acesso à internet.',
    para: '/erro/sem-conexao',
    tom: 'cinza',
    pequeno: true,
  },
]

// Página de apoio: mostra as 8 telas em um só lugar para facilitar a apresentação.
function IndiceErros() {
  return (
    <main className="erros-index">
      <header className="erros-index-topo">
        <Link to="/" className="erro-marca" aria-label="EduGest, voltar ao início">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M4 15 24 5l20 10-20 10L4 15Z" fill="currentColor" />
            <path d="M11 20v10c0 4 8 9 13 9s13-5 13-9V20L24 27 11 20Z" fill="currentColor" />
            <path d="M44 16v13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span>
            Edu<span>Gest</span>
          </span>
        </Link>

        <Link to="/login" className="erro-topo-link">
          Ir para o login
        </Link>
      </header>

      <div className="erros-index-titulo">
        <h1>Telas de erro</h1>
        <p>Clique em um card para visualizar cada tela do projeto.</p>
      </div>

      <div className="erros-grid">
        {telas.map((tela) => (
          <Link
            key={tela.codigo}
            to={tela.para}
            className={`erros-card tom-${tela.tom}`}
          >
            <span className={`erros-card-codigo ${tela.pequeno ? 'pequeno' : ''}`}>
              {tela.codigo}
            </span>
            <h2>{tela.titulo}</h2>
            <p>{tela.descricao}</p>
            <span className="erros-card-link">Visualizar tela →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default IndiceErros
