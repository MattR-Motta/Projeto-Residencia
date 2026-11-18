import { useState } from 'react'
import { Bot, MessageCircle, Send, X, LoaderCircle } from 'lucide-react'
import { enviarMensagemIA } from '../services/ia/iaService'

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioEduGest') || '{}')
  } catch {
    return {}
  }
}

function EduGestIA() {
  const [aberto, setAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mensagens, setMensagens] = useState([
    { id: 'inicio', autor: 'bot', texto: 'Olá! Sou o assistente virtual do EduGest. Como posso ajudar?' },
  ])

  async function enviar(evento) {
    evento.preventDefault()
    const texto = mensagem.trim()
    if (!texto || carregando) return

    const historico = mensagens.map(({ autor, texto: textoMensagem }) => ({ autor, texto: textoMensagem }))
    setMensagens((anteriores) => [...anteriores, { id: crypto.randomUUID(), autor: 'usuario', texto }])
    setMensagem('')
    setCarregando(true)

    try {
      const usuario = obterUsuario()
      const resposta = await enviarMensagemIA({
        mensagem: texto,
        perfil: usuario.perfil || usuario.tipo || 'não identificado',
        historico,
      })
      setMensagens((anteriores) => [...anteriores, { id: crypto.randomUUID(), autor: 'bot', texto: resposta }])
    } catch (erro) {
      setMensagens((anteriores) => [...anteriores, { id: crypto.randomUUID(), autor: 'bot', texto: erro.message || 'Não foi possível obter uma resposta.' }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="edugest-ia">
      {aberto && (
        <section className="edugest-ia-painel" aria-label="Assistente virtual">
          <header className="edugest-ia-cabecalho">
            <span><Bot size={20} /> Assistente EduGest</span>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar assistente"><X size={19} /></button>
          </header>
          <div className="edugest-ia-mensagens" aria-live="polite">
            {mensagens.map((item) => (
              <div key={item.id} className={`edugest-ia-mensagem ${item.autor}`}>
                {item.texto}
              </div>
            ))}
            {carregando && <div className="edugest-ia-carregando"><LoaderCircle size={16} /> Gerando resposta...</div>}
          </div>
          <form className="edugest-ia-formulario" onSubmit={enviar}>
            <input value={mensagem} onChange={(evento) => setMensagem(evento.target.value)} placeholder="Digite sua mensagem..." aria-label="Mensagem" />
            <button type="submit" disabled={!mensagem.trim() || carregando} aria-label="Enviar mensagem"><Send size={18} /></button>
          </form>
        </section>
      )}
      <button className="edugest-ia-botao" type="button" onClick={() => setAberto((valor) => !valor)} aria-label={aberto ? 'Fechar assistente' : 'Abrir assistente'}>
        {aberto ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}

export default EduGestIA