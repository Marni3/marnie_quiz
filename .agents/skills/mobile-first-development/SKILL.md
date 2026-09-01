---
name: mobile-first-development
description: Mobile-first UI/UX development standards for the Marnie Quiz platform. Covers touch targets, viewport handling, scroll behavior, input management, modal patterns, and a pre-commit mobile verification checklist. Read this skill before building or revising any user-facing screen.
---

# Mobile-First Development Standards — Marnie Quiz

Marnie Quiz is primarily used on mobile web browsers by students studying on their phones. Every screen must be designed mobile-first, then adapted upward for desktop — not the other way around. This skill defines the standards and verification checklist for mobile UI/UX development.

---

## 1. Viewport & Layout Foundations

### Dynamic Viewport Units
* **Always use `100dvh`**, never `100vh`, for full-height layouts. On iOS Safari, `100vh` includes the URL bar height, causing content to overflow behind the browser chrome.
* The platform already uses `h-[100dvh]` in several root layouts — maintain this consistently.

### Safe Areas
* Respect device safe areas (notch, home indicator) with `env(safe-area-inset-*)`:
  ```css
  .bottom-bar {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  }
  ```
* The bottom mobile navigation bar and any fixed-position composers (AI Tutor input) must account for `safe-area-inset-bottom`.

### Overflow Management
* Root layout containers should use `overflow-hidden` on the outermost shell and `overflow-y-auto` on the scrollable content area. Never allow two nested scroll containers on the same axis — this causes "scroll trapping" on iOS.
* Horizontal overflow (`overflow-x-auto`) on tables or code blocks is acceptable but must include `-webkit-overflow-scrolling: touch` behavior (default in modern Safari).

---

## 2. Touch Targets & Interactive Elements

### Minimum Sizes
* **All interactive elements must be at least 44×44px** in touch target area (Apple HIG / WCAG 2.5.5). This includes:
  - Buttons, icon buttons, and links
  - Radio buttons and checkboxes (including quiz answer choices)
  - Dropdown triggers and select elements
  - Navigation items in the bottom bar and sidebar
* Small visual elements (e.g., a 16px icon button) must have padding or a transparent hit area that expands the touch target to 44px minimum.

### Spacing Between Targets
* Adjacent interactive elements must have at least **8px of non-interactive space** between them to prevent mis-taps. This is especially critical in:
  - Quiz answer choice lists
  - Action button rows (Copy / Save Note / Review in AI Tutor)
  - Navigation tabs and filter pills

### Hover States ≠ Mobile States
* Never rely on `:hover` as the only interactive feedback. Hover states are invisible on touch devices.
* Always pair hover styles with `:active` or `:focus-visible` states:
  ```css
  .btn {
    transition: all 0.15s ease;
  }
  .btn:hover, .btn:active {
    background: var(--surface2);
  }
  ```
* Avoid hover-triggered dropdowns, tooltips, or popovers that have no tap equivalent.

---

## 3. Text & Typography

### Minimum Font Sizes
* **Body text: 14px minimum** on mobile. Anything smaller becomes unreadable on phone screens.
* **Supplementary/caption text: 11px minimum.** Below this, text is illegible on most devices.
* **Input fields: 16px minimum.** iOS Safari auto-zooms the viewport when a user taps an input with `font-size < 16px`. This is jarring and breaks the layout. Always ensure:
  ```css
  input, textarea, select {
    font-size: 16px; /* Prevents iOS auto-zoom */
  }
  ```

### Line Length & Readability
* On mobile viewports (<640px), text blocks should not exceed ~65 characters per line. Use appropriate padding (`px-4` or `px-5`) to constrain line length naturally.
* KaTeX-rendered math that overflows horizontally should be wrapped in a horizontally scrollable container rather than breaking the page layout.

---

## 4. Navigation & Screen Structure

### Bottom Navigation Bar
* The platform uses a fixed bottom navigation bar on mobile. All primary navigation destinations must be reachable from this bar.
* Content areas must include `pb-16` (or equivalent) to prevent the bottom nav from occluding the last items in a scrollable list.
* The bottom nav must remain visible and functional during all states — including when modals are open, when the AI Tutor is streaming, and during quiz-taking.

### Back Navigation
* Every screen that is not a top-level navigation destination must have a clear "back" affordance. Do not rely solely on the browser's back button — provide an in-app back arrow or breadcrumb.
* Modal and drawer close buttons must be large (44px+), clearly visible, and positioned consistently (top-right for modals, top-left or top-right for drawers).

