import { useNavigate } from 'react-router-dom'
import { Download, Plus, FileText, GitPullRequest, School, ChartNoAxesColumn } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import "../../styles/Gestor/baseGestor.css";
import "../../styles/Gestor/dashboardGestor.css";

const escolasMock = [
  { id: 1, codigo: 'ESC001', nome: 'Escola Estadual Professor José Alves', municipio: 'Aracaju', tipo: 'Ensino Médio', alunos: 842, status: 'Ativa' },
  { id: 2, codigo: 'ESC002', nome: 'Centro de Excelência Maria das Graças', municipio: 'Nossa Senhora do Socorro', tipo: 'Ensino Fundamental', alunos: 615, status: 'Ativa' },
  { id: 3, codigo: 'ESC003', nome: 'Colégio Estadual Tobias Barreto', municipio: 'Itabaiana', tipo: 'Ensino Médio', alunos: 734, status: 'Ativa' },
  { id: 4, codigo: 'ESC004', nome: 'Escola Estadual Caminhos do Saber', municipio: 'Lagarto', tipo: 'Ensino Integrado', alunos: 398, status: 'Inativa' },
  { id: 5, codigo: 'ESC005', nome: 'Centro Educacional do Sul', municipio: 'Estância', tipo: 'Profissionalizante', alunos: 526, status: 'Ativa' },
]

const portariasMock = [
  { id: 1, numero: '1.248/2026', titulo: 'Designação de equipe estora', tipo: 'Designação', data: '10/10/2026', status: 'Publicada' },
  { id: 2, numero: '1.249/2026', titulo: 'Alteração do calendário letivo', tipo: 'Alteração', data: '12/10/2026', status: 'Em análise' },
  { id: 3, numero: '1.250/2026', titulo: 'Autorização de funcionamento', tipo: 'Autorização', data: '15/10/2026', status: 'Publicada' },
  { id: 4, numero: '1.251/2026', titulo: 'Atualização de matriz curricular', tipo: 'Atualização', data: '18/10/2026', status: 'Rascunho' },
]

const dashboardestorMock = {
  indicadores: [
    { titulo: 'Escolas ativas', valor: 124, detalhe: '+2 novas este mês', cor: 'verde' },
    { titulo: 'Solicitações pendentes', valor: 18, detalhe: 'Aguardando triagem', cor: 'laranja' },
    { titulo: 'Modelos em análise', valor: 6, detalhe: 'Grades curriculares', cor: 'azul' },
    { titulo: 'Portarias emitidas', valor: 32, detalhe: 'Neste ano letivo', cor: 'roxo' },
  ],
  tiposEnsino: [
    { nome: 'Ensino Médio', quantidade: 48, percentual: 38.7 },
    { nome: 'Ensino Fundamental', quantidade: 36, percentual: 29.0 },
    { nome: 'Ensino Integrado', quantidade: 22, percentual: 17.7 },
    { nome: 'Profissionalizante', quantidade: 14, percentual: 11.3 },
    { nome: 'Outros / EJA', quantidade: 4, percentual: 3.3 },
  ],
  municipios: [
    { nome: 'Aracaju', escolas: 48 },
    { nome: 'Nossa Senhora do Socorro', escolas: 18 },
    { nome: 'Itabaiana', escolas: 10 },
    { nome: 'Lagarto', escolas: 9 },
    { nome: 'Estância', escolas: 8 },
    { nome: 'Nossa Senhora da Glória', escolas: 6 },
  ],
}

