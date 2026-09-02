---
name: testing
description: "Use when: determining, planning, implementing, or reviewing tests for a change in the ecommerce. Selects the appropriate level of testing (Vitest, React Testing Library, MSW, or Playwright) according to the code's responsibility and risk, defines observable scenarios and edge cases, and avoids duplicate or implementation-detail coverage. Complements api-integration for API-layer test setup and code-review for reviewing completed coverage."
---

# Testing Strategy Procedure

## Purpose

This skill determines **what behavior needs coverage**, **which test level proves it**, and **which scenarios are worth implementing** for a defined change.

Use [docs/architecture.md](../../../docs/architecture.md) as the testing-strategy source of truth and [.github/copilot-instructions.md](../../copilot-instructions.md) for project-wide rules. For HTTP-layer setup and examples for schemas, services, hooks, and data-connected components, use [api-integration](../api-integration/SKILL.md).

This skill does not create tests merely to increase coverage. It prioritizes observable behavior, risk, and the smallest test level that can establish confidence.

## When to Use This Skill

Use this skill when:

- Adding or changing pure business logic, transformations, utilities, or Zod schemas.
- Adding or changing a React component, hook, form, loading state, empty state, or error state.
- Changing an HTTP contract, API service, query hook, or MSW scenario.
- Adding a workflow that spans multiple pages or features.
- Deciding whether an existing test suite needs additional coverage.
- Reviewing whether a proposed test duplicates coverage at another level.

Do not use this skill to bootstrap Vitest, Testing Library, MSW, or Playwright configuration. When test infrastructure is missing, follow the bootstrap guidance in [api-integration](../api-integration/SKILL.md) before writing tests that depend on it.

Do not use this skill as a substitute for a completed-change review. Use [code-review](../code-review/SKILL.md) to assess a change set and its tests after implementation.

## Testing Principles

1. Test a user-visible outcome or a public contract, not the component's internal state, helper call sequence, or DOM structure.
2. Test a behavior once at the lowest level that can prove it with confidence.
3. Add coverage in proportion to risk: changed contracts, money, inventory, authentication, checkout, and irreversible actions justify more coverage than static presentation.
4. Prefer real providers and MSW at the HTTP boundary over mocks of application internals.
5. Keep tests focused. A test should describe one behavior and fail for one meaningful reason.
6. Reuse test utilities, fixtures, query wrappers, and MSW handlers already available in the repository.

## Decision Workflow

Apply the following steps to every change before writing tests.

### 1. Identify the Changed Responsibility

Classify the code by the responsibility it owns, not by its file extension.

| Changed responsibility                                                | Primary test level                   | Why                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| Pure utility, transformation, calculation, parser, or validation rule | Vitest unit                          | Inputs and outputs can be verified without React or HTTP.                            |
| Zod schema                                                            | Vitest unit                          | The schema is the runtime boundary for valid and invalid external data.              |
| API service                                                           | Vitest + MSW                         | MSW proves the HTTP request and response handling without mocking `fetch` internals. |
| TanStack Query hook                                                   | Vitest + React Testing Library + MSW | `renderHook` verifies query state and the service contract together.                 |
| Presentation component with props and local interaction               | Vitest + React Testing Library       | Rendering and user interaction are the public behavior.                              |
| Data-connected component                                              | Vitest + React Testing Library + MSW | MSW represents the HTTP boundary and enables loading, error, and empty scenarios.    |
| Multi-page, cross-feature, business-critical journey                  | Playwright                           | Browser navigation and integrations must work together.                              |

