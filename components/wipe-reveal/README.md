# Wipe Reveal: Framer Code Component

A solid-color panel covers your image. Press and drag across it (mouse,
pen, or touch) to erase the panel along your path, like a scratch card,
revealing the image underneath.

## Install into Framer

1. In Framer, add a new **Code Component** (Assets panel, Code, `+`).
2. Replace its contents with `src/WipeReveal.tsx`.
3. Drag it onto the canvas and resize the frame like any other layer
   (it fills whatever size you give it). The property panel exposes:
   - **Image**
   - **Overlay Color** (the panel that gets scratched away)
   - **Brush Size**
   - **Border Radius**
   - **Reset Button** (shows a small button to repaint the panel so it
     can be scratched again)
4. Wire `onReveal()` to a Framer event or interaction if you want to
   trigger something the first time a visitor starts scratching.

## Local preview (outside Framer)

```bash
npm install
npm run dev      # press and drag across the panel in a real browser
npm run build    # typecheck + production build sanity check
```

`src/framer-shim.ts` plus the `framer` alias in `vite.config.ts` stand in
for Framer's runtime `framer` module so the exact same `WipeReveal.tsx`
file can be dev-tested locally and then pasted unmodified into Framer.

## Notes for marketplace packaging

- No external dependencies beyond React (no `framer-motion`, it's a canvas-based effect, not a CSS animation).
- Declares `@framerSupportedLayoutWidth/Height: any-prefer-fixed` and spreads Framer's injected `style` prop, so resizing the frame on canvas actually resizes the component.
- Uses `useIsStaticRenderer()` to skip the canvas and pointer handling entirely on the canvas and in exports, showing the plain overlay color as a static fallback instead.
- Good candidate to bundle with other interactive-image components (image card stack, tilt card, before/after slider) as an "Interactive Image Kit".
