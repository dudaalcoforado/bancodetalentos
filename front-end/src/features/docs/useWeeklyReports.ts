'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { buildSeedReports, createEmptyReport, newId } from './seed'
import type { WeeklyReport } from './types'

const STORAGE_KEY = 'loomi.weekly-reports.v1'

function cloneWithNewIds(report: WeeklyReport, titulo: string): WeeklyReport {
  return {
    id: newId(),
    titulo,
    criadoEm: new Date().toISOString(),
    vagas: report.vagas.map((vaga) => ({
      ...vaga,
      id: newId(),
      fases: vaga.fases.map((fase) => ({ ...fase, id: newId() })),
    })),
  }
}

export function useWeeklyReports() {
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [ready, setReady] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as WeeklyReport[]) : null
      setReports(parsed && parsed.length > 0 ? parsed : buildSeedReports())
    } catch {
      setReports(buildSeedReports())
    }
    hydrated.current = true
    setReady(true)
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
    } catch {
      /* armazenamento indisponível — mantém apenas em memória */
    }
  }, [reports])

  const mutateReport = useCallback(
    (id: string, recipe: (report: WeeklyReport) => WeeklyReport) => {
      setReports((prev) => prev.map((report) => (report.id === id ? recipe(report) : report)))
    },
    [],
  )

  const createReport = useCallback((): string => {
    const titulo = new Date().toLocaleDateString('pt-BR')
    const report = createEmptyReport(titulo)
    setReports((prev) => [report, ...prev])
    return report.id
  }, [])

  const duplicateReport = useCallback(
    (id: string): string | null => {
      const source = reports.find((report) => report.id === id)
      if (!source) return null
      const copy = cloneWithNewIds(source, `${source.titulo} (cópia)`)
      setReports((prev) => {
        const index = prev.findIndex((report) => report.id === id)
        const next = [...prev]
        next.splice(index + 1, 0, copy)
        return next
      })
      return copy.id
    },
    [reports],
  )

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id))
  }, [])

  return {
    reports,
    ready,
    mutateReport,
    createReport,
    duplicateReport,
    deleteReport,
  }
}
