import * as React from "react"
import { useCallback, useEffect, useRef } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

/**
 * Wipe Reveal
 *
 * A solid-color panel covers the image. Press and drag (mouse, pen, or
 * touch) across it to erase the panel along your path, like a scratch
 * card, revealing the image underneath. A small reset button repaints
 * the panel so it can be scratched again.
 */

type ImageAsset = {
    src?: string
    alt?: string
}

export interface WipeRevealProps {
    image: ImageAsset
    overlayColor: string
    brushSize: number
    borderRadius: number
    showResetButton: boolean
    onReveal?: () => void
    style?: React.CSSProperties
}

const DEFAULT_IMAGE: ImageAsset = {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Ocean cliff",
}

function paintOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
    ctx.save()
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function WipeReveal(props: Partial<WipeRevealProps>) {
    const {
        image = DEFAULT_IMAGE,
        overlayColor = "#C4C4C4",
        brushSize = 60,
        borderRadius = 0,
        showResetButton = true,
        onReveal,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawingRef = useRef(false)
    const lastPointRef = useRef<{ x: number; y: number } | null>(null)
    const revealedRef = useRef(false)

    useEffect(() => {
        if (isStatic) return
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resize = () => {
            const rect = container.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.max(1, Math.round(rect.width * dpr))
            canvas.height = Math.max(1, Math.round(rect.height * dpr))
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            paintOverlay(ctx, rect.width, rect.height, overlayColor)
            revealedRef.current = false
        }

        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(container)
        return () => observer.disconnect()
    }, [isStatic, overlayColor])

    const eraseTo = useCallback((x: number, y: number) => {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineWidth = brushSize
        ctx.beginPath()
        const from = lastPointRef.current ?? { x, y }
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(x, y)
        ctx.stroke()
        lastPointRef.current = { x, y }

        if (!revealedRef.current) {
            revealedRef.current = true
            onReveal?.()
        }
    }, [brushSize, onReveal])

    const getPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }, [])

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            drawingRef.current = true
            lastPointRef.current = null
            e.currentTarget.setPointerCapture(e.pointerId)
            const { x, y } = getPos(e)
            eraseTo(x, y)
        },
        [eraseTo, getPos]
    )

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            if (!drawingRef.current) return
            const { x, y } = getPos(e)
            eraseTo(x, y)
        },
        [eraseTo, getPos]
    )

    const endStroke = useCallback(() => {
        drawingRef.current = false
        lastPointRef.current = null
    }, [])

    const handleReset = useCallback(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        const ctx = canvas?.getContext("2d")
        if (!ctx || !container) return
        const rect = container.getBoundingClientRect()
        paintOverlay(ctx, rect.width, rect.height, overlayColor)
        revealedRef.current = false
    }, [overlayColor])

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                overflow: "hidden",
                borderRadius,
                width: 400,
                height: 300,
                userSelect: "none",
                ...style,
            }}
        >
            {image?.src && (
                <img
                    src={image.src}
                    alt={image.alt || ""}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
            )}

            {isStatic ? (
                <div style={{ position: "absolute", inset: 0, background: overlayColor }} />
            ) : (
                <>
                    <canvas
                        ref={canvasRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={endStroke}
                        onPointerLeave={endStroke}
                        onPointerCancel={endStroke}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            touchAction: "none",
                            cursor: "crosshair",
                        }}
                    />
                    {showResetButton && (
                        <button
                            onClick={handleReset}
                            aria-label="Reset"
                            style={{
                                position: "absolute",
                                bottom: 10,
                                right: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                border: "1px solid rgba(128,128,128,0.4)",
                                background: "rgba(20,20,20,0.55)",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 3-6.7" />
                                <path d="M3 4v5h5" />
                            </svg>
                        </button>
                    )}
                </>
            )}
        </div>
    )
}

WipeReveal.defaultProps = {
    image: DEFAULT_IMAGE,
    overlayColor: "#C4C4C4",
    brushSize: 60,
    borderRadius: 0,
    showResetButton: true,
}

addPropertyControls(WipeReveal, {
    image: {
        type: ControlType.Image,
        title: "Image",
    },
    overlayColor: {
        type: ControlType.Color,
        title: "Overlay Color",
        defaultValue: "#C4C4C4",
    },
    brushSize: {
        type: ControlType.Number,
        title: "Brush Size",
        min: 20,
        max: 150,
        step: 5,
        defaultValue: 60,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
    },
    showResetButton: {
        type: ControlType.Boolean,
        title: "Reset Button",
        description: "Shows a small button to repaint the overlay so it can be scratched again.",
        defaultValue: true,
    },
})
