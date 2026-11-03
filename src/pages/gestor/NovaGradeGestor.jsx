import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import BarraLateral from '../../components/barraLateral'
import '../../styles/gestor/baseGestor.css'
import '../../styles/gestor/gradesGestor.css'

// ---- Dados das grades (guardados no navegador) ----
const CHAVE = 'gradesEduGest'

const GRADES_INICIAIS = [
  { id: 1, nome: 'Referencial Regular Sergipe - Médio', ensino: 'Ensino Médio', series: '1º, 2º e 3º Ano', carga: 3000, status: 'Ativa' },
  { id: 2, nome: 'Matriz Unificada Fundamental I', ensino: 'Ensino Fundamental', series: '1º ao 5º Ano', carga: 4500, status: 'Ativa' },
  { id: 3, nome: 'Base Integrada Agropecuária', ensino: 'Ensino Integrado', series: '1º ao 4º Ano', carga: 4200, status: 'Ativa' },
  { id: 4, nome: 'Matriz Fundamental II Regular', ensino: 'Ensino Fundamental', series: '6º ao 9º Ano', carga: 3600, status: 'Ativa' },
  { id: 5, nome: 'Formação Técnica Administração', ensino: 'Profissionalizante', series: '1º e 2º Módulo', carga: 1200, status: 'Em Análise' },
  { id: 6, nome: 'EJA - Médio Exponencial', ensino: 'Outros / EJA', series: 'Etapa I e II', carga: 1600, status: 'Ativa' },
]

function listarGrades() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null')

    if (Array.isArray(salvo)) {
      return salvo
    }
  } catch {
    // Se os dados estiverem inválidos, volta pra lista inicial.
  }

  localStorage.setItem(CHAVE, JSON.stringify(GRADES_INICIAIS))
  return GRADES_INICIAIS
}

function salvarGrades(lista) {
  localStorage.setItem(CHAVE, JSON.stringify(lista))
}

const OPCOES_ENSINO = ['Ensino Médio', 'Ensino Fundamental', 'Ensino Integrado', 'Profissionalizante', 'Outros / EJA']

// Essa mesma tela serve pra criar (/gestor/grades/nova)
// e pra editar (/gestor/grades/:id/editar)
function NovaGradeGestor() {
  const navigate = useNavigate()
  const { id } = useParams()

  const gradeExistente = id
    ? listarGrades().find((grade) => String(grade.id) === id)
    : null

  const editando = Boolean(gradeExistente)

  const [form, setForm] = useState({
    nome: gradeExistente?.nome ?? '',
    ensino: gradeExistente?.ensino ?? OPCOES_ENSINO[0],
    series: gradeExistente?.series ?? '',
    carga: gradeExistente?.carga ?? '',
    status: gradeExistente?.status ?? 'Ativa',
  })

  // Se o id da URL não existe, volta pra lista
  if (id && !gradeExistente) {
    return <Navigate to="/gestor/grades" replace />
  }

  // Atualiza só o campo que mudou
  function mudarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function salvar(e) {
    e.preventDefault()

    const grades = listarGrades()
    const dados = { ...form, carga: Number(form.carga) }

    if (editando) {
      // Troca só a grade que estava sendo editada
      const novaLista = grades.map((grade) =>
        grade.id === gradeExistente.id ? { ...grade, ...dados } : grade
      )
      salvarGrades(novaLista)
    } else {
      // Cria uma grade nova no final da lista
      salvarGrades([...grades, { id: Date.now(), ...dados }])
    }

    navigate('/gestor/grades')
  }

  return (
    <div className="grades-pagina">
      <BarraLateral />

      <div className="grades-conteudo">
        <main className="grades-principal">
          <button type="button" className="nova-voltar" onClick={() => navigate('/gestor/grades')}>
            <ArrowLeft size={16} />
            Voltar para grades
          </button>

          <div className="grades-titulo-area">
            <div>
              <h1>{editando ? 'Editar grade curricular' : 'Nova grade curricular'}</h1>
              <p>Preencha os dados da grade que será usada pelas escolas.</p>
            </div>
          </div>

          <form className="grades-cartao nova-form" onSubmit={salvar}>
            <label className="nova-campo nova-campo-largo">
              <span>Nome da grade</span>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={mudarCampo}
                placeholder="Ex: Matriz Fundamental II Regular"
                required
              />
            </label>

            <label className="nova-campo">
              <span>Tipo de ensino</span>
              <select name="ensino" value={form.ensino} onChange={mudarCampo}>
                {OPCOES_ENSINO.map((opcao) => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            </label>

            <label className="nova-campo">
              <span>Séries/Anos</span>
              <input
                type="text"
                name="series"
                value={form.series}
                onChange={mudarCampo}
                placeholder="Ex: 6º ao 9º Ano"
                required
              />
            </label>

            <label className="nova-campo">
              <span>Carga horária total (horas)</span>
              <input
                type="number"
                name="carga"
                value={form.carga}
                onChange={mudarCampo}
                min="1"
                placeholder="Ex: 3600"
                required
              />
            </label>

            <label className="nova-campo">
              <span>Status</span>
              <select name="status" value={form.status} onChange={mudarCampo}>
                <option value="Ativa">Ativa</option>
                <option value="Em Análise">Em Análise</option>
              </select>
            </label>

            <div className="nova-botoes">
              <button type="button" className="nova-cancelar" onClick={() => navigate('/gestor/grades')}>
                Cancelar
              </button>
              <button type="submit" className="grades-botao-nova">
                <Check size={18} />
                {editando ? 'Salvar alterações' : 'Salvar grade'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default NovaGradeGestor