import TelaErro from '../../components/telaErro'

// 401: o usuário não está autenticado.
function Erro401() {
  return (
    <TelaErro
      codigo="401"
      rotulo="Acesso não autorizado"
      titulo="Você precisa entrar para continuar"
      descricao="Esta página só pode ser acessada por usuários autenticados. Sua sessão pode ter expirado ou você ainda não fez o login."
      dica="Entre com seu e-mail e senha do EduGest para acessar o painel."
      tom="azul"
      icone="chave"
      acoes={[
        { rotulo: 'Entrar novamente', para: '/login' },
        { rotulo: 'Voltar para o início', para: '/', variante: 'secundario' },
      ]}
    />
  )
}

export default Erro401
