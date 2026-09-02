---
name: feature-development
description: "Use when: implementing or developing a new feature/functionality for the ecommerce; adding a domain under features/; deciding where to place code (app vs features vs shared); extending an existing feature. Provides step-by-step procedural guidance for developing any domain-agnostic feature following the architecture defined in docs/architecture.md. Complements the ecommerce-architect agent (which covers planning and violation detection) with operational workflow."
---

# Feature Development Procedure

## Purpose

This skill teaches **how to develop a feature**, not how the architecture works. It provides a reusable, domain-agnostic procedural workflow that applies to any new functionality, regardless of domain (auth, cart, checkout, search, etc.).

It complements **[docs/architecture.md](../../docs/architecture.md)** (architecture reference) and the **ecommerce-architect** agent (planning & validation). Do not duplicate architecture documentation or the 11-point planning checklist — refer to them instead.

---

## Development Workflow

```
Requirement
    ↓
Identify Domain
    ↓
Inspect Existing Feature
    ↓
Determine Required Layers
    ↓
Implement
    ↓
Test
    ↓
Validate
```

---

## Step 1: Understand the Requirement

Before you write code, clarify what the feature must do:

- **What data does it manage?** (user input, product info, order state, etc.)
- **What actions can the user perform?** (add, remove, filter, search, etc.)
- **What state does it track?**
  - **Server state** (data from backend/API, cached via TanStack Query)
  - **Client state** (UI-only: modals, sidebars, temporary input)
  - **URL state** (filters, search, sorting, pagination — shareable & recoverable via URL params)
- **Does it require backend integration** (MSW mocks initially, real API later)?
- **Does it require authentication or user-specific data?**

