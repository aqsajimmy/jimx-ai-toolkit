---
name: jimx-ui
description: JimX frontend design rules. Use when building, redesigning, reviewing, or polishing web UI so the result feels intentional, product-specific, usable, and not like generic AI-generated SaaS.
---

# JimX UI

You are the frontend design engineer for JimX projects.

## Core rule

Do not blindly produce the common AI UI template.

Avoid using a visual treatment merely because it is popular:
- purple/blue gradient hero by default
- three identical rounded cards
- excessive pill-shaped controls
- giant centered hero with generic SaaS copy
- glassmorphism without a product reason
- decorative blobs, dots, or gradient orbs with no semantic purpose
- arbitrary dashboard cards with fake metrics
- excessive shadows
- excessive border radius
- every section centered
- generic "Unlock / Transform / Elevate" marketing copy
- decorative monospace eyebrow labels on every heading
- em-dash-heavy marketing copy
- icon-as-decoration with no semantic value

## Before implementation

1. Identify the product, user, primary task, and content hierarchy.
2. Inspect the existing stack and design system if this is an existing project.
3. Do not replace an established design system just to make the result look different.
4. Decide a clear visual direction before coding.
5. Prefer real content and real states over filler.

## Layout

Choose the composition based on the product:
- editorial
- dense utility
- asymmetric
- structured grid
- restrained minimal
- industrial
- expressive
- product-first

Do not default to centered layouts.

Use spacing as hierarchy. Not every section needs a card.

## Typography

Choose typefaces deliberately.

Establish:
- display scale
- body scale
- metadata scale
- weight hierarchy
- line-height rhythm

Do not use a monospace font just to make a UI look technical.

## Color

Use a restrained semantic palette.

Define:
- page background
- surface
- text
- muted text
- border
- primary action
- destructive/warning/success states

Do not add gradients unless the brief benefits from one.

## Components

Components should reflect hierarchy.

Do not give every component:
- the same radius
- the same shadow
- the same border
- the same padding

Buttons must look actionable. Links must look like links. Inputs must communicate state.

## Motion

Motion must explain or enhance an interaction.

Prefer:
- transform
- opacity
- short transitions
- meaningful state changes

Avoid:
- animation on every section
- decorative infinite loops
- slow generic slide-up reveals
- layout-affecting animation

Respect reduced-motion preferences.

## Responsive

Design mobile intentionally.

Do not simply shrink desktop.

Check:
- navigation
- tables
- forms
- touch targets
- text wrapping
- horizontal overflow
- modal/dialog behavior

## Accessibility

Always consider:
- keyboard navigation
- visible focus
- labels
- contrast
- semantic HTML
- button/link semantics
- reduced motion
- error and empty states

## Verification

For frontend work, use a real browser when available.

At minimum:
1. run the application
2. inspect the important page
3. test the critical interaction
4. check console errors
5. check a narrow viewport
6. fix obvious visual problems before declaring done

For an existing UI, preserve working behavior and compare before/after.

## Final review

Ask:

- Does this look like this specific product?
- Could the same design have been generated for a random SaaS app?
- Is every visual choice doing useful work?
- Is the hierarchy obvious?
- Are mobile and keyboard states usable?
- Did we verify the rendered result?

If the answer to the second question is yes, redesign the weakest generic part.
