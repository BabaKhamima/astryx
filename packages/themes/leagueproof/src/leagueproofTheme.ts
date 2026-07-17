// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * LEAGUEPROOF Theme
 *
 * Extends the neutral theme with the brand accent pulled from the
 * LEAGUEPROOF Component Library Figma file (node 1:3):
 * https://www.figma.com/design/ejncH9a6FFuLwxtJwHaNcB/LEAGUEPROOF-%E2%80%94-Component-Library?node-id=1-3
 *
 * Figma's variable/design-context tools were unavailable when this was
 * authored, so accent hex values are estimated by pixel-sampling the
 * rendered screenshot rather than read from Figma's own color variables.
 * Confirm against the file's published variables before shipping to
 * production.
 */

import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const leagueproofTheme = defineTheme({
  name: 'leagueproof',
  extends: neutralTheme,

  tokens: {
    // Electric lime — primary brand accent (filled buttons, active tab
    // underline, avatar "+" badges, brand wordmark bar). Screenshot samples
    // clustered around #a5ec00–#c4fd3e; using the cluster average. Dark-mode
    // value is unconfirmed (source file only shows light mode) — kept equal
    // to light for now.
    '--color-accent': ['#b2f419', '#b2f419'],

    // Pastel lime — secondary/ghost button fill, light-tint hover states.
    '--color-accent-muted': ['#def6a8', '#3c4a12'],

    // Bright lime needs dark text for contrast, unlike neutralTheme's
    // near-black accent which pairs with white text.
    '--color-on-accent': ['#0a0a0a', '#0a0a0a'],
  },
});
