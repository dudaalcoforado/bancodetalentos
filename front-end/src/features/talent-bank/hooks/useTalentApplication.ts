'use client'

import { useQuery } from '@tanstack/react-query'

import { talentBankApi } from '../api'
import { talentBankKeys } from '../keys'

export function useTalentApplication(id: string | undefined) {
  return useQuery({
    queryKey: id ? talentBankKeys.detail(id) : [...talentBankKeys.all, 'detail', 'pending'],
    queryFn: () => talentBankApi.getOne(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  })
}
