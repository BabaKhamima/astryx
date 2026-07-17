// Copyright (c) Meta Platforms, Inc. and affiliates.

import * as React from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Section} from '@astryxdesign/core/Section';
import {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutPanel,
  HStack,
  VStack,
} from '@astryxdesign/core/Layout';
import {Button} from '@astryxdesign/core/Button';
import {AppShell} from '@astryxdesign/core/AppShell';

// Layout.stories.tsx also imports `stoneTheme` from '@astryxdesign/theme-stone'
// (used only by the "Themed Layout (Neutral vs Stone)" story) and
// `neutralTheme` from '@astryxdesign/theme-neutral' (used by that same
// story). Both are sibling theme packages outside this bundle's resolvable
// graph (neither is in cfg.extraEntries, and this converter's preview
// compile restricts node resolution to --node-modules, not a directory-walk
// from the story file — confirmed via a direct esbuild probe: even
// theme-neutral alone fails to resolve under the same nodePaths restriction
// used here). Because those are static ES imports, importing the story
// module AT ALL fails the whole file's compile (previewKind: "fallback",
// all 18 stories showed "unpaired" before this file existed) — not just the
// one story that uses them. Per NOTES.md's documented, already-decided scope
// boundary for Layout/theme-stone (do not pull in extraEntries), this owned
// preview mirrors every OTHER story's JSX directly against the real
// `@astryxdesign/core` exports and drops only "Themed Layout (Neutral vs
// Stone)". See .design-sync/learnings/batch07.md for the extended
// theme-neutral finding (also unresolvable, not just theme-stone/theme-y2k).
//
// Plain inline styles (not stylex) are used for the story's demo-only
// wrapper layout — the Layout/Card/Section/Button/AppShell components
// themselves are real package imports, unaffected either way.

const pageWrapper: React.CSSProperties = {
  height: 500,
  backgroundColor: 'var(--color-background-body)',
  padding: 'var(--spacing-4)',
};
const pageWrapperTall: React.CSSProperties = {...pageWrapper, height: 600};
const storySection: React.CSSProperties = {
  padding: 'var(--spacing-4)',
  backgroundColor: 'var(--color-background-body)',
};
const heading: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-family-body)',
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--color-text-primary)',
};
const subheading: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-family-body)',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
};
const bodyText: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-family-body)',
  fontSize: 14,
  lineHeight: 1.5,
  color: 'var(--color-text-secondary)',
};
const navItem: React.CSSProperties = {
  padding: 'var(--spacing-2) var(--spacing-3)',
  borderRadius: 6,
  cursor: 'pointer',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-body)',
  fontSize: 14,
};
const navItemActive: React.CSSProperties = {
  backgroundColor: 'var(--color-accent-muted)',
  color: 'var(--color-text-accent)',
};
const placeholder: React.CSSProperties = {
  backgroundColor: 'var(--color-background-gray)',
  borderRadius: 8,
  padding: 'var(--spacing-4)',
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-family-body)',
  fontSize: 14,
};
const placeholderFullBleed: React.CSSProperties = {
  ...placeholder,
  borderRadius: undefined,
  minHeight: 100,
};
const sectionLabel: React.CSSProperties = {
  margin: '0 0 var(--spacing-2) 0',
  fontFamily: 'var(--font-family-body)',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-secondary)',
};
const demoContainer: React.CSSProperties = {
  backgroundColor: 'var(--color-background-card)',
  borderRadius: 'var(--radius-container)',
  boxShadow: 'var(--shadow-low)',
};
const demoSize: React.CSSProperties = {width: 300, height: 220};
const cwContainer: React.CSSProperties = {
  border: '2px dashed',
  borderColor: 'var(--color-border)',
  borderRadius: 'var(--radius-container)',
  overflow: 'hidden',
};

function NavItem({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={active ? {...navItem, ...navItemActive} : navItem}>
      {children}
    </div>
  );
}

