export interface TalentFormState {
  fullName: string
  preferredName: string
  pronoun: string
  city: string
  email: string
  phone: string
  linkedin: string
  resume: File | null
  vaga: string
  seniority: string
  salaryExpectation: string
  stacks: string
  skills: string
  education: string
  experience: string
  values: string[]
  motivation: string
  futureVision: string
  aiLevel: string
  aiPurpose: string
  aiAutomation: string
  howFound: string
  referredBy: string
  affirmativeGroups: string[]
}

export const INITIAL_FORM_STATE: TalentFormState = {
  fullName: '',
  preferredName: '',
  pronoun: '',
  city: '',
  email: '',
  phone: '',
  linkedin: '',
  resume: null,
  vaga: '',
  seniority: '',
  salaryExpectation: '',
  stacks: '',
  skills: '',
  education: '',
  experience: '',
  values: [],
  motivation: '',
  futureVision: '',
  aiLevel: '',
  aiPurpose: '',
  aiAutomation: '',
  howFound: '',
  referredBy: '',
  affirmativeGroups: [],
}

type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'

export interface FieldDef {
  id: keyof TalentFormState
  type: FieldType
  label: string
  required?: boolean
  placeholder?: string
  hint?: string
  options?: string[]
  showIf?: { field: keyof TalentFormState; equals: string }
}

export interface StepDef {
  id: string
  title: string
  subtitle?: string
  fields: FieldDef[]
}

export const STEPS: StepDef[] = [
  {
    id: 'identidade',
    title: 'Identidade',
    subtitle: 'Queremos te conhecer como pessoa, antes de tudo.',
    fields: [
      { id: 'fullName', type: 'text', label: 'Nome completo', required: true },
      {
        id: 'preferredName',
        type: 'text',
        label: 'Como você gostaria de ser chamade?',
        required: true,
      },
      {
        id: 'pronoun',
        type: 'radio',
        label: 'Qual pronome de tratamento você prefere?',
        options: ['Ela/Dela', 'Ele/Dele', 'Elu/Delu', 'Prefiro não informar'],
      },
    ],
  },
  {
    id: 'contato',
    title: 'Contato',
    subtitle: 'Para que possamos te encontrar facilmente.',
    fields: [
      { id: 'city', type: 'text', label: 'Em qual cidade você mora?', required: true },
      {
        id: 'email',
        type: 'email',
        label: 'E-mail',
        required: true,
        placeholder: 'voce@email.com',
      },
      {
        id: 'phone',
        type: 'tel',
        label: 'Telefone',
        required: true,
        placeholder: '(00) 00000-0000',
      },
      {
        id: 'linkedin',
        type: 'url',
        label: 'LinkedIn',
        required: true,
        placeholder: 'https://linkedin.com/in/...',
      },
      {
        id: 'resume',
        type: 'file',
        label: 'Currículo (PDF)',
        required: true,
        hint: 'Garanta que o seu currículo tenha todos os acessos importantes, como portfólio, Behance ou GitHub.',
      },
    ],
  },
  {
    id: 'perfil',
    title: 'Perfil profissional',
    subtitle: 'Onde você está hoje na sua carreira.',
    fields: [
      {
        id: 'vaga',
        type: 'text',
        label: 'Para qual vaga você está se candidatando?',
        placeholder: 'Ex.: Back-end .NET',
        hint: 'Se você não tem uma vaga específica em mente, pode deixar em branco.',
      },
      {
        id: 'seniority',
        type: 'select',
        label: 'Nível de senioridade',
        options: ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Liderança / Gestão'],
      },
      {
        id: 'salaryExpectation',
        type: 'text',
        label: 'Expectativa de remuneração',
        placeholder: 'Ex.: R$ 8.000',
      },
      {
        id: 'stacks',
        type: 'textarea',
        label: 'Stacks, frameworks ou especializações',
        placeholder: 'Conta o que você domina...',
      },
      { id: 'skills', type: 'textarea', label: 'Competências e habilidades' },
    ],
  },
  {
    id: 'trajetoria',
    title: 'Formação & experiência',
    subtitle: 'Os caminhos que te trouxeram até aqui.',
    fields: [
      { id: 'education', type: 'textarea', label: 'Formação' },
      { id: 'experience', type: 'textarea', label: 'Experiência profissional' },
    ],
  },
  {
    id: 'fit',
    title: 'O que te move',
    subtitle: 'O que importa pra você num lugar de trabalho.',
    fields: [
      {
        id: 'values',
        type: 'checkbox',
        label: 'O que você mais valoriza?',
        options: [
          'Estabilidade e segurança no vínculo',
          'Oportunidade de crescimento e evolução na carreira',
          'Remuneração competitiva e benefícios',
          'Autonomia e liberdade para decisões',
          'Projetos desafiadores e inovadores',
          'Cultura de colaboração, confiança e pertencimento',
          'Flexibilidade de horário e/ou modelo remoto',
        ],
      },
      { id: 'motivation', type: 'textarea', label: 'Sua motivação para entrar na Loomi' },
      { id: 'futureVision', type: 'textarea', label: 'Como você imagina o seu futuro?' },
    ],
  },
  {
    id: 'ia',
    title: 'Você e a IA',
    subtitle: 'Como a inteligência artificial entra no seu dia a dia.',
    fields: [
      {
        id: 'aiLevel',
        type: 'select',
        label: 'Nível de uso de IA',
        options: [
          'Não uso',
          'Uso ocasionalmente',
          'Uso no dia a dia',
          'Uso de forma avançada / integrada ao trabalho',
        ],
      },
      { id: 'aiPurpose', type: 'textarea', label: 'Para que você usa IA?' },
      {
        id: 'aiAutomation',
        type: 'textarea',
        label: 'Você já criou alguma automação com IA? Conta pra gente.',
      },
    ],
  },
  {
    id: 'final',
    title: 'Quase lá',
    subtitle: 'Só mais alguns detalhes.',
    fields: [
      {
        id: 'howFound',
        type: 'select',
        label: 'Como você conheceu a Loomi?',
        options: ['LinkedIn', 'Instagram', 'Indicação de alguém', 'Site / Blog', 'Evento', 'Outro'],
      },
      {
        id: 'referredBy',
        type: 'text',
        label: 'Quem te indicou?',
        showIf: { field: 'howFound', equals: 'Indicação de alguém' },
      },
      {
        id: 'affirmativeGroups',
        type: 'checkbox',
        label: 'Você gostaria de entrar em um banco afirmativo?',
        hint: 'Opcional. Essa informação nos ajuda em ações afirmativas e é tratada com confidencialidade.',
        options: ['Pessoas LGBTQIA+', 'Mulheres', 'Pessoas pretas', 'Prefiro não informar'],
      },
    ],
  },
]
