// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as React from 'react';
import {
  MediaTheme,
  defineTheme,
  Theme,
  Button,
  Link,
  Text,
  Badge,
  Icon,
  Stack,
} from '@astryxdesign/core';

// MediaTheme.stories.tsx also imports `neutralTheme` from
// '@astryxdesign/theme-neutral' (used by "On Light" and "Across Themes") and
// `y2kTheme` from '@astryxdesign/theme-y2k' (used by "Component Override
// Boundary" and "Across Themes"). Both are sibling theme packages outside
// this bundle's resolvable graph (neither is in cfg.extraEntries, and this
// converter's preview compile restricts node resolution to --node-modules,
// not a directory-walk from the story file — confirmed via a direct esbuild
// probe: theme-neutral alone fails to resolve under the same nodePaths
// restriction used here, same as theme-y2k/theme-stone). Because those are
// static ES imports, importing the story module AT ALL fails the whole
// file's compile (previewKind: "fallback", all 8 stories showed "unpaired"
// before this file existed) — not just the story that uses them. Per
// NOTES.md's documented, already-decided scope boundary for
// MediaTheme/theme-y2k (do not pull in extraEntries), this owned preview
// mirrors the OTHER stories' JSX directly against the real
// `@astryxdesign/core` exports and drops "On Light", "Component Override
// Boundary", and "Across Themes" (all three need theme-neutral and/or
// theme-y2k — wider than NOTES.md's "exactly one story" note; see
// .design-sync/learnings/batch07.md). "Auto Detect From Image" and
// "Regional Detection" (useImageMode + remote images) are outside the
// default 6-story compare cap and are also omitted here for scope.
//
// Plain inline styles (React.CSSProperties) mirror the story's inline
// `style={{...}}` usage verbatim — the story never used stylex for its own
// wrapper layout, so no conversion was needed there.

function OnDarkDemo() {
  return (
    <div
      style={{
        backgroundColor:
          'var(--color-surface-inverted, light-dark(#0A1317, #FFFFFF))',
        borderRadius: 'var(--radius-container)',
        padding: 16,
      }}>
      <MediaTheme mode="dark">
        <Stack gap={3}>
          <Text>
            Content on a dark surface: text, icons, and interactive elements
            automatically adapt.
          </Text>
          <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
            <Button label="Primary" />
            <Button label="Secondary" variant="secondary" />
            <Button label="Ghost" variant="ghost" />
            <Link href="#" hasUnderline>
              A link
            </Link>
          </Stack>
          <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
            <Badge label="Badge" />
            <Icon icon="info" size="md" />
            <Icon icon="success" size="md" />
          </Stack>
        </Stack>
      </MediaTheme>
    </div>
  );
}

export const OnDark = () => <OnDarkDemo />;

function ToastDemo() {
  return (
    <Stack gap={3}>
      {/* Info toast */}
      <div
        style={{
          backgroundColor:
            'var(--color-surface-inverted, light-dark(#0A1317, #FFFFFF))',
          borderRadius: 'var(--radius-container)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-med)',
          maxWidth: 400,
          width: '100%',
        }}>
        <MediaTheme mode="dark">
          <Stack direction="horizontal" gap={3} align="center" wrap="wrap">
            <Text style={{flex: 1}}>Changes saved successfully.</Text>
            <Button label="Undo" variant="secondary" size="sm" />
            <Button
              label="Dismiss"
              variant="ghost"
              size="sm"
              icon={<Icon icon="close" size="sm" />}
              isIconOnly
            />
          </Stack>
        </MediaTheme>
      </div>
      {/* Error toast */}
      <div
        style={{
          backgroundColor:
            'var(--color-error-inverted, light-dark(#AA071E, #E3193B))',
          borderRadius: 'var(--radius-container)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-med)',
          maxWidth: 400,
          width: '100%',
        }}>
        <MediaTheme mode="dark">
          <Stack direction="horizontal" gap={3} align="center" wrap="wrap">
            <Text style={{flex: 1}}>
              Failed to save. Check your connection.
            </Text>
            <Button
              label="Dismiss"
              variant="ghost"
              size="sm"
              icon={<Icon icon="close" size="sm" />}
              isIconOnly
            />
          </Stack>
        </MediaTheme>
      </div>
    </Stack>
  );
}

export const ToastExample = () => <ToastDemo />;

const customTheme = defineTheme({
  name: 'custom-media',
  tokens: {
    '--color-accent': ['#7C3AED', '#A78BFA'],
  },
  onDark: {
    tokens: {
      // Custom: use a tinted accent color on dark surfaces instead of white
      '--color-accent': '#C4B5FD',
      '--color-text-accent': '#C4B5FD',
    },
  },
});

function CustomOverridesDemo() {
  return (
    <Theme theme={customTheme}>
      <Stack gap={3}>
        <Text>
          This theme has a custom <code>onDark</code> config; the accent color
          on dark surfaces is a lighter purple instead of plain white.
        </Text>
        <div
          style={{
            backgroundColor:
              'var(--color-surface-inverted, light-dark(#0A1317, #FFFFFF))',
            borderRadius: 'var(--radius-container)',
            padding: 16,
          }}>
          <MediaTheme mode="dark">
            <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
              <Button label="Accent button" />
              <Button label="Secondary" variant="secondary" />
              <Link href="#" hasUnderline>
                Accent link
              </Link>
            </Stack>
          </MediaTheme>
        </div>
      </Stack>
    </Theme>
  );
}

export const CustomOverrides = () => <CustomOverridesDemo />;