export const Playground = () => (
  <div style={pageWrapper}>
    <Card width={700} height={400}>
      <Layout
        padding={4}
        header={
          <LayoutHeader hasDivider padding={4}>
            <h3 style={heading}>Layout Header</h3>
          </LayoutHeader>
        }
        start={
          <LayoutPanel width={160} hasDivider isScrollable role="navigation">
            <NavItem active>Dashboard</NavItem>
            <NavItem>Settings</NavItem>
            <NavItem>Profile</NavItem>
            <NavItem>Help</NavItem>
          </LayoutPanel>
        }
        content={
          <LayoutContent padding={4} isScrollable>
            <h4 style={subheading}>Main Content Area</h4>
            <br />
            <p style={bodyText}>
              This is the main content area. Use the controls panel to toggle
              headers, footers, side panels, and adjust their properties.
            </p>
            <br />
            <p style={bodyText}>
              Try setting padding to 0 to see how content can extend to the
              edges, or toggle &quot;isScrollable&quot; to change overflow
              behavior.
            </p>
            <br />
            <div style={placeholder}>Placeholder content block</div>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider padding={4}>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary">
                Cancel
              </Button>
              <Button label="Save" variant="primary">
                Save
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  </div>
);

export const BasicCard = () => (
  <div style={pageWrapper}>
    <Card width={400} height={350}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <h3 style={heading}>Card Title</h3>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p style={bodyText}>
              This is a basic card layout with a header, scrollable content
              area, and footer. The layout automatically handles padding and
              spacing between sections.
            </p>
            <br />
            <p style={bodyText}>
              Try scrolling this content area when it overflows.
            </p>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary">
                Cancel
              </Button>
              <Button label="Save" variant="primary">
                Save
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  </div>
);

export const WithSidebar = () => (
  <div style={pageWrapper}>
    <Card width={700} height={400}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <h3 style={heading}>Settings</h3>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider role="navigation">
            <NavItem active>General</NavItem>
            <NavItem>Account</NavItem>
            <NavItem>Privacy</NavItem>
            <NavItem>Notifications</NavItem>
            <NavItem>Security</NavItem>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <h4 style={subheading}>General Settings</h4>
            <br />
            <p style={bodyText}>
              Configure your general preferences here. The sidebar navigation
              allows you to switch between different settings sections.
            </p>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} hAlign="end">
              <Button label="Reset" variant="secondary">
                Reset
              </Button>
              <Button label="Save Changes" variant="primary">
                Save Changes
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  </div>
);

export const DualPanels = () => (
  <div style={{...pageWrapper, ...pageWrapperTall}}>
    <Card width="100%" maxWidth={800} height={400}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <h3 style={heading}>File Browser</h3>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider>
            <p style={sectionLabel}>Folders</p>
            <NavItem>Documents</NavItem>
            <NavItem active>Projects</NavItem>
            <NavItem>Downloads</NavItem>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <p style={sectionLabel}>Files</p>
            <div style={placeholder}>Select a folder to view its contents</div>
          </LayoutContent>
        }
        end={
          <LayoutPanel hasDivider>
            <p style={sectionLabel}>Details</p>
            <p style={bodyText}>Select a file to view details</p>
          </LayoutPanel>
        }
      />
    </Card>
  </div>
);

export const NoDividers = () => (
  <div style={pageWrapper}>
    <Card width={400} height={350}>
      <Layout
        header={
          <LayoutHeader>
            <h3 style={heading}>Seamless Layout</h3>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p style={bodyText}>
              When dividers are not used, the layout automatically collapses
              spacing between sections for a smooth visual flow.
            </p>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Continue" variant="primary">
                Continue
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  </div>
);

export const FullBleedContent = () => (
  <div style={pageWrapper}>
    <Card width={400} height={350}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <h3 style={heading}>Full Bleed Example</h3>
          </LayoutHeader>
        }
        content={
          <LayoutContent padding={0}>
            <div style={placeholderFullBleed}>
              This content uses padding=0 to remove padding, allowing it to
              touch the edges. Useful for tables, images, or other edge-to-edge
              content.
            </div>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} hAlign="end">
              <Button label="Close" variant="secondary">
                Close
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  </div>
);

