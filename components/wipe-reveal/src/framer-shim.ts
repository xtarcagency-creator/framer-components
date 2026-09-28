// Local-dev stand-in for the "framer" module that only exists inside the
// Framer canvas. Aliased in vite.config.ts so the real WipeReveal.tsx
// (unchanged) can be previewed in a normal browser.
export const ControlType = {
    Image: "image",
    Enum: "enum",
    Number: "number",
    Color: "color",
    Boolean: "boolean",
} as const

export function addPropertyControls(_component: unknown, _controls: unknown) {
    // no-op outside the Framer canvas
}

export function useIsStaticRenderer() {
    // Local browser preview is always interactive.
    return false
}
