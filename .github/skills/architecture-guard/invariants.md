# Architecture Invariants Catalogue

Reference guide for rules governing the ecommerce frontend, pre-classified to avoid re-deriving the same distinction each time. Consult this before evaluating a decision.

---

## Dependency Direction and Layer Responsibility

### RULE: Unidirectional dependency flow `app → features → shared`

**Source**: [docs/architecture.md § Arquitectura](../../docs/architecture.md#arquitectura), [.github/copilot-instructions.md § "1. Dirección de dependencias"](../../copilot-instructions.md)

`app/` may import from `features/` and `shared/`. `features/` may import from `shared/` and other `features/` only in justified cases (cross-feature domain logic; flag for review). `shared/` must **never** import from `features/`.

**Classification**: ARCHITECTURAL RULE — violation always creates tight coupling, blocks feature isolation, and contradicts the layered architecture.

---

### RULE: `app/` contains routing, layouts, providers, and page composition only

**Source**: [docs/architecture.md § `app/` Responsabilidad](../../docs/architecture.md#app), [.github/copilot-instructions.md § "2. `app/` solo contiene..."](../../copilot-instructions.md)

Domain business logic, data fetching, schema definitions, and feature-specific components belong in `features/`.

**Classification**: ARCHITECTURAL RULE — `app/` is a composition and routing layer; moving domain logic there violates the separation of concerns and makes the feature non-portable.

---

### RULE: Feature-specific code remains inside `features/<domain>/`

**Source**: [docs/architecture.md § `features/` Responsabilidad](../../docs/architecture.md#features)

Types, schemas, components, hooks, and API services specific to a feature stay in its folder tree (`api/`, `components/`, `hooks/`, `schemas/`, `types/`). Do not scatter them across the codebase.

**Classification**: ARCHITECTURAL RULE — enables feature portability, clear ownership, and prevents domain leakage.

---

### RULE: `shared/` contains domain-agnostic, genuinely reusable code

**Source**: [docs/architecture.md § `shared/` Responsabilidad](../../docs/architecture.md#shared)

`shared/` is for components (Button, Modal, Spinner, EmptyState), hooks (e.g., local state management), utilities (formatMoney, formatDate), and types/lib that do not depend on any feature's domain.

**Classification**: ARCHITECTURAL RULE — `shared/` must remain independent and portable; feature-specific code in `shared/` blocks reuse in other projects and creates circular dependencies.

---

## Data Flow and External Communication

### RULE: Data access only via Component → Hook → Query → Service → HTTP → MSW/Backend

**Source**: [docs/architecture.md § "Comunicación con API"](../../docs/architecture.md#comunicación-con-api)

```
Component
   ↓
Custom Hook
   ↓
TanStack Query
   ↓
API Service
   ↓
HTTP Request
   ↓
MSW (or Backend)
```

Components must **never**:

- Perform direct `fetch()` calls.
- Import data from `/data/` or JSON files.
- Use raw filesystem or environment access to external data.

**Classification**: ARCHITECTURAL RULE — this contract ensures centralized data management, consistent error handling, testability via MSW, and the ability to swap backends without changing components.

---

### CONVENTION: API service functions named descriptively

**Source**: [docs/architecture.md § Ejemplo § ProductGrid](../../docs/architecture.md#ejemplo)

Typical naming: `getProducts()`, `getProduct(id)`, `getProductsByCategory(category)`. Services live in `features/<domain>/api/`.

**Classification**: CONVENTION — consistent naming aids readability but is not an absolute rule; the key RULE is the layer structure and the data flow chain.

---

## Validation of External Data

### RULE: External data must be validated with Zod before entering the application

**Source**: [docs/architecture.md § "Validación de datos"](../../docs/architecture.md#validación-de-datos)

Every response from HTTP, MSW, or JSON must be parsed and validated by a Zod schema before assignment to state, props, or typed application data.

```
External Data → Zod → Validated Data → Application
```

This complements TypeScript's compile-time types with runtime guarantees.

**Classification**: ARCHITECTURAL RULE — prevents invalid data from corrupting application state, catches backend contract drift early, and enables safe data transformation.

---

### EXAMPLE: Schema naming and structure

**Source**: [docs/architecture.md § "Validación de datos" § ejemplo](../../docs/architecture.md#validación-de-datos)

Typical structure in `features/<domain>/schemas/`:

```typescript
export const productSchema = z.object({ id: z.string(), name: z.string(), ... });
export const productsSchema = z.array(productSchema);
export type Product = z.infer<typeof productSchema>;
```

**Classification**: EXAMPLE — the exact names and file organization are illustrative. What matters is the RULE: all external data is validated.

---

## Mock API (MSW)

### CONVENTION: MSW is the standard tool for mocking HTTP

**Source**: [docs/architecture.md § "Mock API"](../../docs/architecture.md#mock-api)

MSW intercepts requests at the network layer and returns mock responses, allowing the frontend to develop as if a backend exists. Handlers are in `mocks/handlers/`.

**Classification**: CONVENTION/EXAMPLE hybrid — MSW is the current choice, not a prescriptive constraint. If a future project uses a different mock strategy, the RULE (external data must come through the Component → Hook → Query → Service chain) still applies.

---

### CONVENTION: Initial data stored in `data/products.json` or similar

**Source**: [docs/architecture.md § "Mock API"](../../docs/architecture.md#mock-api)

Data files live in `data/`, never imported directly by components.

**Classification**: CONVENTION — the specific file location and format are implementation details. The RULE is that components never access raw data; the API service abstracts the source.

---

## State Management

### RULE: Server state (data from backend) uses TanStack Query

**Source**: [docs/architecture.md § "Gestión de estado"](../../docs/architecture.md#gestión-de-estado)

Products, orders, categories, stock, and other backend-sourced data belong in TanStack Query, not in `useState`, context, or global stores.

**Classification**: ARCHITECTURAL RULE — TanStack Query provides caching, cache invalidation, deduplication, and synchronization; ad-hoc state management leads to data inconsistency bugs and redundant fetches.

---

### RULE: Client state (UI-only) may use React `useState` initially

**Source**: [docs/architecture.md § "Gestión de estado" § "Client State"](../../docs/architecture.md#client-state)

Modal open/closed, sidebar collapsed, theme, temporary component state. No global store needed unless a proven need emerges (avoid Zustand or Redux prematurely).

**Classification**: ARCHITECTURAL RULE — keep global state minimal; most temporary UI state belongs in the component.

---

### RULE: Filters, search, sorting, and pagination live in URL state

**Source**: [docs/architecture.md § "Gestión de estado" § "URL State"](../../docs/architecture.md#url-state)

Example: `/products?category=ropa&sort=price&page=2`

This enables sharing, bookmarking, and browser back/forward recovery.

**Classification**: ARCHITECTURAL RULE — ensures the UI state is recoverable and shareable without a global store.

---

### CONVENTION: Zustand as a future option only

**Source**: [docs/architecture.md § "Gestión de estado" § "Client State"](../../docs/architecture.md#client-state)

Zustand may be introduced later if a real cross-component client-state need arises. Do not add it proactively.

**Classification**: EXAMPLE — this is an optional future tool, not a current requirement.

---

## Code Quality and Dependencies

### RULE: No `any` type; use TypeScript strict mode

**Source**: [.github/copilot-instructions.md § "9. TypeScript estricto"](../../copilot-instructions.md)

Never use `any` or `@ts-ignore` to silence real errors.

**Classification**: ARCHITECTURAL RULE — `any` erodes type safety and hides bugs; address the real issue instead.

---

### RULE: Do not add a dependency without a concrete need already present

**Source**: [.github/copilot-instructions.md § "11. No agregar una dependencia..."](../../copilot-instructions.md)

Before importing a new package, confirm that existing tools (TanStack Query, Zod, Biome, React, TypeScript) do not already solve the problem.

**Classification**: ARCHITECTURAL RULE — unnecessary dependencies increase bundle size, maintenance burden, and supply-chain risk.

---

### RULE: Biome is the sole linter/formatter; no ESLint/Prettier alongside it

**Source**: [.github/copilot-instructions.md § "10. Biome es el único linter..."](../../copilot-instructions.md)

Biome handles linting, formatting, and import sorting. Do not introduce ESLint or Prettier in parallel without justification.

**Classification**: ARCHITECTURAL RULE — dual toolchains cause conflicts and inconsistency.

---

## Component and Hook Organization

### CONVENTION: Folder-per-component structure

**Source**: [.github/copilot-instructions.md § "13. Seguir la convención de carpeta..."](../../copilot-instructions.md), observed in `shared/components/`, `shared/layouts/`

```
ComponentName/
  ComponentName.tsx
  ComponentName.types.ts
  ComponentName.test.tsx
  data/
    componentName.data.ts (if static data)
```

**Classification**: CONVENTION — aids organization and navigation. Not an absolute law, but consistency matters for maintainability.

---

### CONVENTION: Feature subfolders: `api/`, `components/`, `hooks/`, `schemas/`, `types/`

**Source**: [docs/architecture.md § `features/` § Responsabilidad](../../docs/architecture.md#features) (example structure)

**Classification**: CONVENTION — recommended organization for clarity. The RULE is that feature-specific code stays in `features/<domain>/` and is not scattered.

---

### RULE: Keep components small with a single responsibility

**Source**: [.github/copilot-instructions.md § "12. Mantener componentes pequeños..."](../../copilot-instructions.md)

If a component grows too large, divide it into smaller components within its feature or into `shared/` if truly generic.

**Classification**: ARCHITECTURAL RULE — oversized components are hard to test, reuse, and reason about.

---

## Feature Boundaries

### RULE: No cross-feature imports without clear domain justification

**Source**: Derived from [docs/architecture.md § Dirección general de dependencias](../../docs/architecture.md#arquitectura)

Example: `features/cart/` importing from `features/products/` is sometimes necessary (product info in cart) but should be minimal and explicitly justified. `features/A/` should never share internal implementation details with `features/B/`.

**Classification**: ARCHITECTURAL RULE — cross-feature imports create coupling and make features hard to develop or remove independently.

---

### RULE: Shared state between features via TanStack Query or URL only

**Source**: Derived from architecture.md state management and data flow sections

If two features need to communicate (e.g., cart and products), they do so through:

1. TanStack Query (shared server state fetched by both independently).
2. URL state (filters, pagination shared by navigation).
3. Message passing via component props or callbacks.

Never share internal state objects or stores between features.

**Classification**: ARCHITECTURAL RULE — enforces isolation and makes each feature independently testable and portable.

---

## Premature Abstraction and Over-Engineering

### CONVENTION: Reutilizar antes de abstraer

**Source**: [.github/copilot-instructions.md § "11. No agregar una dependencia..."](../../copilot-instructions.md) (generalized to abstractions)

Do not extract a utility, component, or layer "just in case" it might be reused. Wait for the second real use case.

**Classification**: CONVENTION — preventing premature abstraction is a maintenance best practice but not an absolute rule. However, moving code to `shared/` without a second consumer is typically a smell.

---

### RULE: Abstractions must serve a demonstrated need

**Source**: Derived from [.github/copilot-instructions.md](../../copilot-instructions.md) and common engineering practices

Creating a generic interface, utility, or component before it is needed leads to:

- Over-engineered APIs that don't fit actual use cases.
- Dead code that is harder to remove than to write.
- Maintenance burden on code paths that don't exist yet.

**Classification**: ARCHITECTURAL RULE — write the code for the real requirement first, then abstract if you see the pattern repeated.

---

## Validation Strategy

### EXAMPLE: Quality pipeline layers

**Source**: [docs/architecture.md § "Estrategia de validación"](../../docs/architecture.md#estrategia-de-validación)

- Pre-commit: Biome, Commitlint.
- Pre-push: TypeScript type-check, Vitest unit tests.
- PR/CI: Full suite (Biome, TypeScript, Vitest, build, Playwright).

**Classification**: EXAMPLE — the tool choices and commands are specific to this project. The RULE is that code quality gates exist and pass before integration.

---

## Git Workflow

### CONVENTION: Conventional Commits format

**Source**: [docs/architecture.md § "Commitlint"](../../docs/architecture.md#commitlint), [commitlint.config.mjs](../../commitlint.config.mjs)

Allowed types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.

**Classification**: CONVENTION — improves commit history readability and enables automated changelog generation.

---

## Summary of Key RULES

| Category             | Rule                                                                   | Impact                                                |
| -------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| Dependency Flow      | `app → features → shared` (no cycles)                                  | Enables feature isolation and portability             |
| Layer Responsibility | `app/` = routing/layout; `features/` = domain; `shared/` = generic     | Clear ownership and boundary enforcement              |
| Data Flow            | Component → Hook → Query → Service → HTTP → MSW/Backend (no shortcuts) | Centralized data management, testability, MSW mocking |
| External Validation  | All external data via Zod before entering app                          | Runtime safety, contract enforcement                  |
| Server State         | TanStack Query only (not useState, context, stores)                    | Caching, sync, consistency                            |
| Type Safety          | No `any`, strict mode enabled                                          | Catch errors at compile time                          |
| Dependencies         | Only add if needed; existing stack covers most needs                   | Bundle size, maintenance, supply-chain safety         |
| Component Scope      | Small, single-responsibility components                                | Testability, reusability, clarity                     |

---

For detailed procedures on detecting each violation, see [SKILL.md](./SKILL.md).