export const SectionVariants = () => (
  <VStack gap={6} style={storySection}>
    <p style={sectionLabel}>Section Variants</p>
    <HStack gap={4} wrap="wrap">
      <Section variant="section" width={300} height={250}>
        <Layout
          header={
            <LayoutHeader hasDivider>
              <p style={subheading}>Section</p>
            </LayoutHeader>
          }
          content={
            <LayoutContent>
              <p style={bodyText}>Surface background color</p>
            </LayoutContent>
          }
        />
      </Section>
      <Section variant="muted" width={300} height={250}>
        <Layout
          header={
            <LayoutHeader hasDivider>
              <p style={subheading}>Wash</p>
            </LayoutHeader>
          }
          content={
            <LayoutContent>
              <p style={bodyText}>Wash background color</p>
            </LayoutContent>
          }
        />
      </Section>
      <Section variant="transparent" width={300} height={250}>
        <Layout
          header={
            <LayoutHeader hasDivider>
              <p style={subheading}>Transparent</p>
            </LayoutHeader>
          }
          content={
            <LayoutContent>
              <p style={bodyText}>No background, shows parent</p>
            </LayoutContent>
          }
        />
      </Section>
    </HStack>
  </VStack>
);

export const ContentOnly = () => (
  <div style={pageWrapper}>
    <Card width={400} height={350}>
      <Layout
        content={
          <LayoutContent>
            <h3 style={heading}>Simple Content</h3>
            <br />
            <p style={bodyText}>
              A layout can have just content without header or footer. This is
              useful for simple cards or content blocks.
            </p>
          </LayoutContent>
        }
      />
    </Card>
  </div>
);

export const OuterPaddingDemo = () => (
  <VStack gap={6} style={storySection}>
    <p style={sectionLabel}>Outer Padding</p>
    <p style={bodyText}>
      Outer padding creates space between the container edge and the layout
      content. Notice how the dividers are inset from the container edges as
      outer padding increases.
    </p>
    <HStack gap={4} wrap="wrap">
      <VStack gap={2}>
        <p style={subheading}>paddingOuterX/Y = spacing0</p>
        <div style={{...demoContainer, ...demoSize, padding: 0}}>
          <Layout
            header={
              <LayoutHeader hasDivider>
                <p style={subheading}>Header</p>
              </LayoutHeader>
            }
            content={
              <LayoutContent>
                <p style={bodyText}>Dividers touch container edges.</p>
              </LayoutContent>
            }
            footer={
              <LayoutFooter hasDivider>
                <p style={bodyText}>Footer</p>
              </LayoutFooter>
            }
          />
        </div>
      </VStack>
      <VStack gap={2}>
        <p style={subheading}>paddingOuterX/Y = spacing4</p>
        <div
          style={{...demoContainer, ...demoSize, padding: 'var(--spacing-4)'}}>
          <Layout
            header={
              <LayoutHeader hasDivider>
                <p style={subheading}>Header</p>
              </LayoutHeader>
            }
            content={
              <LayoutContent>
                <p style={bodyText}>16px inset from edges.</p>
              </LayoutContent>
            }
            footer={
              <LayoutFooter hasDivider>
                <p style={bodyText}>Footer</p>
              </LayoutFooter>
            }
          />
        </div>
      </VStack>
      <VStack gap={2}>
        <p style={subheading}>paddingOuterX/Y = spacing7</p>
        <div
          style={{
            ...demoContainer,
            ...demoSize,
            padding: 'var(--spacing-7, 28px)',
          }}>
          <Layout
            header={
              <LayoutHeader hasDivider>
                <p style={subheading}>Header</p>
              </LayoutHeader>
            }
            content={
              <LayoutContent>
                <p style={bodyText}>48px inset from edges.</p>
              </LayoutContent>
            }
            footer={
              <LayoutFooter hasDivider>
                <p style={bodyText}>Footer</p>
              </LayoutFooter>
            }
          />
        </div>
      </VStack>
    </HStack>
  </VStack>
);

