// Minimal ambient types for the "framer" module, which only exists inside
// the Framer canvas at runtime. Lets tsc typecheck ImageCardStack.tsx
// standalone; real behavior comes from Framer itself when pasted in there.
declare module "framer" {
    export const ControlType: Record<string, string>
    export function addPropertyControls(component: unknown, controls: unknown): void
    export function useIsStaticRenderer(): boolean
}
