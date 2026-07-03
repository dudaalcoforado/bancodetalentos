'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { ApplicationDetail } from '@/features/talent-bank/components/ApplicationDetail'
import { useTalentApplication } from '@/features/talent-bank/hooks/useTalentApplication'

export default function TalentApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const { data: application, isLoading } = useTalentApplication(params.id)

  if (isLoading || !application) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/talent-bank"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para candidaturas
      </Link>

      <Card className="border-border/60 ring-foreground/5">
        <CardContent className="p-6">
          <ApplicationDetail application={application} />
        </CardContent>
      </Card>
    </div>
  )
}
