'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { VagaDetail } from '@/features/vagas/components/VagaDetail'
import { useVaga } from '@/features/vagas/hooks/useVaga'

export default function VagaDetailPage() {
  const params = useParams<{ id: string }>()
  const { data: vaga, isLoading } = useVaga(params.id)

  if (isLoading || !vaga) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/vagas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para vagas
      </Link>

      <Card className="border-border/60 ring-foreground/5">
        <CardContent className="p-6">
          <VagaDetail vaga={vaga} />
        </CardContent>
      </Card>
    </div>
  )
}
