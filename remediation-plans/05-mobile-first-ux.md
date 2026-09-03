# Implementation Plan 05: Mobile-First UX & Viewport Remediation

**Target Issue**: Occlusion of bottom content by the fixed 64px mobile navigation bar, jarring iOS Safari auto-zoom on input focus, sub-44px touch targets causing mis-taps, inaccessibility of `/history` on mobile screens, and unlocked body scroll behind modals.  
**Governing Standards**:  
* [Mobile-First Development SKILL.md §1](file:///.agents/skills/mobile-first-development/SKILL.md) (Viewport & Layout Foundations: `100dvh`, Safe Areas)  
* [Mobile-First Development SKILL.md §2](file:///.agents/skills/mobile-first-development/SKILL.md) (Touch Targets: 44×44px, 8px Spacing)  
* [Mobile-First Development SKILL.md §3](file:///.agents/skills/mobile-first-development/SKILL.md) (Typography: 16px Minimum Input Size)  
* [Mobile-First Development SKILL.md §4](file:///.agents/skills/mobile-first-development/SKILL.md) (Navigation & Screen Structure: Mobile History Access)  
* [Mobile-First Development SKILL.md §6](file:///.agents/skills/mobile-first-development/SKILL.md) (Modals, Drawers & Scroll Lock)

---

## 1. Root-Cause Summary

1. **Bottom Nav Occlusion Bug**: `MobileNav` is fixed to `bottom-0` with `h-16` ($64\text{px}$). Neither `platform/app/layout.tsx` nor page containers apply bottom padding, permanently obscuring the lower $64\text{px}$ of cards, action buttons, and tables on mobile screens.
2. **iOS Safari Viewport Auto-Zoom**: Search inputs and AI Tutor composers use `text-xs` or `text-sm` ($12\text{px}$–$14\text{px}$). Tapping an input $<16\text{px}$ triggers an involuntary viewport zoom on iOS Safari.
3. **Sub-44px Hit Targets**: Action buttons in tables and study lists measure $28\times 28\text{px}$ with $<4\text{px}$ margin, causing frequent mis-taps on touch devices.
4. **History Inaccessibility on Mobile**: Header hides the History navigation link on `< md`. `MobileNav` omits History, leaving phone users with zero navigation path to `/history`.
5. **Background Scroll Bleed**: Opening modals on mobile does not lock `body` scroll, causing background lists to scroll erratically beneath the modal overlay.

---

## 2. Technical Solution & Changes

### A. Viewport Safe Areas & Bottom Nav Clearance
* **File**: [`platform/app/layout.tsx`](file:///platform/app/layout.tsx)
* **File**: [`platform/components/mobile-nav.tsx`](file:///platform/components/mobile-nav.tsx)
* **Implementation**:
  1. Add `pb-24 md:pb-0` to the root `<main>` containers and layout shells.
  2. In `mobile-nav.tsx`, add safe-area bottom padding:
     ```css
     padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
     ```
  3. Enforce `min-h-[100dvh]` across full-screen layouts.

### B. Eliminate iOS Safari Auto-Zoom (16px Rule)
* **File**: [`platform/app/globals.css`](file:///platform/app/globals.css)
* **File**: All input/textarea components in `library-view.tsx`, `tutor-view.tsx`, and `omni-search.tsx`.
* **Implementation**:
  * Enforce `text-base` ($16\text{px}$) on mobile viewports for all `<input>` and `<textarea>` elements:
    ```css
    @media (max-width: 640px) {
      input, textarea, select {
        font-size: 16px !important;
      }
    }
    ```

### C. 44×44px Touch Targets & 8px Spacing
* **File**: [`platform/components/retention-board.tsx`](file:///platform/components/retention-board.tsx)
* **File**: [`platform/app/tutor/chat-message.tsx`](file:///platform/app/tutor/chat-message.tsx)
* **File**: [`platform/components/navbar.tsx`](file:///platform/components/navbar.tsx)
* **Implementation**:
  * Expand touch hit areas on all buttons, links, and icons to at least $44\times 44\text{px}$ using minimum dimensions or padding.
  * Ensure a minimum of $8\text{px}$ non-interactive separation between adjacent buttons (e.g. Save Note, Copy, .md download).

### D. Mobile History Navigation
* **File**: [`platform/components/mobile-nav.tsx`](file:///platform/components/mobile-nav.tsx)
* **Implementation**:
  * Add the **History** destination (`Clock` icon) to `MobileNav` or embed a persistent History link in the mobile drawer/profile sheet, ensuring mobile students can review past attempts in 1 tap.

### E. Modal Sizing & Scroll Locking
* **File**: [`platform/components/refresher-customizer-modal.tsx`](file:///platform/components/refresher-customizer-modal.tsx)
* **File**: [`platform/app/tutor/byok-modal.tsx`](file:///platform/app/tutor/byok-modal.tsx)
* **Implementation**:
  * Ensure modals use `max-h-[90dvh]` with `overflow-y-auto` on the content container and fixed headers/footers.
  * Apply `overflow: hidden` to `document.body` when any modal or drawer is open.

---

## 3. Step-by-Step Implementation Steps

1. Update `globals.css`: Add the 16px mobile input rule and safe-area utilities.
2. Update `layout.tsx`: Add `pb-24 md:pb-0` to the root body/main wrapper.
3. Update `mobile-nav.tsx`: Add History icon and `safe-area-inset-bottom` padding.
4. Update `retention-board.tsx` and `chat-message.tsx`: Enforce 44px touch targets and 8px spacing.
5. Update modal components: Enforce `90dvh` max height and body scroll lock.

---

## 4. Verification & Walkthrough Steps

1. Open Chrome DevTools with iPhone 14 Pro emulation ($393\times 852\text{px}$).
2. Navigate to `/analytics` and `/history` $\to$ Scroll to the bottom $\to$ Verify all buttons and table rows are fully visible above the mobile navigation bar.
3. Tap the search input in Omni-Search and the AI Tutor composer $\to$ Verify iOS Safari does not zoom the viewport.
4. Tap the History button in `MobileNav` $\to$ Verify it navigates directly to `/history`.
5. Open the BYOK modal $\to$ Try scrolling the background page $\to$ Verify background scroll is locked.
