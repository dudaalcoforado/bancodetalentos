'use client'

import { useQuery } from '@tanstack/react-query'

import { vagasApi } from '../api'
import { vagasKeys } from '../keys'

export function useVagas() {
  return useQuery({
    queryKey: vagasKeys.all,
    queryFn: () => vagasApi.list(),
    staleTime: 30_000,
  })
}
