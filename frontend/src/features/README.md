# Features

Feature-based architecture (see `.claude/rules/react.md`, based on
[bulletproof-react](https://github.com/alan2207/bulletproof-react)).

Each feature is a self-contained folder under `src/features/<feature>/` and
contains only the parts it needs:

```
src/features/<feature>/
  api/          Feature API calls + TanStack Query hooks
  components/   Feature-scoped components
  hooks/        Feature-scoped hooks
  stores/       Feature state (if any)
  types/        Feature types
  utils/        Feature utils
```

## Import rules (unidirectional: shared → features → app)

- A feature may import from **shared** modules only (`components/`, `hooks/`,
  `lib/`, `config/`, `testing/`).
- A feature must **never** import from another feature — compose across features
  at the `app`/route level.
- Import files directly; **no barrel (`index.ts`) files**.

Shared, reusable UI lives in `src/components/`. Route definitions live in
`src/routes/` and should stay thin, delegating to feature components.
