# Implementation Log

## 2026-11-21 — CP-001
- Extracted Nagomi's large-koi state and school behavior, removing ripple and tiny-fish coupling.
- Added continuous pointer targeting, fixed-step simulation, responsive resizing, and fish-only procedural Canvas2D geometry.
- Limited runtime to exactly three regular koi and three distinct upstream-derived appearances.
- Removed all visible UI/environment layers and retained transparent page/canvas output.
- Added unit, desktop browser, mobile browser, transparent-background, no-UI, pointer-response, overflow, build, secret-scan, and Pages checks.
- Deliberately changed the count to two and proved the exact-count unit test failed; restored three and passed full verification.
