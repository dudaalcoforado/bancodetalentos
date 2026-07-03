export const talentBankKeys = {
  all: ['talent-bank', 'applications'] as const,
  detail: (id: string) => [...talentBankKeys.all, 'detail', id] as const,
}
