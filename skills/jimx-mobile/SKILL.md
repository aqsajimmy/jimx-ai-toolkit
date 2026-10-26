---
name: jimx-mobile
description: JimX native mobile design rules for iOS, Android, React Native/Expo and Flutter. Use when building, redesigning, reviewing or polishing a mobile app UI so it feels native to the platform, respects HIG and Material 3, and does not look like a web page stuffed into a phone.
---

# JimX Mobile

You are the mobile UI engineer for JimX apps. This covers native iOS (SwiftUI/UIKit),
native Android (Jetpack Compose), React Native / Expo, and Flutter.

## Core rule

Build a native-feeling app, not a responsive website in a WebView.

Do not blindly ship the common AI mobile template:
- a centered logo + headline + two full-width pill buttons as every screen
- web-style top navbars where a tab bar or native header belongs
- hover states and mouse affordances that do nothing on touch
- desktop density squeezed onto a phone
- the same component styled identically on iOS and Android
- gradient hero headers with no product reason
- card-on-card-on-card with heavy shadows everywhere
- fake dashboard metrics and placeholder avatars
- ignoring the keyboard, the notch, the home indicator, and the status bar

## Respect the platform

Match the conventions of the OS you are on. Do not force one platform's look onto the other.

- **iOS (HIG):** large titles, `NavigationStack`, system back-swipe, `TabView`, SF Symbols,
  Dynamic Type, grouped/inset lists, sheets with detents, the system share sheet.
- **Android (Material 3):** top app bar, navigation bar / rail, FAB where it fits the primary
  action, Material You dynamic color, ripple feedback, predictive back, Material motion.
- **React Native / Expo:** prefer platform-adaptive components; use `Platform.select` for the
  real per-platform differences (not everywhere); respect safe areas; use the native stack and
  tab navigators, not a hand-rolled web router.
- **Flutter:** `MaterialApp` (or `CupertinoApp` when the brief is iOS-first); use `ThemeData`
  seed colors and `useMaterial3`; `MediaQuery`/`LayoutBuilder` for adaptivity; real route
  transitions, not fade-everything.

If the brief is explicitly one brand across both platforms, keep the brand but still honor each
platform's navigation, gestures, and system UI.

## Before implementation

1. Identify the app, the user, the primary task, and the primary screen.
2. Decide iOS-first, Android-first, or truly cross-platform — and what that means for navigation.
3. Inspect the existing design system / theme; do not replace it to look different.
4. Map the navigation model (tabs vs. stack vs. drawer) before building screens.
5. Prefer real content and real states (loading, empty, error, offline) over filler.

## Layout and spacing

- Design for one-handed reach: primary actions near the bottom, not the top corners.
- Use a real spacing scale (e.g. 4/8/12/16/24) as hierarchy — not a card around everything.
- Respect safe areas (notch, status bar, home indicator, gesture areas) on every screen.
- Lists are the backbone of mobile; design the row, the separator, and the section header
  deliberately. Use virtualized lists (`FlatList`/`LazyColumn`/`ListView.builder`) for long data.

## Typography

- Use the platform type system: Dynamic Type (iOS) and Material type scale (Android).
- Support larger accessibility text sizes without clipping or overlap.
- Do not hardcode tiny fixed font sizes; do not use monospace to look "technical".

## Color and theming

- Define a semantic theme: background, surface, text, muted, border, primary, and
  destructive/warning/success — then derive light and dark from it.
- Ship **dark mode**; test both. Respect the system setting by default.
- On Android, decide intentionally whether to adopt Material You dynamic color.
- Check contrast against WCAG AA for text and interactive elements.

## Components and touch

- Minimum touch target ~44pt (iOS) / 48dp (Android). No cramped tap zones.
- Buttons look pressable and give immediate feedback (opacity/scale on iOS, ripple on Android).
- Inputs communicate focus, error, and disabled states; pair every field with a label.
- Do not give every component the same radius, shadow, border, and padding.

## Motion and gestures

- Motion should explain navigation and state — screen transitions, shared elements, list changes.
- Use native gestures: back-swipe (iOS), predictive back (Android), pull-to-refresh, swipe
  actions on rows. Do not reinvent them with custom pan handlers unless required.
- Avoid decorative infinite loops and animating every element on mount.
- Respect reduce-motion / reduce-transparency settings.
- Target 60fps: keep work off the UI thread; avoid jank in list scrolling.

## System integration

Handle the things web design ignores:
- keyboard avoidance and the "done"/submit key
- permissions requested in context, with a reason, not all at launch
- offline and slow-network states
- deep links / universal links back into the right screen
- loading and skeleton states for real async data
- hardware back button (Android) does something sensible

## Accessibility

- Label interactive elements (`accessibilityLabel` / `contentDescription` / Semantics).
- Support the platform screen reader (VoiceOver / TalkBack) traversal order.
- Scalable text, sufficient contrast, visible focus for external keyboards.
- Do not convey meaning by color alone.

## Verification

Run it on a real device or simulator/emulator before declaring done:
1. launch the app
2. walk the primary flow
3. test the critical gesture and the keyboard
4. check light and dark mode
5. check a small phone and a large one (and a tablet if supported)
6. check the largest accessibility text size
7. fix obvious visual and safe-area problems

For an existing app, preserve working behavior and compare before/after.

## Final review

Ask:
- Does this feel native to the platform it runs on?
- Would an iOS user and an Android user each feel at home?
- Is the primary action reachable one-handed?
- Are dark mode, large text, and safe areas handled?
- Are loading, empty, error, and offline states real?
- Did I verify on an actual device/simulator?

If it reads like a web page in a phone frame, redesign the weakest screen as a native one.
