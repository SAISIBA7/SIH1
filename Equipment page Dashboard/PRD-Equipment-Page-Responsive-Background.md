# Product Requirements Document
## Equipment Page — Responsive Background Image Switching

| | |
|---|---|
| **Status** | Draft |
| **Doc type** | PRD |
| **Scope** | Equipment page only — self-contained, must not touch other folders |
| **Parent product** | Smart Crop — Equipment Rental (Intervene stage) |

---

## 1. Overview

The Equipment page uses a full-page background image as its visual theme (per the existing Equipment page Claude prompt — the image controls palette, mood, card styling, everything). Right now it likely uses a single static image regardless of screen size.

This PRD adds **responsive background switching**: one image for wide/landscape layouts (laptop, desktop, tablet landscape), a different image for narrow/portrait layouts (phone, 9:16 aspect ratio).

## 2. Goals

- On laptop/desktop (wide aspect ratio) → show `1.png` as the page background.
- On mobile/portrait (9:16-ish aspect ratio) → show `2.png` as the page background.
- The switch happens automatically based on the browser's aspect ratio/viewport — no user toggle needed.
- All code for this lives inside the **Equipment page folder only**. No shared/global CSS files, no edits to other pages' folders, no new files created outside `Equipment page/`.

## 3. Non-Goals

- No manual theme switcher for the user.
- No new images beyond the two already provided (`1.png`, `2.png`).
- Not touching the login page, dashboard, or any other page's styling.

## 4. Functional Requirement

| Condition | Background shown |
|---|---|
| Wide viewport (landscape-ish, e.g. width > height, typical laptop/desktop widths) | `1.png` |
| Narrow/tall viewport (portrait, roughly 9:16, typical phone screens) | `2.png` |
| Viewport resized live (e.g. rotating a tablet, resizing browser window) | Background updates immediately, no page reload needed |

**Breakpoint definition:** Use a CSS aspect-ratio or width-based media query — the natural cutoff is the standard mobile breakpoint (commonly `max-width: 768px` combined with a portrait orientation check), so this doesn't misfire on a small-but-wide window. Antigravity should choose the exact threshold, but it must:
- Show `1.png` on typical desktop/laptop windows.
- Show `2.png` on typical phone-sized portrait windows.
- Not flicker or swap images unnecessarily on minor resizes.

## 5. Technical Requirements

- Both images (`1.png`, `2.png`) already exist at `Equipment page/Image/`. Reference them from there — do not duplicate them elsewhere.
- Implement the switch using CSS (media query) as the primary mechanism, since it's more reliable and performant than JS-based resize listeners. JS-based `window.innerWidth` checks are acceptable only as a fallback if the framework setup makes CSS-only harder.
- The background must still support the existing translucent/blurred card overlays and text readability requirements from the original Equipment page design (dark overlay or blur as needed so foreground content stays legible on both images).
- No new npm packages required for this.

## 6. Folder Isolation Requirement

This is important: **everything related to this feature must stay inside `Equipment page/`.**
- Any CSS/styling for the background switch → inside `Equipment page/` (e.g. in `Equipment page.tsx` itself, or a CSS/module file created inside that same folder).
- Do not add global styles to a shared `app/globals.css` or similar shared file.
- Do not move or copy the images out of `Equipment page/Image/`.
- Do not modify any other page's folder (farmer profile, dashboard, login page, etc.) as part of this task.

## 7. Acceptance Criteria

- [ ] Opening the Equipment page on a laptop/desktop browser window shows `1.png` as the background.
- [ ] Resizing the browser window down to a narrow/portrait shape (or opening on a phone) shows `2.png` instead.
- [ ] Resizing back up restores `1.png` without a page reload.
- [ ] No other page's appearance changed as a result of this work.
- [ ] All new/modified code lives inside `Equipment page/` only.
