export const RECRUITERS = [
  'Ton Lima',
  'Eduarda Alcoforado',
  'Laura Nóbrega',
  'Yngrid Figueiredo',
] as const

export type Recruiter = (typeof RECRUITERS)[number]

/**
 * Extract the Brazilian area code (DDD) from a phone string.
 * Strips non-digits and an optional +55 country code, then returns the
 * first two digits. Returns null when the number is too short to have one.
 */
export function getDDD(phone: string | null | undefined): string | null {
  if (!phone) return null
  let digits = phone.replace(/\D/g, '')
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2)
  if (digits.length < 10) return null
  return digits.slice(0, 2)
}
