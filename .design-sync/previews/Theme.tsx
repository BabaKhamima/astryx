// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as React from 'react';
import {
  Theme,
  defineTheme,
  useTheme,
  Card,
  Stack,
  Heading,
  Badge,
} from '@astryxdesign/core';

// Theme.stories.tsx imports `Theme`, `defineTheme`, `useTheme` from the
// SUBPATH `@astryxdesign/core/theme` (not the package root) and every one
// of its 5 stories wraps its demo content in `<Theme theme={neutralTheme}>`
// from `@astryxdesign/theme-neutral`.
//
// Two distinct problems, confirmed by direct comparison against the true
// storybook render:
// 1. The `@astryxdesign/core/theme` SUBPATH import doesn't match this
//    converter's "redirect to window.Astryx" rule (that rule matches a
//    subpath whose last segment IS an exported component's own file/dir —
//    "theme" isn't one), so it falls through to real SOURCE bundling of
//    `packages/core/src/theme/index.ts` — a second, disconnected copy of
//    Theme/useTheme's module graph, separate from the actual shipped
//    `window.Astryx.Theme` this bundle's forced provider (cfg.provider)
//    wraps the page with. The nested `<Theme theme={neutralTheme}>` from
//    that duplicated copy never reaches the real ThemeContext consumed by
//    the REAL useTheme — confirmed via the rendered output itself: every
//    chart/inspector panel showed the base bundle's raw un-themed
//    `--color-accent` (#0064E0 blue, from tokens.stylex.ts's own default,
//    not neutralTheme's near-black #262626 and not leagueproofTheme's lime
//    either), and TokenInspector's badges read name="default" mode="light"
//    for EVERY panel (even the one wrapped in `oceanTheme mode="dark"`) —
//    exactly `useTheme()`'s documented no-context fallback
//    (`theme?.name ?? 'default'`), proving the nested Theme's context never
//    reached the inspector. Root-import components (`@astryxdesign/core`
//    bare, no subpath) redirect correctly — this is what Layout.tsx/
//    MediaTheme.tsx's owned previews already do, and it fixed the same
//    class of symptom there. Fixed here the same way: import Theme/
//    defineTheme/useTheme from the package ROOT instead of the `/theme`
//    subpath.
// 2. `@astryxdesign/theme-neutral` itself is the confirmed-unresolvable
//    sibling theme package documented repo-wide in NOTES.md (also affects
//    Layout.stories.tsx/theme-stone and MediaTheme.stories.tsx/theme-y2k).
//    Rather than dropping every story here (unlike Layout/MediaTheme, ALL
//    5 of Theme's stories use neutralTheme — dropping every affected story
//    would leave nothing to preview), this file inlines a local `defineTheme`
//    object with the exact token values `@astryxdesign/theme-neutral`'s real
//    source (`neutralTheme.ts`) overrides — copied verbatim, not imported —
//    for just the tokens these 5 stories actually read (chart colors, text,
//    border, radius). `defineTheme` itself comes from the real, resolvable
//    `@astryxdesign/core` root export, so this renders with the SAME real
//    Theme/useTheme machinery the fix in (1) restores, just fed theme data
//    equivalent to the unresolvable package's real values instead of a
//    second copy of the package.
//
// `oceanTheme` is already defined locally in the story (no external import),
// copied here unchanged.

