# Implementation Log

## 2026-11-21 — CP-001
- Extracted Nagomi's large-koi state and school behavior, removing ripple and tiny-fish coupling.
- Added continuous pointer targeting, fixed-step simulation, responsive resizing, and fish-only procedural Canvas2D geometry.
- Limited runtime to exactly three regular koi and three distinct upstream-derived appearances.
- Removed all visible UI/environment layers and retained transparent page/canvas output.
- Added unit, desktop browser, mobile browser, transparent-background, no-UI, pointer-response, overflow, build, secret-scan, and Pages checks.
- Deliberately changed the count to two and proved the exact-count unit test failed; restored three and passed full verification.

## 2026-11-21 — Mixed cursor personalities
- Changed cursor response from group convergence to three stable behaviors: close follower, wide counter-orbiting koi, and slower nearby wanderer.
- Added separate orbit radii, directions, pull strengths, and urgency/speed profiles while retaining natural schooling and spine motion.
- Added personality-response coverage and reran the full desktop/mobile verification suite.

## 2026-11-22 — Glyphmix fish presets and behavior audit
- Added a responsive glass toolbar with all eight Glyphmix presets, None, and cell-size control.
- Added transparent fish-only post-processing for Terminal, Koi tiles, 1-bit dither, Halftone, Mosaic, Cyber, Gameboy, and Amber.
- None restores the unfiltered koi appearance; all presets apply to all three koi.
- Removed depth-driven palette shifts so normal koi colors remain stable.
- Fixed pointer-target expiry: koi continue gathering and hovering around a stationary cursor until pointer leave.
- Added iterative soft-body collision resolution and velocity deflection to prevent koi crossing through one another.
- Added a white-circle fish favicon and responsive keyboard-accessible preset controls.
- Audited desktop/mobile rendering, transparency, overflow, console errors, effects, slider, collision, targeting, and build output.

## 2026-11-22 — Stronger following and fish-size control
- Increased target pull, chase boost, and sustained cursor urgency for all three personalities.
- Added a 65–170% fish-size slider that scales all three koi while preserving count, behavior, and collision handling.
- Verified six unit tests and six desktop/mobile browser tests.
