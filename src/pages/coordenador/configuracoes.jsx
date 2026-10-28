
import { useState } from 'react'
import {
  UserRound,
  Shield,
  Bell,
  Sun,
  Users,
  Building,
  CircleHelp,
  Save,
  Camera,
} from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/telasCoordenador.css'
import '../../styles/configuracoes.css'

const preferencias = [
  { id: 'perfil', label: 'Perfil', Icon: UserRound },
  { id: 'seguranca', label: 'Segurança', Icon: Shield },
  { id: 'notificacoes', label: 'Notificações', Icon: Bell },
  { id: 'aparencia', label: 'Aparência', Icon: Sun },
  { id: 'usuarios', label: 'Gestão de Usuários', Icon: Users },
  { id: 'institucional', label: 'Dados Institucionais', Icon: Building },
]

const perfilInicial = {
  nome: 'Marina Costa',
  email: 'marina.costa@seduc.se.gov.br',
  cargo: 'Coordenadora pedagógica',
  unidade: 'C.E. Professor João Costa',
}

function Configuracoes() {
  const [secaoAtiva, setSecaoAtiva] = useState('perfil')
  const [perfil, setPerfil] = useState(() => {
  try {
    const dadosSalvos = localStorage.getItem('edugest:coordenador:perfil')

    return dadosSalvos
      ? { ...perfilInicial, ...JSON.parse(dadosSalvos) }
      : perfilInicial
  } catch {
    return perfilInicial
  }
 })
  const [mensagem, setMensagem] = useState('')
  const [tema, setTema] = useState('claro')
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    sistema: true,
    reposicoes: true,
  })

  function alterarPerfil(event) {
    const { name, value } = event.target

    setPerfil((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    setMensagem('')
  }

  function salvarAlteracoes(event) {
  event.preventDefault()

  if (secaoAtiva !== 'perfil' && secaoAtiva !== 'institucional') {
    setMensagem('O salvamento desta seção ainda não foi implementado.')
    return
  }

  if (secaoAtiva === 'perfil') {
    if (!perfil.nome.trim() || !perfil.email.trim()) {
      setMensagem('Preencha o nome e o e-mail institucional.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.email.trim())) {
      setMensagem('Informe um endereço de e-mail válido.')
      return
    }
  }

  try {
    const perfilAtualizado = {
      ...perfil,
      nome: perfil.nome.trim(),
      email: perfil.email.trim(),
      cargo: perfil.cargo.trim(),
      unidade: perfil.unidade.trim(),
    }

    localStorage.setItem(
      'edugest:coordenador:perfil',
      JSON.stringify(perfilAtualizado)
    )

    setPerfil(perfilAtualizado)
    setMensagem('Alterações salvas com sucesso!')
  } catch {
    setMensagem('Não foi possível salvar. Verifique o armazenamento do navegador.')
  }
}

  const secao = preferencias.find(
    (item) => item.id === secaoAtiva
  )

  return (
    <div className="coordenador-layout telas-prototipo">
      <BarraLateral />

      <main className="dashboard-main tp-main configuracoes-main">
        <header className="tp-topbar configuracoes-topbar">
          <div className="config-ajuda">
            <CircleHelp size={19} />
          </div>

          <div className="tp-user">
            <span className="tp-avatar configuracoes-avatar">
              MC
            </span>
            <div>
              <strong>{perfil.nome || 'Coordenadora'}</strong>
              <small>Coordenadora</small>
            </div>
            <span>⌄</span>
          </div>
        </header>

        <div className="config-content">
          <div className="tp-page-title config-page-title">
            <div>
              <h1>Configurações</h1>
              <p>
                Gerencie suas preferências e informações da conta.
              </p>
            </div>
          </div>

          <div className="config-layout">
            <aside className="config-menu">
              <span className="config-menu-titulo">
                PREFERÊNCIAS
              </span>

              <nav aria-label="Seções de configurações">
                {preferencias.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`config-menu-item ${
                      secaoAtiva === id ? 'ativo' : ''
                    }`}
                    onClick={() => {
                      setSecaoAtiva(id)
                      setMensagem('')
                    }}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>

              <div className="config-versao">
                EduGest v2.4.0
              </div>
            </aside>

            <form
              className="config-painel"
              onSubmit={salvarAlteracoes}
            >
              <div className="config-painel-cabecalho">
                <h2>{secao?.label}</h2>
                <p>
                  {secaoAtiva === 'perfil'
                    ? 'Atualize sua foto e seus dados pessoais.'
                    : `Gerencie suas preferências de ${secao?.label.toLowerCase()}.`}
                </p>
              </div>

              {secaoAtiva === 'perfil' && (
                <div className="config-form-conteudo">
                  <div className="config-foto">
                    <div className="config-foto-avatar">
                      MC
                    </div>

                    <div className="config-foto-info">
                      <span>Foto de perfil</span>
                      <small>
                        JPG ou PNG. Tamanho máximo de 2 MB.
                      </small>
                      <label className="config-botao-foto">
                        <Camera size={15} />
                        Alterar foto
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={(event) => {
                            const arquivo = event.target.files?.[0]

                            if (arquivo && arquivo.size > 2 * 1024 * 1024) {
                              setMensagem('A imagem deve ter no máximo 2 MB.')
                              event.target.value = ''
                            } else if (arquivo) {
                              setMensagem(
                                'Foto selecionada. O envio será disponibilizado com a integração de arquivos.'
                              )
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="config-campos">
                    <label>
                      Nome completo
                      <input
                        name="nome"
                        value={perfil.nome}
                        onChange={alterarPerfil}
                        required
                      />
                    </label>

                    <label>
                      E-mail institucional
                      <input
                        name="email"
                        type="email"
                        value={perfil.email}
                        onChange={alterarPerfil}
                        required
                      />
                      <small>
                        Utilizado para acesso e comunicações oficiais.
                      </small>
                    </label>

                    <label>
                      Cargo
                      <input
                        name="cargo"
                        value={perfil.cargo}
                        onChange={alterarPerfil}
                      />
                    </label>

                    <label>
                      Unidade escolar
                      <input
                        name="unidade"
                        value={perfil.unidade}
                        onChange={alterarPerfil}
                      />
                    </label>
                  </div>
                </div>
              )}

              {secaoAtiva === 'seguranca' && (
                <div className="config-opcoes">
                  <h3>Segurança da conta</h3>
                  <p>
                    As opções de alteração de senha e autenticação
                    dependem da integração com o sistema de acesso.
                  </p>
                  <div className="config-aviso">
                    A alteração de senha ainda não está disponível.
                  </div>
                </div>
              )}

              {secaoAtiva === 'notificacoes' && (
                <div className="config-opcoes">
                  <h3>Preferências de notificações</h3>

                  {[
                    ['email', 'Notificações por e-mail'],
                    ['sistema', 'Avisos dentro do sistema'],
                    ['reposicoes', 'Solicitações de reposição'],
                  ].map(([id, label]) => (
                    <label className="config-toggle" key={id}>
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        checked={notificacoes[id]}
                        onChange={(event) => {
                          setNotificacoes((anterior) => ({
                            ...anterior,
                            [id]: event.target.checked,
                          }))
                          setMensagem('')
                        }}
                      />
                    </label>
                  ))}
                </div>
              )}

              {secaoAtiva === 'aparencia' && (
                <div className="config-opcoes">
                  <h3>Aparência do sistema</h3>
                  <p>Escolha sua preferência visual.</p>

                  <div className="config-temas">
                    {['claro', 'escuro'].map((opcao) => (
                      <button
                        type="button"
                        key={opcao}
                        className={`config-tema ${
                          tema === opcao ? 'selecionado' : ''
                        }`}
                        onClick={() => {
                          setTema(opcao)
                          setMensagem(
                            opcao === 'claro'
                              ? 'Tema claro selecionado.'
                              : 'Tema escuro selecionado. A aplicação do tema ainda precisa ser integrada.'
                          )
                        }}
                      >
                        {opcao === 'claro' ? 'Tema claro' : 'Tema escuro'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {secaoAtiva === 'usuarios' && (
                <div className="config-opcoes">
                  <h3>Gestão de Usuários</h3>
                  <p>
                    O gerenciamento de contas e permissões será
                    disponibilizado quando houver integração com
                    os dados de usuários.
                  </p>
                  <div className="config-aviso">
                    Nenhuma conta pode ser alterada nesta seção ainda.
                  </div>
                </div>
              )}

              {secaoAtiva === 'institucional' && (
                <div className="config-opcoes">
                  <h3>Dados Institucionais</h3>
                  <p>
                    Informações da unidade escolar vinculada à conta.
                  </p>
                  <label className="config-campo-unico">
                    Nome da unidade escolar
                    <input
                      value={perfil.unidade}
                      onChange={(event) => {
                        setPerfil((anterior) => ({
                          ...anterior,
                          unidade: event.target.value,
                        }))
                        setMensagem('')
                      }}
                    />
                  </label>
                </div>
              )}

              <footer className="config-painel-rodape">
                <div>
                  {mensagem ? (
                    <span className="config-mensagem" role="status">
                      {mensagem}
                    </span>
                  ) : (
                    <span className="config-atualizacao">
                      Última atualização: nesta sessão
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="config-salvar"
                >
                  <Save size={16} />
                  Salvar alterações
                </button>
              </footer>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Configuracoes
