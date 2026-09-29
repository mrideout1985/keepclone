---
paths:
  - "backend/**/*.{ts,js}"
---

# Express / Node.js Backend Standards

Based on [practica.js](https://github.com/practicajs/practica) and [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices).

## Philosophy

Favour **simplicity, flat code flows, and minimal abstractions.** Build on known libraries rather than reinventing infrastructure. Avoid heavy indirection (unnecessary DI containers, deep inheritance, clever metaprogramming) — code should be obvious to read top to bottom.

---

## Structure

### Component-Based, Not Layer-Based

Organise by **business domain** (e.g. `order/`, `user/`, `payment/`), not by technical type (`controllers/`, `services/`, `models/`). Each component is self-contained.

### 3-Tier Layering (inside each component)

```
backend/src/
  components/
    order/
      entry-points/   ← API layer: Express routes/controllers, request parsing, response shaping
      domain/         ← Business logic (the only place rules live). Framework-agnostic.
      data-access/    ← DB queries, repositories. The only place that talks to the database.
  libraries/          ← Reusable cross-cutting packages (logger, config, error-handling)
```

A request flows **entry-point → domain → data-access** and never skips or reverses:

- **entry-points** know about HTTP; they must contain no business logic.
- **domain** knows nothing about HTTP or SQL; it receives plain objects and returns plain objects.
- **data-access** is the only layer that imports the DB client.

---

## Configuration

- Use **strong-schema, type-safe config** that validates on startup and **fails fast** on missing/invalid values.
- Support both env vars and config files, with a documented hierarchy.
- **Never hardcode secrets** — load from environment. Set `NODE_ENV=production` in prod.

---

## Error Handling

- Use **async/await**; always `await` a promise before returning so stack traces stay intact.
- Extend the built-in `Error` with a custom `AppError` carrying `name`, `httpStatus`, and `isOperational`.
- **Distinguish operational errors** (expected: bad input, 404) from **programmer errors** (bugs) — crash and restart on the latter.
- Route everything through a **single centralized error handler** (one Express error middleware delegating to it) — don't scatter try/catch response logic across controllers.
- Listen for `process.on('unhandledRejection')` and `uncaughtException`.

---

## Code Style

- **ESLint + Prettier** enforced in CI.
- `const` first; `let` only when reassigning; never `var`. Always `===`, never `==`.
- Naming: `lowerCamelCase` for variables/functions, `UpperCamelCase` for classes, `UPPER_SNAKE_CASE` for constants.
- **Require/import at the top of the file** — no lazy requires, no side effects (network/DB calls) at module load; keep those inside functions.
- Use the `node:` prefix for built-in modules.

---

## Security

- **Validate all input** at the entry-point with a schema validator (**Zod** or ajv) — fail fast on invalid data.
- Prevent injection via an ORM/query builder or parameterized queries — never string-concatenate SQL.
- **Escape/sanitize output** to prevent XSS.
- Hash passwords with **bcrypt/scrypt** — never store plaintext.
- Set security headers (**helmet**: CSP, HSTS, X-Frame-Options).
- Keep secrets out of code; scan dependencies for vulnerabilities in CI.
- Support **JWT revocation/blocklisting** for token auth.

---

## Observability

- **Structured logging** (Pino) to stdout — never `console.log` in app code.
- Generate a **correlation/request ID** per request (via `AsyncLocalStorage`) and attach it to every log line for traceability.
- Cover uptime, user-facing metrics, Node.js runtime metrics, and distributed tracing.

---

## Testing

- Prioritise **component/integration tests** (API in, DB out) over unit tests for coverage ROI.
- Name tests with three parts: unit-under-test, conditions, expected outcome.
- Structure with **AAA** (Arrange, Act, Assert).
- **Isolate tests** — each test seeds its own data; no shared global fixtures.
- Mock external services (e.g. nock) including their error paths.
- Verify all outcomes: response, state change, outgoing calls, queued messages, observability.

---

## Production

- Commit `package-lock.json`; install with `npm ci` for deterministic builds.
- **Multi-stage, hardened Dockerfile**; run as a **non-root** user; start with `node app.js` (not `npm start`) for correct signal handling.
- Let Docker/Kubernetes handle process restarts and replication — no PM2 inside containers.
- Keep the app **stateless** for horizontal scaling.
- Offload gzip/SSL to a reverse proxy (nginx).
- **Never block the event loop** with heavy synchronous work — offload to workers.
