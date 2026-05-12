# Technical Specification — SRI KAPOTHESWARA DELUXE WOMEN'S PG Website

## Dependencies

### Core
- `react` + `react-dom` — UI framework
- `vite` — build tool
- `@vitejs/plugin-react` — React support for Vite
- `typescript` — type safety
- `tailwindcss` — utility-first CSS

### Animation & Effects
- `gsap` — all animations (ScrollTrigger, quickTo, timeline)
- `lenis` — smooth scrolling

### Dev Dependencies
- `@types/react` + `@types/react-dom`
- `autoprefixer` + `postcss`
- `tailwindcss` (v3 with `@tailwindcss/vite` plugin for v4)

### Google Fonts (loaded via CSS `@import`)
- Noto Serif Display (400, 500, 600, italic)
- Inter (300, 400, 500)

---

## Component Inventory

### Layout

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| `Navigation` | Custom | Single | Fixed top bar. GSAP-driven shrink on scroll (>100px). Nav links with underline hover. |
| `Footer` | Custom | Single | Three-column layout. Static content. |
| `Cursor` | Custom | Single | Conditionally rendered (hidden on touch via CSS media query). GSAP quickTo for smooth follow. |
| `WhatsAppButton` | Custom | Single | Fixed floating button. Always visible. |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| `HeroSection` | Custom | Split layout (55/45). Contains DotGrid canvas + text content. Mobile: stacks, canvas as subtle bg. |
| `AboutSection` | Custom | 45/55 text/image split. Entrance animations via ScrollTrigger. |
| `FacilitiesSection` | Custom | Dark bg. 3-column grid of FacilityCard. Staggered entrance. |
| `GallerySection` | Custom | Masonry-style grid (mixed aspect ratios). Image hover scale. |
| `TestimonialsSection` | Custom | Dark bg. Quote carousel with auto-advance (6s). Dot navigation. |
| `ContactSection` | Custom | 50/50 split. Left: contact info + form. Right: map embed. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| `SectionLabel` | Custom | All sections | "INTER 11px uppercase" label pattern. Accepts text + optional color override. |
| `DotGrid` | Custom | HeroSection | Canvas-based multi-color dot grid. Self-contained canvas lifecycle (init, render, resize, mouse events, cleanup). |
| `FacilityCard` | Custom | FacilitiesSection | Icon circle + title + description. Hover lift effect. |
| `TestimonialCarousel` | Custom | TestimonialsSection | Auto-advancing quote carousel with fade transitions and dot nav. |

---

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Dot Grid (multi-color, breathing, mouse repulsion) | Canvas 2D API | Custom render loop: `requestAnimationFrame`, Dot class with per-dot phase offset, distance-based repulsion, staggered brick grid. IntersectionObserver to pause off-viewport. | **High 🔒** |
| Canvas resize handling | Canvas 2D API + ResizeObserver | Recalculate cols/rows on container resize. Re-init dot grid. DPR capped at 2. | Medium |
| Nav shrink on scroll | GSAP | `gsap.to(navEl, { height: 48, duration: 0.2 })` triggered at scrollY > 100px. Reverse when scrolling back up. | Low |
| Nav link underline hover | CSS | `::after` pseudo-element, `width: 0 → 100%`, `transition: 300ms`. Pure CSS. | Low |
| Hero heading entrance | GSAP | `gsap.from(headingWords, { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", delay: 0.3 })` | Medium |
| Hero subtitle + CTA entrance | GSAP | `gsap.from([subtitle, cta], { opacity: 0, y: 20, stagger: 0.2, duration: 0.4 })`, starts after heading completes via timeline or delay. | Low |
| Section entrance (generic pattern) | GSAP + ScrollTrigger | `gsap.from(el, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } })` | Low |
| Staggered children entrance | GSAP + ScrollTrigger | Same pattern but `gsap.from(children, { y: 40, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" })`. Applied to facility cards, gallery images. | Low |
| About heading slide-up | GSAP + ScrollTrigger | Line-by-line: `translateY(60px) → 0`, stagger 0.12s, `power3.out`, `start: "top 80%"`. | Medium |
| About image slide-in | GSAP + ScrollTrigger | `translateX(80px) → 0` + fade, 1s, `power3.out`, 0.2s delay after heading. | Low |
| Facility card hover | CSS | `transform: translateY(-4px)`, icon circle bg brightens. Pure CSS transitions. | Low |
| Gallery image hover | CSS | `transform: scale(1.05)` within `overflow: hidden` container. Pure CSS transition 400ms. | Low |
| Testimonial auto-advance | GSAP + setInterval | `gsap.to(current, { opacity: 0, y: -20, duration: 0.4, onComplete: ... })` → `gsap.fromTo(next, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })`. 6s interval via `setInterval`. | Medium |
| Contact column slide-in | GSAP + ScrollTrigger | Left: `translateX(-60px) → 0`, Right: `translateX(60px) → 0` + 0.15s delay. `power3.out`, `start: "top 80%"`. | Low |
| Smooth cursor follow | GSAP quickTo | `gsap.quickTo(cursorEl, "x", { duration: 0.35, ease: "power2.out" })`. Updated on mousemove. | Low |
| Smooth scrolling | Lenis | `new Lenis({ lerp: 0.08, smoothWheel: true })`. Integrated with GSAP ticker + ScrollTrigger. | Low |

