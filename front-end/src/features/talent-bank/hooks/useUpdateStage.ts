'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TalentApplicationStage } from '@/features/talent-bank/stages'
import type { TalentApplication } from '@/types/talent-application'
import { talentBankApi } from '../api'
import { talentBankKeys } from '../keys'

interface UpdateStageVariables {
  id: string
  stage: TalentApplicationStage
}

interface MutationContext {
  previous: TalentApplication[] | undefined
}

export function useUpdateStage() {
  const queryClient = useQueryClient()

  return useMutation<TalentApplication, Error, UpdateStageVariables, MutationContext>({
    mutationFn: ({ id, stage }) => talentBankApi.updateStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: talentBankKeys.all })
      const previous = queryClient.getQueryData<TalentApplication[]>(talentBankKeys.all)
      queryClient.setQueryData<TalentApplication[]>(talentBankKeys.all, (current) =>
        current?.map((application) =>
          application.id === id ? { ...application, stage } : application,
        ),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(talentBankKeys.all, context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: talentBankKeys.all })
    },
  })
}
