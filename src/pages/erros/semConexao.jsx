import TelaErro from '../../components/telaErro'

// Tela exibida quando o navegador fica sem internet.
function SemConexao() {
  return (
    <TelaErro
      codigo="Offline"
      codigoLongo
      codigoRodape="SEM CONEXÃO"
      rotulo="Sem conexão"
      titulo="Você está offline"
      descricao="Não foi possível conectar ao servidor do EduGest. Verifique se o seu computador ou celular está conectado a uma rede com internet."
      dica="Confira o Wi-Fi ou o cabo de rede e tente novamente. Se estiver em uma rede da faculdade, verifique se é necessário fazer login no portal."
      tom="cinza"
      icone="conexao"
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

export default SemConexao
