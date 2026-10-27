import TelaErro from '../../components/telaErro'

// 403: o usuário está logado, mas não tem permissão para a página.
function Erro403() {
  return (
    <TelaErro
      codigo="403"
      rotulo="Acesso negado"
      titulo="Seu perfil não tem permissão"
      descricao="Você está autenticado, mas esta área é restrita a outro tipo de usuário. Coordenadores e docentes possuem permissões diferentes no sistema."
      dica="Volte para o seu painel ou entre com uma conta que tenha acesso a esta área."
      tom="vermelho"
      icone="bloqueado"
      acoes={[
        {
          rotulo: 'Voltar ao painel',
          aoClicar: () => window.history.back(),
        },
        { rotulo: 'Ir para o login', para: '/login', variante: 'secundario' },
      ]}
    />
  )
}

export default Erro403
