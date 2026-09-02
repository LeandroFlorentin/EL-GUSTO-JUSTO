# Example: homepage reference interpretation

This file is a concrete example of how to translate a reference image into the project’s own system. It is illustrative rather than a final design spec.

## Observed design language in the reference

The reference image shows a warm, editorial landing page with the following traits:

- problem-free visual rhythm and generous whitespace
- dark green as the base brand tone
- warm gold used as a highlight accent
- cream and off-white backgrounds to create calm surfaces
- serif typography for prominent headlines and premium feeling
- sans-serif typography for navigation and supporting copy
- strong hero composition with a dark overlay and visible headline emphasis
- minimal navigation with thin underline treatment
- visually clean gallery cards with rounded corners and image overlays
- no heavy border emphasis; section separation happens by background and spacing
- high readability with restrained but deliberate contrast

## Project mapping

The current design system already matches this direction closely:

- `primary` → dark green brand tone
- `accent` → gold accent tone
- `background` and `background-secondary` → cream/off-white surfaces
- `font-serif` → Cormorant Garamond for titles and emphasis
- `font-sans` → Montserrat for navigation, labels, and body copy

This is a translation from the visual direction to the existing project palette and typography, not a literal color or font copy.

## Reusable principles extracted

### Visual hierarchy

The reference favors a single dominant headline above supporting text and actions. That means:

- hero title should be the primary element
- supporting copy should be compact and restrained
- accent color should appear only where it adds clarity or emphasis

### Composition and spacing

Sections are clearly separated by whitespace, not by dense decorative borders. The project should preserve:

- generous vertical spacing
- strong margin rhythm between blocks
- simple column arrangement on wide screens
- stacked layout on smaller screens

### Navigation

Navigation is calm and understated, not overloaded. The project already has a subtle underline interaction in `NavBar` using `after:` and `hover:text-accent`. That is a good fit for the reference direction.

### Imagery

The reference’s images are treated as atmospheric and editorial rather than as dense product thumbnails. In practice, this suggests:

- use large image panels
- round corners gently
- apply soft overlays for contrast
- keep image treatment secondary to the text hierarchy

### Cards and galleries

The gallery language is less “boxed UI” and more “editorial layout.” The project should prefer:

- rounded images
- light overlays for captions
- soft cropping and large framing
- limited decorative shadows or borders

### Buttons and calls to action

The reference uses strongly legible pill buttons. That maps naturally to:

- `rounded-full`
- `bg-primary` for primary actions
- `bg-accent` only when the accent role is intentional and still legible
- strong hover/focus states based on the project tokens

## Interpretation checklist

The reference contributes direction, not exact implementation details:

- [x] color temperature and mood
- [x] heading scale and rhythm
- [x] section proportion and whitespace
- [x] navigation behavior
- [x] gallery/image composition
- [x] use of accent for emphasis
- [ ] exact logo or branded wording
- [ ] exact commercial text
- [ ] exact hex values
- [ ] copied photography or illustrations

This example demonstrates the correct transformation: use the reference’s language and rhythm, but keep the final implementation bound to the real design system of the ecommerce.
