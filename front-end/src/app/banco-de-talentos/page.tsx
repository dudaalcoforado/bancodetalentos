import type { Metadata } from 'next'

import { TalentApplicationForm } from '@/features/talent-bank/components/TalentApplicationForm'

export const metadata: Metadata = {
  title: 'Banco de Talentos Loomi',
  description: 'Candidate-se ao Banco de Talentos da Loomi.',
}

export default function BancoDeTalentosPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_-10%,oklch(0.40_0.235_288/0.18),transparent_70%),radial-gradient(45%_40%_at_85%_110%,oklch(0.55_0.20_330/0.15),transparent_70%)]"
      />
      <div className="w-full max-w-2xl">
        <TalentApplicationForm />
      </div>
    </main>
  )
}
