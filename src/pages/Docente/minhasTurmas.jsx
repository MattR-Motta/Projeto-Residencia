import { useState } from 'react'
import './minhasTurmas.css'
import BarraLateral from '../../components/barraLateral'


const turmas = [
    {
        codigo: '1A',
        disciplina: 'Matemática',
        alunos: 32,
        sala: 'Sala 101',
        cor: 'azul',
    },
    {
        codigo: '1B',
        disciplina: 'Matemática',
        alunos: 29,
        sala: 'Sala 203',
        cor: 'roxo',
    },
    {
        codigo: '3A',
        disciplina: 'Português',
        alunos: 30,
        sala: 'Sala 105',
        cor: 'verde',
    },
    {
        codigo: '2C',
        disciplina: 'História',
        alunos: 27,
        sala: 'Sala 102',
        cor: 'laranja',
    },
]

const aulas = [
    {
        horario: '08:00',
        disciplina: 'Matemática',
        turma: '1A',
        status: 'Confirmado',
    },
    {
        horario: '10:00',
        disciplina: 'Matemática',
        turma: '1B',
        status: 'Em andamento',
    },
    {
        horario: '14:00',
        disciplina: 'Português',
        turma: '3A',
        status: 'Confirmado',
    },
    {
        horario: '16:00',
        disciplina: 'História',
        turma: '2C',
        status: 'Confirmado',
    },
]

function MinhasTurmas() {
    const [busca, setBusca] = useState('')
    const [disciplinaSelecionada, setDisciplinaSelecionada] =
        useState('Todas as disciplinas')

    const turmasFiltradas = turmas.filter((turma) => {
        const correspondeBusca =
            turma.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
            turma.codigo.toLowerCase().includes(busca.toLowerCase())

        const correspondeDisciplina =
            disciplinaSelecionada === 'Todas as disciplinas' ||
            turma.disciplina === disciplinaSelecionada

        return correspondeBusca && correspondeDisciplina
    })


    return (
        <div className="edu-layout">
            <BarraLateral />

            <div className="edu-main">
                {/* Barra superior */}
                <header className="edu-topbar">
                    <div className="edu-search-global">
                        <span>⌕</span>
                        <input
                            type="search"
                            placeholder="Buscar informações..."
                            aria-label="Buscar informações"
                        />
                    </div>

                    <div className="edu-topbar-profile">
                        <button
                            className="edu-notification"
                            type="button"
                            aria-label="Notificações"
                        >
                            ♧
                        </button>

                        <div className="edu-avatar top-avatar">J</div>
                        <strong>João Silva</strong>
                    </div>
                </header>

                {/* Conteúdo principal */}
                <main className="edu-content">
                    <div className="edu-page-heading">
                        <div>
                            <h1>Minhas turmas</h1>
                            <p>Consulte suas turmas e acompanhe as aulas.</p>
                        </div>

                        <div className="edu-filters">
                            <div className="edu-search-class">
                                <input
                                    type="search"
                                    placeholder="Buscar turma..."
                                    value={busca}
                                    onChange={(event) => setBusca(event.target.value)}
                                    aria-label="Buscar turma"
                                />
                            </div>

                            <select
                                value={disciplinaSelecionada}
                                onChange={(event) =>
                                    setDisciplinaSelecionada(event.target.value)
                                }
                                aria-label="Filtrar por disciplina"
                            >
                                <option>Todas as disciplinas</option>
                                <option>Matemática</option>
                                <option>Português</option>
                                <option>História</option>
                            </select>
                        </div>
                    </div>

                    <div className="edu-dashboard-grid">
                        {/* Lista de turmas */}
                        <section className="edu-classes">
                            <h2 className="edu-section-title">
                                Minhas turmas ({turmasFiltradas.length})
                            </h2>

                            <div className="edu-class-list">
                                {turmasFiltradas.map((turma) => (
                                    <button
                                        className="edu-class-card"
                                        type="button"
                                        key={turma.codigo}
                                        onClick={() =>
                                            alert(`Você selecionou a turma ${turma.codigo}`)
                                        }
                                    >
                                        <div className={`edu-class-code ${turma.cor}`}>
                                            {turma.codigo}
                                        </div>

                                        <div className="edu-class-info">
                                            <h3>{turma.disciplina}</h3>
                                            <p>
                                                {turma.alunos} alunos · {turma.sala}
                                            </p>
                                        </div>

                                        <span className="edu-class-arrow">›</span>
                                    </button>
                                ))}

                                {turmasFiltradas.length === 0 && (
                                    <p className="edu-empty-state">
                                        Nenhuma turma encontrada.
                                    </p>
                                )}
                            </div>

                            <div className="edu-info-banner">
                                <p>
                                    Acesse suas turmas para consultar informações acadêmicas.
                                </p>

                                <span aria-hidden="true">→</span>
                            </div>
                        </section>

                        {/* Programação das aulas */}
                        <aside className="edu-schedule">
                            <h2>Programação das aulas</h2>
                            <p className="edu-schedule-date">26 de outubro de 2026</p>

                            <div className="edu-schedule-list">
                                {aulas.map((aula) => (
                                    <article
                                        className="edu-schedule-item"
                                        key={aula.horario}
                                    >
                                        <time>{aula.horario}</time>

                                        <p>
                                            {aula.disciplina} · Turma {aula.turma}
                                        </p>

                                        <span
                                            className={`edu-status ${aula.status === 'Confirmado'
                                                    ? 'confirmed'
                                                    : 'in-progress'
                                                }`}
                                        >
                                            {aula.status}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    )}

    export default MinhasTurmas
