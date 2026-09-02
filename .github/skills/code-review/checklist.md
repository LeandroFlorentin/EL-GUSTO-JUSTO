# Review Checklist

Use this checklist to find concrete risks in the agreed review scope. Severity is guidance, not a substitute for engineering judgment; classify the demonstrated impact of the specific change.

## Architecture

Review dependency direction and ownership boundaries.

- Confirm that `app/` contains routing, layouts, providers, and page composition rather than unnecessary domain business logic.
- Confirm that dependencies flow `app -> features -> shared`; `shared/` must not import from `features/`.
- Confirm that code in `shared/` is domain-agnostic and genuinely reusable across unrelated domains, not specific to a single feature.
- Confirm that feature-specific types, components, hooks, schemas, and services remain inside the owning `features/<domain>/` folder.

A `shared/` dependency on `features/` is typically CRITICAL. Business logic in `app/` or domain code in `shared/` is typically HIGH when it creates a real boundary violation.

## Correctness

Review changed behavior, error handling, boundary conditions, and public contracts.

- Trace the changed control flow for valid, empty, invalid, loading, error, and unavailable states when relevant.
- Check that conditionals, transformations, and mutations preserve the expected domain behavior.
- Check that user-visible errors, request failures, and nullish values do not produce incorrect or inaccessible behavior.
- Check that API or component contract changes update all affected consumers.

Broken core behavior, data corruption, or exposed security-sensitive behavior is typically CRITICAL. Likely user-facing failures are typically HIGH.

## Type Safety

Review runtime and compile-time contracts at changed boundaries.

- Identify `any`, unsafe type assertions, ignored TypeScript errors, or types that conceal meaningful invalid states.
- Check that nullable, optional, union, and asynchronous values are handled before use.
- Confirm that input and output types match the actual public contract.
- Confirm external data is validated at runtime, not only typed at compile time.

A type escape that can cause an unhandled production failure is typically HIGH or MEDIUM, depending on reachability.

## Data Flow

Review how external data enters and moves through the feature.

- Components must not perform raw `fetch()` calls, import raw data files, or read external sources directly.
- Request logic belongs in the feature API service, with UI consuming it through a custom hook.
- External API, mock, JSON, and URL data must be parsed with Zod before entering application state.
- Presentation components should remain independent of whether data comes from MSW, local fixtures, or a backend.

Direct component access to external data or unvalidated data crossing into the app is typically HIGH when it bypasses the required contract.

## State Management

Review state ownership and recovery behavior.

- Server state must use TanStack Query rather than manual `useEffect` plus `useState`, context, or a global store.
- UI-only temporary state may use local React state when it has no server or shareability requirement.
- Search, filters, sorting, and pagination should live in URL state when they must be shareable or recoverable.
- Flag a global store or dependency introduced without a demonstrated need that React state, TanStack Query, or URL state cannot satisfy.

Incorrect server-state ownership is typically HIGH. State missing from the URL is typically MEDIUM when it prevents an expected shareable or recoverable workflow.

## Testing

Review whether tests exercise the changed behavior at the appropriate level.

- New or changed business logic, schemas, services, and hooks need focused unit or integration coverage.
- Changed components need component tests for meaningful rendering, interaction, loading, error, and empty states where applicable.
- Critical user flows need Playwright coverage when unit and component tests cannot prove the workflow.
- Reject tests that only assert implementation details, snapshots without behavioral value, or mocks that bypass the behavior under review.

Missing coverage for critical behavior is typically HIGH or MEDIUM. Keep these findings only in the report's **Missing Tests** section.

## Maintainability

Review whether the change keeps responsibility and future modification costs clear.

- Identify meaningful duplication that risks inconsistent behavior or fixes.
- Flag abstractions introduced before there are concrete repeated use cases.
- Flag components that combine distinct responsibilities or have grown large enough to make behavior hard to reason about or test.
- Check that names, module boundaries, and local APIs communicate their responsibility without hiding essential behavior.

Premature abstractions and oversized components are typically MEDIUM or LOW unless they conceal a correctness or architecture issue.

## Dependencies

Review every new or changed dependency and integration point.

- Confirm each new package serves a concrete need not already met by the existing stack or standard platform APIs.
- Check that added dependencies align with the project's architecture and do not duplicate configured tooling.
- Flag unnecessary global state, request, validation, or formatting libraries when existing TanStack Query, Zod, Biome, or React capabilities cover the need.
- Check that dependency upgrades or configuration changes do not broaden risk without justification or tests.

A dependency that introduces a security or core runtime risk may be CRITICAL or HIGH. Unnecessary dependencies are normally MEDIUM or LOW.

## Code Quality

Review concrete readability and reliability issues not already handled by Biome.

- Identify dead branches, misleading logic, swallowed errors, unstable keys, resource leaks, or side effects with unclear ownership.
- Check that error handling preserves actionable failures rather than silently continuing with invalid data.
- Check that async work, cleanup, and event handling cannot produce stale or conflicting UI state.
- Do not report formatting, import ordering, whitespace, or other purely stylistic issues covered by Biome unless they materially affect maintainability.

Classify only demonstrated risks; do not create findings merely to fill this category.