---

## State & Logic Plan

### Lenis ↔ GSAP Ticker Integration
Lenis must be driven by GSAP's ticker (not a separate rAF loop) to avoid frame desync. Initialize Lenis in a top-level hook (e.g., `useSmoothScroll`), wire `lenis.on('scroll', ScrollTrigger.update)`, and add `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `gsap.ticker.lagSmoothing(0)`. Single source of truth for all scroll-linked animation updates.

### DotGrid Canvas Lifecycle
The DotGrid component owns its entire canvas lifecycle imperatively (not via React state):
- **Init**: On mount + resize, compute cols/rows, create Dot array, start `requestAnimationFrame` loop.
- **Render loop**: Each frame: clear → iterate dots → compute breath + mouse repulsion → draw arc → restore position. Mouse state is a single mutable object (not React state) to avoid re-renders.
- **Mouse events**: Attached directly to canvas element (`mousemove`, `mouseleave`, `touchmove`, `touchend`). Call `updateMouse()` to mutate shared mouse state object.
- **Cleanup**: Cancel rAF, remove event listeners, disconnect ResizeObserver on unmount.
- **Visibility**: Use `IntersectionObserver` on canvas container. Pause rAF loop when not visible.

### Testimonial Carousel State
- Use `useState` for `activeIndex` (0, 1, 2).
- `useEffect` with `setInterval(6000)` to auto-advance. Clear interval on unmount.
- GSAP handles the transition animation (fade out current → fade in next), not React. React only updates `activeIndex`. A separate `useEffect` watches `activeIndex` and triggers the GSAP transition.
- Optional: pause/resume on hover via mouseenter/mouseleave.

### Navigation Scroll Detection
- Use `useEffect` with a scroll listener (or Lenis scroll callback) to detect `scrollY > 100`.
- Toggle a CSS class or state boolean. GSAP tweens the height/opacity change for smoothness.
- Debounce not needed — Lenis provides smooth scroll values.

---

## Other Key Decisions

### Canvas Strategy: Imperative, Not Declarative
The dot grid uses raw Canvas 2D API inside a React `useRef` + `useEffect`. No React wrapper library (like `react-canvas`). The entire render loop, mouse physics, and resize logic live in a custom hook `useDotGrid(canvasRef, containerRef)` that returns nothing — it runs side effects only.

### Google Fonts Loading
Load Noto Serif Display and Inter via a single `<link>` tag in `index.html` (or CSS `@import`). Use `font-display: swap` to prevent FOIT. Only load the required weights: Noto Serif Display (400, 500, 600, italic) and Inter (300, 400, 500).

### Tailwind Configuration
Extend Tailwind theme with the design's color palette and typography. Custom colors: `warm-brown` (#4E342E), `deep-saffron` (#D84315), `warm-ivory` (#FFF8F0), `dark-brown` (#2E1A0F), `amber-accent` (#FF8F00), `warm-taupe` (#8D6E63). Custom fonts: `display` (Noto Serif Display) and `body` (Inter).
