export async function enviarMensagemIA({ mensagem, perfil, historico = [], contexto = '' }) {
  const resposta = await fetch('/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagem, perfil, historico, contexto }),
  })

  const dados = await resposta.json()
  if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível enviar a mensagem.')
  return dados.resposta
}
