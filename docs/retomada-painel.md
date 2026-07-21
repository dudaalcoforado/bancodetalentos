# Retomada — Banco de Talentos (painel / Kanban admin)

Cole este conteúdo num chat novo do Claude Code para continuar **só o painel administrativo**.

---

Retomando o **Banco de Talentos (painel administrativo / Kanban)** no monorepo
`C:\Users\Rafael\Documents\Hacka Loomi`.

## O que já existe (commitado)

**Back-end** — `back-end/src/modules/talent-bank/`
- `talent-bank.controller.ts`, `talent-bank.service.ts`, `talent-bank.service.spec.ts`
- DTOs: `dto/talent-application.entity.ts`, `dto/create-talent-application.dto.ts`
- Migration: `prisma/migrations/20260626153631_add_talent_application_stage_and_vaga/`

**Front-end** — `front-end/src/features/talent-bank/`
- `components/TalentKanbanBoard.tsx` — quadro Kanban por estágio
- `components/ApplicationDetail.tsx` — detalhe da candidatura
- `stages.ts` — definição dos estágios do funil
- hooks: `useUpdateStage`, `useTalentApplications`, `useTalentApplication`, `useDownloadResume`
- Rotas: `/talent-bank` e `/talent-bank/[id]`

## Onde paramos

Painel funcional: Kanban por estágio + detalhe da candidatura + download de
currículo. Próximo passo em aberto — revisar `stages.ts` e confirmar os
estágios do funil antes de evoluir (filtros, busca, mover em massa, etc.).

## Regras do repositório (obrigatório ler antes de mudar código)

- `CLAUDE.md`, `back-end/CLAUDE.md`, `front-end/CLAUDE.md`
- Stop hook roda `make verify` (lint + build + typecheck + audit) a cada turno — não pode quebrar
- SQLite only, sem Docker, TS strict

## Primeiro passo sugerido

Rodar `git status` e `make dev`, então propor o próximo incremento do painel.
