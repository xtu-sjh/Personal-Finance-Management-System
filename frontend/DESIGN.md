---
name: Personal Finance Management System
description: A refined personal finance tracker with teal-green primary and warm neutrals.
colors:
  primary: "#3D7A72"
  primary-light: "#5A9A90"
  primary-dark: "#2E6660"
  success: "#5A8A5E"
  success-light: "#7AAA7E"
  warning: "#C49A3D"
  warning-light: "#D4B05A"
  danger: "#C4725A"
  danger-light: "#D48F7A"
  bg: "#F9F9F7"
  bg-secondary: "#F2F0ED"
  card: "#FDFCFB"
  text-primary: "#2A2C2B"
  text-secondary: "#6E7370"
  text-tertiary: "#AAAEAB"
  border: "#E5E3DF"
  border-light: "#EFEDE9"
typography:
  body:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  title:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
  headline:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.25
  display:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "10px"
  md: "14px"
  lg: "16px"
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "20px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "40px"
  "4xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.card}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.card}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    typography: "{typography.body}"
  navbar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.card}"
    height: "60px"
    padding: "0 {spacing.xl}"
---

# Design System: Personal Finance Management System

## 1. Overview

**Creative North Star: "The Greenhouse Ledger"**

This is a personal finance tool that feels like reviewing a well-organized ledger in a sunlit greenhouse. The interface is refined, calm, grounded. Deep teal greens, warm off-white backgrounds, terracotta accents. The teal primary gives the system a cooler sophistication while the warm neutrals keep it approachable.

The system explicitly rejects corporate banking software: no cold gray slabs, no dense multi-column forms, no "enterprise software" energy, no feeling of filling out a tax form. It also rejects gamified budgeting (confetti, streaks, cartoon mascots) and crypto/trading terminal aesthetics (neon, flashing numbers, urgency-driven design). The app should not feel like navigating a bank's online portal.

**Key Characteristics:**
- DM Sans throughout: a warm geometric sans-serif that feels human, not institutional
- Deep teal primary with warm neutral canvas: cool-warm balance
- Neutral-warm shadows (not cold gray)
- Solid teal navbar and hero (no gradients)
- Left accent bar on summary cards (not top bar)
- 10-14px radius range, slightly rounder than default

## 2. Colors

The palette is a cool-warm balance. Deep teal carries the primary role with a sophisticated blue-green character. Terracotta marks expenses. Forest green marks income. Amber warns. The neutral canvas is warm off-white, keeping the teal from feeling cold.