export const ContentWidthWithDividers = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=640 in a 900px container; dividers remain full-bleed while
      content is constrained
    </p>
    <div style={{...cwContainer, width: 900}}>
      <Layout
        contentWidth={640}
        defaultHasDividers
        header={
          <LayoutHeader>
            <h3 style={heading}>Header</h3>
            <p style={bodyText}>Header content is constrained to 640px</p>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p style={bodyText}>
              Main content is constrained to 640px and centered. The dividers
              above and below span the full width of the container.
            </p>
            <br />
            <div style={placeholder}>Placeholder content block</div>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Cancel" variant="secondary">
                Cancel
              </Button>
              <Button label="Save" variant="primary">
                Save
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </div>
  </VStack>
);

export const ContentWidthWithStartPanel = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=640 with a 200px start panel: the middle row (panel +
      content) is constrained
    </p>
    <div style={{...cwContainer, width: 900}}>
      <Layout
        contentWidth={640}
        defaultHasDividers
        header={
          <LayoutHeader>
            <h3 style={heading}>Settings</h3>
          </LayoutHeader>
        }
        start={
          <LayoutPanel width={200} hasDivider role="navigation">
            <NavItem active>General</NavItem>
            <NavItem>Account</NavItem>
            <NavItem>Privacy</NavItem>
            <NavItem>Notifications</NavItem>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <h4 style={subheading}>General Settings</h4>
            <br />
            <p style={bodyText}>
              The start panel and content area together are constrained to 640px
              and centered within the container.
            </p>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Save Changes" variant="primary">
                Save Changes
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </div>
  </VStack>
);

export const ContentWidthWithBothPanels = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=800 with start=200 and end=200 panels in a 1200px container
    </p>
    <div style={{...cwContainer, width: 1200}}>
      <Layout
        contentWidth={800}
        defaultHasDividers
        header={
          <LayoutHeader>
            <h3 style={heading}>File Browser</h3>
          </LayoutHeader>
        }
        start={
          <LayoutPanel width={200} hasDivider>
            <p style={sectionLabel}>Folders</p>
            <NavItem>Documents</NavItem>
            <NavItem active>Projects</NavItem>
            <NavItem>Downloads</NavItem>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <p style={sectionLabel}>Files</p>
            <div style={placeholder}>Select a folder to view its contents</div>
          </LayoutContent>
        }
        end={
          <LayoutPanel width={200} hasDivider>
            <p style={sectionLabel}>Details</p>
            <p style={bodyText}>Select a file to view details</p>
          </LayoutPanel>
        }
        footer={
          <LayoutFooter>
            <p style={bodyText}>3 items</p>
          </LayoutFooter>
        }
      />
    </div>
  </VStack>
);

export const ContentWidthNoDividers = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=640 without dividers: constraint works the same
    </p>
    <div style={{...cwContainer, width: 900}}>
      <Layout
        contentWidth={640}
        header={
          <LayoutHeader>
            <h3 style={heading}>Seamless Layout</h3>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p style={bodyText}>
              Even without dividers, the content is constrained to 640px and
              centered. The visual flow is continuous with no divider lines.
            </p>
            <br />
            <div style={placeholder}>Placeholder content block</div>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Continue" variant="primary">
                Continue
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </div>
  </VStack>
);

export const ContentWidthNarrower = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=400 in a 900px container: content is visibly centered
    </p>
    <div style={{...cwContainer, width: 900}}>
      <Layout
        contentWidth={400}
        defaultHasDividers
        header={
          <LayoutHeader>
            <h3 style={heading}>Narrow Content</h3>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p style={bodyText}>
              This content is constrained to 400px inside a 900px container.
              Notice the visible centering, great for focused forms or settings
              pages.
            </p>
            <br />
            <div style={placeholder}>Narrow placeholder block</div>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Submit" variant="primary">
                Submit
              </Button>
            </HStack>
          </LayoutFooter>
        }
      />
    </div>
  </VStack>
);

