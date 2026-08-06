import type { TalentApplicationStage } from '@/features/talent-bank/stages'

export interface TalentApplicationPayload {
  fullName: string
  preferredName: string
  pronoun?: string
  city: string
  email: string
  phone: string
  linkedin: string
  resume: File
  vaga?: string
  seniority?: string
  salaryExpectation?: string
  stacks?: string
  skills?: string
  education?: string
  experience?: string
  values: string[]
  motivation?: string
  futureVision?: string
  aiLevel?: string
  aiPurpose?: string
  aiAutomation?: string
  howFound?: string
  referredBy?: string
  affirmativeGroups: string[]
}

export interface TalentApplication {
  id: string
  fullName: string
  preferredName: string
  pronoun: string | null
  city: string
  email: string
  phone: string
  linkedin: string
  resumeFileName: string
  resumeUrl: string
  vaga: string | null
  seniority: string | null
  salaryExpectation: string | null
  stacks: string | null
  skills: string | null
  education: string | null
  experience: string | null
  values: string[]
  motivation: string | null
  futureVision: string | null
  aiLevel: string | null
  aiPurpose: string | null
  aiAutomation: string | null
  howFound: string | null
  referredBy: string | null
  affirmativeGroups: string[]
  recruiter: string | null
  stage: TalentApplicationStage
  createdAt: string
}
