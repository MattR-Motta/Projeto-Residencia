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

export const solicitacoesIniciaisSeduc = [
  {
    id: 4122,
    escola: "Colégio Dom Pedro II",
    escolaNomeCompleto: "Colégio Estadual Dom Pedro II",
    codigoInep: "28001234",
    tipo: "Inclusão de optativas",
    tipoDetalhado: "Inclusão de disciplinas optativas (Novo Ensino Médio)",
    dataEnvio: "10/05/2025",
    horaEnvio: "14:32",
    status: "Pendente",
    aba: "pendentes",
    descricao:
      "Solicitamos autorização para a inclusão de disciplinas eletivas e optativas voltadas à tecnologia e programação básica para o segundo semestre de 2025. O projeto prevê o uso do laboratório de informática existente na escola.",
    justificativa:
      "A comunidade escolar demonstrou alto interesse em tecnologia, visando preparar os alunos para o mercado profissional de Sergipe. O projeto pedagógico foi aprovado pelo conselho escolar de forma unânime.",
    documentos: [
      { id: 1, nome: "projeto_pedagogico_optativas.pdf" },
      { id: 2, nome: "ata_conselho_escolar.pdf" },
    ],
    historico: [
      {
        id: 1,
        titulo: "Enviado pela escola",
        subtitulo: "10/05/2025 às 14:32 • Por Direção Escolar",
        estado: "concluido",
      },
      {
        id: 2,
        titulo: "Triagem e Validação",
        subtitulo: "11/05/2025 às 09:15 • Automático pelo sistema",
        estado: "atual-validado",
      },
      {
        id: 3,
        titulo: "Aguardando Parecer Técnico",
        subtitulo: "Fase atual • Responsável: Coordenadoria Pedagógica",
        estado: "pendente",
      },
    ],
    parecerPadrao:
      "Após análise do projeto pedagógico encaminhado e conferência da infraestrutura de rede, o parecer técnico é FAVORÁVEL à inclusão das disciplinas optativas no Colégio Dom Pedro II. O laboratório de informática atende aos pré-requisitos necessários para a execução prática das disciplinas sugeridas no cronograma escolar.",
  },
  {
    id: 4123,
    escola: "EE José de Alencar",
    escolaNomeCompleto: "Escola Estadual José de Alencar",
    codigoInep: "28005678",
    tipo: "Alteração de grade",
    tipoDetalhado: "Alteração de carga horária da grade curricular",
    dataEnvio: "08/05/2025",
    horaEnvio: "10:15",
    status: "Em análise",
    aba: "pendentes",
    descricao:
      "Solicitação de ajuste na distribuição de aulas do turno matutino para adequação da carga horária de Ciências da Natureza.",
    justificativa:
      "Otimização do uso dos laboratórios multidisciplinares entre as turmas de 2º e 3º ano.",
    documentos: [{ id: 1, nome: "proposta_grade_2025.pdf" }],
    historico: [
      {
        id: 1,
        titulo: "Enviado pela escola",
        subtitulo: "08/05/2025 às 10:15 • Por Direção Escolar",
        estado: "concluido",
      },
      {
        id: 2,
        titulo: "Triagem e Validação",
        subtitulo: "09/05/2025 às 08:30 • Automático pelo sistema",
        estado: "atual-validado",
      },
      {
        id: 3,
        titulo: "Aguardando Parecer Técnico",
        subtitulo: "Fase atual • Responsável: Coordenadoria Pedagógica",
        estado: "pendente",
      },
    ],
    parecerPadrao: "",
  },
  {
    id: 4124,
    escola: "Colégio João XXIII",
    escolaNomeCompleto: "Colégio Estadual João XXIII",
    codigoInep: "28009012",
    tipo: "Nova matriz",
    tipoDetalhado: "Implementação de nova matriz curricular integral",
    dataEnvio: "06/05/2025",
    horaEnvio: "16:40",
    status: "Pendente",
    aba: "pendentes",
    descricao:
      "Pedido de homologação de nova matriz curricular para o ensino médio em tempo integral.",
    justificativa:
      "Adequação às novas diretrizes estaduais e ampliação da oferta de oficinas pedagógicas.",
    documentos: [{ id: 1, nome: "matriz_curricular_joao_xxiii.pdf" }],
    historico: [
      {
        id: 1,
        titulo: "Enviado pela escola",
        subtitulo: "06/05/2025 às 16:40 • Por Direção Escolar",
        estado: "concluido",
      },
      {
        id: 2,
        titulo: "Aguardando Parecer Técnico",
        subtitulo: "Fase atual • Responsável: Coordenadoria Pedagógica",
        estado: "pendente",
      },
    ],
    parecerPadrao: "",
  },
  {
    id: 4125,
    escola: "EE 8 de Julho",
    escolaNomeCompleto: "Escola Estadual 8 de Julho",
    codigoInep: "28003456",
    tipo: "Distribuição de prof.",
    tipoDetalhado: "Redistribuição de carga horária docente",
    dataEnvio: "02/05/2025",
    horaEnvio: "11:20",
    status: "Aprovado",
    aba: "pendentes",
    descricao:
      "Solicitação de realocação de professores da área de Matemática para cobertura de novas turmas.",
    justificativa:
      "Aumento no número de matrículas registradas no início do semestre letivo.",
    documentos: [{ id: 1, nome: "quadro_docente_atualizado.pdf" }],
    historico: [
      {
        id: 1,
        titulo: "Enviado pela escola",
        subtitulo: "02/05/2025 às 11:20 • Por Direção Escolar",
        estado: "concluido",
      },
      {
        id: 2,
        titulo: "Solicitação Aprovada",
        subtitulo: "04/05/2025 às 15:00 • Coordenadoria Pedagógica",
        estado: "concluido",
      },
    ],
    parecerPadrao: "Solicitação aprovada conforme disponibilidade de quadro.",
  },
];