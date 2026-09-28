# Wipe Reveal: Framer Code Component

A solid-color panel covers your image until it scrolls into view, then
wipes away in the direction you choose to reveal it.

## Install into Framer

1. In Framer, add a new **Code Component** (Assets panel, Code, `+`).
2. Replace its contents with `src/WipeReveal.tsx`.
3. Drag it onto the canvas and resize the frame like any other layer
   (it fills whatever size you give it). The property panel exposes:
   - **Image**
   - **Direction** (From Left, From Right, From Top, From Bottom)
   - **Duration**, **Delay**
   - **Overlay Color** (the panel that wipes away)
   - **Border Radius**
   - **Replay** (wipe again every time it re-enters view, instead of only once)

By default the reveal only ever plays once, the first time the component
scrolls into view, which is what most buyers want for a hero image or a
portfolio piece.

## Local preview (outside Framer)

```bash
npm install
npm run dev      # scroll down to trigger the reveal in a real browser
npm run build    # typecheck + production build sanity check
```

`src/framer-shim.ts` plus the `framer` alias in `vite.config.ts` stand in
for Framer's runtime `framer` module so the exact same `WipeReveal.tsx`
file can be dev-tested locally and then pasted unmodified into Framer.

## Notes for marketplace packaging

- No external dependencies beyond `framer-motion`, which Framer already bundles.
- Declares `@framerSupportedLayoutWidth/Height: any-prefer-fixed` and spreads Framer's injected `style` prop, so resizing the frame on canvas actually resizes the component (unlike a fixed intrinsic size).
- Uses `useIsStaticRenderer()` to skip the scroll-trigger and animated overlay entirely on the canvas and in exports, showing the image fully revealed instead.
- Good candidate to bundle with other interactive-image components (image card stack, tilt card, before/after slider) as an "Interactive Image Kit".
