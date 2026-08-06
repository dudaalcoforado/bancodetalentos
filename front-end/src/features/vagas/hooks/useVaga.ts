'use client'

import { useQuery } from '@tanstack/react-query'

import { vagasApi } from '../api'
import { vagasKeys } from '../keys'

export function useVaga(id: string) {
  return useQuery({
    queryKey: vagasKeys.detail(id),
    queryFn: () => vagasApi.getOne(id),
    enabled: Boolean(id),
  })
}
