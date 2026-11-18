import TelaErro from '../../components/telaErro'

// 404: o endereço acessado não existe.
function Erro404() {
  return (
    <TelaErro
      codigo="404"
      rotulo="Página não encontrada"
      titulo="Não encontramos esta página"
      descricao="O endereço que você tentou acessar não existe ou foi movido para outro lugar. Pode ser que o link esteja incompleto ou desatualizado."
      dica="Verifique o endereço digitado ou use o menu do sistema para voltar ao painel."
      tom="azul"
      icone="busca"
      acoes={[
        { rotulo: 'Voltar para o início', para: '/' },
        {
          rotulo: 'Ir para a página anterior',
          aoClicar: () => window.history.back(),
          variante: 'secundario',
        },
      ]}
    />
  )
}

export default Erro404
