# Portfolio Landing Page Notes

## Project

- **Owner:** Srishty Singh
- **Purpose:** Personal portfolio built with HTML, CSS, and JavaScript.
- **Entry page:** `index.html`
- **Assets:** `assets/images/websitebanner/`

## Source Images

| File | Use |
| --- | --- |
| `Desktop - 1.png` | Initial split-screen visual reference. |
| `Desktop - 2.png` | Full designer-view visual reference. |
| `Desktop - 3.png` | Full developer-view visual reference. |
| `6668835.png` | Floral designer illustration. |
| `Untitled_design__3_-removebg-preview.png` | Developer/laptop illustration. |
| `1000199316-Photoroom.png` | Central portrait illustration. |

## Initial Layout

- Full-screen landing page with a 55/45 split:
  - Left: white designer panel.
  - Right: black developer panel.
- The portrait starts at the divide between both panels.
- Header contains the Srishty Singh brand and Home, About, and Resume links.

## Loading Motion

- Designer and developer panels enter from opposite sides.
- Portrait appears after the panels.
- Navigation slides down from the top after a 3-second delay.

## Current Pointer Interaction

- Moving the cursor toward the **right** causes the developer panel to expand leftward.
- Moving the cursor toward the **left** causes the designer panel to expand rightward.
- At the far takeover states, the active panel fills the screen.
- The motion is intentionally eased using JavaScript interpolation for a slower glide.
- The non-active panel fades as the active panel takes over.
  - Designer panel fades from white toward black when the developer takes over.
  - Developer panel fades from black toward white when the designer takes over.
- Portrait movement is clamped between 20% and 80% of viewport width. It returns smoothly when the cursor moves back.

## Implementation Files

- `index.html` — page structure and asset references.
- `assets/css/style.css` — responsive split-screen layout, entry animations, fade/color states, and positioning.
- `assets/js/main.js` — cursor position mapping, smooth split transitions, panel state classes, opacity/color variables, and portrait clamp.

## Specification-to-Implementation Guide

This section connects each design specification to the implementation so the page can be maintained or used as a learning example.

### 1. 60/40 designer/developer landing layout

**Specification:** Show a white designer area on the left and a black developer area on the right, beginning at a 60/40 ratio.

**Implementation:**

- `index.html` has two full-viewport sections: `.panel--designer` and `.panel--developer`.
- Each panel is positioned with `position: absolute; inset: 0`, so both occupy the same full-screen area.
- CSS clips each panel instead of changing its physical width:
  - Designer: `clip-path: inset(0 calc(100% - var(--split)) 0 0)`.
  - Developer: `clip-path: inset(0 0 0 var(--split))`.
- The CSS custom property `--split` starts at `55%`. Therefore, the left panel shows 55% of the page and the right panel shows the remaining 45%.

**Why clip paths:** Both panel contents can stay laid out against the full viewport. The visible boundary can then animate without text and images being reflowed on every pointer movement.

### 2. Use the supplied illustrations

**Specification:** Use the floral illustration for the designer area, the laptop illustration for the developer area, and the portrait in the middle.

**Implementation:**

- The three `<img>` elements in `index.html` load the images from `assets/images/websitebanner/`.
- The flower and laptop images are inside their own panels so they are naturally revealed or hidden by the panel clip path.
- The portrait is outside both panels and has a higher `z-index`, allowing it to visually sit over the split boundary.

### 3. Entrance animations

**Specification:** The two panels should enter from opposite directions, the portrait should appear afterward, and the navigation should drop in after 3 seconds.

**Implementation:**

- `.panel--designer` uses the `arrive-left` keyframe animation, beginning fully clipped from the left and ending at the 55% split.
- `.panel--developer` uses `arrive-right`, beginning fully clipped from the right and ending at the 55% split.
- `.portrait` uses `reveal-portrait`, which fades it in and moves it upward slightly after a `1.15s` delay.
- `.site-header` uses `reveal-nav` with a `3s` animation delay to move down from above the viewport.
- When the panel animations finish, `main.js` sets their inline animation to `none`. This releases the final keyframe so normal pointer-driven `clip-path` updates can control the panels.

### 4. Cursor-driven takeover direction

**Specification:** Moving toward the right should make the developer panel expand leftward. Moving toward the left should make the designer panel expand rightward.

**Implementation:**

- The `pointermove` event on `.hero` passes the cursor’s horizontal position to `setTarget()` in `main.js`.
- `setTarget()` converts pixels to a percentage of viewport width.
- It maps positions right of 55% to a lower `--split` value. A smaller split means the developer panel’s left clip inset shrinks, revealing more of that panel toward the left.
- It maps positions left of 55% to a higher `--split` value. A larger split reveals more of the designer panel toward the right.
- Values are clamped to the 0–100 range, so the panels never reveal beyond the viewport.

### 5. Slower, smoother movement

**Specification:** The split should feel slower than a direct cursor follow.

**Implementation:**

- `targetSplit` stores the target location based on the current pointer position.
- `displayedSplit` is the location currently rendered on screen.
- The animation loop gradually moves `displayedSplit` toward `targetSplit` using:

  ```js
  displayedSplit += (targetSplit - displayedSplit) * 0.045;
  ```

- The small `0.045` factor creates smoothing. Lower values make the movement slower; higher values make it respond faster.
- `requestAnimationFrame(animate)` runs the calculation before the browser’s next paint for fluid movement.

### 6. Fade and color transition during takeover

