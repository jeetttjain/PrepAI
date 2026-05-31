---
name: Lumina Synth
colors:
  surface: '#141317'
  surface-dim: '#141317'
  surface-bright: '#3a383d'
  surface-container-lowest: '#0f0e11'
  surface-container-low: '#1c1b1f'
  surface-container: '#201f23'
  surface-container-high: '#2b292d'
  surface-container-highest: '#363438'
  on-surface: '#e6e1e6'
  on-surface-variant: '#cac4ce'
  inverse-surface: '#e6e1e6'
  inverse-on-surface: '#313034'
  outline: '#948f98'
  outline-variant: '#49454d'
  surface-tint: '#cec0ec'
  primary: '#cec0ec'
  on-primary: '#352b4e'
  primary-container: '#978ab4'
  on-primary-container: '#2e2447'
  inverse-primary: '#64587f'
  secondary: '#ccc2dc'
  on-secondary: '#332d41'
  secondary-container: '#4a4358'
  on-secondary-container: '#bab1ca'
  tertiary: '#ebb7db'
  on-tertiary: '#482440'
  tertiary-container: '#966989'
  on-tertiary-container: '#11000e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cec0ec'
  on-primary-fixed: '#1f1538'
  on-primary-fixed-variant: '#4c4166'
  secondary-fixed: '#e9def8'
  secondary-fixed-dim: '#ccc2dc'
  on-secondary-fixed: '#1e182b'
  on-secondary-fixed-variant: '#4a4358'
  tertiary-fixed: '#ffd7f0'
  tertiary-fixed-dim: '#ebb7db'
  on-tertiary-fixed: '#300f2a'
  on-tertiary-fixed-variant: '#613a57'
  background: '#141317'
  on-background: '#e6e1e6'
  surface-variant: '#363438'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 60px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  section-padding-desktop: 120px
  section-padding-mobile: 64px
---

## Brand & Style
The brand personality is visionary, high-velocity, and premium. It targets a sophisticated tech audience seeking the "next generation" of AI interaction. The design system evokes a sense of infinite computational depth through a **Hyper-Modern Glassmorphism** style. 

The UI features deep, atmospheric backgrounds punctuated by muted, sophisticated light sources. We utilize high-translucency layers, multi-layered backdrop blurs, and luminous perimeter strokes to simulate holographic interfaces. The emotional response is one of awe, precision, and frictionless intelligence.

## Colors
The palette is rooted in a deep, desaturated neutral base to provide a sophisticated foundation for the tonal accent system. Transitioning from high-vibrancy to a **Tonal Spot** approach, the colors are now more integrated and atmospheric.

- **Primary:** Muted Lavender-Slate, used for high-importance actions and focal points with a refined, professional glow.
- **Secondary:** Dusty Periwinkle-Grey, used for success states, data visualizations, and secondary accents.
- **Surface:** Deep tonal neutrals that maintain a "cool" yet grounded temperature.
- **Glows:** Every interactive element or container border should utilize subtle glow tokens that reflect these more muted, tonal hues to simulate soft light emission in a dark environment.

## Typography
The system employs a "Premium SaaS" typographic hierarchy. **Plus Jakarta Sans** provides a modern, slightly geometric feel for headlines, utilizing tight tracking (-0.02em to -0.04em) to create a high-impact, editorial look. 

**Inter** handles body copy with an increased line-height (1.6x - 1.7x) to ensure maximum readability against dark, translucent backgrounds. **JetBrains Mono** is used sparingly for labels, tags, and technical metadata to reinforce the "Synthetic Intelligence" narrative.

## Layout & Spacing
The design system utilizes a 12-column fluid grid for desktop and a single-column layout for mobile. 

- **Breathing Room:** Use aggressive vertical padding between sections (120px+) to allow the "Floating Blobs" and background gradients to occupy space without cluttering content.
- **Rhythm:** All spacing is based on an 8px base unit. 
- **Margins:** Desktop containers use 40px side margins; mobile uses 20px. 
- **Reflow:** On mobile, large display text should scale down aggressively while maintaining its bold weight and tight tracking.

## Elevation & Depth
Depth is created through **Layered Glassmorphism** rather than traditional shadows.

1.  **Background Layer:** Deep neutral base with "Floating Blobs"—large, low-opacity blurred circles of Muted Lavender and Dust Grey (#7D7199 and #7B738A at 10% opacity) that move slowly or sit static behind content.
2.  **Mid Layer:** Surface cards with `backdrop-filter: blur(20px)` and a background of `rgba(255, 255, 255, 0.02)`.
3.  **Border Glows:** Instead of drop shadows, cards use a 1px solid border with a linear gradient (top-left to bottom-right) from White (10% opacity) to Transparent. High-priority cards use the Primary Tonal gradient for the border.
4.  **Interactive State:** On hover, the blur intensity increases and the border glow becomes more pronounced using a subtle tonal primary glow.

## Shapes
The shape language is "Soft-Modern." All primary containers, cards, and input fields use a 0.5rem (8px) radius. Buttons and decorative tags use a fully pill-shaped (rounded-full) geometry to provide a friendly, accessible contrast to the technical grid. Interactive elements should feel like smooth, machined glass.

## Components
- **Buttons:** Primary buttons use a tonal primary background with white text and a soft lavender glow effect on hover. Secondary buttons are "ghost" style with a thin secondary-grey border and backdrop blur.
- **Glass Cards:** Feature a `backdrop-filter: blur(24px)`, a 1px border (`rgba(255,255,255,0.08)`), and a subtle inner shadow to simulate thickness.
- **Floating Blobs:** Non-semantic decorative elements. Large (400px-600px), soft-edged circles with 100px+ blur radius using desaturated tones placed behind key content sections.
- **Input Fields:** Dark, semi-transparent backgrounds with a 1px bottom border that transforms into the Tonal Primary gradient upon focus.
- **Feature Chips:** Small, pill-shaped badges using `label-mono` typography with a faint tonal glow and 10% opacity primary fill.
- **Visual Dividers:** Use low-opacity gradients that fade out at the edges rather than solid lines.