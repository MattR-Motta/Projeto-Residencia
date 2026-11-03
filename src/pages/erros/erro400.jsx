import TelaErro from '../../components/telaErro'

// 400: a requisição enviada pelo navegador está incorreta ou incompleta.
function Erro400() {
  return (
    <TelaErro
      codigo="400"
      rotulo="Requisição inválida"
      titulo="Algo saiu errado no caminho"
      descricao="Os dados enviados não puderam ser processados pelo sistema. Isso costuma acontecer quando um endereço ou formulário está incompleto."
      dica="Confira o endereço acessado ou volte para a página anterior e tente novamente."
      tom="ambar"
      icone="alerta"
      acoes={[
        { rotulo: 'Voltar para o início', para: '/' },
        {
          rotulo: 'Tentar novamente',
          aoClicar: () => window.location.reload(),
          variante: 'secundario',
        },
      ]}
    />
  )
}

export default Erro400