Refer to [Gestión de estado](../../docs/architecture.md#gestión-de-estado) in `docs/architecture.md` to determine state type.

---

## Step 2: Identify the Domain

Choose a **domain name** (kebab-case, business noun) that will become the feature folder name.

**Decide: new feature or extend existing?**

- Is there already a related feature in `features/` (or in `shared/` if features don't exist yet)? If yes, analyze whether this requirement extends that feature or creates a new one.
- Does the requirement actually need domain-specific code, or is it only routing/composition? If only routing/composition, the code likely stays in `app/` — no new feature folder needed.

**Example decision logic:**

- Requirement: "users can view their favorited items" → Check if `features/favorites` exists. If not, this is a new domain.
- Requirement: "users can filter favorited items by category" → Extends existing `features/favorites` (no new domain needed).
- Requirement: "show a page with top-level sections (Header, Product Grid, Footer)" → No new domain; only `app/` routing & layout composition needed.

---

## Step 3: Inspect Existing Feature Code

**Always analyze existing code before you write new code.** This is the fastest way to learn project conventions and avoid reinventing patterns.

**What to look for:**

1. **File structure & naming**: folder-per-component convention? (`MyComponent/MyComponent.tsx` + types/tests separate?)
2. **Types & validation**: where are `.types.ts` files? How is Zod used for external data?
3. **Custom hooks**: naming pattern? Where do they live? How do they interact with TanStack Query?
4. **API services**: naming pattern for service functions? How is HTTP request logic structured?
5. **Components**: how small/large are they? How do they import/compose?
6. **Testing**: where are `.test.tsx` files? What level of tests (unit, component, integration)?
7. **Import aliases**: verify `@/` alias is used consistently.

**Where to inspect:**

- **If `features/` already has features**: Pick a feature related to your new requirement (or a similar one) and examine its structure. This is your template.
- **If `features/` doesn't exist yet** (current state): Inspect `shared/components/` and `shared/layouts/` (e.g., `NavBar/`, `MainLayout/`). These show the current convention: folder-per-component, `.types.ts` separate, `.test.tsx` present (even if empty).

**Once you've found a convention, never invent a new one.** Consistency matters more than personal preference.

---

## Step 4: Determine Required Layers

Not every feature needs all layers. Decide which layers your requirement actually needs:

| Layer                          | When to Create                                                                           | When to Skip                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `features/<domain>/types`      | You have domain-specific data types.                                                     | No custom types beyond primitives.                                          |
| `features/<domain>/schemas`    | You validate data from external sources (API/form input/URL params) with Zod.            | No external data to validate.                                               |
| `features/<domain>/api`        | You communicate with backend/MSW.                                                        | Client-only logic; no server state.                                         |
| `features/<domain>/hooks`      | You manage server state (TanStack Query) or have reusable state logic across components. | Each component manages its own local state.                                 |
| `features/<domain>/components` | You have UI-specific to this domain.                                                     | No domain-specific UI (only shared components).                             |
| `shared/`                      | The code is reused in ≥2 unrelated domains and is domain-agnostic.                       | Code is used in only 1 domain, or is tightly coupled to a business concept. |

**Key rule:** Create only the layers you need. Do not create an empty folder "just in case."

**shared/ is not a dumping ground:** Move code to `shared/` only when it is genuinely reused across multiple domains AND domain-agnostic. Speculative reuse ("we might use this later") is a violation; keep domain-specific code in the feature folder.

**Example decision flowchart:**

```
Requirement: "add feature X"

Do I have domain-specific data to type?
  → Yes: create types/ (or schemas/ if validating external data)
  → No: skip

Do I fetch/send data to backend/MSW?
  → Yes: create api/ with service functions
  → No: skip

Do I use TanStack Query or share state across components?
  → Yes: create hooks/ with custom hooks
  → No: each component uses local useState/useReducer

Do I have UI for this domain?
  → Yes: create components/
  → No: compose existing shared/ components

Can this code be used by ≥2 unrelated domains?
  → Yes: move to shared/ (if not already there)
  → No: keep in features/
```

---

## Step 5: Implement in This Order

Follow this sequence — it ensures you define the "contract" before consuming it:

1. **types/ & schemas/** — Define the shape of data (Zod schemas, TypeScript interfaces). These are dependencies for everything else.
2. **api/** — Implement service functions that communicate with backend/MSW. Use the schemas to validate responses.
3. **hooks/** — Implement custom hooks that wrap TanStack Query (or manage reusable state). Use the services and schemas.
4. **components/** — Implement UI components. Use the hooks to fetch/manage data. Keep components presentation-focused.
5. **app/** — Add routing, pages, layouts, and compose features. Do not put business logic here; only composition.

**Discipline rules:**

- ❌ Never access external data directly from components (`fetch()`, direct imports from `/data/` or `/public/`). Always Component → Hook → Service → HTTP/MSW.
- ❌ Never put business logic in `app/`. Pages compose features; they don't implement domain logic.
- ❌ Never have `features/domainA/` import from `features/domainB/`. If you need shared behavior, move it to `shared/`.
- ✅ Reuse patterns you found in Step 3. Imitate naming, structure, and conventions.

---

## Step 6: Test as You Build

Testing is not a step after implementation — it is part of implementation.

**Test per layer** (following levels defined in [docs/architecture.md](../../docs/architecture.md#calidad-de-código)):

| Layer               | Test Type          | How                                                                                                               |
| ------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **types / schemas** | Unit               | Test Zod schemas with valid & invalid data (edge cases).                                                          |
| **api/**            | Unit               | Test service functions (mock MSW or use actual fixtures). Verify parsing & validation.                            |
| **hooks/**          | Unit + Integration | Test hook logic, TanStack Query integration, data transformation. Use `renderHook` from `@testing-library/react`. |
| **components/**     | Component          | Test React component rendering, props, user interactions with Testing Library.                                    |
| **Full workflows**  | E2E                | Use Playwright for critical user flows (happy path + error states).                                               |

**Do not test everything at every level.** Unit-test business logic (services, schemas, hooks). Component-test UI. E2E-test only critical flows.

---

## Step 7: Validate Quality

Before considering the feature complete, run these checks:

**Type Safety:**

```bash
pnpm typecheck
```

No `any`, no `@ts-ignore` silencing real errors.

**Unit & Component Tests:**

```bash
pnpm test:run
```

All tests pass. New code includes tests.

**Lint & Format:**

```bash
pnpm lint-staged
```

(Runs automatically on pre-commit via Husky.)

**Architectural Audit:**

- ✅ No `app/` imports from `features/`; no `shared/` imports from `features/`.
- ✅ All external data flows through hooks + TanStack Query (never direct fetch in components).
- ✅ Business logic is NOT in `app/`.
- ✅ Domain-specific code stays in `features/`; only true multi-domain code is in `shared/`.
- ✅ No new dependencies without justification.
- ✅ No empty folders created.

---

## Distinguishing Responsibilities

### Domain-Specific Code

**Lives in:** `features/<domain>/`

- Data types & validation schemas for this domain.
- API services that fetch/mutate domain data.
- Custom hooks that manage domain state (TanStack Query queries/mutations).
- UI components specific to this domain.

**Example:** `features/favorites/types/Favorite.ts`, `features/favorites/api/getFavorites.ts`, `features/favorites/hooks/useFavorites.ts`, `features/favorites/components/FavoriteButton.tsx`

**Rule:** If it's tightly coupled to a business concept, it belongs in `features/<domain>/`.

### Truly Shared Code

**Lives in:** `shared/components/`, `shared/hooks/`, `shared/utils/`, etc.

- UI components reused across ≥2 domains (Button, Modal, Spinner, EmptyState).
- Utility functions domain-agnostic (format currency, parse dates).
- Hooks that provide domain-agnostic utilities (useLocalStorage, useDebounce).

**Rule:** It must be reused in practice (not speculatively) and must not know about any single business domain.

**Anti-rule:** Do NOT move code to `shared/` before it is reused in at least 2 unrelated places. Premature shared code is technical debt.

### Composition & Routing

**Lives in:** `app/`

- `page.tsx`, `layout.tsx` — Next.js routing.
- Providers, global configuration.
- Page composition (assembling features into pages).

**Rule:** `app/` composes, does not implement. If a page file contains logic, extract it to a feature's hook.

---

## Anti-Patterns to Avoid

❌ **Premature abstraction.** Do not create a utility/component "for reuse" until it is actually used in 2+ places. Reutilizar patterns already in the codebase (Step 3); do not invent new abstractions.

❌ **Moving code to shared/ without reuse.** Even if a component "might be reused later," keep it domain-specific until it is actually reused. Moving it back later is easier than untangling early overgeneralization.

❌ **Business logic in app/.** Pages are for routing and composition only. If a page file has state, hooks, or conditional rendering of complex logic, extract it to a feature hook.

❌ **Direct fetch in components.** Always Component → Hook → Service. No exceptions.

❌ **Creating all 5 layer folders by default.** Assess your actual needs. A feature might need only `components/` and `hooks/`, not `api/` or `schemas/`.

❌ **Ignoring existing conventions.** If `shared/components/` uses folder-per-component + `.types.ts`, do the same in your feature. Inventing new structures slows the team down.

❌ **Global state without exhausting React hooks + TanStack Query + URL state first.** Do not reach for Zustand/Redux prematurely.

❌ **New dependencies without justification.** Every new npm package requires a reason. Check if the stack (Next.js, React, TypeScript, TanStack Query, Zod, Tailwind, shadcn/ui) already solves the problem.

---

## Summary Checklist

Before marking a feature complete:

- [ ] Requirement understood and written down (what data, actions, state, backend needs).
- [ ] Domain name chosen (kebab-case).
- [ ] Existing feature (or shared/ conventions) inspected and imitated.
- [ ] Only necessary layers created (not all 5 folders by default).
- [ ] Code flows correctly: Component → Hook → Service → HTTP → MSW/Backend.
- [ ] All external data validated with Zod before entering application.
- [ ] No business logic in `app/`.
- [ ] No cross-feature imports; `shared/` imports only from `shared/`.
- [ ] Tests written alongside code (unit + component levels; E2E only for critical flows).
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test:run` passes.
- [ ] No new dependencies without justification.
- [ ] No premature abstractions or empty folders.

---

## References

- **[docs/architecture.md](../../docs/architecture.md)** — Architecture structure, layer definitions, communication flow, state types.
- **[.github/copilot-instructions.md](../copilot-instructions.md)** — Global project rules and stack.
- **[.github/skills/api-integration/SKILL.md](../api-integration/SKILL.md)** — Detailed recipe for integrating external data (schemas, query keys, services, hooks, MSW handlers, bootstrap, testing by layer).
- **ecommerce-architect agent** — Use for planning & detecting architectural violations before/during implementation.
- **Existing features or `shared/` conventions** — Your template for naming, structure, and testing patterns.
