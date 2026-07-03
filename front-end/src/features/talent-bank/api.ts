import type { TalentApplicationStage } from '@/features/talent-bank/stages'
import { api } from '@/lib/api'
import type {
  TalentApplication,
  TalentApplicationPayload,
} from '@/types/talent-application'

function buildFormData(payload: TalentApplicationPayload): FormData {
  const formData = new FormData()
  const append = (key: string, value: string | undefined) => {
    if (value) formData.append(key, value)
  }

  append('fullName', payload.fullName)
  append('preferredName', payload.preferredName)
  append('pronoun', payload.pronoun)
  append('city', payload.city)
  append('email', payload.email)
  append('phone', payload.phone)
  append('linkedin', payload.linkedin)
  formData.append('resume', payload.resume)
  append('vaga', payload.vaga)
  append('seniority', payload.seniority)
  append('salaryExpectation', payload.salaryExpectation)
  append('stacks', payload.stacks)
  append('skills', payload.skills)
  append('education', payload.education)
  append('experience', payload.experience)
  formData.append('values', JSON.stringify(payload.values))
  append('motivation', payload.motivation)
  append('futureVision', payload.futureVision)
  append('aiLevel', payload.aiLevel)
  append('aiPurpose', payload.aiPurpose)
  append('aiAutomation', payload.aiAutomation)
  append('howFound', payload.howFound)
  append('referredBy', payload.referredBy)
  formData.append('affirmativeGroups', JSON.stringify(payload.affirmativeGroups))

  return formData
}

export const talentBankApi = {
  submit: (payload: TalentApplicationPayload): Promise<TalentApplication> =>
    api.postForm<TalentApplication>(
      '/talent-bank/applications',
      buildFormData(payload),
      { auth: false },
    ),

  list: (): Promise<TalentApplication[]> =>
    api.get<TalentApplication[]>('/talent-bank/applications'),

  getOne: (id: string): Promise<TalentApplication> =>
    api.get<TalentApplication>(`/talent-bank/applications/${id}`),

  downloadResume: (id: string): Promise<Blob> =>
    api.getBlob(`/talent-bank/applications/${id}/resume`),

  updateStage: (id: string, stage: TalentApplicationStage): Promise<TalentApplication> =>
    api.patch<TalentApplication>(`/talent-bank/applications/${id}/stage`, { stage }),
}