### Primary
- **Deep Teal** (#3D7A72): Buttons, active states, nav links, hero backgrounds. The anchor of the system. Cooler than olive, more refined.
- **Darker Teal** (#2E6660): Button hover, pressed states, text links.
- **Teal Wash** (#5A9A90): Hover states on primary elements, lighter accents.

### Semantic
- **Forest** (#5A8A5E): Income amounts, success alerts, positive indicators. Money coming in.
- **Terracotta** (#C4725A): Expense amounts, danger alerts, delete buttons. Money going out.
- **Golden** (#C49A3D): Budget warnings (70-90% threshold). "Pay attention, but calmly."

### Neutral
- **Off White** (#F9F9F7): Page background. Warm, not blue-gray.
- **Warm Gray** (#F2F0ED): Table headers, secondary surfaces.
- **White** (#FDFCFB): Card surfaces, input backgrounds. Slightly warm, never pure white.
- **Charcoal** (#2A2C2B): Primary text. Warm dark, not cool black.
- **Stone** (#6E7370): Secondary text. Descriptions, labels.
- **Ash** (#AAAEAB): Tertiary text. Placeholders, disabled states.
- **Pebble** (#E5E3DF): Borders, dividers.
- **Pale Pebble** (#EFEDE9): Light borders, subtle separators.

### Named Rules

**The Cool-Warm Balance Rule.** The primary is cool (teal), the canvas is warm (off-white). This balance is intentional. Don't make the whole system cold by adding cool grays or icy whites. Keep the neutral canvas warm so the teal feels inviting, not clinical.

**The Semantic Consistency Rule.** Green always means income or success. Terracotta always means expense or error. Amber always means warning. These meanings never shift across screens.

## 3. Typography

**Font:** DM Sans (Google Fonts), loaded via `<link>` in every HTML page.

**Character:** DM Sans is a warm geometric sans-serif. It has more personality than system defaults without feeling decorative. The slightly rounded letterforms complement the warm palette. It reads well at small sizes for data-dense tables and at large sizes for hero headings.

### Hierarchy
- **Display** (700, 28px, line-height 1.2): Page hero titles. One per page, inside the teal banner.
- **Headline** (700, 22px, line-height 1.25): Section titles, modal headings.
- **Title** (600, 17px, line-height 1.3): Card headers, sub-section labels.
- **Body** (400, 14px, line-height 1.6): Default text. Form labels, table cells, nav links, buttons. Max line length 70ch for prose.
- **Label** (500, 13px, line-height 1.4): Form labels, button text, nav links.
- **Caption** (400, 12px, line-height 1.4): Tags, badges, metadata.

### Named Rules

**The One Weight Rule.** Headings use bold (700), subheadings use semibold (600), interactive elements use medium (500), body uses regular (400). No other weights exist in this system.

**The DM Sans Only Rule.** No font pairing, no display fonts, no custom typefaces. DM Sans carries every role from display headings to table cells.

## 4. Elevation

Neutral-warm shadows. Surfaces are slightly elevated at rest (Subtle shadow); shadows escalate on interaction.

### Shadow Vocabulary
- **Subtle** (`0 1px 3px rgba(42, 44, 43, 0.06)`): Default card state. Barely visible.
- **Medium** (`0 4px 12px rgba(42, 44, 43, 0.08)`): Card hover state, dropdown menus.
- **High** (`0 12px 24px rgba(42, 44, 43, 0.1)`): Modals, floating elements.

### Named Rules

**The Neutral Shadow Rule.** Every shadow uses `rgba(42, 44, 43, ...)` as its base, not `rgba(0, 0, 0, ...)`. Neutral-warm undertone that works with both the cool primary and warm canvas.

## 5. Components

### Buttons

Compact, functional. Deep teal for primary actions.

- **Shape:** 10px radius
- **Primary:** Deep Teal background (#3D7A72), off-white text, medium weight, 8px 16px padding. Hover darkens to Darker Teal (#2E6660), lifts 1px.
- **Secondary:** Warm Gray background, dark text, 1px Pebble border. Hover shifts to Pebble.
- **Danger:** Terracotta background (#C4725A), off-white text. Hover darkens.
- **Ghost/Link:** No background, teal text. For inline actions.
- **Sizes:** Small (12px), Default (14px), Large (16px).

### Cards

White surface, neutral shadow, gentle lift on hover.

- **Corner Style:** 14px radius
- **Background:** White (#FDFCFB)
- **Shadow:** Subtle at rest, Medium on hover, with 2px translateY lift
- **Border:** 1px Pale Pebble (#EFEDE9)
- **Internal Padding:** 24px
- **Animation:** fadeInUp (0.4s ease) on page load, staggered 0.1s per card

### Summary Cards

A card variant for financial figures. Left accent bar on hover (not top bar).

- **Value:** 26px, bold (700), color-coded (forest for income, terracotta for expense, teal for balance)
- **Accent:** 4px left bar on hover using ::before pseudo-element
- **Layout:** Centered content, neutral shadow, 14px radius

### Forms / Inputs

Clean, with teal focus states.

- **Style:** White background, 1px Pebble border, 10px radius
- **Padding:** 8px 12px
- **Focus:** Teal border + 3px glow ring (`0 0 0 3px rgba(61, 122, 114, 0.1)`)
- **Placeholder:** Ash color (#AAAEAB)
- **Labels:** Medium weight (500), 13px, above the input

### Navigation

Solid teal background (no gradient), off-white text, 60px height.

- **Background:** Solid Deep Teal (#3D7A72)
- **Logo:** 20px, bold (700), off-white with lighter accent span
- **Links:** 14px, medium weight (500), 10px radius, off-white text. Hover/active: white overlay at 15% opacity
- **Responsive:** Nav links hidden below 768px

### Page Hero

Solid teal banner. Matches navbar color for visual cohesion.

- **Background:** Solid Deep Teal (#3D7A72)
- **Radius:** 16px
- **Content:** Eyebrow pill badge, display heading (28px bold), subtitle, action buttons
- **Text:** Off-white throughout

### Tables

Dense data display. Warm Gray headers, alternating row backgrounds.

- **Header:** Warm Gray background (#F2F0ED), semibold (600)
- **Rows:** White background, hover shifts to Warm Gray
- **Cells:** 12px 16px padding, 14px body text
- **Borders:** 1px Pebble

### Tags / Badges

Small inline labels. 6px radius, pastel backgrounds.

- **Income tag:** Forest Mist (#EDF5ED) background, Forest (#5A8A5E) text
- **Expense tag:** Terra Mist (#FDF0EC) background, Terracotta (#C4725A) text
- **Neutral tag:** Warm Gray background, Stone text

### Budget Progress

Progress bars with rounded ends (10px radius).

- **Bar:** 10px height, 5px radius, Warm Gray background
- **Fill:** Teal (normal, <70%), Amber (warning, 70-90%), Terracotta (danger, >90%)

### Alerts

Inline feedback. Tinted backgrounds.

- **Success:** Forest Mist (#EDF5ED) background, Forest text
- **Error:** Terra Mist (#FDF0EC) background, Terracotta text

### Modals

Overlay dialogs for add/edit forms.

- **Overlay:** Fixed full-screen, `rgba(42, 44, 43, 0.4)` backdrop
- **Content:** Centered card, max-width 400-500px
- **Structure:** Header with title + close button, form body, footer with actions

## 6. Do's and Don'ts

### Do:
- **Do** use Deep Teal (#3D7A72) exclusively for primary actions, active states, and focus indicators.
- **Do** keep green = income, terracotta = expense, amber = warning across every screen.
- **Do** use DM Sans loaded from Google Fonts for every text element.
- **Do** maintain the 10/14/16/20px radius scale for all rounded elements.
- **Do** use neutral-warm shadows (`rgba(42, 44, 43, ...)`) for all elevation.
- **Do** keep transitions in the 200-300ms range with ease-out curves.
- **Do** use fadeInUp animation for card entrance with staggered delays.
- **Do** maintain 24px padding inside cards and 16px spacing between form items.
- **Do** use solid teal for navbar and hero (no gradients).
- **Do** keep the warm neutral canvas (off-white bg) to balance the cool teal primary.

### Don't:
- **Don't** use cold grays, icy whites, or blue-gray backgrounds. The canvas must stay warm.
- **Don't** use indigo, purple, or navy as primary colors. Teal is the anchor.
- **Don't** add decorative motion that doesn't convey state change.
- **Don't** use gradient text, glassmorphism, or colored border accents.
- **Don't** design like corporate banking software. No cold gray slabs, no dense multi-column forms, no tiny text, no cramped spacing, no jargon-heavy labels, no gray-on-gray color schemes, no institutional tone.
- **Don't** use urgent red or alarm-style visuals for budget warnings. Use calm amber for caution; the app informs, it doesn't judge.
- **Don't** use gradient backgrounds on navbar or hero. Solid teal only.
- **Don't** use pure white (#FFFFFF) or pure black (#000000). Always warm-tint: White (#FDFCFB) for white, Charcoal (#2A2C2B) for black.
- **Don't** wrap every element in a card. Use cards for distinct content groups; inline layouts for dense data.
