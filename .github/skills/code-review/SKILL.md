---
name: code-review
description: "Use when: reviewing code changes before they are considered complete or merged. Performs a technical and architectural code review across correctness, type safety, data flow, state management, testing, maintainability, dependencies, and code quality. Produces severity-classified findings and an APPROVED or CHANGES REQUIRED verdict without modifying code."
---

# Code Review Procedure

## Purpose

This skill performs a technical and architectural review of a defined change set before it is considered complete. It is a read-only review gate: identify real risks, report them clearly, and wait for the user's decision before making any code changes.

Use [docs/architecture.md](../../docs/architecture.md) as the architectural source of truth and [.github/copilot-instructions.md](../../copilot-instructions.md) for project-wide rules. The `ecommerce-architect` agent detects architectural issues during implementation; the `architecture-guard` skill evaluates specific decisions or plans in isolation; this skill reviews the completed change set holistically.

## Review Workflow

### 1. Establish the Scope

If the user has not explicitly identified files, a pull request, commits, or a diff range, ask what to review. Do not assume the working tree diff is the intended scope.

Review only the agreed scope and the directly related tests. Expand it only when a necessary dependency is required to understand a concrete risk.

### 2. Gather Evidence

Read:

1. [docs/architecture.md](../../docs/architecture.md).
2. [.github/copilot-instructions.md](../../copilot-instructions.md).
3. Every changed file in the agreed scope.
4. Related tests, including colocated `*.test.ts` and `*.test.tsx` files and the tests that exercise the changed behavior.

Base every finding on observed code or an observable absence. Do not infer defects from naming, file placement alone, or hypothetical future requirements.

### 3. Apply the Checklist

Review each relevant dimension in the [review checklist](./checklist.md):

- Architecture
- Correctness
- Type Safety
- Data Flow
- State Management
- Testing
- Maintainability
- Dependencies
- Code Quality

Do not report purely stylistic preferences already enforced automatically by Biome unless they cause an architectural or maintainability impact.

### 4. Write Findings

Report only relevant findings. If a report section has no relevant issue, state `Ninguno detectado.`

Every finding must include:

- **Problema**: the observed defect or risk.
- **Ubicacion**: file and precise symbol or line.
- **Por que importa**: the behavioral, architectural, or maintenance impact.
- **Solucion recomendada**: a concrete correction or next step.

Place Architecture, Data Flow, and State Management findings only in **Architecture**. Place Testing findings only in **Missing Tests**. Place findings from Correctness, Type Safety, Maintainability, Dependencies, and Code Quality in the severity section that matches their impact.

Use severity proportionately:

- **CRITICAL**: data loss, security exposure, broken core behavior, or a dependency-direction violation that compromises the architecture.
- **HIGH**: a likely production defect, a major contract violation, or a significant maintenance risk.
- **MEDIUM**: a contained correctness, safety, or maintenance issue with meaningful impact.
- **LOW**: a concrete, non-blocking improvement with a demonstrated maintenance impact.

### 5. Produce the Report

Use this exact structure:

```markdown
# Review

## Critical

## High

## Medium

## Low

## Missing Tests

## Architecture

## Final Assessment
```

End the report with exactly one verdict on its own line:

- `CHANGES REQUIRED` when there is at least one CRITICAL finding.
- `APPROVED` when there are no CRITICAL findings. HIGH findings remain visible as strong warnings in **Final Assessment**, but do not change this verdict.

Do not modify source code, tests, dependencies, or configuration while applying this skill. Present the report first and wait for the user to request changes.
