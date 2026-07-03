'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, UploadCloud } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/progress'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ApiError } from '@/lib/api'
import { ChipGroup } from './ChipGroup'
import { useSubmitApplication } from '../hooks/useSubmitApplication'
import { INITIAL_FORM_STATE, STEPS, type FieldDef, type TalentFormState } from '../steps'

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024

export function TalentApplicationForm() {
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState<TalentFormState>(INITIAL_FORM_STATE)
  const [fileError, setFileError] = useState<string | null>(null)
  const submit = useSubmitApplication()

  const step = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1

  function setValue<K extends keyof TalentFormState>(key: K, value: TalentFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isStepValid(): boolean {
    return step.fields
      .filter((f) => !f.showIf || form[f.showIf.field] === f.showIf.equals)
      .every((f) => {
        if (!f.required) return true
        const value = form[f.id]
        if (f.id === 'resume') return value instanceof File
        return typeof value === 'string' && value.trim().length > 0
      })
  }

  function onFileChange(file: File | null) {
    if (!file) {
      setValue('resume', null)
      return
    }
    if (file.type !== 'application/pdf') {
      setFileError('Envie um arquivo em formato PDF.')
      setValue('resume', null)
      return
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setFileError('O arquivo deve ter no máximo 10 MB.')
      setValue('resume', null)
      return
    }
    setFileError(null)
    setValue('resume', file)
  }

  function goNext() {
    if (!isLastStep) {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
      return
    }
    if (!form.resume) return
    submit.mutate({ ...form, resume: form.resume })
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  if (submit.isSuccess) {
    return (
      <Card className="border-border/60 shadow-xl ring-1 ring-foreground/5">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <CheckCircle2 className="size-10 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Candidatura enviada!
          </h1>
          <p className="text-sm text-muted-foreground">
            Obrigado por se candidatar ao Banco de Talentos Loomi. Assim que surgir uma
            oportunidade compatível, vamos te procurar por aqui.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!started) {
    return (
      <Card className="border-border/60 shadow-xl ring-1 ring-foreground/5">
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Loomi · Carreiras
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Banco de Talentos Loomi
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Na Loomi, acreditamos que talento nasce de histórias diversas, caminhos únicos e
            sonhos autênticos. Queremos conhecer quem você é, como você trabalha e o que te
            move, além do que está no currículo.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sempre que surge uma nova oportunidade por aqui, este é o primeiro lugar que
            procuramos por pessoas candidatas.
          </p>
          <Button size="lg" className="mt-2 w-full" onClick={() => setStarted(true)}>
            Começar
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  const submitError =
    submit.error instanceof ApiError
      ? submit.error.message
      : submit.error
        ? 'Não foi possível enviar sua candidatura. Tente novamente.'
        : null

  return (
    <Card className="border-border/60 shadow-xl ring-1 ring-foreground/5">
      <CardContent className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Etapa {stepIndex + 1} de {STEPS.length}
          </p>
          <Progress value={((stepIndex + 1) / STEPS.length) * 100} />
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">{step.title}</h2>
          {step.subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          {step.fields
            .filter((f) => !f.showIf || form[f.showIf.field] === f.showIf.equals)
            .map((f) => (
              <Field
                key={f.id}
                label={f.label + (f.required ? ' *' : '')}
                htmlFor={f.id}
                hint={f.id === 'resume' ? fileError ?? f.hint : f.hint}
              >
                {renderField(f, form, setValue, onFileChange)}
              </Field>
            ))}
        </div>

        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex === 0}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
          <Button
            type="button"
            onClick={goNext}
            disabled={!isStepValid() || submit.isPending}
          >
            {submit.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando...
              </>
            ) : isLastStep ? (
              'Enviar candidatura'
            ) : (
              <>
                Continuar
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function renderField(
  field: FieldDef,
  form: TalentFormState,
  setValue: <K extends keyof TalentFormState>(key: K, value: TalentFormState[K]) => void,
  onFileChange: (file: File | null) => void,
): React.ReactNode {
  const value = form[field.id]

  if (field.type === 'file') {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-4 text-sm transition-colors hover:border-primary/50">
        <input
          id={field.id}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        <UploadCloud className="size-5 text-primary" />
        <span className="text-foreground">
          {value instanceof File ? value.name : 'Clique para anexar (PDF)'}
        </span>
      </label>
    )
  }

  if (field.type === 'textarea') {
    return (
      <Textarea
        id={field.id}
        value={typeof value === 'string' ? value : ''}
        placeholder={field.placeholder}
        onChange={(e) => setValue(field.id, e.target.value as never)}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <Select
        id={field.id}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => setValue(field.id, e.target.value as never)}
      >
        <option value="" disabled>
          Selecione...
        </option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  }

  if (field.type === 'radio' || field.type === 'checkbox') {
    return (
      <ChipGroup
        options={field.options ?? []}
        multiple={field.type === 'checkbox'}
        value={value as string | string[]}
        onChange={(next) => setValue(field.id, next as never)}
      />
    )
  }

  return (
    <Input
      id={field.id}
      type={field.type}
      value={typeof value === 'string' ? value : ''}
      placeholder={field.placeholder}
      onChange={(e) => setValue(field.id, e.target.value as never)}
    />
  )
}
