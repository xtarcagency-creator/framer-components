// Local-dev stand-in for the "framer" module that only exists inside the
// Framer canvas. Aliased in vite.config.ts so the real ImageCardStack.tsx
// (unchanged) can be previewed in a normal browser.
export const ControlType = {
    Array: "array",
    Object: "object",
    Image: "image",
    String: "string",
    Number: "number",
    Boolean: "boolean",
} as const

export function addPropertyControls(_component: unknown, _controls: unknown) {
    // no-op outside the Framer canvas
}

export function useIsStaticRenderer() {
    // Local browser preview is always interactive.
    return false
}
