import TelaErro from '../../components/telaErro'

// 503: o sistema está temporariamente fora do ar.
function Erro503() {
  return (
    <TelaErro
      codigo="503"
      rotulo="Em manutenção"
      titulo="O sistema está temporariamente indisponível"
      descricao="Estamos realizando uma atualização programada no EduGest. Durante esse período, algumas funcionalidades podem ficar fora do ar."
      dica="Volte em alguns minutos. Seus dados estão salvos e estarão disponíveis assim que a manutenção terminar."
      tom="ambar"
      icone="manutencao"
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

export default Erro503