For schemas, services, hooks, and data-connected components, follow the matching examples and setup in [api-integration](../api-integration/SKILL.md#testing-by-layer).

### 2. State the Observable Behavior

Write the behavior as an outcome that a user, consumer, or public contract can observe. This becomes the basis for the test name and assertions.

Good examples:

- `formats a valid price using the configured currency`.
- `shows matching products after the user selects a category`.
- `shows a retry action when the products request fails`.
- `prevents checkout when the cart is empty`.

Avoid implementation-focused descriptions:

- `sets isLoading to true`.
- `calls setProducts after fetch resolves`.
- `uses useQuery with the products key`.
- `renders the third div in ProductGrid`.

A behavior needs a test when a regression would affect a user, a public API contract, a business rule, or a previously failing path.

### 3. Choose the Smallest Sufficient Level

Use this rule:

```text
Can a pure function prove the behavior?
    Yes -> Vitest unit test.
    No -> Can a rendered component or hook prove it without browser navigation?
        Yes -> Vitest + React Testing Library.
        No -> Does the behavior cross the HTTP boundary?
            Yes -> Use MSW at the HTTP boundary.
        Does the outcome require multiple pages, features, or browser behavior?
            Yes -> Playwright E2E.
```

MSW is not a separate replacement for unit or component tests. It is the HTTP boundary used by service, hook, and data-connected component tests. Use it whenever application code communicates through HTTP and the test needs to control the server response.

### 4. Select Relevant Scenarios

Evaluate every row below. Implement only the scenarios that can occur for the changed responsibility; do not force every row into every test file.

| Scenario         | When it applies                                     | Preferred level                   | Observable assertion                                                      |
| ---------------- | --------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| Happy path       | Every changed behavior                              | Lowest sufficient level           | Correct result, content, state, or next action is available.              |
| Loading          | Data is asynchronous and UI exposes pending state   | Component or hook + MSW           | Progress feedback is visible before the response resolves.                |
| Error            | Request, mutation, parsing, or validation can fail  | Service, hook, or component + MSW | Error feedback and recovery behavior are available.                       |
| Empty state      | A valid response can contain no usable items        | Component + MSW                   | Meaningful empty content appears instead of a blank or broken UI.         |
| Invalid data     | External data crosses a Zod boundary                | Schema or service + MSW           | Invalid payload is rejected or converted into the expected failure state. |
| User interaction | A user can click, type, select, submit, or navigate | Component + React Testing Library | The visible result of the action is correct.                              |
| Critical flow    | A high-value journey crosses pages or features      | Playwright                        | The user can complete the business outcome in a browser.                  |

### 5. Identify Edge Cases

Choose edge cases from the responsibility being changed. Do not manufacture theoretical cases with no supported input or product relevance.

| Responsibility                    | Edge cases to consider                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Utilities and transformations     | Empty input, zero, boundary values, duplicate values, precision, large values, unsupported input when part of the public contract.               |
| Zod schemas and services          | Missing required fields, wrong primitive types, invalid enum values, malformed nested data, HTTP 4xx/5xx, valid HTTP response with invalid body. |
| Queries and lists                 | Empty result, delayed response, request failure, stale or changed filter input, nonexistent item.                                                |
| Forms and mutations               | Required fields, invalid user input, double submit, disabled action, server rejection, successful reset or redirect.                             |
| Interactive components            | Keyboard access, focus behavior when meaningful, repeated clicks, cancellation, unavailable actions.                                             |
| Checkout and other critical flows | Empty or unavailable cart, rejected payment/order action, interrupted navigation, persisted URL state where required.                            |

## Implementation Patterns

### Pure Utility: Vitest Unit Test

Place the test next to the utility. Assert its public input-output contract, including meaningful boundaries.

**File:** `shared/utils/format-money.test.ts`

```typescript
import { describe, expect, it } from "vitest";

import { formatMoney } from "./format-money";

describe("formatMoney", () => {
  it("formats a positive amount as currency", () => {
    expect(formatMoney(12.5)).toBe("$12.50");
  });

  it("formats zero without losing precision", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });
});
```

Do not mock `Intl`, helper functions, or module internals unless the behavior specifically depends on a boundary that must be controlled.

### Presentation Component: React Testing Library

Use queries that resemble how a user finds the UI: role, label, text, or placeholder. Use `userEvent` for interactions instead of invoking event handlers directly.

**File:** `shared/components/QuantitySelector/QuantitySelector.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuantitySelector } from "./QuantitySelector";

describe("QuantitySelector", () => {
  it("reports the incremented quantity when the user selects add", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<QuantitySelector value={1} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /increase quantity/i }));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables decrement at the minimum quantity", () => {
    render(<QuantitySelector value={1} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeDisabled();
  });
});
```

The test must assert behavior exposed by the component contract. Do not assert local state variable names, private callbacks, or incidental wrapper elements.

### HTTP Scenarios: MSW

When a component, hook, or service communicates over HTTP, control responses with MSW rather than mocking `fetch`, the API service, or a custom hook. This keeps the application path intact:

```text
Component -> Hook -> TanStack Query -> API Service -> HTTP -> MSW
```

Use shared handlers for standard behavior. Override a handler inside the test only for the scenario under test, then reset handlers after each test. See [api-integration](../api-integration/SKILL.md#testing-by-layer) for service, hook, schema, and data-connected component implementations.

### Critical Flow: Playwright

Use one E2E test to prove a business journey that cannot be established by lower-level tests. Keep setup through visible user actions where practical.

**File:** `e2e/checkout.spec.ts`

```typescript
import { expect, test } from "@playwright/test";

test("customer completes checkout from a product detail", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /products/i }).click();
  await page
    .getByRole("link", { name: /view product/i })
    .first()
    .click();
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.getByRole("link", { name: /cart/i }).click();
  await page.getByRole("button", { name: /checkout/i }).click();

  await expect(page.getByRole("heading", { name: /order confirmed/i })).toBeVisible();
});
```

This test proves the purchase journey. Individual button labels, validation messages, and empty-state rendering should remain covered at the component level unless the full flow is the only meaningful way to verify them.

## Avoid Duplicate Coverage

Assign each behavior a primary owner:

| Behavior                                    | Best primary coverage   | Do not duplicate with                                                           |
| ------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| Currency calculation and formatting         | Unit test               | Component or E2E test for every value variant.                                  |
| Schema rejects malformed API data           | Schema/service test     | Component test of every malformed payload.                                      |
| Loading, error, and empty list presentation | Component test with MSW | E2E tests for each server outcome.                                              |
| Filter interaction updates visible results  | Component test          | Unit test of framework wiring and E2E test for each filter option.              |
| Customer completes checkout                 | Playwright E2E          | Separate E2E tests for each internal UI step already proven by component tests. |

A higher-level test may incidentally cover a lower-level behavior. That is not a reason to remove focused lower-level coverage when it protects an important contract; it is a reason not to duplicate every permutation at the higher level.

## What Not to Test

Do not add tests for:

- Coverage percentages without an identified behavior or risk.
- Private React state, internal hook calls, implementation-specific module boundaries, or TanStack Query internals.
- Exact markup, wrapper elements, CSS utility classes, or broad snapshots with no behavioral assertion.
- Framework or library behavior already tested by React, TanStack Query, Zod, Testing Library, MSW, or Playwright.
- The same happy path in unit, component, and E2E tests without a distinct contract at each level.
- Every small visual detail or validation rule with Playwright.
- Direct mocks of `fetch`, API services, query hooks, or sibling components when MSW can model the HTTP response at the correct boundary.
- A test for static content with no branching, interaction, public contract, or meaningful regression risk.

## Analysis Output

When asked to analyze a change, produce this structure before writing tests:

```markdown
## Testing Plan

### Behavior to Cover

- [Observable behavior and risk]

### Recommended Tests

| Behavior | Test type                       | Scenarios |
| -------- | ------------------------------- | --------- |
| ...      | Vitest / RTL / MSW / Playwright | ...       |

### Edge Cases

- [Only relevant boundaries or failure modes]

### Out of Scope

- [Behavior intentionally not tested and why]
```

The plan must answer all of the following:

1. Which observable behavior needs tests?
2. Which test type corresponds to each behavior?
3. Which happy, loading, error, empty, invalid-data, interaction, or critical-flow scenarios apply?
4. Which realistic edge cases could change the outcome?
5. What is not worth testing because it is internal, duplicated, static, or low risk?

## Validation Checklist

Before considering test work complete, verify:

- [ ] Each added test protects an observable behavior or a public contract.
- [ ] The test level is the lowest one that can prove the behavior with confidence.
- [ ] Happy path and each relevant loading, error, empty, invalid-data, interaction, and critical-flow scenario were evaluated.
- [ ] HTTP behavior is modeled with MSW rather than unnecessary application-internal mocks.
- [ ] The same behavior is not unnecessarily repeated across unit, component, and E2E suites.
- [ ] Tests reuse established wrappers, fixtures, and handlers where available.
- [ ] Unit and component tests are colocated with the code they protect; E2E tests are grouped by critical user flow.
- [ ] `pnpm test:run` passes, and `pnpm test:e2e` passes when an E2E flow changed.
