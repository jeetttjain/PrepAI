---
name: PrepAI Admin
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  table-header:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 1.5rem
  margin-x: 2rem
  stack-xs: 0.25rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system for the administrative environment evolves the core PrepAI identity into a high-density, performance-oriented command center. It targets technical operators and system administrators who require real-time oversight of AI inference loads, user seat management, and system health.

The visual style is **Glassmorphism**, refined for professional utility. It utilizes deep layered translucency to maintain context while surfacing critical data. The emotional response is one of "command and control"—sophisticated, high-tech, and incredibly precise. Large background blurs of the signature blue/purple gradients persist, but they are disciplined by structural grids and sharp data visualization.

## Colors
The palette is rooted in a `dark` mode environment to reduce eye strain during long monitoring sessions. 

- **Primary & Secondary:** A vibrant gradient of Indigo and Purple is used for active states, primary actions, and branding elements.
- **Surface:** The base neutral is a deep Navy (#0F172A), used as the foundation for glass layers.
- **Utility Palette:** High-chroma colors are introduced for system health. These must meet AA contrast ratios against the dark translucent backgrounds. 
  - **Success:** Emerald green for stable AI nodes.
  - **Warning:** Amber for throttled services or high latency.
  - **Error:** Rose red for system outages or failed payments.

## Typography
This design system utilizes **Geist** for its technical precision and exceptional legibility in dense layouts. For system-critical data, logs, and ID strings, **JetBrains Mono** is employed to provide a clear distinction between prose and programmatic data.

For the Admin environment, font sizes are slightly reduced (14px base) compared to consumer interfaces to accommodate the increased data density required for monitoring dashboards.

## Layout & Spacing
The layout follows a **Fixed Grid** model for the main dashboard content to ensure data visualizations maintain their aspect ratios and readability. 

- **Sidebar:** A narrow, collapsed-by-default navigation rail (72px) or expanded (240px) translucent sidebar.
- **Main Content:** A 12-column grid with a 1440px max-width, centered in the viewport.
- **Density:** Spacing is tightened in the admin view. Use `stack-sm` (8px) for related input groups and `stack-xs` (4px) for table cell padding to maximize information density.
- **Responsive:** On tablet, the grid shifts to 8 columns; on mobile, it stacks into a single column with horizontal scrolling enabled specifically for data tables.

## Elevation & Depth
Depth is created through **Glassmorphism** and tonal stacking rather than heavy shadows.

- **Level 0 (Base):** Deep Navy background with subtle radial gradients of primary/secondary colors.
- **Level 1 (Cards/Tables):** Semi-transparent surface (10% white opacity) with a 20px backdrop blur and a 1px thin border (15% white opacity).
- **Level 2 (Modals/Popovers):** Higher opacity (20% white) with a 40px backdrop blur and a subtle 48px outer glow using the primary color at 5% opacity.
- **Indicators:** System health status uses a "pulse" animation—a soft, breathing outer glow in the corresponding status color to draw immediate attention without cluttering the UI.

## Shapes
The shape language is **Soft**, utilizing a consistent 0.25rem (4px) radius for most UI components like table rows, input fields, and small buttons. This creates a geometric, professional aesthetic that feels more "engineered" than the consumer-facing interface. Large containers and dashboard cards use `rounded-lg` (8px) to provide a clear structural frame.

## Components
- **Data Tables:** High-density rows (40px height). Header cells use `table-header` typography with subtle sort icons. Row hover states should increase backdrop-filter strength rather than changing background color significantly.
- **Status Badges:** Small, pill-shaped indicators. Use a subtle background tint of the status color with high-contrast text. For "Critical" errors, include a 2px solid border in the status color.
- **AI Monitoring Charts:** Line and Area charts using the primary/secondary gradient for the stroke. Grid lines should be faint (5% white opacity). Use JetBrains Mono for all axis labels.
- **Action Buttons:** Primary buttons use a linear gradient (Primary to Secondary). Secondary buttons use the "Ghost" style—1px border with no fill, becoming semi-transparent on hover.
- **Search/Filters:** Integrated into the table header area. Input fields are dark, translucent boxes with 1px borders that glow primary-blue on focus.
- **User Management:** List items featuring avatars with a "status ring" indicating current AI activity or session state.