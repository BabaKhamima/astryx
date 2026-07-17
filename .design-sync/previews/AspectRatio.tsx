// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as React from 'react';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Text} from '@astryxdesign/core/Text';
import * as S from '@ds-stories/apps/storybook/stories/AspectRatio.stories';

function compose(S: unknown, key: string) {
  const meta: unknown = S.default ?? {};
  const st: unknown = S[key];
  const args: unknown = {
    ...(meta.args ?? {}),
    ...(st && st.args ? st.args : {}),
  };
  const at: unknown = {
    ...(meta.argTypes ?? {}),
    ...(st && st.argTypes ? st.argTypes : {}),
  };
  for (const k of Object.keys(args)) {
    const m = at[k] && at[k].mapping;
    if (m && typeof m === 'object' && args[k] in m) {args[k] = m[args[k]];}
  }
  const title: string = typeof meta.title === 'string' ? meta.title : '';
  const ctx: unknown = {
    args,
    name: key,
    title,
    kind: title,
    id: '',
    componentId: '',
    globals: {},
    viewMode: 'story',
    parameters: (st && st.parameters) ?? meta.parameters ?? {},
  };
  let render: (() => unknown) | null = null;
  if (st && typeof st.render === 'function')
    {render = () => st.render(args, ctx);}
  else if (typeof st === 'function') {render = () => st(args, ctx);}
  else if (typeof meta.render === 'function')
    {render = () => meta.render(args, ctx);}
  else {
    const C = (st && st.component) || meta.component;
    if (C) {render = () => React.createElement(C, args);}
  }
  if (!render) {return () => null;}
  const decorators: unknown[] = ([] as unknown[])
    .concat((st && st.decorators) ?? [])
    .concat(meta.decorators ?? []);
  return decorators.reduce(
    (inner: unknown, dec: unknown) => () => {
      const out = dec(inner, ctx);
      return out === undefined ? inner() : out;
    },
    render,
  );
}

// Default/Widescreen16x9/Classic4x3/Square1x1 use the story's unseeded
// `https://picsum.photos/800/600` / `/400/400` placeholder URLs, which
// picsum serves as a genuinely random image on every request — the
// storybook reference and this preview each get a DIFFERENT photo, which
// looks like a mismatch but is really nondeterministic fixture data (SKILL.md
// §4: "for truly random content, pin values in an owned .tsx"). Inlined here
// with seeded picsum URLs (stable per capture) so both panels can be judged
// on the actual AspectRatio behavior (ratio/crop/radius) instead of on which
// random photo loaded. Plain inline `style` (not stylex) is used for the
// story's demo-only wrapper layout to sidestep the unrelated global
// story-local-stylex-stub issue (see learnings) — the AspectRatio/Text
// components themselves are real package imports, unaffected by that stub.

const containerStyle: React.CSSProperties = {
  padding: 16,
  maxWidth: 600,
};

const smallContainerStyle: React.CSSProperties = {
  padding: 16,
  maxWidth: 300,
};

const imageStyle: React.CSSProperties = {
  borderRadius: 8,
};

export const Default = () => (
  <div style={containerStyle}>
    <Text type="supporting" style={{marginBottom: 8}}>
      16:9 Aspect Ratio (Default)
    </Text>
    <AspectRatio ratio={16 / 9} fit="cover">
      <img
        style={imageStyle}
        src="https://picsum.photos/seed/aspectratio-default/800/600"
        alt="16:9 placeholder"
      />
    </AspectRatio>
  </div>
);

export const Widescreen16x9 = () => (
  <div style={containerStyle}>
    <Text type="supporting" style={{marginBottom: 8}}>
      16:9 - Standard widescreen (YouTube, TV)
    </Text>
    <AspectRatio ratio={16 / 9} fit="cover">
      <img
        style={imageStyle}
        src="https://picsum.photos/seed/aspectratio-widescreen/800/600"
        alt="16:9 widescreen"
      />
    </AspectRatio>
  </div>
);

export const Classic4x3 = () => (
  <div style={containerStyle}>
    <Text type="supporting" style={{marginBottom: 8}}>
      4:3 - Classic TV and photography
    </Text>
    <AspectRatio ratio={4 / 3} fit="cover">
      <img
        style={imageStyle}
        src="https://picsum.photos/seed/aspectratio-classic/800/600"
        alt="4:3 classic"
      />
    </AspectRatio>
  </div>
);

export const Square1x1 = () => (
  <div style={smallContainerStyle}>
    <Text type="supporting" style={{marginBottom: 8}}>
      1:1 - Square (Instagram, avatars)
    </Text>
    <AspectRatio ratio={1} fit="cover">
      <img
        style={imageStyle}
        src="https://picsum.photos/seed/aspectratio-square/400/400"
        alt="1:1 square"
      />
    </AspectRatio>
  </div>
);

// Remaining stories are unaffected by the random-image issue (no photo
// fixture, or already using a seeded URL) — delegate to the story module
// verbatim so any future story edits keep flowing through automatically.
export const Ultrawide21x9 = /* Ultrawide 21 X 9 */ compose(S, 'Ultrawide21x9');
export const EllipseCircle = /* Ellipse Circle */ compose(S, 'EllipseCircle');
export const EllipseOval = /* Ellipse Oval */ compose(S, 'EllipseOval');
export const FitModes = /* Fit Modes */ compose(S, 'FitModes');
export const WithPlaceholderSkeleton = /* With Placeholder Skeleton */ compose(
  S,
  'WithPlaceholderSkeleton',
);
export const ResponsiveGrid = /* Responsive Grid */ compose(
  S,
  'ResponsiveGrid',
);
export const AllRatiosComparison = /* All Ratios Comparison */ compose(
  S,
  'AllRatiosComparison',
);
export const ImageGallery = /* Image Gallery */ compose(S, 'ImageGallery');
