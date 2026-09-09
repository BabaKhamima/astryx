// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * LEAGUEPROOF Theme
 *
 * Full brand theme, verified against the real design handoff (39 app
 * screens dark+light, design/README.md's token tables) in the
 * BabaKhamima/Leagueproof app repo — not pixel-sampled estimates.
 *
 * SOURCE OF TRUTH IS THAT REPO, NOT THIS FILE: @leagueproof/tokens
 * (packages/tokens/src/colors.ts) is the canonical values, consumed
 * directly by apps/web/lib/leagueproofTheme.ts there. This file is a
 * hand-kept mirror — this package can't depend on a workspace package in a
 * different repo, so if the brand tokens ever change, update
 * @leagueproof/tokens first, then apps/web/lib/leagueproofTheme.ts, then
 * copy the resulting values here.
 *
 * An earlier version of this file used pixel-sampled screenshot estimates
 * (accent-only, explicitly flagged "unconfirmed") — this replaces it with
 * the complete, verified token set plus typography.
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const leagueproofTheme = defineTheme({
  name: 'leagueproof',
  extends: neutralTheme,

  typography: {
    heading: {
      family: 'Times New Roman',
      fallbacks: 'Times, Georgia, serif',
      weight: '800',
    },
    body: {
      family: 'Archivo',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      weight: '500',
    },
  },

  tokens: {
    // Lime — the hero color. Never change it.
    '--color-accent': ['#B2F419', '#B2F419'],
    '--color-on-accent': ['#0A0A0A', '#0A0A0A'],
    '--color-accent-muted': ['#E4F7BD', '#39481A'],
    // Lime as *ink* fails contrast on paper (~1.4:1) — light mode
    // substitutes olive (7.5:1); dark mode can use lime directly.
    '--color-text-accent': ['#3F5D00', '#B2F419'],

    '--color-background-body': ['#F4F3EF', '#101113'],
    '--color-background-surface': ['#FFFFFF', '#191A1D'],
    '--color-background-card': ['#FBFAF7', '#161719'],
    '--color-background-muted': ['#E9E8E2', '#212327'],

    '--color-text-primary': ['#111214', '#F4F5F2'],
    '--color-text-secondary': ['#55585F', '#9498A0'],
    '--color-text-disabled': ['#6B6E75', '#5F636A'],

    '--color-border': ['#DCDBD4', '#292B30'],
    '--color-border-emphasized': ['#BCBBB3', '#3A3D43'],

    '--color-success': ['#186538', '#54D98C'],
    '--color-warning': ['#8A4B00', '#F5C451'],
    '--color-error': ['#A41C1C', '#FF7777'],

    // Coach App addition (2026-09) — background-inverted and muted status
    // tints. The coach app hasn't had a dark-mode design pass, so only
    // light values are specified; using light for both modes here rather
    // than inventing a dark one. Replace with a real [light, dark] pair
    // once that design pass happens — mirrors apps/web/lib/leagueproofTheme.ts
    // in the BabaKhamima/Leagueproof repo. No Astryx slot for infoMuted,
    // same gap as the unmapped "info" token below.
    '--color-background-inverted': ['#111214', '#111214'],
    '--color-success-muted': ['#DCF0E4', '#DCF0E4'],
    '--color-warning-muted': ['#FAEDD8', '#FAEDD8'],
    '--color-error-muted': ['#F9E5E5', '#F9E5E5'],

    // No LEAGUEPROOF override for the secondary/guardian blue (#1A4FD6
    // light / #3A9BFF dark) or a generic "info" token yet — Astryx has no
    // matching semantic slot (it uses per-hue categorical tokens like
    // --color-background-blue instead, meant for badge-style tinting, not
    // a single brand-secondary color). Needs resolving before the
    // guardian-verification screens (E1–E8, H1–H4) get built against this
    // theme — left as Astryx defaults for now.
  },
});