### Screen Transitions
* Avoid full-page reloads when navigating between screens. Use Next.js client-side navigation (`Link` component, `router.push`) for smooth transitions.
* Loading states between screens should show skeleton placeholders or a minimal spinner — never a blank white screen.

---

## 5. Input Handling & Virtual Keyboard

### Keyboard Push Behavior
* When the virtual keyboard opens on mobile, the visible content area shrinks dramatically. Fixed-position elements (bottom nav, floating action buttons) must either:
  - **Hide** when the keyboard is open, or
  - **Reposition** above the keyboard using `visualViewport` API awareness
* The AI Tutor composer is especially sensitive to this — the input textarea must remain visible and usable when the keyboard is open.

### Textarea Auto-Resize
* Multi-line text inputs (AI Tutor composer, note editor) should auto-resize to fit content up to a reasonable maximum height (e.g., `max-h-32`), then scroll internally. Never let a textarea push the entire page layout down.

### Input Focus Management
* On mobile, avoid `autoFocus` on inputs that would immediately trigger the keyboard on page load — this is disorienting, especially when navigating to a new screen.
* After form submission (e.g., sending an AI Tutor message), return focus to the input field so the user can continue typing without re-tapping.

---

## 6. Modals, Drawers & Overlays

### Modal Sizing
* Modals on mobile should be **full-screen or near-full-screen** (`max-h-[90dvh]`), not small centered dialogs that leave unusable margins on all sides.
* The modal content area must be scrollable (`overflow-y-auto`) while the header and action buttons remain fixed.

### Drawer Patterns
* Side drawers (e.g., AI Tutor session history, context picker) should slide in from the edge and cover at least 85% of the viewport width on mobile.
* Include a visible close button AND support swipe-to-dismiss where feasible.

### Backdrop Dismissal
* Tapping the backdrop (dark overlay) behind a modal or drawer must dismiss it. This is the primary dismissal mechanism on mobile — users expect it universally.

### Scroll Lock
* When a modal or drawer is open, the background content must not scroll. Use `overflow: hidden` on `<body>` or the scroll container while the overlay is active.

---

## 7. Data Display & Dense Content

### Tables on Mobile
* Wide data tables (analytics, SRS retention board) must be horizontally scrollable on mobile rather than breaking the layout or hiding columns.
* Consider card-based layouts as an alternative to tables on screens narrower than 640px — each row becomes a stacked card.

### Charts & Visualizations
* Charts must be responsive and readable at 320px viewport width. Labels should truncate or rotate rather than overlapping.
* Touch-based chart interactions (tap to see data point values) should replace hover-based tooltips.

### Long Lists & Pagination
* Quiz question lists, module lists, and history lists should use virtual scrolling or pagination if they exceed ~50 items. Rendering 200+ DOM nodes in a mobile scroll container causes jank.

---

## 8. Performance Considerations

### Bundle Size Awareness
* Heavy client-side libraries (KaTeX, chart libraries) should be lazy-loaded or dynamically imported. Don't block first paint with libraries needed only on specific screens.

### Image & Asset Handling
* Serve appropriately sized images for mobile viewports. A 2000px-wide hero image on a 375px screen wastes bandwidth and memory.
* Use `loading="lazy"` on images below the fold.

### Scroll Performance
* Avoid heavy re-renders during scroll events. If scroll-linked animations or calculations are needed, use `requestAnimationFrame` or `IntersectionObserver` — never raw `onScroll` handlers that trigger state updates.

---

## 9. Pre-Commit Mobile Verification Checklist

Before calling any screen or feature "done," verify the following on a mobile viewport (375px width, or use Chrome DevTools device emulation):

- [ ] **Layout**: No horizontal overflow, no content hidden behind fixed bars, no overlapping elements
- [ ] **Touch targets**: All buttons, links, and interactive elements are ≥44px touch target
- [ ] **Text**: All text is readable without zooming; inputs are ≥16px font-size
- [ ] **Navigation**: Can reach this screen and leave it using only the bottom nav and in-app controls
- [ ] **Keyboard**: Opening the keyboard doesn't break the layout or hide the active input
- [ ] **Modals**: All modals are appropriately sized, scrollable, and dismissible via backdrop tap
- [ ] **Scrolling**: Content scrolls smoothly; no scroll trapping or double-scroll-container issues
- [ ] **Loading states**: Network-dependent content shows skeleton/spinner, not blank space
- [ ] **Orientation**: Screen is usable in both portrait and landscape (portrait is primary)

> **When to use this checklist:** After building or modifying any user-facing screen. Use the browser's device emulation tools to test at 375px (iPhone SE), 390px (iPhone 14), and 412px (Pixel 7) widths at minimum.
