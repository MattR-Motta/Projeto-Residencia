import { useState } from 'react'
import { Eye, FileText, Info, Search } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/dashboarddocente.css'
import '../../styles/minhasDisciplinas.css'

// Dados de exemplo (depois é só trocar por dados reais)
const disciplinas = [
  {
    id: 1,
    nome: 'Matemática',
    codigo: 'MAT-101',
    turma: '1A',
    alunos: 32,
    cargaHoraria: 80,
    cor: 'azul',
    ementaAtualizada: true,
    ementa: {
      objetivo:
        'Desenvolver o raciocínio lógico, a capacidade de resolver problemas e aplicar conceitos matemáticos em situações do cotidiano.',
      conteudo:
        'Números e operações · Álgebra · Geometria · Grandezas e medidas · Estatística e probabilidade',
      competencias:
        'Argumentação, pensamento científico, comunicação e resolução colaborativa de problemas.',
      bibliografia:
        'DANTE, L. R. Matemática: contexto & aplicações. São Paulo: Ática. · Base Nacional Comum Curricular.',
    },
  },
  {
    id: 2,
    nome: 'Matemática',
    codigo: 'MAT-101',
    turma: '1B',
    alunos: 29,
    cargaHoraria: 80,
    cor: 'roxo',
    ementaAtualizada: false,
    ementa: {
      objetivo:
        'Desenvolver o raciocínio lógico, a capacidade de resolver problemas e aplicar conceitos matemáticos em situações do cotidiano.',
      conteudo:
        'Números e operações · Álgebra · Geometria · Grandezas e medidas · Estatística e probabilidade',
      competencias:
        'Argumentação, pensamento científico, comunicação e resolução colaborativa de problemas.',
      bibliografia:
        'DANTE, L. R. Matemática: contexto & aplicações. São Paulo: Ática. · Base Nacional Comum Curricular.',
    },
  },
  {
    id: 3,
    nome: 'Português',
    codigo: 'POR-102',
    turma: '3A',
    alunos: 30,
    cargaHoraria: 80,
    cor: 'verde',
    ementaAtualizada: false,
    ementa: {
      objetivo:
        'Ampliar a leitura, a interpretação e a produção de textos, fortalecendo a comunicação oral e escrita.',
      conteudo:
        'Gêneros textuais · Interpretação de texto · Gramática contextualizada · Produção textual · Literatura brasileira',
      competencias:
        'Leitura crítica, expressão escrita, argumentação e uso consciente da língua em diferentes contextos.',
      bibliografia:
        'CEREJA, W.; MAGALHÃES, T. Português: linguagens. São Paulo: Saraiva. · Base Nacional Comum Curricular.',
    },
  },
  {
    id: 4,
    nome: 'História',
    codigo: 'HIS-201',
    turma: '2C',
    alunos: 27,
    cargaHoraria: 60,
    cor: 'laranja',
    ementaAtualizada: false,
    ementa: {
      objetivo:
        'Compreender os processos históricos e sociais, desenvolvendo o senso crítico sobre o presente.',
      conteudo:
        'Brasil Colônia e Império · República brasileira · Revoluções modernas · Cidadania e direitos humanos',
      competencias:
        'Análise de fontes, pensamento crítico, contextualização histórica e respeito à diversidade.',
      bibliografia:
        'BOULOS JÚNIOR, A. História: sociedade & cidadania. São Paulo: FTD. · Base Nacional Comum Curricular.',
    },
  },
]

const turmas = [...new Set(disciplinas.map((item) => item.turma))]

