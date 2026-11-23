
import { useEffect, useState } from 'react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  GraduationCap,
  LockKeyhole,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from 'lucide-react'

import BarraLateral from '../../components/Barra Lateral/BarraLateralResponsavel'
import '../../styles/Responsavel/configuracoesResponsavel.css'

const chaveStorage = 'edugest:responsavel:configuracoes'

const dadosIniciais = {
  nome: 'Ana Costa',
  cpf: '•••.•••.•••-42',
  email: 'ana.costa@email.com',
  celular: '(79) 99912-2040',
  notificacoes: {
    faltas: true,
    notas: true,
    eventos: true,
    mensagens: true,
  },
  contatos: [
    {
      id: 1,
      nome: 'Ana Costa',
      parentesco: 'Mãe · Contato principal',
      telefone: '(79) 99912-2040',
    },
    {
      id: 2,
      nome: 'Paulo Costa',
      parentesco: 'Pai · Contato alternativo',
      telefone: '(79) 99832-1170',
    },
  ],
}

const filhos = [
  {
    id: 'lucas',
    nome: 'Lucas Costa',
    turma: '8º ano A',
    matricula: '20260842',
  },
  {
    id: 'sofia',
    nome: 'Sofia Costa',
    turma: '9º ano B',
    matricula: '20260517',
  },
]

function carregarDados() {
  try {
    const salvos = localStorage.getItem(chaveStorage)
    return salvos ? { ...dadosIniciais, ...JSON.parse(salvos) } : dadosIniciais
  } catch {
    return dadosIniciais
  }
}

