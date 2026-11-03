import { Link } from 'react-router-dom'
import '../styles/telaErro.css'

// Biblioteca de ícones usada nas telas de erro.
const icones = {
  alerta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9.5v5" />
      <path d="M12 17.5h.01" />
    </svg>
  ),
  chave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9" />
      <path d="m16 4 4 4" />
      <path d="m13 7 3 3" />
    </svg>
  ),
  bloqueado: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </svg>
  ),
  busca: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  relogio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  servidor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01" />
      <path d="M7 16.5h.01" />
    </svg>
  ),
  manutencao: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  ),
  conexao: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M8.5 15.5a5 5 0 0 1 7 1" />
      <path d="M5 12.5a10 10 0 0 1 3.5-2.3" />
      <path d="M12 19h.01" />
    </svg>
  ),
}

// Componente reutilizável: todas as 8 telas usam esta mesma estrutura.
function TelaErro({
  codigo,
  codigoLongo = false,
  rotulo,
  titulo,
  descricao,
  dica,
  tom = 'azul',
  icone = 'alerta',
  acoes = [],
  codigoRodape,
}) {
  return (
    <main className={`erro-page tom-${tom}`}>
      <header className="erro-topo">
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

      <section className="erro-conteudo">
        <div className="erro-texto">
          <span className="erro-etiqueta">{rotulo}</span>

          <h1>{titulo}</h1>
          <p className="erro-descricao">{descricao}</p>

          <div className="erro-acoes">
            {acoes.map((acao) =>
              acao.para ? (
                <Link
                  key={acao.rotulo}
                  to={acao.para}
                  className={`erro-botao ${acao.variante === 'secundario' ? 'erro-botao--secundario' : ''}`}
                >
                  {acao.rotulo}
                </Link>
              ) : (
                <button
                  key={acao.rotulo}
                  type="button"
                  onClick={acao.aoClicar}
                  className={`erro-botao ${acao.variante === 'secundario' ? 'erro-botao--secundario' : ''}`}
                >
                  {acao.rotulo}
                </button>
              )
            )}
          </div>

          {dica && (
            <p className="erro-dica">
              <strong>Dica:</strong> {dica}
            </p>
          )}
        </div>

        <div className="erro-visual" aria-hidden="true">
          <span className="erro-orbe erro-orbe--grande" />
          <span className="erro-orbe erro-orbe--pequeno" />

          <div className="erro-cartao">
            <span className={`erro-cartao-codigo ${codigoLongo ? 'erro-cartao-codigo--texto' : ''}`}>
              {codigo}
            </span>
            <span className="erro-cartao-legenda">EduGest</span>
          </div>

          <span className="erro-selo">{icones[icone]}</span>
          <span className="erro-pontinho">!</span>
        </div>
      </section>

      <footer className="erro-rodape">
        <span>EduGest · Plataforma de gestão acadêmica</span>
        <span>Código do erro: {codigoRodape || codigo}</span>
      </footer>
    </main>
  )
}

export default TelaErro
