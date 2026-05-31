---
name: Synthetic Intelligence Coach
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
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#009fb4'
  on-tertiary-container: '#002f36'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
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
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system focuses on a high-fidelity, futuristic atmosphere tailored for professionals preparing for the next stage of their careers. The brand personality is authoritative yet encouraging, blending the precision of AI with the fluidity of human conversation. 

The aesthetic centers on **Glassmorphism**, utilizing deep spatial layers to create a sense of immersion. By combining dark, monochromatic foundations with vibrant spectral gradients, the UI evokes a "mission control" feel—highly functional, technologically advanced, and sophisticated. The interface prioritizes clarity through heavy whitespace (negative space) and a reduction of non-essential decorative elements, ensuring the AI-driven insights remain the focal point.

## Colors
This design system utilizes a deep-space palette to establish depth and focus. 

- **Foundational Surfaces:** The primary background is a near-black Navy (`#020617`). Surface containers use semi-transparent Charcoal (`#0f172a`) with varying alpha channels to facilitate the glass effect.
- **Action Gradients:** A linear flow from Electric Blue (`#3b82f6`) to Vivid Purple (`#a855f7`) is reserved for primary actions, progress indicators, and AI-active states.
- **Neon Accents:** Cyan (`#22d3ee`) is used sparingly for data visualization highlights and success states to provide high-contrast "glints" against the dark backdrop.
- **Glass Overlays:** Surfaces should use a 60-80% opacity fill with a 20px-40px backdrop blur.

## Typography
The typography system relies on **Inter** for its neutral, highly legible character, and **Geist** for technical data points to reinforce the AI narrative.

- **Headlines:** Use tight letter-spacing and bold weights to create a "locked-in" professional feel. 
- **Body:** Generous line heights are required to maintain readability against dark, blurred backgrounds.
- **Labels:** Technical labels and AI-generated metadata use uppercase Geist with expanded letter spacing to simulate a digital terminal or readout.
- **Hierarchical Contrast:** Always use High-Contrast White (`#f8fafc`) for primary text and Muted Blue-Grey (`#94a3b8`) for secondary descriptions.

## Layout & Spacing
The design system employs a **fluid 12-column grid** for desktop and a **single-column stack** for mobile. 

- **Rhythm:** All spacing is based on an 8px base unit. 
- **Margins:** Large outer margins (`40px+` on desktop) are encouraged to allow the glassmorphic background blurs to "breathe" around the content.
- **Reflow:** On tablet/mobile, complex dashboard widgets should transform into a vertical feed. 
- **In-Component Padding:** Use consistent internal padding (e.g., `24px` for cards) to maintain a structured, clean-room environment for text.

## Elevation & Depth
Depth is created through **Backdrop Filtering** rather than traditional shadows.

1.  **Level 0 (Base):** The dark Navy background.
2.  **Level 1 (Cards/Sections):** 60% opacity Navy fill with 32px backdrop blur and a `1px` stroke (White at 10% opacity).
3.  **Level 2 (Modals/Popovers):** 80% opacity Navy fill with 64px backdrop blur and a `1.5px` gradient stroke (Primary Blue to Purple).
4.  **Glows:** Use secondary-color radial gradients (low opacity, `150px` radius) positioned behind Level 1 elements to create a "sub-surface" bioluminescent glow.

## Shapes
The shape language is approachable yet geometric. 

- **Primary Radius:** `0.5rem (8px)` for small elements like inputs and buttons.
- **Large Radius:** `1.5rem (24px)` for containers, cards, and glass panels. This "2xl" rounding is essential to soften the high-tech aesthetic and make it feel user-friendly.
- **Interactive States:** Buttons and chips transition from a flat stroke to a subtle outer glow on hover to indicate "activation."

## Components
- **Buttons:** Primary buttons use the Blue-to-Purple gradient with white text. Secondary buttons use a "Ghost" style with a `1px` gradient border and transparent background.
- **Input Fields:** Semi-transparent dark fills with a bottom-only or full-border highlight that glows when focused. 
- **Chips/Badges:** Small, pill-shaped elements with a solid tint of the accent color at 20% opacity and 100% opacity text for status indicators.
- **AI Feedback Cards:** Feature a subtle, animated gradient border (1px) that pulses slowly to indicate the AI is "thinking" or "processing."
- **Progress Indicators:** Use thin, neon-cyan lines. Avoid chunky bars to maintain the minimal, futuristic feel.
- **Lists:** Items separated by low-opacity dividers (`white/5%`), using Geist for any time-stamps or quantitative scores.