function ConfiguracoesResponsavel() {
  const [dados, setDados] = useState(carregarDados)
  const [filhoSelecionado, setFilhoSelecionado] = useState('lucas')
  const [modal, setModal] = useState(null)
  const [contatoEditando, setContatoEditando] = useState(null)
  const [mensagem, setMensagem] = useState('')

  const [formContato, setFormContato] = useState({
    nome: '',
    parentesco: '',
    telefone: '',
  })

  const [senha, setSenha] = useState({
    atual: '',
    nova: '',
    confirmar: '',
  })

  useEffect(() => {
    localStorage.setItem(chaveStorage, JSON.stringify(dados))
  }, [dados])

  function atualizarCampo(campo, valor) {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }))
  }

  function alternarNotificacao(chave) {
    setDados((anterior) => ({
      ...anterior,
      notificacoes: {
        ...anterior.notificacoes,
        [chave]: !anterior.notificacoes[chave],
      },
    }))
  }

  function salvarAlteracoes() {
    localStorage.setItem(chaveStorage, JSON.stringify(dados))
    setMensagem('Alterações salvas com sucesso!')
    setTimeout(() => setMensagem(''), 3000)
  }

  function abrirNovoContato() {
    setContatoEditando(null)
    setFormContato({ nome: '', parentesco: '', telefone: '' })
    setModal('contato')
  }

  function abrirEdicaoContato(contato) {
    setContatoEditando(contato.id)
    setFormContato({
      nome: contato.nome,
      parentesco: contato.parentesco,
      telefone: contato.telefone,
    })
    setModal('contato')
  }

  function salvarContato(event) {
    event.preventDefault()

    if (contatoEditando) {
      setDados((anterior) => ({
        ...anterior,
        contatos: anterior.contatos.map((contato) =>
          contato.id === contatoEditando
            ? { ...contato, ...formContato }
            : contato
        ),
      }))
    } else {
      setDados((anterior) => ({
        ...anterior,
        contatos: [
          ...anterior.contatos,
          { id: Date.now(), ...formContato },
        ],
      }))
    }

    setModal(null)
  }

  function salvarSenha(event) {
    event.preventDefault()

    if (senha.nova.length < 6) {
      setMensagem('A nova senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (senha.nova !== senha.confirmar) {
      setMensagem('A confirmação da senha não corresponde.')
      return
    }

    setSenha({ atual: '', nova: '', confirmar: '' })
    setModal(null)
    setMensagem('Solicitação de alteração registrada (demonstração).')
    setTimeout(() => setMensagem(''), 4000)
  }

  const aluno = filhos.find((filho) => filho.id === filhoSelecionado)

  return (
    <div className="resp-config-layout">
      <BarraLateral />

      <main className="resp-config-main">
        <header className="resp-config-topbar">
          <span>Portal do Responsável / Perfil e configurações</span>

          <div className="resp-config-usuario">
            <div className="resp-config-avatar">AC</div>
            <div>
              <strong>{dados.nome}</strong>
              <span>Responsável</span>
            </div>
          </div>
        </header>

        <div className="resp-config-conteudo">
          <section className="resp-config-cabecalho">
            <div>
              <h1>Perfil e configurações</h1>
              <p>
                Mantenha seus contatos atualizados e escolha como acompanhar
                a vida escolar.
              </p>
            </div>

            <button
              type="button"
              className="resp-config-salvar"
              onClick={salvarAlteracoes}
            >
              <Check size={16} />
              Salvar alterações
            </button>
          </section>

          <div className="resp-config-selecao-aluno">
            {filhos.map((filho) => (
              <button
                type="button"
                key={filho.id}
                className={
                  filhoSelecionado === filho.id
                    ? 'resp-config-aluno ativo'
                    : 'resp-config-aluno'
                }
                onClick={() => setFilhoSelecionado(filho.id)}
              >
                <GraduationCap size={15} />
                {filho.nome} · {filho.turma}
              </button>
            ))}

            <span className="resp-config-ano">
              Ano letivo 2026 · Escola Estadual Farol
            </span>
          </div>

          <div className="resp-config-grid">
            <div className="resp-config-coluna">
              <section className="resp-config-card">
                <div className="resp-config-card-titulo">
                  <div>
                    <h2>Informações do responsável</h2>
                    <p>{dados.nome} · Mãe / responsável legal</p>
                  </div>
                  <UserRound size={19} />
                </div>

                <div className="resp-config-form-grid">
                  <label>
                    Nome completo
                    <input
                      value={dados.nome}
                      onChange={(e) => atualizarCampo('nome', e.target.value)}
                    />
                  </label>

                  <label>
                    CPF
                    <input value={dados.cpf} disabled />
                  </label>

                  <label>
                    E-mail de acesso
                    <input
                      type="email"
                      value={dados.email}
                      onChange={(e) => atualizarCampo('email', e.target.value)}
                    />
                  </label>

                  <label>
                    Celular
                    <input
                      value={dados.celular}
                      onChange={(e) => atualizarCampo('celular', e.target.value)}
                    />
                  </label>
                </div>

                <small className="resp-config-observacao">
                  Para alterar nome, CPF ou vínculo familiar, solicite a
                  atualização à secretaria. E-mail e celular são usados nos
                  avisos da escola.
                </small>
              </section>

              <section className="resp-config-card">
                <div className="resp-config-card-titulo">
                  <div>
                    <h2>Filhos vinculados</h2>
                    <p>2 alunos · Escola Estadual Farol</p>
                  </div>
                  <GraduationCap size={19} />
                </div>

                <div className="resp-config-filhos">
                  {filhos.map((filho) => (
                    <button
                      type="button"
                      key={filho.id}
                      className={
                        filhoSelecionado === filho.id
                          ? 'resp-config-filho selecionado'
                          : 'resp-config-filho'
                      }
                      onClick={() => setFilhoSelecionado(filho.id)}
                    >
                      <span className="resp-config-filho-icone">
                        <GraduationCap size={18} />
                      </span>

                      <span className="resp-config-filho-info">
                        <strong>{filho.nome}</strong>
                        <small>
                          {filho.turma} · Matrícula {filho.matricula}
                        </small>
                      </span>

                      <span className="resp-config-filho-acao">
                        {filhoSelecionado === filho.id
                          ? 'Selecionado'
                          : 'Selecionar →'}
                      </span>
                    </button>
                  ))}
                </div>

                <small className="resp-config-observacao">
                  Vínculo ausente ou incorreto? Apenas a escola pode validar
                  o acesso.
                </small>
              </section>

              <section className="resp-config-card">
                <div className="resp-config-card-titulo">
                  <div>
                    <h2>Contatos de emergência</h2>
                    <p>Disponíveis à secretaria para situações urgentes com os alunos.</p>
                  </div>
                  <Phone size={19} />
                </div>

                <div className="resp-config-contatos">
                  {dados.contatos.map((contato) => (
                    <div className="resp-config-contato" key={contato.id}>
                      <div>
                        <strong>
                          {contato.nome} · {contato.parentesco}
                        </strong>
                        <span>{contato.telefone}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => abrirEdicaoContato(contato)}
                      >
                        Editar
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="resp-config-adicionar"
                  onClick={abrirNovoContato}
                >
                  <Plus size={14} />
                  Adicionar contato de emergência
                </button>
              </section>
            </div>

            <div className="resp-config-coluna">
              <section className="resp-config-card">
                <div className="resp-config-card-titulo">
                  <div>
                    <h2>Preferências de notificações</h2>
                    <p>Aplicadas aos dois filhos · Portal e e-mail</p>
                  </div>
                  <Bell size={19} />
                </div>

                <div className="resp-config-notificacoes">
                  <div className="resp-config-notificacao">
                    <div>
                      <strong>Faltas e frequência</strong>
                      <small>Avisos quando houver nova ausência.</small>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={dados.notificacoes.faltas}
                      className={`resp-config-switch ${
                        dados.notificacoes.faltas ? 'ligado' : ''
                      }`}
                      onClick={() => alternarNotificacao('faltas')}
                    >
                      <span />
                    </button>
                  </div>

                  <div className="resp-config-notificacao">
                    <div>
                      <strong>Notas e devolutivas</strong>
                      <small>Receba os resultados publicados.</small>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={dados.notificacoes.notas}
                      className={`resp-config-switch ${
                        dados.notificacoes.notas ? 'ligado' : ''
                      }`}
                      onClick={() => alternarNotificacao('notas')}
                    >
                      <span />
                    </button>
                  </div>

                  <div className="resp-config-notificacao">
                    <div>
                      <strong>Eventos e prazos</strong>
                      <small>Lembretes do calendário acadêmico.</small>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={dados.notificacoes.eventos}
                      className={`resp-config-switch ${
                        dados.notificacoes.eventos ? 'ligado' : ''
                      }`}
                      onClick={() => alternarNotificacao('eventos')}
                    >
                      <span />
                    </button>
                  </div>

                  <div className="resp-config-notificacao">
                    <div>
                      <strong>Mensagens da escola</strong>
                      <small>Novas conversas e comunicados.</small>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={dados.notificacoes.mensagens}
                      className={`resp-config-switch ${
                        dados.notificacoes.mensagens ? 'ligado' : ''
                      }`}
                      onClick={() => alternarNotificacao('mensagens')}
                    >
                      <span />
                    </button>
                  </div>
                </div>

                <small className="resp-config-observacao">
                  Avisos essenciais de segurança são enviados sempre.
                </small>
              </section>

              <section className="resp-config-card">
                <div className="resp-config-card-titulo">
                  <div>
                    <h2>Segurança e privacidade</h2>
                    <p>Proteja sua conta e seus dados.</p>
                  </div>
                  <ShieldCheck size={19} />
                </div>

                <p className="resp-config-seguranca-texto">
                  Senha atualizada hoje · 05/10/2026
                  <br />
                  Último acesso: hoje, às 7h40 · Este dispositivo
                </p>

                <button
                  type="button"
                  className="resp-config-link"
                  onClick={() => setModal('senha')}
                >
                  Alterar senha <ChevronRight size={14} />
                </button>

                <button
                  type="button"
                  className="resp-config-link"
                  onClick={() => setModal('dispositivos')}
                >
                  Gerenciar dispositivos conectados <ChevronRight size={14} />
                </button>

                <div className="resp-config-divisor" />

                <p className="resp-config-seguranca-texto">
                  Seus dados são usados para o acompanhamento escolar.
                  O acesso às informações dos alunos é restrito aos
                  responsáveis autorizados.
                </p>

                <button
                  type="button"
                  className="resp-config-link"
                  onClick={() => setModal('privacidade')}
                >
                  Aviso de Privacidade e direitos LGPD <ChevronRight size={14} />
                </button>
              </section>

              <section className="resp-config-card resp-config-suporte">
                <div className="resp-config-card-titulo">
                  <div>
                    <h2>Suporte da escola</h2>
                    <p>Secretaria · Escola Estadual Farol</p>
                  </div>
                  <MessageCircle size={19} />
                </div>

                <strong className="resp-config-telefone">
                  (79) 3200-2026
                </strong>

                <span className="resp-config-email-escola">
                  secretaria@farol.edu.br
                </span>

                <span className="resp-config-horario">
                  Atendimento de segunda a sexta, das 7h às 17h.
                </span>

                <a
                  className="resp-config-botao-suporte"
                  href="mailto:secretaria@farol.edu.br?subject=Suporte%20EduGest"
                >
                  <Mail size={14} />
                  Enviar mensagem à secretaria
                </a>

                <small className="resp-config-observacao">
                  Para dúvidas sobre vínculo, cadastro ou acesso ao portal.
                </small>
              </section>
            </div>
          </div>

          <footer className="resp-config-rodape">
            <span>EduGest · Dados demonstrativos · Atualizado em 05/10/2026 às 08h</span>
            <span>Privacidade e proteção de dados</span>
          </footer>
        </div>
      </main>

      {mensagem && (
        <div className="resp-config-feedback">
          <Check size={16} />
          {mensagem}
          <button type="button" onClick={() => setMensagem('')}>
            <X size={15} />
          </button>
        </div>
      )}

      {modal === 'contato' && (
        <div className="resp-config-overlay" onClick={() => setModal(null)}>
          <section
            className="resp-config-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resp-config-modal-topo">
              <div>
                <h2>
                  {contatoEditando ? 'Editar contato' : 'Novo contato de emergência'}
                </h2>
                <p>Preencha os dados da pessoa de contato.</p>
              </div>
              <button type="button" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={salvarContato}>
              <label>
                Nome completo
                <input
                  required
                  value={formContato.nome}
                  onChange={(e) =>
                    setFormContato({ ...formContato, nome: e.target.value })
                  }
                />
              </label>

              <label>
                Parentesco / relação
                <input
                  required
                  placeholder="Ex.: Pai, avó, tio..."
                  value={formContato.parentesco}
                  onChange={(e) =>
                    setFormContato({
                      ...formContato,
                      parentesco: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Telefone
                <input
                  required
                  value={formContato.telefone}
                  onChange={(e) =>
                    setFormContato({ ...formContato, telefone: e.target.value })
                  }
                />
              </label>

              <div className="resp-config-modal-acoes">
                <button
                  type="button"
                  className="secundario"
                  onClick={() => setModal(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="primario">
                  Salvar contato
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal === 'senha' && (
        <div className="resp-config-overlay" onClick={() => setModal(null)}>
          <section
            className="resp-config-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resp-config-modal-topo">
              <div>
                <h2>Alterar senha</h2>
                <p>Crie uma nova senha para sua conta.</p>
              </div>
              <button type="button" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>

            <form onSubmit={salvarSenha}>
              <label>
                Senha atual
                <input
                  type="password"
                  required
                  value={senha.atual}
                  onChange={(e) => setSenha({ ...senha, atual: e.target.value })}
                />
              </label>

              <label>
                Nova senha
                <input
                  type="password"
                  required
                  value={senha.nova}
                  onChange={(e) => setSenha({ ...senha, nova: e.target.value })}
                />
              </label>

              <label>
                Confirmar nova senha
                <input
                  type="password"
                  required
                  value={senha.confirmar}
                  onChange={(e) =>
                    setSenha({ ...senha, confirmar: e.target.value })
                  }
                />
              </label>

              <div className="resp-config-modal-acoes">
                <button
                  type="button"
                  className="secundario"
                  onClick={() => setModal(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="primario">
                  Confirmar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {(modal === 'dispositivos' || modal === 'privacidade') && (
        <div className="resp-config-overlay" onClick={() => setModal(null)}>
          <section
            className="resp-config-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resp-config-modal-topo">
              <div>
                <h2>
                  {modal === 'dispositivos'
                    ? 'Dispositivos conectados'
                    : 'Aviso de privacidade'}
                </h2>
                <p>
                  {modal === 'dispositivos'
                    ? 'Sessões demonstrativas da sua conta.'
                    : 'Como seus dados são utilizados no EduGest.'}
                </p>
              </div>
              <button type="button" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>

            {modal === 'dispositivos' ? (
              <div className="resp-config-dispositivo">
                <Smartphone size={22} />
                <div>
                  <strong>Este dispositivo</strong>
                  <span> Navegador atual · Acesso ativo</span>
                </div>
                <span className="resp-config-status">Ativo</span>
              </div>
            ) : (
              <p className="resp-config-privacidade">
                Os dados pessoais e escolares são utilizados para permitir
                o acompanhamento da vida acadêmica dos alunos vinculados.
                O acesso é restrito aos responsáveis autorizados e à equipe
                escolar, conforme suas permissões. Esta tela utiliza dados
                demonstrativos e não realiza integração com uma base real.
              </p>
            )}

            <div className="resp-config-modal-acoes">
              <button
                type="button"
                className="primario"
                onClick={() => setModal(null)}
              >
                Fechar
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default ConfiguracoesResponsavel
