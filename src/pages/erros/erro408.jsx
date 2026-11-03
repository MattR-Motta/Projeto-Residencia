import TelaErro from '../../components/telaErro'

// 408: o servidor demorou demais para responder.
function Erro408() {
  return (
    <TelaErro
      codigo="408"
      rotulo="Tempo esgotado"
      titulo="A resposta demorou demais"
      descricao="O sistema esperou pela resposta do servidor, mas o tempo limite foi atingido. Isso pode acontecer em conexões lentas ou quando o servidor está sobrecarregado."
      dica="Aguarde alguns instantes e tente novamente. Se o problema continuar, verifique sua conexão com a internet."
      tom="cinza"
      icone="relogio"
      acoes={[
        {
          rotulo: 'Tentar novamente',
          aoClicar: () => window.location.reload(),
        },
        { rotulo: 'Voltar para o início', para: '/', variante: 'secundario' },
      ]}
    />
  )
}

export default Erro408
