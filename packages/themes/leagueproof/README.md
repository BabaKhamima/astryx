# @astryxdesign/theme-leagueproof

Electric lime accent on the neutral spine, per the LEAGUEPROOF Component Library.

## Install

```bash
npm install @astryxdesign/theme-leagueproof
```

## Usage

Wrap your app with `Theme` and pass the theme:

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {leagueproofTheme} from '@astryxdesign/theme-leagueproof/built';

function App() {
  return <Theme theme={leagueproofTheme}>{/* your app */}</Theme>;
}
```

### Import paths

| Path                                        | Use case                                                    |
| ------------------------------------------- | ----------------------------------------------------------- |
| `@astryxdesign/theme-leagueproof`           | Source build (StyleX compilation via `@astryxdesign/build`) |
| `@astryxdesign/theme-leagueproof/built`     | Pre-built dist (Tailwind, plain CSS, or no build step)      |
| `@astryxdesign/theme-leagueproof/theme.css` | Pre-built CSS file (import in your stylesheet)              |

### CSS import

Add the theme CSS to your stylesheet:

```css
@import '@astryxdesign/theme-leagueproof/theme.css';
```

This theme extends `@astryxdesign/theme-neutral` and only overrides the
accent tokens (`--color-accent`, `--color-accent-muted`, `--color-on-accent`).
