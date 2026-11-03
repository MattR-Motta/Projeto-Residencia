import TelaErro from '../../components/telaErro'

// 500: falha inesperada dentro do servidor.
function Erro500() {
  return (
    <TelaErro
      codigo="500"
      rotulo="Erro interno"
      titulo="O servidor encontrou um problema"
      descricao="Não foi possível concluir a operação porque ocorreu uma falha inesperada no servidor. Os dados da sua conta não foram alterados."
      dica="Tente novamente em alguns instantes. Se o erro persistir, entre em contato com o suporte informando o código 500."
      tom="vermelho"
      icone="servidor"
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

export default Erro500
