'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TalentApplication } from '@/types/talent-application'
import { talentBankApi } from '../api'
import { talentBankKeys } from '../keys'

interface UpdateRecruiterVariables {
  id: string
  recruiter: string | null
}

interface MutationContext {
  previous: TalentApplication[] | undefined
}

export function useUpdateRecruiter() {
  const queryClient = useQueryClient()

  return useMutation<TalentApplication, Error, UpdateRecruiterVariables, MutationContext>({
    mutationFn: ({ id, recruiter }) => talentBankApi.updateRecruiter(id, recruiter),
    onMutate: async ({ id, recruiter }) => {
      await queryClient.cancelQueries({ queryKey: talentBankKeys.all })
      const previous = queryClient.getQueryData<TalentApplication[]>(talentBankKeys.all)
      queryClient.setQueryData<TalentApplication[]>(talentBankKeys.all, (current) =>
        current?.map((application) =>
          application.id === id ? { ...application, recruiter } : application,
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
