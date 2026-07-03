'use client'

import { useQuery } from '@tanstack/react-query'

import { talentBankApi } from '../api'
import { talentBankKeys } from '../keys'

export function useTalentApplications() {
  return useQuery({
    queryKey: talentBankKeys.all,
    queryFn: () => talentBankApi.list(),
    staleTime: 30_000,
  })
}
