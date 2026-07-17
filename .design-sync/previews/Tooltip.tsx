// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as React from 'react';
import * as S from '@ds-stories/apps/storybook/stories/Tooltip.stories';

function compose(S: unknown, key: string) {
  const meta: unknown = S.default ?? {};
  const st: unknown = S[key];
  const args: unknown = {
    ...(meta.args ?? {}),
    ...(st && st.args ? st.args : {}),
  };
  // Storybook resolves argTypes.mapping (control value -> real arg) before
  // rendering; mirror that so mapped args don't render raw.
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
  // [].concat: a single function is legal CSF decorator shorthand. A
  // decorator returning undefined (stubbed addon) falls through to the inner
  // render — otherwise one unrecognized addon blanks the cell silently.
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

// NOTE: the generated preview also imported
// apps/storybook/stories/charts/Tooltip.stories (a chart-specific Tooltip
// demo unrelated to core's Tooltip, per NOTES.md's known non-blocking
// issue: it pulls in the unresolvable @astryxdesign/charts package). That
// import throws at module load, which failed THIS WHOLE MODULE — turning
// every core Tooltip story into a "fallback preview" (floor card), not just
// the chart one. Dropping the charts import/Default2 export here fixes all
// 6 core Tooltip stories.
export const Default = /* Default */ compose(S, 'Default');
export const Below = /* Below */ compose(S, 'Below');
export const Start = /* Start */ compose(S, 'Start');
export const End = /* End */ compose(S, 'End');
export const CustomDelay = /* Custom Delay */ compose(S, 'CustomDelay');
export const Disabled = /* Disabled Tooltip */ compose(S, 'Disabled');
export const AllPlacements = /* All Placements */ compose(S, 'AllPlacements');
export const WithHook = /* With Hook */ compose(S, 'WithHook');
export const LongContent = /* Long Content */ compose(S, 'LongContent');
export const MultipleTooltips = /* Multiple Tooltips */ compose(
  S,
  'MultipleTooltips',
);
export const TextNode = /* Text Node */ compose(S, 'TextNode');
export const TextNodeInline = /* Text Node Inline */ compose(
  S,
  'TextNodeInline',
);
