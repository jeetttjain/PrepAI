---
name: Sophisticated Utility
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c7c4d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#918f9f'
  outline-variant: '#464554'
  surface-tint: '#c2c1ff'
  primary: '#c2c1ff'
  on-primary: '#1c0b9f'
  primary-container: '#5856d6'
  on-primary-container: '#e7e4ff'
  inverse-primary: '#4f4ccd'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffb785'
  on-tertiary: '#502500'
  tertiary-container: '#a25100'
  on-tertiary-container: '#ffe1cf'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c2c1ff'
  on-primary-fixed: '#0c006a'
  on-primary-fixed-variant: '#3631b4'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb785'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-code:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is rooted in the philosophy of "Sophisticated Utility." It is tailored for high-end SaaS environments where clarity, speed, and precision are paramount. The aesthetic is strictly minimalist, stripping away decorative gradients and soft shadows in favor of structural integrity and high-contrast legibility.

The target audience consists of power users, developers, and data-driven professionals who value a tool that feels like a precision instrument. The emotional response should be one of calm focus and controlled authority. By utilizing a monochromatic dark foundation with sharp, intentional accents, the UI recedes to the background, allowing the user's data to become the primary visual hero.

## Colors

The palette is built on a deep monochromatic foundation. The primary background is a true black to maximize contrast and reduce eye strain in professional environments. 

- **Primary:** A vivid violet-blue used sparingly for focus states and primary calls to action.
- **Secondary/Surface:** Shades of charcoal and obsidian are used for layering and surface differentiation.
- **Text:** Pure white (#FFFFFF) for headers and high-emphasis content; silver-gray (#A1A1AA) for secondary labels and metadata.
- **Accents:** High-contrast white is the default for most interactive elements to maintain a "clinical" feel, while subtle blue-violet tones signal intent.
- **Borders:** A consistent "Stroke" color of #262626 is used for all 1px dividers and component outlines.

## Typography

The typography utilizes **Geist**, a typeface designed for precision and technical applications. The type scale is optimized for high information density without sacrificing readability.

Headlines use tighter tracking and heavier weights to create a strong visual anchor. Body text is set with generous line heights to ensure long-form data remains digestible. For technical strings or data values, a mono-variant of the font is employed to signify "system-level" information. All labels in the system follow a strict hierarchy: uppercase for structural navigation and sentence case for descriptive metadata.

## Layout & Spacing

This design system employs a **12-column fixed grid** for desktop, centering the content to maintain focus. For data-heavy dashboards, a fluid layout option is available, utilizing 24px gutters.

The spacing rhythm is based on a 4px baseline grid. 
- **Desktop (1440px+):** 12 columns, 24px gutters, 64px max margins.
- **Tablet (768px - 1024px):** 8 columns, 16px gutters, 32px margins.
- **Mobile (<768px):** 4 columns, 16px gutters, 16px margins.

Whitespace is used aggressively to separate functional blocks. Rather than using background colors to group elements, the system relies on generous margins (24px - 48px) to create logical divisions.

## Elevation & Depth

In keeping with the minimalist SaaS aesthetic, the design system avoids traditional drop shadows. Depth is achieved through **Tonal Layering** and **1px Borders**.

- **Level 0 (Base):** #000000. The foundational canvas.
- **Level 1 (Surface):** #0A0A0A. Used for cards and secondary panels, defined by a 1px border (#262626).
- **Level 2 (Popovers/Modals):** #171717. Elevated elements use a slightly lighter background and a crisp 1px white border at 10% opacity to simulate light catching the edge.

There are no blurs or frosted glass effects. Every layer is opaque and clearly defined by its geometric boundary.

## Shapes

The shape language is strictly geometric and architectural. A base corner radius of **4px (Soft)** is applied to all interactive elements to provide a hint of approachability while maintaining a sharp, professional edge.

- **Small Components (Buttons, Inputs):** 4px.
- **Containers (Cards, Modals):** 6px.
- **Data Visualizations:** 0px (sharp) to emphasize mathematical precision.

Icons must be stroke-based with a consistent 1.5px or 2px weight, matching the "fine line" aesthetic of the component borders.

## Components

### Buttons
- **Primary:** Solid White background with Black text. No shadow. 4px radius.
- **Secondary:** Ghost style. 1px border (#262626) with White text. Hover state: Background changes to #171717.
- **Action:** Subtle Blue/Violet text on transparent background for inline actions.

### Input Fields
Inputs are defined by a 1px border (#262626) and a #0A0A0A background. On focus, the border transitions to White or the primary accent color. Placeholders are set in #525252.

### Chips & Tags
Small, 4px rounded containers with a #171717 background and #A1A1AA text. Used for status indicators and filtering.

### Cards
Cards are flat containers. They do not use shadows. They are distinguished from the background solely by a 1px border and a slightly elevated surface color (#0A0A0A).

### Lists & Tables
Rows are separated by 1px horizontal dividers (#262626). Interactive rows use a #0A0A0A hover state. Table headers are set in the `label-caps` typography style for maximum clarity.