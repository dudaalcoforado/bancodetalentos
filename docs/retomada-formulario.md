# Retomada — Formulário do Banco de Talentos (público, multi-etapas)

Cole este conteúdo num chat novo do Claude Code para continuar **só o formulário público**.

---

Retomando o **Formulário público do Banco de Talentos** no monorepo
`C:\Users\Rafael\Documents\Hacka Loomi`.

## O que já existe

**Front-end** — `front-end/src/features/talent-bank/`
- `steps.ts` — definição das etapas do formulário multi-etapas
- `components/TalentApplicationForm.tsx` — renderizador do formulário
- `components/ChipGroup.tsx`
- hook `useSubmitApplication`
- Rota pública: `/banco-de-talentos`

## Onde paramos

Estávamos **portando a referência de design completa** para o `steps.ts` real.

1. `steps.ts` — a opção do banco afirmativo passou a incluir **"PCD"**:
   `['Pessoas LGBTQIA+', 'Mulheres', 'Pessoas pretas', 'PCD']`.
2. `BancoTalentosLoomi_1.jsx` (raiz do projeto) — **referência de design**
   mais completa (727 linhas, etapa `intro` + motor de campos mais rico).
   Estava sendo portada para o `steps.ts` real.

### Campos que existem na referência e ainda faltam no form real
- Etapa `intro` (página de abertura com botão Start)
- Identidade: `nome_completo` + `como_chamada`
- Perfil: `remuneracao`
- Fit: `futuro`

### Decisão pendente
Convenção de IDs: a referência usa pt-br (`nome_completo`, `senioridade`…) e o
`steps.ts` real usa en (`seniority`, `city`…). Definir uma só antes de portar.

## Regras do repositório (obrigatório ler antes de mudar código)

- `CLAUDE.md`, `front-end/CLAUDE.md`
- Stop hook roda `make verify` a cada turno — não pode quebrar
- TS strict

## Primeiro passo sugerido

Comparar `BancoTalentosLoomi_1.jsx` com
`front-end/src/features/talent-bank/steps.ts` e propor o plano de port dos
campos faltantes.
