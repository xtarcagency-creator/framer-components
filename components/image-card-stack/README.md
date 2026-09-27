# Draggable Image Card Stack: Framer Code Component

A Tinder-style swipeable stack of image cards, built as a Framer Code
Component (works via drag on desktop and touch on mobile).

## Install into Framer

1. In Framer, add a new **Code Component** (Assets panel, Code, `+`).
2. Replace its contents with `src/ImageCardStack.tsx`.
3. Drag the component onto the canvas. The property panel exposes:
   - **Images** (add/reorder any number of images, each with alt text)
   - Visible Cards, Card Width/Height, Border Radius
   - Stack Spread (how far cards behind the top one fan out)
   - Loop Cards (swiped card returns to the back of the deck vs. disappears)
   - Card Shadow
4. Wire `onSwipe(index, direction)` and `onEmpty()` to a Framer event or
   interaction if you want to trigger something (an overlay, a counter)
   when a card is swiped or the deck runs out.

Swipe threshold, drag elasticity, and spring physics are pre-tuned
internally so the component looks good with zero configuration; they are
not exposed as property controls.

## Local preview (outside Framer)

```bash
npm install
npm run dev      # interactive preview in a real browser
npm run build    # typecheck + production build sanity check
```

`src/framer-shim.ts` plus the `framer` alias in `vite.config.ts` stand in
for Framer's runtime `framer` module (which provides `addPropertyControls`)
so the exact same `ImageCardStack.tsx` file can be dev-tested locally and
then pasted unmodified into Framer.

## Notes for marketplace packaging

- No external dependencies beyond `framer-motion`, which Framer already bundles, so it's safe for marketplace review.
- All visual/behavioral knobs are property-controlled; no code editing required by buyers.
- Good candidate to bundle with other interactive-image components (tilt card, scroll reveal, before/after slider) as an "Interactive Image Kit".
