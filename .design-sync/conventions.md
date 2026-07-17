# LEAGUEPROOF Design System — build conventions

This is `@astryxdesign/core` (Meta's Astryx design system) themed for LEAGUEPROOF: a lime
(`#b2f419`) primary accent on the neutral grayscale spine, extending `@astryxdesign/theme-neutral`.

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
- `--color-background-body` / `--color-background-surface` / `--color-background-card` — surface
  tiers.
- `--color-text-primary` / `--color-text-secondary` / `--color-text-disabled` — text tiers.
- `--color-border` / `--color-border-emphasized` — borders.
- `--color-success` / `--color-warning` / `--color-error` / `--color-info` and their `-muted`
  variants — semantic status colors.
- `--radius-inner` / `--radius-element` / `--radius-container` / `--radius-page` — radius scale.
- `--spacing-{1..N}` — spacing scale.

All of the above are inherited from `@astryxdesign/theme-neutral` unmodified — only
`--color-accent`, `--color-accent-muted`, and `--color-on-accent` are LEAGUEPROOF-specific
overrides.

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
