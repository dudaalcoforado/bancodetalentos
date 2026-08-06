'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Vaga, VagaPayload } from '@/types/vaga'
import { vagasApi } from '../api'
import { vagasKeys } from '../keys'

export function useCreateVaga() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: VagaPayload) => vagasApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vagasKeys.all })
    },
  })
}

export function useUpdateVaga() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VagaPayload }) =>
      vagasApi.update(id, payload),
    onSuccess: (vaga: Vaga) => {
      queryClient.setQueryData(vagasKeys.detail(vaga.id), vaga)
      void queryClient.invalidateQueries({ queryKey: vagasKeys.all })
    },
  })
}

export function useDeleteVaga() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vagasApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vagasKeys.all })
    },
  })
}