function MinhasDisciplinas() {
  const [busca, setBusca] = useState('')
  const [turmaFiltro, setTurmaFiltro] = useState('todas')
  const [idSelecionado, setIdSelecionado] = useState(disciplinas[0].id)

  // Aplica a busca por nome/código e o filtro de turma
  const textoBusca = busca.trim().toLowerCase()
  const filtradas = disciplinas.filter((item) => {
    const bateBusca =
      !textoBusca ||
      item.nome.toLowerCase().includes(textoBusca) ||
      item.codigo.toLowerCase().includes(textoBusca)
    const bateTurma = turmaFiltro === 'todas' || item.turma === turmaFiltro
    return bateBusca && bateTurma
  })

  // Se a disciplina selecionada sumiu do filtro, mostra a primeira da lista
  const selecionada =
    filtradas.find((item) => item.id === idSelecionado) || filtradas[0]

  return (
    <div className="docente-pagina">
      <BarraLateral />

      <main className="docente-conteudo">
        {/* Topo: usuário */}
        <header className="docente-topo disc-topo">
          <div className="docente-usuario">
            <span className="docente-sino">🔔</span>
            <div className="docente-avatar"></div>
            <strong>Joao Silva</strong>
          </div>
        </header>

        {/* Título */}
        <section className="disc-titulo">
          <h1>Minhas disciplinas</h1>
          <p>Consulte suas disciplinas, turmas e ementas.</p>
        </section>

        {/* Filtros */}
        <section className="disc-filtros">
          <label className="disc-campo-busca">
            <Search size={16} aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar disciplina..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </label>

          <select
            className="disc-select"
            value={turmaFiltro}
            onChange={(event) => setTurmaFiltro(event.target.value)}
            aria-label="Filtrar por turma"
          >
            <option value="todas">Todas as turmas</option>
            {turmas.map((turma) => (
              <option key={turma} value={turma}>
                Turma {turma}
              </option>
            ))}
          </select>
        </section>

        {/* Lista à esquerda, ementa à direita */}
        <section className="disc-corpo">
          <div className="disc-lista">
            {filtradas.length === 0 && (
              <div className="docente-card disc-vazio">
                Nenhuma disciplina encontrada.
              </div>
            )}

            {filtradas.map((item) => (
              <article
                key={item.id}
                className={
                  'docente-card disc-item' +
                  (selecionada?.id === item.id ? ' disc-item--ativo' : '')
                }
              >
                <span className={'disc-turma-selo ' + item.cor}>{item.turma}</span>

                <div className="disc-item-info">
                  <h2>{item.nome}</h2>
                  {item.ementaAtualizada && (
                    <span className="disc-tag-verde">Ementa atualizada</span>
                  )}
                  <span className="disc-codigo">{item.codigo}</span>
                  <span className="disc-detalhes">
                    Turma {item.turma} · {item.alunos} alunos · Carga horária:{' '}
                    {item.cargaHoraria}h
                  </span>
                </div>

                <button
                  type="button"
                  className="disc-botao-ementa"
                  onClick={() => setIdSelecionado(item.id)}
                >
                  <Eye size={16} aria-hidden="true" />
                  Ver ementa
                </button>
              </article>
            ))}
          </div>

          {/* Painel da ementa */}
          {selecionada && (
            <aside className="docente-card disc-ementa">
              <h2 className="disc-ementa-titulo">
                <FileText size={18} aria-hidden="true" />
                Ementa da disciplina
              </h2>
              <p className="disc-ementa-sub">
                {selecionada.nome} · {selecionada.codigo} · Turma {selecionada.turma}
              </p>

              <div className="disc-aviso">
                <Info size={14} aria-hidden="true" />
                <span>
                  Modo de consulta. A ementa é mantida pela coordenação
                  pedagógica.
                </span>
              </div>

              <section className="disc-ementa-bloco">
                <h3>Objetivo da disciplina</h3>
                <p>{selecionada.ementa.objetivo}</p>
              </section>

              <section className="disc-ementa-bloco">
                <h3>Conteúdo programático</h3>
                <p>{selecionada.ementa.conteudo}</p>
              </section>

              <section className="disc-ementa-bloco">
                <h3>Carga horária</h3>
                <p>{selecionada.cargaHoraria} horas</p>
              </section>

              <section className="disc-ementa-bloco">
                <h3>Competências</h3>
                <p>{selecionada.ementa.competencias}</p>
              </section>

              <section className="disc-ementa-bloco">
                <h3>Bibliografia/referências</h3>
                <p>{selecionada.ementa.bibliografia}</p>
              </section>
            </aside>
          )}
        </section>
      </main>
    </div>
  )
}

export default MinhasDisciplinas
