import * as React from "react"
import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * Draggable Image Card Stack
 *
 * A Tinder-style swipeable stack of image cards. Drag a card past the
 * swipe threshold to send it flying off; it loops to the back of the
 * stack (or disappears permanently, depending on `loop`).
 *
 * Only the knobs a buyer would actually reach for are exposed as property
 * controls — animation feel (spring, swipe threshold, drag elasticity) is
 * pre-tuned internally so the component looks good with zero configuration.
 */

// Pre-tuned animation feel — not exposed, so the component looks polished
// out of the box instead of needing manual tuning.
const SWIPE_THRESHOLD = 120
const DRAG_ELASTIC = 0.6
const SPRING = { type: "spring" as const, stiffness: 300, damping: 26 }
const BASE_OFFSET_X = 10
const BASE_OFFSET_Y = 14
const BASE_ROTATION = 4
const BASE_SCALE_STEP = 0.05

type CardImage = {
    src?: string
    alt?: string
}

export interface ImageCardStackProps {
    images: CardImage[]
    visibleCards: number
    cardWidth: number
    cardHeight: number
    borderRadius: number
    stackSpread: number
    loop: boolean
    shadow: boolean
    onSwipe?: (index: number, direction: "left" | "right") => void
    onEmpty?: () => void
}

const DEFAULT_IMAGES: CardImage[] = [
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80", alt: "Mountain landscape" },
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", alt: "Forest path" },
    { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", alt: "Ocean cliff" },
    { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", alt: "Desert dunes" },
]

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ImageCardStack(props: Partial<ImageCardStackProps>) {
    const {
        images = DEFAULT_IMAGES,
        visibleCards = 4,
        cardWidth = 280,
        cardHeight = 380,
        borderRadius = 20,
        stackSpread = 1,
        loop = true,
        shadow = true,
        onSwipe,
        onEmpty,
    } = props

    const offsetX = BASE_OFFSET_X * stackSpread
    const offsetY = BASE_OFFSET_Y * stackSpread
    const rotation = BASE_ROTATION * stackSpread
    const scaleStep = BASE_SCALE_STEP * stackSpread

    // order[0] is the top (frontmost, draggable) card. Indices reference `images`.
    const [order, setOrder] = useState<number[]>(() => images.map((_, i) => i))

    const handleDragEnd = useCallback(
        (topIndex: number) => (_e: any, info: PanInfo) => {
            const passed = Math.abs(info.offset.x) > SWIPE_THRESHOLD
            if (!passed) return

            const direction: "left" | "right" = info.offset.x > 0 ? "right" : "left"
            onSwipe?.(topIndex, direction)

            setOrder((prev) => {
                const [first, ...rest] = prev
                if (loop) return [...rest, first]
                if (rest.length === 0) onEmpty?.()
                return rest
            })
        },
        [loop, onSwipe, onEmpty]
    )

    const reset = useCallback(() => {
        setOrder(images.map((_, i) => i))
    }, [images])

    const visible = useMemo(() => order.slice(0, Math.max(1, visibleCards)), [order, visibleCards])

    if (images.length === 0 || visible.length === 0) {
        return (
            <div
                style={{
                    width: cardWidth,
                    height: cardHeight,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    borderRadius,
                    background: "rgba(128,128,128,0.08)",
                    border: "1px dashed rgba(128,128,128,0.35)",
                    color: "rgba(128,128,128,0.9)",
                    fontFamily: "inherit",
                    fontSize: 14,
                }}
            >
                <span>You've seen them all</span>
                <button
                    onClick={reset}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(128,128,128,0.4)",
                        background: "transparent",
                        color: "inherit",
                        fontFamily: "inherit",
                        fontSize: 13,
                        cursor: "pointer",
                    }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 3-6.7" />
                        <path d="M3 4v5h5" />
                    </svg>
                    Reset
                </button>
            </div>
        )
    }

    return (
        <div
            style={{
                position: "relative",
                width: cardWidth + Math.abs(offsetX) * (visible.length - 1),
                height: cardHeight + Math.abs(offsetY) * (visible.length - 1),
            }}
        >
            <AnimatePresence>
                {visible
                    .map((imgIndex, stackPos) => {
                        const isTop = stackPos === 0
                        const image = images[imgIndex]
                        const depth = visible.length - 1 - stackPos

                        return (
                            <motion.div
                                key={imgIndex}
                                drag={isTop ? "x" : false}
                                dragElastic={DRAG_ELASTIC}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={isTop ? handleDragEnd(imgIndex) : undefined}
                                initial={false}
                                animate={{
                                    x: offsetX * stackPos,
                                    y: offsetY * stackPos,
                                    rotate: stackPos === 0 ? 0 : rotation * (stackPos % 2 === 0 ? 1 : -1) * stackPos,
                                    scale: 1 - scaleStep * stackPos,
                                }}
                                exit={{
                                    x: 300,
                                    opacity: 0,
                                    rotate: 20,
                                    transition: { duration: 0.3 },
                                }}
                                transition={SPRING}
                                whileDrag={{ cursor: "grabbing" }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: cardWidth,
                                    height: cardHeight,
                                    borderRadius,
                                    overflow: "hidden",
                                    cursor: isTop ? "grab" : "default",
                                    zIndex: depth,
                                    boxShadow: shadow
                                        ? `0 ${8 + depth * 2}px ${24 + depth * 4}px rgba(0,0,0,${0.18 - depth * 0.02})`
                                        : "none",
                                    touchAction: "none",
                                    userSelect: "none",
                                }}
                            >
                                {image?.src && (
                                    <img
                                        src={image.src}
                                        alt={image.alt || ""}
                                        draggable={false}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            pointerEvents: "none",
                                        }}
                                    />
                                )}
                            </motion.div>
                        )
                    })
                    .reverse()}
            </AnimatePresence>
        </div>
    )
}

ImageCardStack.defaultProps = {
    images: DEFAULT_IMAGES,
    visibleCards: 4,
    cardWidth: 280,
    cardHeight: 380,
    borderRadius: 20,
    stackSpread: 1,
    loop: true,
    shadow: true,
}

addPropertyControls(ImageCardStack, {
    images: {
        type: ControlType.Array,
        title: "Images",
        control: {
            type: ControlType.Object,
            controls: {
                src: { type: ControlType.Image, title: "Image" },
                alt: { type: ControlType.String, title: "Alt text", defaultValue: "" },
            },
        },
        defaultValue: DEFAULT_IMAGES,
    },
    visibleCards: {
        type: ControlType.Number,
        title: "Visible Cards",
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 4,
    },
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width",
        min: 100,
        max: 800,
        step: 1,
        defaultValue: 280,
    },
    cardHeight: {
        type: ControlType.Number,
        title: "Card Height",
        min: 100,
        max: 900,
        step: 1,
        defaultValue: 380,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 20,
    },
    stackSpread: {
        type: ControlType.Number,
        title: "Stack Spread",
        description: "How far the cards behind the top one fan out — offset, rotation, and scale all together.",
        min: 0,
        max: 2,
        step: 0.1,
        defaultValue: 1,
    },
    loop: {
        type: ControlType.Boolean,
        title: "Loop Cards",
        defaultValue: true,
    },
    shadow: {
        type: ControlType.Boolean,
        title: "Card Shadow",
        defaultValue: true,
    },
})