**Specification:** As one side expands, the other should fade, with white becoming black and black becoming white.

**Implementation:**

- `main.js` derives `designerVisibility` and `developerVisibility` from `displayedSplit`.
- These are passed into CSS as custom properties such as `--designer-visibility`, `--developer-visibility`, `--designer-color`, and `--developer-color`.
- The content wrappers use their matching visibility value as `opacity`, fading illustrations and text on the retreating side.
- Each panel’s `background-color` uses HSL grayscale values controlled by its color property:
  - Designer lightness moves from `100%` (white) down to `0%` (black).
  - Developer lightness moves from `0%` (black) up to `100%` (white).

### 7. Portrait movement limit

**Specification:** The portrait must not move farther than 20% from the left or 80% from the left, but it must return when the cursor returns.

**Implementation:**

- `main.js` calculates `portraitPosition` separately from the panel split.
- For developer expansion, it maps the portrait from 55% down to 20%.
- For designer expansion, it maps the portrait from 55% up to 80%.
- The result is set as the `--portrait-position` CSS property, used by `.portrait { left: var(--portrait-position); }`.
- The map never outputs values below 20% or above 80%, which creates the requested stopping point while keeping the return journey smooth.

### 8. Full takeover copy states

**Specification:** At a near-complete takeover, reveal the fuller descriptive copy for the active role.

**Implementation:**

- `main.js` adds `.designer-active` when the designer split is greater than 96%, and `.developer-active` when it is less than 4%.
- CSS uses these state classes to make the corresponding `.intro` text visible.
- The designer intro becomes visible at the expanded state while the signature remains visible.

### 9. Accessibility and smaller screens

**Implementation:**

- Every illustration has an `alt` description.
- Navigation has `aria-label="Primary navigation"`.
- The `@media (max-width: 700px)` section scales text and illustration positions for smaller viewports.
- The `prefers-reduced-motion` media query shortens animations and transitions for people who have asked their operating system to reduce motion.

### 10. Active illustration follows the portrait

**Specification:** Keep the flower and laptop in their current initial positions. When the designer expands, move the flower with the portrait while the laptop stays in place. When the developer expands, move the laptop with the portrait while the flower stays in place.

**Implementation:**

- The initial CSS positions remain `39%` for the flower and `57%` for the laptop.
- `main.js` calculates the portrait’s distance from its initial 55% position.
- `flowerPosition` adds only positive portrait movement (toward the right), so it moves only during designer expansion.
- `laptopPosition` adds only negative portrait movement (toward the left), so it moves only during developer expansion.
- CSS custom properties (`--flower-offset` and `--laptop-offset`) apply the calculated movement while preserving each layout's original `left` position, including on smaller screens.
- This preserves the initial spacing between the active illustration and the portrait instead of placing the images directly on top of one another.

### 11. Role heading movement during takeover

**Specification:** As the developer panel expands, its heading should smoothly move to `top: 15%` and grow to `15dvh`. As the designer panel expands, its heading should smoothly grow to `15dvh`; its signature should move to a 16% bottom gap and remain visible with the intro.

**Implementation:**

- `main.js` derives continuous `designerTakeover` and `developerTakeover` progress values directly from the split position. This is important because visibility describes the fading panel, while takeover progress describes the expanding panel.
- It writes the required title position, title font size, and signature bottom position to custom CSS properties on every animation frame, so they use the same eased flow as the panels, portrait, and illustrations.
- The developer title moves from `top: 35%` to `top: 15%` and grows from `12dvh` to `15dvh`.
- The designer title stays at `top: 15%` and grows from `12dvh` to `15dvh`.
- The signature moves from `bottom: 13%` to `bottom: 16%`, and no active-state rule hides it when the designer intro appears.

### 12. Clickable role panels

**Specification:** Each landing panel should act as a button: designer opens `portfolio.html` and developer opens `about.html`.

**Implementation:**

- Each panel contains a full-size `.panel-link` anchor placed above its visual content.
- The designer anchor uses `href="portfolio.html"`; the developer anchor uses `href="about.html"`.
- The anchor remains inside its panel, so the same panel clipping defines the clickable region as the screen expands or contracts.
- `portfolio.html` has been added as a basic destination page and can be expanded with the project work later.

### 13. Solid navigation bar above the hero

**Specification:** The header should have one beige color and the split-screen main content should begin below it.

**Implementation:**

- `.site-header` is a normal document-flow element with a fixed `--header-height`, a beige `#e9d8c3` background, and dark navigation text.
- Its former `mix-blend-mode: difference` behavior was removed so its color does not change over the designer or developer panels.
- `.hero` uses `height: calc(100svh - var(--header-height))`, reserving the header's space instead of placing the hero behind it.
- The header still keeps its existing downward entrance animation; the hero remains directly below it throughout the animation.

### 14. Scrollable project section below the landing area

**Specification:** Content added below the landing screen should be visible when the visitor scrolls down.

**Implementation:**

- The project markup is placed after the closing `</main>` tag for `.hero`, so it is no longer inside the hero's fixed height and clipping boundary.
- The desktop body now uses `overflow-x: hidden` rather than `overflow: hidden`, restoring vertical page scrolling while preventing horizontal overflow from the animations.
- The hero keeps `overflow: hidden`, which confines its split-screen artwork without hiding later page sections.
- A `.projects` section and responsive card-grid styles present the added “Latest work” content beneath the hero.

## Future Updates

Add future visual, copy, animation, or navigation changes below this line, including the date and files changed.
