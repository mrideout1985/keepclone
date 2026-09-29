# KeepClone

A Google Keep–style notes app, built as a full-stack monorepo.

## Stack

| Layer    | Tech                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| Frontend | Vite + React 19 + TypeScript, MUI 9, TanStack Router, TanStack Query           |
| Backend  | Express 5 + TypeScript, Drizzle ORM                                            |
| Database | PostgreSQL 16 (Docker)                                                         |
| Testing  | Vitest + Testing Library (unit/integration), Supertest (API), Playwright (E2E) |
| Tooling  | pnpm workspaces, ESLint + Prettier, Husky + commitlint                         |

Conventions live in [`.claude/rules`](.claude/rules) — the frontend follows
[bulletproof-react](https://github.com/alan2207/bulletproof-react); the backend
follows [practica](https://github.com/practicajs/practica) (component →
entry-points / domain / data-access).

## Layout

```
keepclone/
  frontend/   Vite React SPA (feature-based; build features in src/features)
  backend/    Express API (add features under src/components)
  docker-compose.yml   Postgres
```

## Prerequisites

- Node.js >= 24 (`.nvmrc`)
- pnpm (via Corepack: `corepack enable pnpm`)
- Docker (for Postgres)

## Getting started

```bash
# 1. install
pnpm install

# 2. copy env files (already done on first setup)
cp .env.example .env
cp frontend/.env.example frontend/.env

# 3. start Postgres
pnpm db:up

# 4. run both apps (frontend :3000, backend :4000)
pnpm dev

# once you define tables in backend/src/db/schema.ts:
#   pnpm db:generate   # create a migration
#   pnpm db:migrate    # apply it
```

## Scripts (run from the repo root)

| Command                  | What it does                                 |
| ------------------------ | -------------------------------------------- |
| `pnpm dev`               | Run frontend + backend in parallel           |
| `pnpm build`             | Build both packages                          |
| `pnpm test`              | Run all unit/integration tests               |
| `pnpm lint`              | ESLint across both packages                  |
| `pnpm typecheck`         | TypeScript checks across both packages       |
| `pnpm format`            | Prettier write                               |
| `pnpm db:up` / `db:down` | Start / stop Postgres                        |
| `pnpm db:generate`       | Generate a Drizzle migration from the schema |
| `pnpm db:migrate`        | Apply migrations                             |

## Testing

- **Backend** — Vitest + Supertest in `backend/test` (a `/health` smoke test to
  start). DB-backed integration tests should run against Postgres (`pnpm db:up`)
  and migrate/reset in a setup file — see the commented hints in
  `backend/vitest.config.ts`.
- **Frontend** — Vitest + Testing Library; the network is mocked with MSW
  (`frontend/src/testing`). Run `pnpm --filter frontend test`.
- **E2E** — Playwright in `frontend/e2e`. First run:
  `pnpm --filter frontend exec playwright install`. Needs the app running.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
(enforced by commitlint via a Husky `commit-msg` hook), e.g.
`feat(notes): add archive toggle`.
