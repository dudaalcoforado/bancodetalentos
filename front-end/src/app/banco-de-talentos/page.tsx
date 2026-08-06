import type { Metadata } from 'next'

import { TalentApplicationForm } from '@/features/talent-bank/components/TalentApplicationForm'

export const metadata: Metadata = {
  title: 'Banco de Talentos Loomi',
  description: 'Candidate-se ao Banco de Talentos da Loomi.',
}

export default function BancoDeTalentosPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Purple aurora ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_-10%,oklch(0.40_0.235_288/0.22),transparent_70%),radial-gradient(45%_45%_at_90%_105%,oklch(0.55_0.20_330/0.18),transparent_70%),radial-gradient(40%_40%_at_5%_110%,oklch(0.40_0.235_288/0.14),transparent_70%)]"
      />
      {/* Soft grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(oklch(0.40_0.235_288/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(0.40_0.235_288/0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
      />
      {/* Wireframe globe, bottom-right */}
      <GlobeDecoration />

      <div className="relative w-full max-w-2xl">
        <TalentApplicationForm />
      </div>
    </main>
  )
}

function GlobeDecoration() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -bottom-24 -right-16 -z-10 size-[min(60vw,420px)] text-primary/45"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.9}
    >
      <circle cx={100} cy={100} r={92} className="text-primary/60" />
      {/* Longitudes */}
      <ellipse cx={100} cy={100} rx={30} ry={92} />
      <ellipse cx={100} cy={100} rx={62} ry={92} />
      <line x1={100} y1={8} x2={100} y2={192} />
      {/* Latitudes */}
      <line x1={8} y1={100} x2={192} y2={100} />
      <ellipse cx={100} cy={100} rx={92} ry={34} />
      <ellipse cx={100} cy={100} rx={92} ry={66} />
      <ellipse cx={100} cy={62} rx={78} ry={16} />
      <ellipse cx={100} cy={138} rx={78} ry={16} />
    </svg>
  )
}
