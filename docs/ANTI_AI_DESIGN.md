# Anti-AI Design Decisions

FocusBloom was built to avoid the visual fingerprints of AI-generated UIs. This document explains every design decision and why it was made.

## The Problem

AI-generated websites and apps share a recognizable "house style" — a cluster of defaults that no human picks all at once:

| AI Default | FocusBloom Choice |
|---|---|
| Blue-500 (#3b82f6) + Purple-500 (#8b5cf6) gradient | Forest green (#2D5A3D) + warm amber (#D4A373) |
| Inter as the only font | Georgia (serif) for headings, System (sans) for body |
| Three-card grid with rounded-2xl + shadow-md | Asymmetric layout, varied card sizes |
| Centered everything | Left-aligned content, asymmetric sections |
| Fade-up-on-scroll animation | Spring-based animations, meaningful motion |
| Generic copy ("Boost Your Workflow") | Specific, human-written copy |
| Emoji as icons | Custom emoji choices by the user |
| Glassmorphism (backdrop-blur) | Solid surfaces with subtle shadows |
| 4px uniform spacing grid | Asymmetric 5px base scale |
| All border radii = 8px | Varied radii per component |

## Color Palette

The palette uses warm, earthy tones that read as intentionally chosen:

- **Primary**: Forest green (#2D5A3D) — chosen for calm and focus
- **Secondary**: Warm amber (#D4A373) — for accents and warmth
- **Accent**: Terracotta (#C17A62) — for highlights and calls to action
- **Background**: Cream (#F8F4E9) — not stark white
- **Surface**: White (#FFFFFF) with warm border (#D4C9B8)

No blue-500 or purple-500 appears anywhere in the palette.

## Typography

A deliberate font pairing:

- **Display/Headings**: Georgia (system serif) — serif gives a human, crafted feel
- **Body**: System sans-serif — clean and readable, NOT Inter
- **Data/Mono**: Menlo — for math problems and statistics

The default AI scale (h1: 3rem, h2: 2.25rem, h3: 1.5rem, body: 1rem) is avoided. Instead, each heading size is chosen for its specific context.

## Layout

- **Asymmetric**: Content is left-aligned, not centered
- **Varied section padding**: Not uniform `py-24 px-6` repeated
- **No three-card grids**: Stats use varied-width cards
- **Broken grid**: Some elements use left offsets for visual interest

## Components

Each component has a unique border radius:

- Buttons: 10px
- Cards: 14px
- Inputs: 8px
- Badges: 20px

No component uses the default 8px radius.

## Animation

Animations are meaningful, not decorative:

- **Spring physics** for interactive elements (stiffness: 180, damping: 22)
- **No fade-up-on-scroll** — the most common AI animation
- **Haptic feedback** tied to user actions
- **Meaningful transitions** — not generic fade-in

## Craft Details

The following craft signals are included (almost no AI-generated sites have them):

- `::selection` color (custom text highlight)
- `:focus-visible` styling (keyboard focus)
- `prefers-reduced-motion` handling
- Print stylesheet
- Custom cursor states on interactive elements

## Copy

All copy is specific and human-written:

- "Focus Session" instead of "Boost Your Workflow"
- "Distractions blocked" instead of "Streamline Your Experience"
- "Emergency Unlock" instead of "Unlock Productivity"
- No em-dash confetti
- No "In today's fast-paced world" openers
