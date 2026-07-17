# design-sync notes — LEAGUEPROOF Design System

## Global fixes (apply automatically on re-sync via config/overrides)

- **`[GENERAL]` StyleX runtime crash in story previews**: 28+ `.stories.tsx` files call
  `@stylexjs/stylex`'s `create()` directly at module scope for demo-only wrapper layout
  (separate from the actual component styles, which ship precompiled in `dist/astryx.css`
  and are unaffected). The real `@stylexjs/stylex` package's `create()` deliberately throws
  at runtime unless compiled away by `babel-plugin-stylex`, which this converter's plain-esbuild
  preview compile never runs. This crashed the story module at import time for every affected
  component (21 components showed `root empty` before the fix — Button, Avatar, Dialog, Card,
  Carousel, etc. — a huge, misleadingly broad-looking symptom for one root cause).
  **Fix (v1, superseded)**: forked `.ds-sync/lib/story-imports.mjs` → `.design-sync/overrides/story-imports.mjs`,
  added a `stylexStubPlugin()` that shimmed `@stylexjs/stylex` to a TRUE no-op module
  (`create` passthrough, `props()` always `{}`) for story compilation only.
  **v1 regression found by fan-out batches 2 and 4**: a true no-op doesn't just stop the crash —
  it silently DROPS every story's own demo-only layout styling (backgrounds, widths, borders,
  gaps on wrapper elements), confirmed independently on Card/Center/Carousel (batch 2) and
  ContextMenu/Collapsible's page wrapper (batch 4). Graded as `close`/`mismatch` rather than a
  crash, so it's a quieter failure — worse in that sense, since it's easy to miss.
  **Fix (v2, current)**: `props()` now actually applies the passed-through style object(s) as an
  inline `style`, best-effort (flat CSS-like declarations only — pseudo-class keys like `:hover`
  and nested/media-query objects are skipped since they aren't valid inline-style values; React
  silently ignores anything it doesn't recognize, so this degrades to "no hover effect" rather
  than a crash or an exception). Recovers the overwhelming majority of story-local demo styling.
  Only affects the STORY's own demo-only StyleX usage — real shipped component styles (from
  `dist/astryx.css`) are untouched either way.
  **Re-graded, resolved**: Card, Center, Carousel, ContextMenu, Collapsible, AppShell all
  re-compared after the v2 stub rebuild — all now grade `match` (Carousel and Center went from
  3/6 and 5/6 mismatch to 6/6 match; AppShell's MockContent paragraph-gap collapse is fixed).
- **`[GENERAL]` Every preview rendered completely unstyled (before the stylex fix even
  surfaced)**: the converter's default CSS auto-detection fell back to `[CSS_FROM_STORYBOOK]`
  scraping (`.design-sync/sb-reference`'s compiled iframe CSS) instead of finding
  `@astryxdesign/core`'s own real, dedicated `dist/astryx.css` (119.8 KB, precompiled StyleX
  atomic classes — `packages/core` ships this via the `./astryx.css` export). The scraped CSS
  either mismatched class-name hashes or otherwise didn't apply — every component rendered as
  plain unstyled text/boxes with zero visual styling.
  **Fix (v1, superseded)**: set `cfg.cssEntry: "dist/astryx.css"` (package-relative to
  `packages/core`) to point directly at the real compiled stylesheet. Bundle CSS size changed
  from 134 KB (scraped) to 125.9 KB (real) after the fix.
  **v1 gap found by fan-out batches 3 and 4**: `dist/astryx.css` alone is only HALF of what
  `@astryxdesign/core` expects a consumer to load. The package also ships a separate
  `reset.css` (`./src/reset.css`, exported as `@astryxdesign/core/reset.css`) — a
  Tailwind-preflight-style native-element reset (margin/padding/border/background resets for
  `button`/`input`/etc. via `:where()` selectors). Components that strip native button chrome
  via `all: 'unset'` for accessibility (the "invisible button" pattern in `Item.tsx`, used by
  `CheckboxListItem`, `RadioListItem`, `DropdownMenuItem`, `SelectorOption`, `Token`,
  `Thumbnail`, `ChatComposer`, `TreeListItem`, `Collapsible`) rely on that reset layer for full
  coverage — StyleX's atomic-class compile only covers the longhand properties explicitly
  declared (cursor/font/color/display/etc.), not full native button reset. Real storybook masks
  this because its own dev build's iframe bundle carries an equivalent Tailwind-preflight reset;
  the synced preview, loading only `dist/astryx.css`, showed raw native button chrome (border,
  background, padding) on every affected component.
  **Fix (v2, current)**: created `packages/core/dist/astryx-with-reset.css` = `src/reset.css` +
  `dist/astryx.css` concatenated (in that order — reset has the lowest cascade-layer priority
  per the package's own documented layer order `reset → astryx-base → astryx-theme`). Updated
  `cfg.cssEntry` to point there instead. **Regenerate this file if either source changes**:
  `cat packages/core/src/reset.css packages/core/dist/astryx.css > packages/core/dist/astryx-with-reset.css`
  (not committed/gitignored automatically — it's a derived file inside `packages/core/dist`,
  which is itself gitignored repo-wide; regenerate on every fresh clone/rebuild before running
  the converter).
  **Re-graded, resolved**: CheckboxList re-compared after the v2 CSS rebuild — now grades
  `match` (was 5/6 mismatch, raw native-button chrome). RadioList/DropdownMenu/Selector/Token/
  Thumbnail/TreeList (not yet graded by any batch) should render correctly now too, being the
  same invisible-button pattern — verify when their batch runs, but no further CSS fix expected
  to be needed.

## Known issues surfaced by fan-out grading (investigate separately — not blocking)

- ~~Token's remove-chip icon renders wrong~~ **RESOLVED (batch 13)** — re-investigated with
  pixel-level crops of the remove-chip icon on both sides; both render an identical plain
  thin-stroke X, no divergence found. The flag was stale, fixed as a side effect of the
  `astryx-with-reset.css` fix (same invisible-button/native-chrome-reset code path Token's
  remove button uses), which landed after this was originally flagged. No longer an issue.
- **CodeBlock's copy button shows a `:focus-visible`-looking border in every preview capture**
  that storybook never shows — no autofocus in the component source, no focus/tab manipulation
  in the compare harness, and other buttons in the same batch (CommandPalette) don't show it.
  Root cause not found; narrowed to CodeBlock specifically. Graded `close`.
- **`[GENERAL]` Stories that import from the `@astryxdesign/core/theme` SUBPATH (not the package
  root) get a disconnected, source-bundled copy of Theme/defineTheme/useTheme** — `story-imports.mjs`'s
  redirect-to-`window.Global` rule only fires for a subpath whose last segment matches a single
  exported COMPONENT's own name ("Button", "Card", ...); "theme" is a multi-export barrel, not a
  single component, so it falls through to real source bundling instead. Any nested `<Theme>` a
  story renders via this path never reaches the real page's `ThemeContext` — `useTheme()` calls
  elsewhere on the page silently fall back to their no-context default (`name: 'default'`, wrong
  colors). Confirmed and fixed on `Theme.stories.tsx` (batch 12) via an owned
  `.design-sync/previews/Theme.tsx` importing from the package root instead, with a local
  `defineTheme(...)` copying the needed theme-neutral token values verbatim (theme-neutral itself
  is unresolvable per the entry below, so the real package couldn't be imported either). A
  repo-wide grep also found this same subpath import in `Table.stories.tsx`, `GridMasonry.stories.tsx`,
  `CodeTheme.stories.tsx`, and `ThreeD-Showcase.stories.tsx` — **Table already graded clean
  (7/7 match, batch 11)** despite the grep hit, so it likely doesn't trigger the symptom in
  practice for Table specifically (not re-opened). GridMasonry/CodeTheme/ThreeD-Showcase are not
  part of this sync's 98-component roster (dropped by `[TITLE_UNMAPPED]` — not public package
  exports), so not applicable here either. Flagging only as a pattern to recognize if it resurfaces.
- **`ToastViewport` is a real, confirmed gap in the published package's public export surface** —
  `packages/core/src/Toast/index.ts` exports it, but `packages/core/src/index.ts` (the package
  ROOT barrel) only re-exports `Toast` and `useToast` from that module, never `ToastViewport`.
  Confirmed missing from the compiled bundle's public global object even though it's compiled in
  and used internally (`useToast`'s fallback-viewport mount). This breaks Toast's "Toast Over
  Dialog" story ("Element type is invalid... undefined") — a REAL bug a claude.ai/design
  consumer of the actual shipped package would also hit, not a sync/converter artifact.
  Storybook's own dev build never surfaces it because it imports against source, not the compiled
  public bundle. Not fixable from `.design-sync/previews/` (no owned preview can add an export
  the real global bundle lacks without misrepresenting the actual shipped API). Graded `mismatch`
  with this note; worth a real upstream fix in `packages/core/src/index.ts` (add `ToastViewport`
  to its `./Toast` re-export list) on a future sync.
- **Overlay-trigger components (ContextMenu, CommandPalette, DropdownMenu, Popover, HoverCard,
  Tooltip, MoreMenu) only ever show their CLOSED trigger state** in both storybook and the
  preview — the compare capture harness doesn't simulate clicks/hovers to open them. This is an
  accepted precedent (same as Dialog, which the solo phase already graded `match` on this
  basis) — not a defect, just a capture-methodology limit. Their actual open/portal content is
  unverified either way. Confirmed also applies to MoreMenu (batch 8) and DropdownMenu (batch 5).
- **`[GENERAL]` `@astryxdesign/theme-neutral` (not just theme-stone/theme-y2k) is ALSO
  unresolvable** for story compilation — confirmed via a direct esbuild probe (batch 7) using the
  same `--node-modules` restriction the converter uses. This widens the already-documented
  Layout/MediaTheme exception (their one unresolvable story each) — MediaTheme's "On Light" story
  is unpaired for this reason even though it doesn't touch theme-y2k. **Components whose subject
  IS neutral-theme comparison (e.g. `Theme.stories.tsx`) will likely hit this too** — expect it,
  don't re-diagnose. Same policy as theme-stone/theme-y2k: leave unresolved, own a `.tsx` that
  drops the affected story if needed (see Layout/MediaTheme's owned previews for the pattern),
  don't pull in extraEntries.
- **`[GENERAL]` Tall components can show as "content cut off" in the compare sheet — this is a
  CAPTURE ARTIFACT, not a real bug.** `compare.mjs` screenshots storybook's `#storybook-root`
  element at full height, but the preview side does a plain viewport screenshot capped around
  700px. Confirmed on Markdown (batch 7) by re-rendering at a taller viewport — content matched
  storybook byte-for-byte once not clipped by the capture viewport. Grade this as `match` per the
  rubric's framing-difference exemption, not `mismatch` — but VERIFY via raw PNGs/direct
  inspection before assuming it's just framing; don't reflexively wave off every tall-content
  divergence without checking.

## Known deliberate exception to "storybook is ground truth" (user-approved policy)

- **`[GENERAL][POLICY]` CSS cascade-layer scheme differs between the published package and
  Storybook's live build, for the same source.** `packages/core`'s own `scripts/build-css.mjs`
  (used for `dist/astryx.css`, what this sync's `cfg.cssEntry` loads) emits a single flat
  `@layer astryx-base` for all component styles. Storybook's live build instead goes through
  `@astryxdesign/build`'s `astryxStylex` vite-plugin, which compiles into StyleX's real
  `@layer priority1..priority10` specificity-bucketed scheme. Confirmed via direct grep of both
  compiled stylesheets (`ds-bundle/_ds_bundle.css` vs `.design-sync/sb-reference/assets/*.css`)
  — genuinely different layer sets, not a source-order artifact. The LEAGUEPROOF theme's
  component-level overrides (e.g. neutralTheme's inherited `button['variant:destructive']:
{backgroundColor: 'var(--color-error-muted)', ...}`) are injected at RUNTIME by `Theme.tsx`
  (both builds use the same unbuilt `defineTheme` runtime-injection path — neither ships
  `astryx-theme`/`@scope` statically, confirmed by grep) — but which of the two different base
  layer schemes that runtime injection needs to beat differs, so **for overrides that set a
  literal CSS property directly** (`background-color`, `color` — as opposed to redefining a
  custom property consumed elsewhere via `var()`), the two builds can show the override applying
  in storybook but not in our sync, or vice versa. First caught on `AlertDialog`'s
  `variant="destructive"` trigger button (batch 1 fan-out subagent, confirmed via direct CSSOM
  inspection with Playwright) — pattern likely also affects `Badge` (info/error/red/orange/
  yellow/green/teal/cyan/blue/purple/pink/gray variants), `ProgressBar` (accent/success/warning/
  error), `Switch`, and `Banner`'s `info` status (confirmed: `Banner`'s success/warning/error
  variants only redefine custom properties and are unaffected; only `info` sets a literal
  `background-color` and is affected).
  **Policy decision (user-approved, given both these are genuinely ambiguous "which is more
  correct" and this is a deep bundler-internals difference, not a design-sync converter bug):**
  trust OUR bundle's rendering as correct for grading purposes when this specific pattern is the
  cause of a mismatch — our rendering already matches the theme system's own documented intent
  (e.g. neutralTheme's explicit, commented destructive-button spec), so it's the more trustworthy
  ground truth here even though it diverges from what storybook happens to show. **Do NOT grade
  these as `mismatch`** — grade `match` with a note citing this policy exception. This is a
  narrow, named exception to the skill's general "storybook is the oracle" rule — every OTHER
  kind of divergence still gets graded normally against storybook.
  **Deferred, not fixed**: the actual root inconsistency (`scripts/build-css.mjs` vs
  `astryxStylex` vite-plugin producing different layer schemes from the same StyleX source) is a
  real repo-level issue worth fixing upstream in `@astryxdesign/core`/`@astryxdesign/build`
  someday, but is out of scope for this sync — flagging here so it isn't lost.

## Repo-specific setup

- Theme is forced via `cfg.provider: {component: "Theme", props: {theme: {"$ref":
"leagueproofTheme"}}}` — the real `.storybook/preview.tsx` decorator (which supports a
  toggleable theme via toolbar) is intentionally bypassed, since a compiled static preview has
  no live toolbar state to read (`context.globals` is empty), so the decorator would always
  fall back to its `|| 'neutral'` default. Forcing the provider guarantees every synced preview
  renders in the LEAGUEPROOF theme.
- `apps/storybook/.storybook/preview.tsx`'s `initialGlobals.astryxTheme` was changed from
  `'neutral'` to `'leagueproof'` so the REFERENCE storybook build (the compare oracle / ground
  truth) also defaults to the LEAGUEPROOF theme — otherwise every comparison would show a
  systematic color mismatch (reference in black/neutral vs. our forced-leagueproof preview),
  swamping real fidelity issues with an expected, intentional difference.
- `@astryxdesign/theme-leagueproof` isn't hoisted into repo-root `node_modules` by pnpm's
  workspace linking (only sibling _consuming_ packages get it in their own `node_modules`).
  Added a manual symlink: `node_modules/@astryxdesign/theme-leagueproof -> ../../packages/themes/leagueproof`
  so the converter (run with `--node-modules ./node_modules`, needed there for `react`) can
  resolve it too. **Not gitignored by the standard rule** (it's outside `.design-sync/`) —
  recreate this symlink on a fresh clone before running the converter.
- Large DS (98 components, 482 `.d.ts` files): the `.d.ts` ts-morph parse OOM'd at the default
  Node heap. Used `NODE_OPTIONS="--max-old-space-size=8192"` for `package-build.mjs`.

## Known non-blocking issues (not yet fixed — deliberately deferred)

- Three story files fail to compile because they import genuinely out-of-scope packages for
  demo/comparison purposes only — NOT bugs in the synced components, since each component has
  other working stories:
  - `Layout.stories.tsx` imports `@astryxdesign/theme-stone` (a side-by-side theme comparison demo)
  - `MediaTheme.stories.tsx` imports `@astryxdesign/theme-y2k` (same)
  - `apps/storybook/stories/charts/Tooltip.stories.tsx` imports `@astryxdesign/charts` (a
    chart-specific Tooltip demo, unrelated to core's own `Tooltip` component)
    Left unresolved rather than pulling in charts/other themes as `extraEntries` — that would
    broaden the bundle scope beyond `@astryxdesign/core` and risks export collisions (e.g. charts
    likely has its own overlapping names).
- `Toast`'s "Toast Over Dialog" story throws "Element type is invalid... undefined" — **root-caused
  (batch 12)**: `ToastViewport` is missing from `packages/core/src/index.ts`'s public re-export
  list (see the dedicated entry above). Real upstream gap, graded `mismatch`, doesn't block the
  build/validate gate.
- ~~`NavIcon` and `Tooltip` are flagged `[RENDER_THIN]`~~ **RESOLVED** — both flags were stale,
  confirmed by batches 8 and 13 respectively. NavIcon: fixed by the global CSS fix. Tooltip: fixed
  by an owned `.design-sync/previews/Tooltip.tsx` that drops an unrelated chart-Tooltip story
  import which was crashing the whole generated preview module (not just its own story cell).
- `[TOKENS_MISSING]`: 7 CSS custom properties referenced but undefined (`--color-border-default`,
  several StyleX-internal `--x-*` vars). Likely runtime-injected inline styles rather than a real
  gap — not chased yet, should verify against a rendered preview before treating as a bug.
- `[GRID_OVERFLOW]` on ~30 components fixed via `cfg.overrides.<Name>.cardMode` (column for wide
  stories, single for portal/fixed-position ones like Carousel/TabList) — mechanical, presentation-only,
  no re-verification needed per the skill's own guidance.

## Re-sync risks

- The `story-imports.mjs` fork and the `cssEntry` override are both load-bearing for every
  component rendering at all — if the astryx repo's own build output layout changes (e.g.
  `dist/astryx.css` renamed/moved, or story files stop using raw `@stylexjs/stylex`), both need
  re-verification, not just a rebuild.
- Only 4/98 components have been visually graded so far (Button, Dialog, Avatar, Badge — the
  solo diversity set). The rest are unverified; do not treat their generated previews as
  confirmed-correct until graded.
- The `node_modules/@astryxdesign/theme-leagueproof` symlink is manual/undocumented in any
  install script — a fresh clone needs it recreated before the converter can resolve the theme.
