# LEAGUEPROOF Design System — build conventions

This is `@astryxdesign/core` (Meta's Astryx design system) themed for LEAGUEPROOF: a lime
(`#B2F419`) primary accent, plus LEAGUEPROOF's own full surface/text/border/status palette and
typography (Times New Roman headings, Archivo body) — extending `@astryxdesign/theme-neutral`,
not inheriting its grayscale unmodified.

## Wrapping — required on every screen

Every screen must be wrapped in `Theme` with the LEAGUEPROOF theme, or components render
unstyled (no colors, no radii, no spacing tokens):

```tsx
import {Theme} from '@astryxdesign/core';

<Theme theme={leagueproofTheme}>{/* screen content */}</Theme>;
```

Nothing else is required — no separate CSS import, no reset, no additional provider. `Theme`
injects all component styling and the LEAGUEPROOF token overrides itself at mount.

## Styling idiom — CSS custom properties, not utility classes

This is a token system, not a Tailwind-style utility system. Never invent class names. Style by
reading the design tokens as CSS custom properties (`var(--token-name)`) when composing raw HTML
elements alongside library components, or — preferably — just use library components, which
already consume these tokens internally:

- `--color-accent` / `--color-accent-muted` / `--color-on-accent` — the LEAGUEPROOF lime accent,
  its muted/pastel tint, and the text color that sits on top of it (dark, not white — the accent
  is bright).
- `--color-text-accent` — lime used AS TEXT (not a fill) fails contrast on paper; this token is
  olive in light mode and lime in dark mode. Use this, never `--color-accent`, when coloring text
  or icon strokes with the brand color.
- `--color-background-body` / `--color-background-surface` / `--color-background-card` /
  `--color-background-muted` — surface tiers. LEAGUEPROOF-specific values, not inherited.
- `--color-text-primary` / `--color-text-secondary` / `--color-text-disabled` — text tiers.
  LEAGUEPROOF-specific values, not inherited.
- `--color-border` / `--color-border-emphasized` — borders. LEAGUEPROOF-specific values.
- `--color-success` / `--color-warning` / `--color-error` — semantic status colors, LEAGUEPROOF
  values. **No LEAGUEPROOF override yet for `--color-info` or a secondary/guardian-blue token** —
  Astryx has no matching semantic slot (it uses per-hue categorical tokens like
  `--color-background-blue` instead); these still read Astryx's stock values. Needs resolving
  before building the guardian-verification screens, which lean on this color heavily.
- `--radius-inner` / `--radius-element` / `--radius-container` / `--radius-page` — radius scale,
  inherited from `@astryxdesign/theme-neutral` unmodified (not yet mapped to LEAGUEPROOF's own
  radii spec).
- `--spacing-{1..N}` — spacing scale, inherited unmodified (same caveat).
- `--font-family-heading` — **Times New Roman**, weight 800. `--font-family-body` — **Archivo**,
  weight 500. Both LEAGUEPROOF-specific; fonts must be loaded by the consumer (Astryx only sets
  the token, it doesn't load font files).

Everything above except radii and spacing is a LEAGUEPROOF-specific override — do not assume
"looks like a neutral-theme token" means "unstyled by LEAGUEPROOF."

## Where the real styles live

The bound copy of the compiled stylesheet is `styles.css` in this project — read it (and its
`@import` closure) before hand-rolling any custom CSS, to see the exact token values and
component class rules actually shipped. Per-component usage docs are each component's own
`.prompt.md` file.

## A representative build

```tsx
import {Theme, Button, Card, Badge} from '@astryxdesign/core';
import {leagueproofTheme} from '@astryxdesign/theme-leagueproof';

function ProfileCard() {
  return (
    <Theme theme={leagueproofTheme}>
      <Card>
        <Badge variant="success">Active</Badge>
        <Button variant="primary">Follow</Button>
      </Card>
    </Theme>
  );
}
```

`variant="primary"` on `Button` and similar accent-driven props automatically pick up the lime
accent — there is no need to pass explicit colors.
