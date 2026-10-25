import { useNavigate } from 'react-router-dom'
import { Download, Plus, FileText, GitPullRequest, School, ChartNoAxesColumn } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/gestor/baseGestor.css'
import '../../styles/gestor/dashboardGestor.css'

const escolasMock = [
  { id: 1, codigo: 'ESC001', nome: 'Escola Estadual Professor José Alves', municipio: 'Aracaju', tipo: 'Ensino Médio', alunos: 842, status: 'Ativa' },
  { id: 2, codigo: 'ESC002', nome: 'Centro de Excelência Maria das Graças', municipio: 'Nossa Senhora do Socorro', tipo: 'Ensino Fundamental', alunos: 615, status: 'Ativa' },
  { id: 3, codigo: 'ESC003', nome: 'Colégio Estadual Tobias Barreto', municipio: 'Itabaiana', tipo: 'Ensino Médio', alunos: 734, status: 'Ativa' },
  { id: 4, codigo: 'ESC004', nome: 'Escola Estadual Caminhos do Saber', municipio: 'Lagarto', tipo: 'Ensino Integrado', alunos: 398, status: 'Inativa' },
  { id: 5, codigo: 'ESC005', nome: 'Centro Educacional do Sul', municipio: 'Estância', tipo: 'Profissionalizante', alunos: 526, status: 'Ativa' },
]

const portariasMock = [
  { id: 1, numero: '1.248/2026', titulo: 'Designação de equipe gestora', tipo: 'Designação', data: '10/10/2026', status: 'Publicada' },
  { id: 2, numero: '1.249/2026', titulo: 'Alteração do calendário letivo', tipo: 'Alteração', data: '12/10/2026', status: 'Em análise' },
  { id: 3, numero: '1.250/2026', titulo: 'Autorização de funcionamento', tipo: 'Autorização', data: '15/10/2026', status: 'Publicada' },
  { id: 4, numero: '1.251/2026', titulo: 'Atualização de matriz curricular', tipo: 'Atualização', data: '18/10/2026', status: 'Rascunho' },
]

const dashboardGestorMock = {
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

function DashboardGestor() {
  const navigate = useNavigate()
  let nome = 'Gestor'

  try {
    nome = JSON.parse(localStorage.getItem('usuarioEduGest') || 'null')?.nome || nome
  } catch {
    /* nome padrão */
  }

  const dados = dashboardGestorMock
  const totalAlunos = escolasMock.reduce((total, escola) => total + escola.alunos, 0)

  function gerarRelatorio() {
    const linhas = [['Indicador', 'Valor'], ...dados.indicadores.map((item) => [item.titulo, item.valor]), ['Escolas cadastradas', escolasMock.length], ['Alunos nas escolas demonstrativas', totalAlunos], ['Portarias cadastradas', portariasMock.length]]
    const csv = '\uFEFF' + linhas.map((linha) => linha.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'relatorio-dashboard-gestor.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="gestor-layout">
      <BarraLateral />
      <main className="gestor-main">
        <header className="gestor-header">
          <div>
            <span className="gestor-breadcrumb">EduGest / Início</span>
            <h1>Dashboard</h1>
          </div>
          <div className="gestor-header-usuario">
            <div className="gestor-avatar">{nome.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{nome}</strong>
              <span>Gestão da rede estadual</span>
            </div>
          </div>
        </header>

        <div className="gestor-conteudo">
          <section className="gestor-saudacao">
            <div>
              <span>PAINEL DE CONTROLE</span>
              <h2>Olá, {nome}!</h2>
              <p>Aqui está o resumo da rede estadual de ensino hoje.</p>
            </div>
            <div className="gestor-saudacao-simbolo"><School size={44} strokeWidth={1.4} /></div>
          </section>

          <section className="gestor-indicadores">
            {dados.indicadores.map((item) => (
              <article className="gestor-indicador" key={item.titulo}>
                <div className="gestor-indicador-topo">
                  <span>{item.titulo}</span>
                  <span className={`gestor-indicador-icone gestor-indicador-icone--${item.cor}`}>
                    {item.cor === 'verde' ? <School size={17} /> : item.cor === 'laranja' ? <GitPullRequest size={17} /> : item.cor === 'azul' ? <ChartNoAxesColumn size={17} /> : <FileText size={17} />}
                  </span>
                </div>
                <strong>{item.valor}</strong>
                <small>{item.detalhe}</small>
              </article>
            ))}
          </section>

          <section className="gestor-dashboard-grid">
            <article className="gestor-painel">
              <h3 className="gestor-painel-titulo">Tipos de ensino das escolas</h3>
              <p className="gestor-painel-subtitulo">Distribuição das unidades por modalidade</p>
              <div className="gestor-barras">
                {dados.tiposEnsino.map((item, i) => (
                  <div className="gestor-barra-item" key={item.nome}>
                    <div className="gestor-barra-legenda">
                      <strong>{item.nome}</strong>
                      <span>{item.quantidade} escolas ({item.percentual.toLocaleString('pt-BR')}%)</span>
                    </div>
                    <div className="gestor-barra-trilho">
                      <span style={{ width: `${item.percentual / 38.7 * 100}%` }} className={`gestor-barra-preenchimento gestor-barra-preenchimento--${i + 1}`} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="gestor-painel gestor-acoes-rapidas">
              <h3 className="gestor-painel-titulo">Ações rápidas</h3>
              <p className="gestor-painel-subtitulo">Acesse as tarefas mais comuns</p>
              <button onClick={() => navigate('/gestor/escolas', { state: { abrirCadastro: true } })}><Plus size={16} /> Criar nova escola</button>
              <button onClick={() => navigate('/gestor/portarias')}><FileText size={16} /> Gerenciar portarias</button>
              <button onClick={() => navigate('/gestor/escolas')}><School size={16} /> Ver escolas cadastradas</button>
              <button onClick={gerarRelatorio}><Download size={16} /> Emitir relatório CSV</button>
            </article>
          </section>

          <section className="gestor-dashboard-grid gestor-dashboard-grid--inferior">
            <article className="gestor-painel">
              <div className="gestor-painel-cabecalho">
                <div>
                  <h3 className="gestor-painel-titulo">Panorama da rede</h3>
                  <p className="gestor-painel-subtitulo">Indicadores gerais e distribuição por município</p>
                </div>
                <button className="gestor-botao gestor-botao-secundario" onClick={gerarRelatorio}><Download size={15} /> Exportar dados</button>
              </div>
              <div className="gestor-panorama">
                <div className="gestor-grafico-donut">
                  <div>
                    <strong>{escolasMock.length}</strong>
                    <span>escolas no mock</span>
                  </div>
                </div>
                <div className="gestor-legenda-donut">
                  {dados.tiposEnsino.map((item, i) => (
                    <div key={item.nome}>
                      <span className={`gestor-ponto gestor-ponto--${i + 1}`} />
                      <span>{item.nome}</span>
                      <strong>{item.quantidade}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="gestor-painel">
              <h3 className="gestor-painel-titulo">Municípios</h3>
              <p className="gestor-painel-subtitulo">Unidades por localidade</p>
              <div className="gestor-municipios">
                {dados.municipios.map((item) => (
                  <div key={item.nome}>
                    <span>{item.nome}</span>
                    <strong>{item.escolas} escolas</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <p className="gestor-aviso-mock">Os números deste painel são dados demonstrativos e não representam dados oficiais da rede.</p>
        </div>
      </main>
    </div>
  )
}

export default DashboardGestor