export const ContentWidthWider = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=2000 in a 350px container, degrades gracefully to 100%
    </p>
    <div style={{...cwContainer, width: 350}}>
      <Layout
        contentWidth={2000}
        defaultHasDividers
        header={
          <LayoutHeader>
            <h3 style={heading}>Overflow</h3>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p style={bodyText}>
              The contentWidth is 2000px but the container is only 350px. The
              content fills 100% of the available space, with no overflow or
              scrollbar.
            </p>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <p style={bodyText}>Footer</p>
          </LayoutFooter>
        }
      />
    </div>
  </VStack>
);

export const ContentWidthResponsive = () => (
  <VStack gap={6} style={storySection}>
    <p style={sectionLabel}>
      contentWidth=640 with a start panel at three container widths — 1000px,
      640px, and 400px
    </p>
    <HStack gap={4} wrap="wrap">
      <VStack gap={2}>
        <p style={subheading}>1000px container</p>
        <div style={{...cwContainer, width: 1000}}>
          <Layout
            contentWidth={640}
            defaultHasDividers
            header={
              <LayoutHeader>
                <h3 style={heading}>Wide</h3>
              </LayoutHeader>
            }
            start={
              <LayoutPanel width={160} hasDivider role="navigation">
                <NavItem active>Dashboard</NavItem>
                <NavItem>Settings</NavItem>
              </LayoutPanel>
            }
            content={
              <LayoutContent>
                <p style={bodyText}>Content is centered with room to spare.</p>
              </LayoutContent>
            }
            footer={
              <LayoutFooter>
                <p style={bodyText}>Footer</p>
              </LayoutFooter>
            }
          />
        </div>
      </VStack>
      <VStack gap={2}>
        <p style={subheading}>640px container</p>
        <div style={{...cwContainer, width: 640}}>
          <Layout
            contentWidth={640}
            defaultHasDividers
            header={
              <LayoutHeader>
                <h3 style={heading}>Medium</h3>
              </LayoutHeader>
            }
            start={
              <LayoutPanel width={160} hasDivider role="navigation">
                <NavItem active>Dashboard</NavItem>
                <NavItem>Settings</NavItem>
              </LayoutPanel>
            }
            content={
              <LayoutContent>
                <p style={bodyText}>Content fills the available space.</p>
              </LayoutContent>
            }
            footer={
              <LayoutFooter>
                <p style={bodyText}>Footer</p>
              </LayoutFooter>
            }
          />
        </div>
      </VStack>
      <VStack gap={2}>
        <p style={subheading}>400px container</p>
        <div style={{...cwContainer, width: 400}}>
          <Layout
            contentWidth={640}
            defaultHasDividers
            header={
              <LayoutHeader>
                <h3 style={heading}>Narrow</h3>
              </LayoutHeader>
            }
            start={
              <LayoutPanel width={160} hasDivider role="navigation">
                <NavItem active>Dashboard</NavItem>
                <NavItem>Settings</NavItem>
              </LayoutPanel>
            }
            content={
              <LayoutContent>
                <p style={bodyText}>Degrades to 100%.</p>
              </LayoutContent>
            }
            footer={
              <LayoutFooter>
                <p style={bodyText}>Footer</p>
              </LayoutFooter>
            }
          />
        </div>
      </VStack>
    </HStack>
  </VStack>
);

export const ContentWidthInAppShell = () => (
  <VStack gap={4} style={storySection}>
    <p style={sectionLabel}>
      Layout with contentWidth=640 nested inside an AppShell
    </p>
    <div style={{...cwContainer, width: 900}}>
      <AppShell height="auto">
        <Layout
          contentWidth={640}
          defaultHasDividers
          header={
            <LayoutHeader>
              <h3 style={heading}>App Shell + Content Width</h3>
            </LayoutHeader>
          }
          content={
            <LayoutContent>
              <p style={bodyText}>
                This layout is nested inside an AppShell. The contentWidth
                constraint applies to the inner layout while the app shell
                provides the outer structure.
              </p>
              <br />
              <div style={placeholder}>Placeholder content block</div>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack gap={2} hAlign="end">
                <Button label="Cancel" variant="secondary">
                  Cancel
                </Button>
                <Button label="Save" variant="primary">
                  Save
                </Button>
              </HStack>
            </LayoutFooter>
          }
        />
      </AppShell>
    </div>
  </VStack>
);
