import React, { useState, useRef } from "react";
import { solicitacoesIniciaisSeduc } from "../../data/solicitacoes";
import BarraLateral from "../../components/barraLateral";
import "../../styles/Gestor/solicitacoesGestor.css";

export default function SolicitacoesGestor() {
  const [listaSolicitacoes, setListaSolicitacoes] = useState(solicitacoesIniciaisSeduc);
  const [abaAtiva, setAbaAtiva] = useState("pendentes");

  // Controle de navegação entre as 3 telas: 'lista' | 'detalhes' | 'parecer'
  const [telaAtual, setTelaAtual] = useState("lista");
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  // Estados da Tela 3 (Parecer Técnico)
  const [decisao, setDecisao] = useState("aprovar"); // 'aprovar' | 'rejeitar'
  const [textoParecer, setTextoParecer] = useState("");
  const [arquivoAnexo, setArquivoAnexo] = useState(null);
  const fileInputRef = useRef(null);

  // Abrir Tela 2 (Detalhes)
  const abrirDetalhes = (item) => {
    setSolicitacaoSelecionada(item);
    setTelaAtual("detalhes");
  };

  // Abrir Tela 3 (Parecer Técnico)
  const abrirParecer = (tipoDecisaoInicial = "aprovar") => {
    setDecisao(tipoDecisaoInicial);
    setTextoParecer(solicitacaoSelecionada?.parecerPadrao || "");
    setArquivoAnexo(null);
    setTelaAtual("parecer");
  };

  // Confirmar decisão na Tela 3 e atualizar status na lista
  const confirmarDecisao = (e) => {
    e.preventDefault();
    if (!textoParecer.trim()) {
      alert("Por favor, preencha o parecer/justificativa obrigatório.");
      return;
    }

    const novoStatus = decisao === "aprovar" ? "Aprovado" : "Rejeitado";
    const listaAtualizada = listaSolicitacoes.map((item) =>
      item.id === solicitacaoSelecionada.id
        ? { ...item, status: novoStatus, parecerPadrao: textoParecer }
        : item
    );

    setListaSolicitacoes(listaAtualizada);
    setSolicitacaoSelecionada({
      ...solicitacaoSelecionada,
      status: novoStatus,
      parecerPadrao: textoParecer,
    });
    setTelaAtual("lista");
  };

  // Classe do badge de status
  const obterClasseStatus = (status) => {
    if (status === "Pendente") return "badge-status pendente";
    if (status === "Em análise") return "badge-status analise";
    if (status === "Aprovado") return "badge-status aprovado";
    return "badge-status rejeitado";
  };

  return (
    <div className="layout-gestor">
      {/* Barra Lateral Padrão Integrada */}
      <BarraLateral />

      {/* Conteúdo Principal direto, sem o cabeçalho superior */}
      <div className="conteudo-principal">
        <main className="container-pagina">
          {/* =========================================================
              TELA 1: LISTA DE SOLICITAÇÕES DAS ESCOLAS
          ========================================================= */}
          {telaAtual === "lista" && (
            <div className="fade-in">
              <div className="cabecalho-pagina">
                <h1>Solicitações das Escolas</h1>
                <p>Analise e responda às solicitações de personalização enviadas pelas escolas.</p>
              </div>

              {/* Abas */}
              <div className="abas-navegacao">
                <button
                  className={`aba-btn ${abaAtiva === "pendentes" ? "ativa" : ""}`}
                  onClick={() => setAbaAtiva("pendentes")}
                >
                  Pendentes (8)
                </button>
                <button
                  className={`aba-btn ${abaAtiva === "analise" ? "ativa" : ""}`}
                  onClick={() => setAbaAtiva("analise")}
                >
                  Em análise (4)
                </button>
                <button
                  className={`aba-btn ${abaAtiva === "finalizadas" ? "ativa" : ""}`}
                  onClick={() => setAbaAtiva("finalizadas")}
                >
                  Finalizadas
                </button>
              </div>

              {/* Tabela */}
              <div className="card-tabela">
                <table className="tabela-solicitacoes">
                  <thead>
                    <tr>
                      <th>Escola</th>
                      <th>Tipo de solicitação</th>
                      <th>Data de envio</th>
                      <th>Status</th>
                      <th className="alinhar-direita">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaSolicitacoes.map((item) => (
                      <tr key={item.id}>
                        <td className="texto-negrito">{item.escola}</td>
                        <td>{item.tipo}</td>
                        <td className="texto-data">{item.dataEnvio}</td>
                        <td>
                          <span className={obterClasseStatus(item.status)}>
                            {item.status}
                          </span>
                        </td>
                        <td className="alinhar-direita">
                          <button
                            className="btn-analisar"
                            onClick={() => abrirDetalhes(item)}
                          >
                            Analisar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Rodapé de Paginação */}
                <div className="rodape-tabela">
                  <span>Mostrando 1-4 de 8 solicitações pendentes</span>
                  <div className="paginacao">
                    <button className="pagina-btn ativa">1</button>
                    <button className="pagina-btn">2</button>
                    <button className="pagina-btn">3</button>
                    <button className="pagina-btn">4</button>
                    <button className="pagina-btn">...</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TELA 2: DETALHES DA SOLICITAÇÃO
          ========================================================= */}
          {telaAtual === "detalhes" && solicitacaoSelecionada && (
            <div className="fade-in">
              {/* Breadcrumb */}
              <nav className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => setTelaAtual("lista")}>
                  Solicitações
                </span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-link" onClick={() => setTelaAtual("lista")}>
                  Detalhes
                </span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-atual">{solicitacaoSelecionada.escola}</span>
              </nav>

              {/* Card Cabeçalho da Solicitação */}
              <div className="card-topo-detalhes">
                <div className="info-principal-detalhes">
                  <div className="titulo-com-badge">
                    <h1>{solicitacaoSelecionada.escola}</h1>
                    <span className={obterClasseStatus(solicitacaoSelecionada.status)}>
                      {solicitacaoSelecionada.status}
                    </span>
                  </div>
                  <p>
                    {solicitacaoSelecionada.tipo} • Código INEP: {solicitacaoSelecionada.codigoInep} • Enviado em{" "}
                    {solicitacaoSelecionada.dataEnvio} às {solicitacaoSelecionada.horaEnvio}
                  </p>
                </div>

                <div className="acoes-topo-detalhes">
                  <button
                    className="btn-rejeitar"
                    onClick={() => abrirParecer("rejeitar")}
                  >
                    Rejeitar
                  </button>
                  <button
                    className="btn-solicitar-info"
                    onClick={() => alert("Solicitação de informações adicionais enviada à escola.")}
                  >
                    Solicitar Informações
                  </button>
                  <button
                    className="btn-aprovar"
                    onClick={() => abrirParecer("aprovar")}
                  >
                    Aprovar Solicitação
                  </button>
                </div>
              </div>

              {/* Grid Inferior: Dados + Documentos (Esquerda) e Histórico (Direita) */}
              <div className="grid-detalhes">
                <div className="coluna-esquerda">
                  {/* Card Dados da Solicitação */}
                  <div className="card-bloco">
                    <h2 className="titulo-card">Dados da Solicitação</h2>
                    <div className="divisor-card"></div>

                    <div className="grid-campos-duplos">
                      <div className="campo-info">
                        <label>ESCOLA SOLICITANTE</label>
                        <p>{solicitacaoSelecionada.escolaNomeCompleto}</p>
                      </div>
                      <div className="campo-info">
                        <label>TIPO DE SOLICITAÇÃO</label>
                        <p>{solicitacaoSelecionada.tipoDetalhado}</p>
                      </div>
                    </div>

                    <div className="campo-info">
                      <label>DESCRIÇÃO DO PEDIDO</label>
                      <p>{solicitacaoSelecionada.descricao}</p>
                    </div>

                    <div className="campo-info">
                      <label>JUSTIFICATIVA PEDAGÓGICA</label>
                      <p>{solicitacaoSelecionada.justificativa}</p>
                    </div>
                  </div>

                  {/* Card Documentos Anexados */}
                  <div className="card-bloco">
                    <h2 className="titulo-card">Documentos Anexados</h2>

                    <div className="lista-documentos">
                      {solicitacaoSelecionada.documentos.map((doc) => (
                        <div key={doc.id} className="item-documento">
                          <div className="doc-esquerda">
                            <div className="icone-pdf">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                              </svg>
                            </div>
                            <span>{doc.nome}</span>
                          </div>
                          <button
                            className="link-visualizar"
                            onClick={() => alert(`Abrindo documento: ${doc.nome}`)}
                          >
                            Visualizar documento
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Histórico */}
                <div className="coluna-direita">
                  <div className="card-bloco">
                    <h2 className="titulo-card">Histórico da Solicitação</h2>
                    <div className="divisor-card"></div>

                    <div className="linha-tempo">
                      {solicitacaoSelecionada.historico.map((evento) => (
                        <div key={evento.id} className={`item-timeline ${evento.estado}`}>
                          <div className="marcador-timeline"></div>
                          <div className="conteudo-timeline">
                            <strong>{evento.titulo}</strong>
                            <span>{evento.subtitulo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TELA 3: PARECER TÉCNICO DA SOLICITAÇÃO
          ========================================================= */}
          {telaAtual === "parecer" && solicitacaoSelecionada && (
            <div className="fade-in">
              {/* Breadcrumb */}
              <nav className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => setTelaAtual("lista")}>
                  Solicitações
                </span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-link" onClick={() => setTelaAtual("detalhes")}>
                  {solicitacaoSelecionada.escola}
                </span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-atual">Parecer Técnico</span>
              </nav>

              <form className="card-parecer" onSubmit={confirmarDecisao}>
                <div className="cabecalho-parecer">
                  <h1>Parecer Técnico da Solicitação</h1>
                  <p>
                    {solicitacaoSelecionada.escolaNomeCompleto} — {solicitacaoSelecionada.tipo} • ID da solicitação: #{solicitacaoSelecionada.id}
                  </p>
                </div>

                <div className="divisor-card"></div>

                {/* Decisão Administrativa */}
                <div className="secao-formulario">
                  <label className="rotulo-secao">Decisão Administrativa</label>
                  <div className="opcoes-decisao">
                    {/* Card Aprovar */}
                    <div
                      className={`card-opcao-decisao aprovar ${
                        decisao === "aprovar" ? "selecionado" : ""
                      }`}
                      onClick={() => setDecisao("aprovar")}
                    >
                      <div className="icone-selecao">
                        {decisao === "aprovar" ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="#15803d">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="16 9 10.5 14.5 8 12" stroke="#fff" strokeWidth="2.2" fill="none" />
                          </svg>
                        ) : (
                          <div className="circulo-vazio"></div>
                        )}
                      </div>
                      <div className="texto-opcao">
                        <strong>Aprovar solicitação</strong>
                        <span>A escola receberá a autorização formal e o modelo será aplicado.</span>
                      </div>
                    </div>

                    {/* Card Rejeitar */}
                    <div
                      className={`card-opcao-decisao rejeitar ${
                        decisao === "rejeitar" ? "selecionado" : ""
                      }`}
                      onClick={() => setDecisao("rejeitar")}
                    >
                      <div className="icone-selecao">
                        {decisao === "rejeitar" ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="#dc2626">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="16 9 10.5 14.5 8 12" stroke="#fff" strokeWidth="2.2" fill="none" />
                          </svg>
                        ) : (
                          <div className="circulo-vazio"></div>
                        )}
                      </div>
                      <div className="texto-opcao">
                        <strong>Rejeitar solicitação</strong>
                        <span>O pedido será arquivado com a justificativa técnica anexada.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parecer / Justificativa */}
                <div className="secao-formulario">
                  <label className="rotulo-secao">Parecer / Justificativa (obrigatório)</label>
                  <textarea
                    className="textarea-parecer"
                    rows="5"
                    value={textoParecer}
                    onChange={(e) => setTextoParecer(e.target.value)}
                    placeholder="Digite aqui a análise técnica detalhada da solicitação..."
                    required
                  />
                </div>

                {/* Anexar Documento Oficial */}
                <div className="secao-formulario">
                  <label className="rotulo-secao">Anexar documento oficial (opcional)</label>
                  <div
                    className="area-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => setArquivoAnexo(e.target.files[0])}
                    />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <strong>
                      {arquivoAnexo
                        ? `Arquivo selecionado: ${arquivoAnexo.name}`
                        : "Clique aqui para anexar o parecer oficial assinado (PDF)"}
                    </strong>
                    <span>Tamanho máximo: 15MB • Apenas formato PDF</span>
                  </div>
                </div>

                <div className="divisor-card"></div>

                {/* Botões de Ação */}
                <div className="rodape-parecer">
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setTelaAtual("detalhes")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-confirmar">
                    Confirmar Decisão
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}