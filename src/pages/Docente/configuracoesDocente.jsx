import { useRef, useState } from "react";
import {
  Search,
  CircleHelp,
  ChevronDown,
  User,
  Shield,
  Bell,
  Sun,
  BookOpen,
  Save,
} from "lucide-react";
import "./configuracoesDocente.css";
import BarraLateral from '../../components/Barra Lateral/BarraLateralDocente'


const MENU = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "aparencia", label: "Aparência", icon: Sun },
  { id: "turmas", label: "Turmas/Disciplinas Vinculadas", icon: BookOpen },
];

const DADOS_INICIAIS = {
  nome: "Joao Silva",
  email: "joao.silva@seduc.se.gov.br",
  cargo: "Professor",
  escola: "C.E. Professor João Costa",
};

const iniciais = (nome) =>
  nome
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Avatar({ nome, tamanho = 36, foto }) {
  return (
    <div
      className="avatar"
      style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.36 }}
    >
      {foto ? <img src={foto} alt="" /> : iniciais(nome)}
    </div>
  );
}

function Campo({ id, label, ajuda, ...props }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}

function PerfilForm() {
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [salvo, setSalvo] = useState(DADOS_INICIAIS);
  const [foto, setFoto] = useState(null);
  const [erroFoto, setErroFoto] = useState("");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("hoje, 10:32");
  const inputFoto = useRef(null);

  const alterado = JSON.stringify(dados) !== JSON.stringify(salvo) || foto;

  const handleChange = (e) =>
    setDados((d) => ({ ...d, [e.target.name]: e.target.value }));

  const handleFoto = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!["image/jpeg", "image/png"].includes(arquivo.type)) {
      setErroFoto("Use uma imagem JPG ou PNG.");
      return;
    }
    if (arquivo.size > 2 * 1024 * 1024) {
      setErroFoto("A imagem passa de 2 MB. Escolha um arquivo menor.");
      return;
    }
    setErroFoto("");
    setFoto(URL.createObjectURL(arquivo));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: chamar a API aqui
    setSalvo(dados);
    const agora = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setUltimaAtualizacao(`hoje, ${agora}`);
  };

  return (
    <form className="painel" onSubmit={handleSubmit}>
      <header className="painel-cabecalho">
        <h2>Perfil</h2>
        <p>Atualize sua foto e seus dados pessoais.</p>
      </header>

      <div className="painel-corpo">
        <div className="foto-bloco">
          <Avatar nome={dados.nome} tamanho={80} foto={foto} />
          <div>
            <p className="foto-titulo">Foto de perfil</p>
            <p className="foto-dica">JPG ou PNG. Tamanho máximo de 2 MB.</p>
            <button
              type="button"
              className="btn-secundario"
              onClick={() => inputFoto.current?.click()}
            >
              Alterar foto
            </button>
            <input
              ref={inputFoto}
              type="file"
              accept="image/jpeg,image/png"
              hidden
              onChange={handleFoto}
            />
            {erroFoto && <p className="erro">{erroFoto}</p>}
          </div>
        </div>

        <hr />

        <Campo
          id="nome"
          name="nome"
          label="Nome completo"
          value={dados.nome}
          onChange={handleChange}
        />
        <Campo
          id="email"
          name="email"
          type="email"
          label="E-mail institucional"
          ajuda="Utilizado para acesso e comunicações oficiais."
          value={dados.email}
          onChange={handleChange}
        />
        <Campo
          id="cargo"
          name="cargo"
          label="Cargo"
          value={dados.cargo}
          onChange={handleChange}
        />
        <Campo
          id="escola"
          name="escola"
          label="Unidade escolar"
          value={dados.escola}
          onChange={handleChange}
        />
      </div>

      <footer className="painel-rodape">
        <span>Última atualização: {ultimaAtualizacao}</span>
        <button type="submit" className="btn-primario" disabled={!alterado}>
          <Save size={16} />
          Salvar alterações
        </button>
      </footer>
    </form>
  );
}

export default function Configuracoes() {
  const [aba, setAba] = useState("perfil");

  return (
    <div className="eg-layout">
      <BarraLateral />

      <div className="cfg-app">
        <header className="topbar">
          {/* igual ao que você já tem */}
        </header>

        <main className="conteudo">
          <h1>Configurações</h1>
          <p className="subtitulo">
            Gerencie suas preferências e informações da conta.
          </p>

          <div className="grade">
            <aside className="menu">
              <p className="menu-titulo">PREFERÊNCIAS</p>
              <nav>
                {MENU.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`cfg-menu-item ${aba === id ? "ativo" : ""}`}
                    aria-current={aba === id ? "page" : undefined}
                    onClick={() => setAba(id)}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </nav>
              <p className="versao">EduGest v2.4.0</p>
            </aside>

            {aba === "perfil" ? (
              <PerfilForm />
            ) : (
              <section className="painel">
                <header className="painel-cabecalho">
                  <h2>{MENU.find((m) => m.id === aba)?.label}</h2>
                </header>
                <div className="painel-corpo">
                  <p className="foto-dica">
                    Esta seção ainda será implementada.
                  </p>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}