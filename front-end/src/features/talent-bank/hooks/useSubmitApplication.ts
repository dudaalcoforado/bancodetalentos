'use client'

import { useMutation } from '@tanstack/react-query'

import type { TalentApplicationPayload } from '@/types/talent-application'
import { talentBankApi } from '../api'

export function useSubmitApplication() {
  return useMutation({
    mutationFn: (payload: TalentApplicationPayload) =>
      talentBankApi.submit(payload),
  })
}
