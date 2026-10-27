const CHAVE_SOLICITACOES = 'edugest:coordenador:solicitacoes'

export const solicitacoesIniciais = [
  {
    id: 1,
    codigo: 'SOL-2026-001',
    solicitante: 'Carlos Mendes',
    email: 'carlos.mendes@edugest.com',
    tipo: 'Reposição de aula',
    titulo: 'Reposição de aula de Matemática',
    descricao:
      'Solicito a reposição da aula de Matemática da turma 1A devido a um afastamento médico.',
    justificativa:
      'Apresento a solicitação para evitar prejuízo ao conteúdo programático da turma. A reposição poderá ocorrer em horário disponível na próxima semana.',
    turma: '1A',
    disciplina: 'Matemática',
    dataEnvio: '23/10/2026',
    prioridade: 'Alta',
    status: 'Pendente',
    observacao: '',
  },
  {
    id: 2,
    codigo: 'SOL-2026-002',
    solicitante: 'Ana Ribeiro',
    email: 'ana.ribeiro@edugest.com',
    tipo: 'Alteração de horário',
    titulo: 'Alteração de horário de História',
    descricao:
      'Solicito a alteração do horário da aula de História da turma 2B.',
    justificativa:
      'O horário atual coincide com uma atividade pedagógica previamente agendada.',
    turma: '2B',
    disciplina: 'História',
    dataEnvio: '22/10/2026',
    prioridade: 'Média',
    status: 'Pendente',
    observacao: '',
  },
  {
    id: 3,
    codigo: 'SOL-2026-003',
    solicitante: 'Juliana Freitas',
    email: 'juliana.freitas@edugest.com',
    tipo: 'Atualização acadêmica',
    titulo: 'Revisão da ementa de Português',
    descricao:
      'Solicito a revisão da ementa da disciplina de Língua Portuguesa.',
    justificativa:
      'A revisão busca alinhar os conteúdos previstos às necessidades pedagógicas do próximo período.',
    turma: '3A',
    disciplina: 'Português',
    dataEnvio: '21/10/2026',
    prioridade: 'Baixa',
    status: 'Aprovada',
    observacao: 'Solicitação aprovada pela coordenação.',
  },
  {
    id: 4,
    codigo: 'SOL-2026-004',
    solicitante: 'Rafael Lima',
    email: 'rafael.lima@edugest.com',
    tipo: 'Reposição de aula',
    titulo: 'Reposição de aula de Física',
    descricao:
      'Solicito a reposição de uma aula de Física da turma 3A.',
    justificativa:
      'A aula precisou ser cancelada devido à indisponibilidade do laboratório.',
    turma: '3A',
    disciplina: 'Física',
    dataEnvio: '20/10/2026',
    prioridade: 'Alta',
    status: 'Recusada',
    observacao: 'A data sugerida coincide com outra atividade da turma.',
  },
]

export function carregarSolicitacoes() {
  try {
    const dados = localStorage.getItem(CHAVE_SOLICITACOES)

    if (dados) {
      return JSON.parse(dados)
    }

    localStorage.setItem(
      CHAVE_SOLICITACOES,
      JSON.stringify(solicitacoesIniciais),
    )

    return solicitacoesIniciais
  } catch {
    return solicitacoesIniciais
  }
}

export function salvarSolicitacoes(solicitacoes) {
  localStorage.setItem(
    CHAVE_SOLICITACOES,
    JSON.stringify(solicitacoes),
  )
}