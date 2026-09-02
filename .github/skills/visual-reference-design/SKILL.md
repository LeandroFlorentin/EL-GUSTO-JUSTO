---
name: visual-reference-design
description: "Use when: translating a visual reference into the ecommerce design system without copying branding, text, or exact colors. Applies the reference as a guide to hierarchy, composition, spacing, proportions, navigation, imagery treatment, cards, typography scale, and section rhythm while preserving the project’s global tokens and accessibility standards."
---

# Visual Reference Design Procedure

## Purpose

This skill teaches how to turn a visual reference into a design that matches the project’s own system instead of copying the source image literally. The goal is not to reproduce exact colors, logotypes, copy, or commercial content; it is to extract the underlying design direction and translate it into the project’s established tokens and patterns.

Use the real source of truth in this repository:

- [app/global.css](../../../app/global.css) for color, typography, and theme tokens.
- [app/layout.tsx](../../../app/layout.tsx) for the actual font variables and body defaults.
- [shared/components](../../../shared/components) for the existing component conventions and styling patterns.
- [docs/architecture.md](../../../docs/architecture.md) for architectural constraints and application boundaries.

## Step 1: Inspect the Reference as a Design Brief

Before deciding any styling, inspect the reference image carefully and isolate:

- hierarchy of titles and supporting text
- visual rhythm of sections and spacing patterns
- density and whitespace balance
- composition of hero, cards, and gallery layouts
- treatment of navigation and calls to action
- image framing, cropping, and overlay choices
- general mood: editorial, warm, minimal, luxury, etc.

The reference should be treated as a language clue, not as a strict specification.

## Step 2: Extract Reusable Visual Principles

Translate the image into principles that can be reused in future work. For example:

- hierarchy visual with strong serif hero and restrained sans body text
- generous vertical rhythm with clear section separation
- soft, layered surfaces driven by warm neutral backgrounds
- high-contrast dark text on light backgrounds with accent highlights
- elevated navigation that is simple, thin, and subtle, not heavy or oversized
- rounded image cards and image overlays to soften the interface
- large whitespace between blocks to preserve editorial calm
- limited accent usage to key moments such as labels, highlights, and CTA emphasis

These principles are reusable even when the exact reference artwork or exact copy is not.

## Step 3: Compare Against the Project Tokens

The project’s design tokens are authoritative. Check the reference only against the project system, not the other way around.

### Real token source

The design system in [app/global.css](../../../app/global.css) defines:

- `--primary`: dark green, used as the core brand tone
- `--accent`: warm gold, used for emphasis and detail
- `--background`: warm cream background
- `--background-secondary`: warm off-white support background
- `--foreground` / `--foreground-muted`: readable neutral text colors
- `--surface`: white surface
- `--border`: project border tone
- `--focus-ring`: focus highlight for accessibility

Typography tokens are also defined through Tailwind theme aliases:

- `font-serif` → `var(--font-cormorant)`
- `font-sans` → `var(--font-montserrat)`

When the reference uses a green or gold similar to the project’s palette, prefer the project token instead of copying the exact hex value from the image.

## Step 4: Map Visual Cues to Project Primitives

Use this translation logic:

| Reference cue                        | Project equivalent                                                        |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Deep green brand area                | `primary`                                                                 |
| Warm gold accent                     | `accent`                                                                  |
| Warm neutral background              | `background` or `background-secondary`                                    |
| Serif headings or emphasis           | `font-serif`                                                              |
| Sans body text and UI labels         | `font-sans`                                                               |
| Light supporting text                | `text-foreground-muted`                                                   |
| Minimal linework or compact dividers | `border` + subtle length, not heavy blocks                                |
| Pill buttons                         | `rounded-full` with `bg-primary` or `bg-accent` depending on role         |
| Soft card framing                    | `rounded-*` + `overflow-hidden`, without copying a specific shadow system |
| Editorial spacing                    | Tailwind spacing scale applied consistently                               |

If the image has no exact matching token, derive the closest semantic match from the design system. Do not import a new visual system just to match one reference.

## Step 5: Respect the Project Priorities

When the reference and the project system conflict, use this order of priority:

1. Architecture and project rules
2. Design tokens in [app/global.css](../../../app/global.css)
3. Accessibility
4. Responsive design
5. Existing patterns already used in the repository
6. The visual reference image itself

This means the reference is an influence, not the final authority.

## What Not to Copy

Do not copy any of the following from the reference image:

- logos
- branding
- commercial text or product names
- illustrations or photographs
- exact colors or hex values
- layout copy, slogans, or headlines
- other people’s visual identity or asset library

The image is only a guide to direction, not a source of final design assets.

## Concrete Heuristics

Use these heuristics during design work:

- If the reference uses an elegant serif headline, prefer `font-serif` with strong tracking and clean spacing.
- If the reference uses warm neutrals and dark green accents, map them to `background` and `primary` instead of introducing a custom palette.
- If the reference uses an editorial gallery, use muted overlays, balanced crops, and soft rounding rather than heavy shadows.
- If the reference feels spacious, keep whitespace generous instead of crowding the layout.
- If the reference emphasizes a luxury or premium mood, use restrained contrast rather than excessive decoration.
- If there are no custom radius tokens, use Tailwind’s default `rounded-*` scale consistently.

## Case Study: Interpretation of the Existing Homepage Reference

This image analysis is illustrative and intentionally not prescriptive for all future references. It shows how to convert a visual cue into the current project language.

In the supplied reference, the overall direction aligns closely with the project’s tokens:

- dark green corresponds to `primary`
- warm gold corresponds to `accent`
- warm cream corresponds to `background` and `background-secondary`
- serif typography corresponds to `font-serif`
- modern sans typography corresponds to `font-sans`

The reference suggests several reusable principles:

- a cinematic, warm hero with a generous dark overlay
- a strong editorial hierarchy in the headline with a highlighted accent phrase
- minimal navigation with subtle underline treatment
- soft image treatments with rounded corners and restrained overlays
- section separation driven by background changes rather than heavy borders
- relaxed visual density with ample whitespace
- pill-style CTAs and small accent markers to guide attention

The reference should influence composition, rhythm, and proportion, while the implementation still uses the project-controlled color and typography system.

## Implementation Checklist

Before finalizing a design inspired by a reference image, confirm:

- [ ] The composition follows the repository’s design language, not the literal reference.
- [ ] Colors are mapped to `primary`, `accent`, `background`, and related tokens.
- [ ] Typography respects `font-serif` and `font-sans`.
- [ ] Spacing and proportions remain consistent with the project’s layout rhythm.
- [ ] Accessibility contrast is preserved.
- [ ] Responsive behavior is considered from the start.
- [ ] Existing project patterns in `shared/` are respected.
- [ ] No branding, logos, or copied text from the reference are used directly.

This skill is designed to support thoughtful adaptation: the goal is to reproduce the direction and mood of a reference using the ecommerce’s own system.
