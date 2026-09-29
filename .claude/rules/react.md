---
paths:
  - "frontend/**/*.{ts,tsx}"
---

# React Development Standards

Based on [bulletproof-react](https://github.com/alan2207/bulletproof-react).

## Project Structure

### Feature-Based Organisation

Organise code by **feature**, not by technical type. Most code lives under `src/features/<feature>/`, and each feature contains only the folders it needs:

```
src/
  app/            ← App-level setup: routes, providers, router, root component
  assets/         ← Static files (images, fonts)
  components/     ← Shared, reusable components (incl. a UI library folder)
  config/         ← Global config + env vars
  features/       ← Feature modules (the bulk of the app)
  hooks/          ← Shared hooks
  lib/            ← Preconfigured third-party libraries (api client, etc.)
  stores/         ← Global state stores
  testing/        ← Test utils, mocks, fixtures
  types/          ← Shared TypeScript types
  utils/          ← Shared utilities

src/features/<feature>/
  api/            ← Feature API calls + query/mutation hooks
  assets/
  components/     ← Feature-scoped components
  hooks/
  stores/
  types/
  utils/
```

### Unidirectional Code Flow

Imports flow in one direction: **shared → features → app**.

- Shared modules (`components`, `hooks`, `lib`, `types`, `utils`) may be imported anywhere.
- A feature may import from shared modules only.
- **A feature must never import from another feature.** Compose cross-feature UI at the `app` level.
- `app` may import from features and shared modules.

Enforce this with ESLint `import/no-restricted-paths` so it fails CI, not just review:

```js
// eslint boundaries
{
  target: './src/features',
  from: './src/app',
},
{
  target: ['./src/components', './src/hooks', './src/lib', './src/types', './src/utils'],
  from: ['./src/features', './src/app'],
},
// plus, per feature: forbid importing that feature from sibling features
```

### No Barrel Files

Import files directly (`features/orders/api/get-orders`), **not** through `index.ts` barrels. Barrels hurt Vite tree-shaking and create circular-import traps.

### Colocation

Keep components, hooks, styles, state and tests as close as possible to where they're used. Only promote to a shared folder once something is genuinely reused.

---

## Components & Styling

### Single Responsibility & Abstraction

Each component does one thing. Extract nested render functions into their own components rather than defining them inline. If you're scrolling past three screens of JSX, it's two components.

### Composition Over Configuration

Prefer building flexible UIs via **children and slot props** rather than ever-growing prop APIs.

```tsx
// ❌ Configuration hell
<Modal title="..." footer="..." icon="..." closable showOverlay ... />

// ✅ Composition
<Modal>
  <Modal.Header><h2>Title</h2></Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer><Button>Confirm</Button></Modal.Footer>
</Modal>
```

### Component Library

Build a shared component library under `components/ui/`. Prefer a headless/code-based system (Radix, shadcn/ui) over fully-styled kits when custom design is needed. **Wrap third-party components** so the app depends on your API, not theirs.

### Styling

Pick one styling solution and stick to it (Tailwind, CSS Modules, vanilla-extract). Prefer **zero-runtime** solutions over runtime CSS-in-JS (styled-components/Emotion) for performance, and note that React Server Components require zero-runtime styling.

---

## State Management

Match the tool to the _kind_ of state — don't put everything in one global store.

| Kind of state                                   | Use                                                  |
| ----------------------------------------------- | ---------------------------------------------------- |
| Component / local UI state                      | `useState`, or `useReducer` for complex transitions  |
| Server cache state                              | **React Query / SWR** — not a general store          |
| Global app state (modals, notifications, theme) | Zustand / Jotai, or Context for low-frequency values |
| Form state                                      | React Hook Form + Zod                                |
| URL state                                       | route/query params via react-router                  |

- **Colocate state as low as possible;** lift only when siblings genuinely share it.
- **Server data is not app state** — never hand-roll caching in Zustand/Redux; use a query library.
- Avoid Context for high-frequency updates (it re-renders all consumers) — reach for a store with selectors.

---

## API Layer

- Use a **single preconfigured API client instance** (e.g. an axios instance in `lib/`) reused everywhere.
- Define request declarations per feature under `features/<feature>/api/`: the fetcher function, its request/response types, and a colocated React Query hook.
- Handle cross-cutting concerns (auth headers, 401 logout, token refresh, error toasts) via **client interceptors**, not in each call site.

---

## Hooks

- Extract reusable stateful logic into focused, composable `use*` hooks (shared ones in `hooks/`).
- Never call hooks conditionally or inside loops.
- Always specify `useEffect` dependency arrays — no suppression comments without a written justification. Implement cleanup to avoid leaks.
- **`useEffect` is for synchronising with external systems**, not deriving state or handling events:

```tsx
// ❌ Deriving state in an effect
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// ✅ Derive inline
const fullName = `${first} ${last}`;
```

---

## TypeScript

### No `any`

Use `unknown` and narrow, or model the type properly.

### Props Are Named Types

```tsx
// ✅
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};
const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => ...
```

### Discriminated Unions for UI States

```tsx
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

---

## Performance

- **Memoisation is opt-in, not default.** Only reach for `React.memo`, `useMemo`, `useCallback` when there's a _measured_ problem.
- **Code-split at the route level** with `React.lazy` + `Suspense`. Don't over-split into tiny chunks.
- Use the **state initializer function** for expensive initial state: `useState(() => compute())`.
- Use the **children prop pattern** to isolate subtrees from parent re-renders.
- **Key discipline:** never use array index as a key for lists that can reorder — use a stable unique id.
- Optimise images: lazy-load off-screen images, modern formats (WEBP), `srcset` for responsiveness.
- Prefetch data before navigation with `queryClient.prefetchQuery`. Watch Core Web Vitals (Lighthouse).

---

## Error Handling

- **Multiple Error Boundaries**, one per feature subtree — a single failure should be contained, not crash the page.
- Handle API errors centrally via client interceptors (toasts, logout, refresh).
- Use **Sentry** (with source maps) for production error tracking rather than a custom solution.
- Never swallow errors silently:

```tsx
// ❌
try {
  await saveUser(data);
} catch (_) {}

// ✅
try {
  await saveUser(data);
} catch (err) {
  logger.error("Failed to save user", err);
  setError("Could not save. Please try again.");
}
```

---

## Security

- **Store auth tokens in `HttpOnly` cookies**, not `localStorage` — this survives refresh without exposing tokens to XSS.
- **Sanitize all user input** before rendering it to defend against XSS.
- Authorization via a protection component that accepts either a role (RBAC) or a policy check (PBAC):
  - **RBAC** — coarse roles (`USER`, `ADMIN`).
  - **PBAC** — fine-grained, e.g. only a resource's owner may edit it.

---

## Testing

- Prioritise **integration tests** — passing unit tests don't prove the wired-up app works.
- **Vitest** as the runner; **Testing Library** for user-centric component tests (test behaviour, not implementation details).
- **MSW** to mock the network at the HTTP layer (incl. error paths).
- **Playwright** for E2E, headless in CI.

---

## Code Quality Guardrails

- One component per file; file name matches the component name.
- Components over **200 lines** → split. Props interfaces over **10 props** → compose or split concerns.
- No inline object/array literals in JSX that trigger needless re-renders.
- Avoid deeply nested ternaries in JSX — extract to a variable or sub-component.
- PascalCase for components, camelCase for functions/variables.