function Dashboardestor() {
  const navigate = useNavigate()
  let nome = 'estor'

  try {
    nome = JSON.parse(localStorage.getItem('usuarioEduGest') || 'null')?.nome || nome
  } catch {
    /* nome padrão */
  }

  const dados = dashboardestorMock
  const totalAlunos = escolasMock.reduce((total, escola) => total + escola.alunos, 0)

  function gerarRelatorio() {
    const linhas = [['Indicador', 'Valor'], ...dados.indicadores.map((item) => [item.titulo, item.valor]), ['Escolas cadastradas', escolasMock.length], ['Alunos nas escolas demonstrativas', totalAlunos], ['Portarias cadastradas', portariasMock.length]]
    const csv = '\uFEFF' + linhas.map((linha) => linha.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'relatorio-dashboard-estor.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="estor-layout">
      <BarraLateral />
      <main className="estor-main">
        <header className="estor-header">
          <div>
            <span className="estor-breadcrumb">EduGest / Início</span>
            <h1>Dashboard</h1>
          </div>
          <div className="estor-header-usuario">
            <div className="estor-avatar">{nome.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{nome}</strong>
              <span>Gestão da rede estadual</span>
            </div>
          </div>
        </header>

        <div className="estor-conteudo">
          <section className="estor-saudacao">
            <div>
              <span>PAINEL DE CONTROLE</span>
              <h2>Olá, {nome}!</h2>
              <p>Aqui está o resumo da rede estadual de ensino hoje.</p>
            </div>
            <div className="estor-saudacao-simbolo"><School size={44} strokeWidth={1.4} /></div>
          </section>

          <section className="estor-indicadores">
            {dados.indicadores.map((item) => (
              <article className="estor-indicador" key={item.titulo}>
                <div className="estor-indicador-topo">
                  <span>{item.titulo}</span>
                  <span className={`estor-indicador-icone estor-indicador-icone--${item.cor}`}>
                    {item.cor === 'verde' ? <School size={17} /> : item.cor === 'laranja' ? <GitPullRequest size={17} /> : item.cor === 'azul' ? <ChartNoAxesColumn size={17} /> : <FileText size={17} />}
                  </span>
                </div>
                <strong>{item.valor}</strong>
                <small>{item.detalhe}</small>
              </article>
            ))}
          </section>

          <section className="estor-dashboard-grid">
            <article className="estor-painel">
              <h3 className="estor-painel-titulo">Tipos de ensino das escolas</h3>
              <p className="estor-painel-subtitulo">Distribuição das unidades por modalidade</p>
              <div className="estor-barras">
                {dados.tiposEnsino.map((item, i) => (
                  <div className="estor-barra-item" key={item.nome}>
                    <div className="estor-barra-legenda">
                      <strong>{item.nome}</strong>
                      <span>{item.quantidade} escolas ({item.percentual.toLocaleString('pt-BR')}%)</span>
                    </div>
                    <div className="estor-barra-trilho">
                      <span style={{ width: `${item.percentual / 38.7 * 100}%` }} className={`estor-barra-preenchimento estor-barra-preenchimento--${i + 1}`} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="estor-painel estor-acoes-rapidas">
              <h3 className="estor-painel-titulo">Ações rápidas</h3>
              <p className="estor-painel-subtitulo">Acesse as tarefas mais comuns</p>
              <button onClick={() => navigate('/estor/escolas', { state: { abrirCadastro: true } })}><Plus size={16} /> Criar nova escola</button>
              <button onClick={() => navigate('/estor/portarias')}><FileText size={16} /> Gerenciar portarias</button>
              <button onClick={() => navigate('/estor/escolas')}><School size={16} /> Ver escolas cadastradas</button>
              <button onClick={gerarRelatorio}><Download size={16} /> Emitir relatório CSV</button>
            </article>
          </section>

          <section className="estor-dashboard-grid estor-dashboard-grid--inferior">
            <article className="estor-painel">
              <div className="estor-painel-cabecalho">
                <div>
                  <h3 className="estor-painel-titulo">Panorama da rede</h3>
                  <p className="estor-painel-subtitulo">Indicadores gerais e distribuição por município</p>
                </div>
                <button className="estor-botao estor-botao-secundario" onClick={gerarRelatorio}><Download size={15} /> Exportar dados</button>
              </div>
              <div className="estor-panorama">
                <div className="estor-grafico-donut">
                  <div>
                    <strong>{escolasMock.length}</strong>
                    <span>escolas no mock</span>
                  </div>
                </div>
                <div className="estor-legenda-donut">
                  {dados.tiposEnsino.map((item, i) => (
                    <div key={item.nome}>
                      <span className={`estor-ponto estor-ponto--${i + 1}`} />
                      <span>{item.nome}</span>
                      <strong>{item.quantidade}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="estor-painel">
              <h3 className="estor-painel-titulo">Municípios</h3>
              <p className="estor-painel-subtitulo">Unidades por localidade</p>
              <div className="estor-municipios">
                {dados.municipios.map((item) => (
                  <div key={item.nome}>
                    <span>{item.nome}</span>
                    <strong>{item.escolas} escolas</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <p className="estor-aviso-mock">Os números deste painel são dados demonstrativos e não representam dados oficiais da rede.</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboardestor