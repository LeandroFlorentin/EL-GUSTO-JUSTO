---
name: architecture-guard
description: "Use when: planning, implementing, or refactoring a feature to detect architectural violations early. Protects invariants (app → features → shared, data flow, state ownership, boundaries) without modifying code. Classifies findings as ARCHITECTURAL RULE, CONVENTION, or EXAMPLE. Produces Decision / Affected Rule / Risk / Recommended Alternative format."
---

# Architecture Guard

## Purpose

This skill detects architectural violations during planning, implementation, and refactoring. It is a **read-only detection gate**: gather context, classify violations, report clearly, and let the user decide.

Unlike `code-review` (which reviews a complete changeset post-hoc) or `ecommerce-architect` (which plans and implements features), this skill is used for **point-in-time evaluation** of a specific decision, plan, or partial implementation to catch degradation before it accumulates.

Use [docs/architecture.md](../../docs/architecture.md) and [.github/copilot-instructions.md](../../copilot-instructions.md) as the source of truth. Consult [invariants.md](./invariants.md) for pre-classified rules to avoid re-deriving the same distinction each time.

## Rule Classification

Every finding must be classified correctly to distinguish between:

- **ARCHITECTURAL RULE**: An invariant structural property of the ecommerce layers. Violation is always a finding: dependency direction (app → features → shared), contract of the data flow (Component → Hook → Query → Service → HTTP → MSW/Backend), ownership of state by layer, responsibility per capa, isolation of boundaries between features, runtime validation of external data with Zod.

- **CONVENTION**: The currently recommended pattern observed in the codebase or architecture.md. Deviation is a finding only if it: 1) breaks an ARCHITECTURAL RULE, 2) creates inconsistency with real existing code patterns, or 3) cannot be justified by a clear local or project constraint. Examples: folder-per-component structure, naming of subfolders `api/`, `components/`, `hooks/`, `schemas/`, `types/` within a feature, naming conventions for files (e.g., `get-products.ts`).

- **EXAMPLE**: An illustrative instance in architecture.md or copilot-instructions.md of a pattern; not a prescriptive requirement. Differing from an EXAMPLE alone is never a blocker. Examples: the specific names of future features (`products`, `cart`, `checkout`, `auth`, `favorites`, `search`), the structure of example API services or component names, the suggestion of Zustand as a future option for global state.

## Detection Procedure

### 1. Establish the Scope

If the user has not explicitly identified a decision, plan, partial diff, or a specific question, ask what to evaluate. Do not assume the working tree diff is the scope.

### 2. Gather Evidence

Read:

1. [docs/architecture.md](../../docs/architecture.md) (layers, data flow, state management, validation, MSW).
2. [.github/copilot-instructions.md](../../copilot-instructions.md) (global rules #9-13: no `any`, no unnecessary dependencies, small components, conventions).
3. [invariants.md](./invariants.md) (pre-classified rules by category).
4. The decision, plan, or code under evaluation.
5. Related existing code that establishes patterns (e.g., `shared/components/`, `shared/layouts/` for conventions).

Base every finding on observed code or an observable absence. Do not infer defects from naming, file placement alone, or hypothetical future requirements.

### 3. Scan the 10 Categories

Systematically evaluate whether the decision or code exhibits any of the following:

1. **shared ↔ feature coupling**: `shared/` importing from `features/` (or a feature importing from another feature).
2. **Business logic in `app/`**: Routing/layouts/providers are the scope; domain logic belongs in `features/`.
3. **Components coupled to data source**: Components performing `fetch()`, importing from `data/`, or knowing where data comes from.
4. **HTTP access outside the chain**: Data access outside `Component → Hook → Query → Service → HTTP → MSW/Backend`.
5. **Domain leakage**: Types, schemas, or logic specific to one feature escaping into `shared/` or another feature.
6. **State in wrong layer**: Server state outside TanStack Query, premature global client state, filters/pagination outside URL when they should be there.
7. **Premature abstractions**: A generic layer, interface, or utility created for a single consumer with no demonstrated reuse.
8. **Artificial reuse**: Moving code to `shared/` "just in case" or "for consistency" without a second real use case.
9. **Unnecessary dependencies**: A new package added without a concrete need already present in the codebase.
10. **Feature boundary violations**: Cross-domain imports or shared ownership of state between features.

### 4. Classify and Decide

For each candidate finding:

- Identify which RULE or CONVENTION it violates.
- If it only differs from an EXAMPLE, mark it explicitly as non-blocking and move on.
- If the violation is genuine but the user has a legitimate alternative (different from but not breaking a RULE), report it with the format below and let the user decide.

Do not block a solution simply because it differs from an example. Distinguish between "harmful" and "different."

### 5. Write Findings

Report only relevant findings. If a scan produces no risk, state explicitly that the decision or code conforms.

Every finding must include exactly these four fields:

```
Decision: [The specific choice or code change under evaluation]
Affected Rule: [Name of the RULE or CONVENTION violated, with reference to invariants.md or architecture.md section]
Risk: [The behavioral, architectural, or maintenance impact]
Recommended Alternative: [A concrete correction or next step]
```

Use severity as guidance to the user:

- Use **Risk** language to explain why this matters (data loss, security, broken workflow, hard-to-maintain, tight coupling, etc.) rather than a severity label.

## Restrictions

- **Do not modify source code, tests, configuration, or dependencies.** This is a read-only skill.
- **Do not produce verdicts like APPROVED or CHANGES REQUIRED.** That is the scope of `code-review`. This skill reports findings; the user decides.
- **Do not implement or plan features.** Use `ecommerce-architect` agent for that. This skill only detects violations.
- **Do not run tests or type checks.** Reference them as indicators but do not execute.

## Relationship to Other Tools

- **`ecommerce-architect` agent**: Plans and implements features, detecting violations during the workflow. Refer to this skill when a point-in-time architectural check is needed.
- **`code-review` skill**: Reviews complete changesets post-hoc with a full verdict. This skill complements it by catching issues earlier during planning and implementation.
- **`api-integration` skill**: Focuses on the data flow layer (Component → Hook → Query → Service). This skill's category "HTTP access outside the chain" overlaps with api-integration scope; use both.

## Example Interaction

**User**: "I have a hook that needs to fetch data. Should it call `fetch()` directly, or use TanStack Query through an API service?"

**Architecture Guard**:

```
Decision: Custom hook fetching data directly with fetch() vs. using TanStack Query + API Service.
Affected Rule: ARCHITECTURAL RULE — Data Flow Contract (docs/architecture.md: "Component → Custom Hook → TanStack Query → API Service → HTTP → MSW → products.json")
Risk: Direct fetch() in the hook couples the component to the HTTP layer, prevents centralized caching/invalidation, bypasses MSW during testing, and makes it harder to add error handling or retries consistently.
Recommended Alternative: Define the API service (e.g., getProducts() in features/products/api/), wrap it with TanStack Query in a custom hook (e.g., useProducts() in features/products/hooks/), and consume the hook from the component. This maintains separation of concerns, enables mocking, and centralizes state management.
```

**User**: "I want to move all button variants to shared/ because they might be reused."

**Architecture Guard**:

```
Decision: Moving button component variants to shared/ for potential future reuse.
Affected Rule: CONVENTION — Reuse Before Abstraction + ARCHITECTURAL RULE — Domain Specificity (copilot-instructions.md #11, architecture.md "Shared Responsibilities")
Risk: Moving code to shared/ without a second real use case creates a maintenance burden: future changes to buttons must be coordinated across domains, and the button API may become over-engineered to satisfy hypothetical scenarios. Premature abstraction typically leads to either unused code or APIs that don't fit actual needs.
Recommended Alternative: Keep the button in its owning feature. If another feature later needs it, move it to shared/ at that point. If truly generic (no domain context), consider whether it belongs in shadcn/ui instead.
```

---

For a complete catalogue of invariants and their classifications, see [invariants.md](./invariants.md).
