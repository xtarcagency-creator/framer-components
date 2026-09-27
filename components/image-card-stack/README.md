# Draggable Image Card Stack — Framer Code Component

A Tinder-style swipeable stack of image cards, built as a Framer Code
Component (works via drag on desktop and touch on mobile).

## Install into Framer

1. In Framer, add a new **Code Component** (Assets panel → Code → `+`).
2. Replace its contents with `src/ImageCardStack.tsx`.
3. Drag the component onto the canvas — the property panel exposes:
   - **Images** (add/reorder any number of images + alt text)
   - Visible Cards, Card Width/Height, Border Radius
   - Stack Offset X/Y, Stack Rotation, Scale Step (controls the "fanned deck" look)
   - Swipe Threshold, Drag Elasticity
   - Loop Cards (swiped card returns to the back of the deck vs. disappears)
   - Card Shadow, Spring Stiffness/Damping (animation feel)
   - Empty State Text
4. Wire `onSwipe(index, direction)` to a Framer event/interaction if you want
   to trigger something (e.g. an overlay, a counter) when a card is swiped.

## Local preview (outside Framer)

```bash
npm install
npm run dev      # interactive preview in a real browser
npm run build    # typecheck + production build sanity check
```

`src/framer-shim.ts` + the `framer` alias in `vite.config.ts` stand in for
Framer's runtime `framer` module (which provides `addPropertyControls`) so
the exact same `ImageCardStack.tsx` file can be dev-tested locally and then
pasted unmodified into Framer.

## Notes for marketplace packaging

- No external dependencies beyond `framer-motion`, which Framer already bundles — safe for the marketplace review.
- All visual/behavioral knobs are property-controlled; no code editing required by buyers.
- Good candidate to bundle with other interactive-image components (tilt card, scroll reveal, before/after slider) as an "Interactive Image Kit".
