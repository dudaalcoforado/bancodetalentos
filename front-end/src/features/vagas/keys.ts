export const vagasKeys = {
  all: ['vagas'] as const,
  detail: (id: string) => ['vagas', 'detail', id] as const,
}
