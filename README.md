# Framer Components

Source-of-truth for Code Components sold on the Framer marketplace, plus
whatever gets bundled into future kits.

Each component lives in its own folder under `components/` as a
self-contained package: the actual `.tsx` file you paste into Framer's Code
Component editor, plus a small Vite scaffold so it can be developed and
tested in a normal browser before it ever touches Framer.

## Components

| Component | Description |
|---|---|
| [`image-card-stack`](components/image-card-stack) | Draggable, Tinder-style stack of image cards with swipe-to-dismiss, loop/no-loop modes, and a reset affordance when the deck empties. |
| [`wipe-reveal`](components/wipe-reveal) | A solid-color panel over an image that scratches away wherever you press and drag, like a scratch card. |

## Adding a new component

```
components/<name>/
  src/<Name>.tsx      # the actual Framer Code Component, paste this into Framer as-is
  src/framer-shim.ts  # local stand-in for Framer's runtime "framer" module
  src/framer.d.ts     # ambient types for "framer" so tsc can check the component standalone
  src/main.tsx         # demo harness for local preview
  package.json, vite.config.ts, tsconfig.json, index.html
```

Each component should:
- Keep property controls to what a buyer would actually reach for (aim for
  well under 10). Bake in animation/physics tuning as constants instead of
  exposing every parameter.
- Work as a plain React component outside Framer (no hard dependency on the
  Framer canvas beyond `addPropertyControls`/`ControlType`).
- Call `useIsStaticRenderer()` and skip all animation/continuous effects when
  it returns true, showing a plain styled fallback instead. Framer's
  automated marketplace review flags components that skip this.
- Declare `@framerSupportedLayoutWidth`/`@framerSupportedLayoutHeight`
  (`auto` if the component sizes itself from content, `any-prefer-fixed` if
  it should fill whatever frame size the buyer drags on canvas) so resizing
  the frame does what it visually implies.
- Ship with a README covering install steps and what's configurable.
