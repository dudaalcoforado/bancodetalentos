'use client'

import { useMutation } from '@tanstack/react-query'

import { talentBankApi } from '../api'

export function useDownloadResume() {
  return useMutation({
    mutationFn: async ({ id, fileName }: { id: string; fileName: string }) => {
      const blob = await talentBankApi.downloadResume(id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
    },
  })
}