const localNeutralTheme = defineTheme({
  name: 'neutral',
  typography: {
    scale: {base: 14, ratio: 1.2},
    body: {
      family: 'Figtree',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    heading: {
      family: 'Figtree',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      weights: {3: 'bold', 4: 'bold'},
    },
  },
  tokens: {
    '--color-background-surface': ['#ffffff', '#262626'],
    '--color-accent': ['#262626', '#ebebeb'],
    '--color-text-primary': ['#171717', '#fafafa'],
    '--color-text-secondary': ['#737373', '#a3a3a3'],
    '--color-success': ['#007004', '#9fe59b'],
    '--color-error': ['#a50c25', '#ffc6c1'],
    '--color-warning': ['#745b00', '#fdcf4f'],
    '--color-border': ['#ebebeb', '#FFFFFF1A'],
    '--color-border-emphasized': ['#d4d4d4', '#525252'],
    '--radius-element': '0.625rem',
  },
});

// =============================================================================
// Sample data for the chart (copied verbatim from Theme.stories.tsx)
// =============================================================================

const CHART_DATA = [
  {label: 'Mon', value: 42},
  {label: 'Tue', value: 78},
  {label: 'Wed', value: 56},
  {label: 'Thu', value: 91},
  {label: 'Fri', value: 64},
  {label: 'Sat', value: 35},
  {label: 'Sun', value: 48},
];

const MULTI_SERIES = [
  {label: 'Q1', series: [120, 90, 70]},
  {label: 'Q2', series: [140, 110, 85]},
  {label: 'Q3', series: [100, 130, 95]},
  {label: 'Q4', series: [160, 105, 120]},
];

// =============================================================================
// Chart components using useTheme (copied verbatim from Theme.stories.tsx)
// =============================================================================

function ThemeAwareBarChart({
  data,
  width = 400,
  height = 200,
}: {
  data: typeof CHART_DATA;
  width?: number;
  height?: number;
}) {
  const {token} = useTheme();

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - 60) / data.length - 8;
  const chartHeight = height - 40;

  return (
    <svg width={width} height={height} role="img" aria-label="Bar chart">
      {[0.25, 0.5, 0.75, 1].map(pct => {
        const y = chartHeight - chartHeight * pct + 20;
        return (
          <g key={pct}>
            <line
              x1={50}
              y1={y}
              x2={width - 10}
              y2={y}
              stroke={token('--color-border')}
              strokeDasharray="4 4"
            />
            <text
              x={45}
              y={y + 4}
              textAnchor="end"
              fontSize={10}
              fill={token('--color-text-secondary')}>
              {Math.round(maxValue * pct)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = 55 + i * (barWidth + 8);
        const y = chartHeight - barHeight + 20;

        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={3}
              fill={token('--color-accent')}
            />
            <text
              x={x + barWidth / 2}
              y={height - 5}
              textAnchor="middle"
              fontSize={11}
              fill={token('--color-text-secondary')}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ThemeAwareGroupedChart({
  data,
  width = 480,
  height = 220,
}: {
  data: typeof MULTI_SERIES;
  width?: number;
  height?: number;
}) {
  const {token} = useTheme();

  const seriesColors = [
    token('--color-accent'),
    token('--color-success'),
    token('--color-warning'),
  ];
  const seriesLabels = ['Revenue', 'Users', 'Sessions'];

  const maxValue = Math.max(...data.flatMap(d => d.series));
  const groupWidth = (width - 80) / data.length;
  const barWidth = (groupWidth - 16) / 3;
  const chartHeight = height - 50;

  return (
    <div>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Grouped bar chart">
        {[0.25, 0.5, 0.75, 1].map(pct => {
          const y = chartHeight - chartHeight * pct + 20;
          return (
            <line
              key={pct}
              x1={55}
              y1={y}
              x2={width - 10}
              y2={y}
              stroke={token('--color-border')}
              strokeDasharray="4 4"
            />
          );
        })}

        {data.map((group, gi) => {
          const groupX = 60 + gi * groupWidth;
          return (
            <g key={group.label}>
              {group.series.map((value, si) => {
                const barHeight = (value / maxValue) * chartHeight;
                const x = groupX + si * (barWidth + 2);
                const y = chartHeight - barHeight + 20;
                return (
                  <rect
                    key={si}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={2}
                    fill={seriesColors[si]}
                    opacity={0.85}
                  />
                );
              })}
              <text
                x={groupX + (groupWidth - 16) / 2}
                y={height - 26}
                textAnchor="middle"
                fontSize={11}
                fill={token('--color-text-secondary')}>
                {group.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{display: 'flex', gap: 16, paddingLeft: 55}}>
        {seriesLabels.map((label, i) => (
          <div
            key={label}
            style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: seriesColors[i],
                opacity: 0.85,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: token('--color-text-secondary'),
              }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenInspector() {
  const {token, mode, name} = useTheme();

  const inspectedTokens = [
    '--color-accent',
    '--color-success',
    '--color-warning',
    '--color-error',
    '--color-text-primary',
    '--color-text-secondary',
    '--color-background-surface',
    '--color-border',
    '--spacing-4',
    '--radius-element',
  ];

  return (
    <Card>
      <Stack direction="vertical" gap={2}>
        <Stack direction="horizontal" gap={2} vAlign="center">
          <Heading level={4}>Token Inspector</Heading>
          <Badge label={name} />
          <Badge variant={mode === 'dark' ? 'neutral' : 'info'} label={mode} />
        </Stack>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '4px 16px',
            fontFamily: 'monospace',
            fontSize: 12,
          }}>
          {inspectedTokens.map(tokenName => (
            <React.Fragment key={tokenName}>
              <span style={{color: token('--color-text-secondary')}}>
                {tokenName}
              </span>
              <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
                {tokenName.startsWith('--color-') && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      backgroundColor: token(tokenName),
                      border: `1px solid ${token('--color-border-emphasized')}`,
                    }}
                  />
                )}
                <code>{token(tokenName)}</code>
              </span>
            </React.Fragment>
          ))}
        </div>
      </Stack>
    </Card>
  );
}

// =============================================================================
// Custom theme for demonstrating override behavior (copied verbatim)
// =============================================================================

const oceanTheme = defineTheme({
  name: 'ocean',
  tokens: {
    '--color-accent': ['#0077B6', '#48CAE4'],
    '--color-success': ['#2D6A4F', '#52B788'],
    '--color-warning': ['#E76F51', '#F4A261'],
    '--color-background-surface': ['#F0F8FF', '#0A1628'],
    '--color-text-primary': ['#023E8A', '#CAF0F8'],
    '--color-text-secondary': ['#4A7FB5', '#89C2D9'],
    '--color-border': ['#ADE8F433', '#02394A66'],
  },
  typography: {scale: {base: 14, ratio: 1.2}},
});

// =============================================================================
// Stories
// =============================================================================

export const BarChart = () => (
  <Theme theme={localNeutralTheme} mode="light">
    <Stack direction="vertical" gap={4}>
      <Heading level={3}>Weekly Activity</Heading>
      <Card>
        <ThemeAwareBarChart data={CHART_DATA} />
      </Card>
    </Stack>
  </Theme>
);

export const BarChartDark = () => (
  <Theme theme={localNeutralTheme} mode="dark">
    <Stack direction="vertical" gap={4}>
      <Heading level={3}>Weekly Activity</Heading>
      <Card>
        <ThemeAwareBarChart data={CHART_DATA} />
      </Card>
    </Stack>
  </Theme>
);

export const GroupedChart = () => (
  <Theme theme={localNeutralTheme} mode="light">
    <Stack direction="vertical" gap={4}>
      <Heading level={3}>Quarterly Metrics</Heading>
      <Card>
        <ThemeAwareGroupedChart data={MULTI_SERIES} />
      </Card>
    </Stack>
  </Theme>
);

export const ThemeComparison = () => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
    <Theme theme={localNeutralTheme} mode="light">
      <Stack direction="vertical" gap={2}>
        <Heading level={4}>Default Theme</Heading>
        <Card>
          <ThemeAwareGroupedChart data={MULTI_SERIES} width={360} />
        </Card>
      </Stack>
    </Theme>
    <Theme theme={oceanTheme} mode="light">
      <Stack direction="vertical" gap={2}>
        <Heading level={4}>Ocean Theme</Heading>
        <Card>
          <ThemeAwareGroupedChart data={MULTI_SERIES} width={360} />
        </Card>
      </Stack>
    </Theme>
  </div>
);

export const TokenInspectorStory = () => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
    <Theme theme={localNeutralTheme} mode="light">
      <TokenInspector />
    </Theme>
    <Theme theme={oceanTheme} mode="dark">
      <TokenInspector />
    </Theme>
  </div>
);
