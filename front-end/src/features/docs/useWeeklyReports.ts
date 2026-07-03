'use client'

import { useCallback, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { docsApi } from './api'
import { weeklyReportKeys } from './keys'
import { createEmptyReport, newId } from './seed'
import type { WeeklyReport } from './types'

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

/**
 * Fonte compartilhada de relatórios semanais (persistida no back-end).
 * Mantém a mesma interface do hook anterior: edições são otimistas no cache
 * do React Query e sincronizadas com a API (PATCH com debounce por relatório).
 */
export function useWeeklyReports() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: weeklyReportKeys.all, queryFn: docsApi.list })
  const reports = query.data ?? []
  const ready = !query.isLoading

  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const rollback = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: weeklyReportKeys.all })
  }, [queryClient])

  const flushSave = useCallback(
    (id: string) => {
      const latest = queryClient
        .getQueryData<WeeklyReport[]>(weeklyReportKeys.all)
        ?.find((report) => report.id === id)
      if (!latest) return
      docsApi.update(id, latest).catch(rollback)
    },
    [queryClient, rollback],
  )

  const scheduleSave = useCallback(
    (id: string) => {
      const timers = saveTimers.current
      const existing = timers.get(id)
      if (existing) clearTimeout(existing)
      timers.set(
        id,
        setTimeout(() => {
          timers.delete(id)
          flushSave(id)
        }, 600),
      )
    },
    [flushSave],
  )

  const mutateReport = useCallback(
    (id: string, recipe: (report: WeeklyReport) => WeeklyReport) => {
      queryClient.setQueryData<WeeklyReport[]>(weeklyReportKeys.all, (prev) =>
        (prev ?? []).map((report) => (report.id === id ? recipe(report) : report)),
      )
      scheduleSave(id)
    },
    [queryClient, scheduleSave],
  )

  const createReport = useCallback((): string => {
    const report = createEmptyReport(new Date().toLocaleDateString('pt-BR'))
    queryClient.setQueryData<WeeklyReport[]>(weeklyReportKeys.all, (prev) => [
      report,
      ...(prev ?? []),
    ])
    docsApi.create(report).catch(rollback)
    return report.id
  }, [queryClient, rollback])

  const duplicateReport = useCallback(
    (id: string): string | null => {
      const source = queryClient
        .getQueryData<WeeklyReport[]>(weeklyReportKeys.all)
        ?.find((report) => report.id === id)
      if (!source) return null
      const copy = cloneWithNewIds(source, `${source.titulo} (cópia)`)
      queryClient.setQueryData<WeeklyReport[]>(weeklyReportKeys.all, (prev) => {
        const next = [...(prev ?? [])]
        const index = next.findIndex((report) => report.id === id)
        next.splice(index < 0 ? next.length : index + 1, 0, copy)
        return next
      })
      docsApi.create(copy).catch(rollback)
      return copy.id
    },
    [queryClient, rollback],
  )

  const deleteReport = useCallback(
    (id: string) => {
      const timer = saveTimers.current.get(id)
      if (timer) {
        clearTimeout(timer)
        saveTimers.current.delete(id)
      }
      queryClient.setQueryData<WeeklyReport[]>(weeklyReportKeys.all, (prev) =>
        (prev ?? []).filter((report) => report.id !== id),
      )
      docsApi.remove(id).catch(rollback)
    },
    [queryClient, rollback],
  )

  return { reports, ready, mutateReport, createReport, duplicateReport, deleteReport }
}
