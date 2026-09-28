import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

/**
 * Wipe Reveal
 *
 * A solid-color panel covers the image until it scrolls into view, then
 * wipes away in the chosen direction to reveal it. Triggers once by
 * default; can be set to replay every time it re-enters the viewport.
 */

const EASE = [0.65, 0, 0.35, 1] as const

type Direction = "left" | "right" | "top" | "bottom"

const ORIGIN: Record<Direction, string> = {
    left: "right center",
    right: "left center",
    top: "center bottom",
    bottom: "center top",
}

const AXIS: Record<Direction, "scaleX" | "scaleY"> = {
    left: "scaleX",
    right: "scaleX",
    top: "scaleY",
    bottom: "scaleY",
}

type ImageAsset = {
    src?: string
    alt?: string
}

export interface WipeRevealProps {
    image: ImageAsset
    direction: Direction
    duration: number
    delay: number
    overlayColor: string
    borderRadius: number
    replay: boolean
    style?: React.CSSProperties
}

const DEFAULT_IMAGE: ImageAsset = {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Ocean cliff",
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function WipeReveal(props: Partial<WipeRevealProps>) {
    const {
        image = DEFAULT_IMAGE,
        direction = "left",
        duration = 0.9,
        delay = 0,
        overlayColor = "#111111",
        borderRadius = 0,
        replay = false,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const containerRef = useRef<HTMLDivElement>(null)
    const [revealed, setRevealed] = useState(isStatic)

    useEffect(() => {
        if (isStatic) return
        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (replay) {
                    setRevealed(entry.isIntersecting)
                } else if (entry.isIntersecting) {
                    setRevealed(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [isStatic, replay])

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                overflow: "hidden",
                borderRadius,
                width: 400,
                height: 300,
                ...style,
            }}
        >
            {image?.src && (
                <img
                    src={image.src}
                    alt={image.alt || ""}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            )}
            {!isStatic && (
                <motion.div
                    initial={false}
                    animate={{ [AXIS[direction]]: revealed ? 0 : 1 }}
                    transition={{ duration, delay, ease: EASE }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: overlayColor,
                        transformOrigin: ORIGIN[direction],
                    }}
                />
            )}
        </div>
    )
}

WipeReveal.defaultProps = {
    image: DEFAULT_IMAGE,
    direction: "left",
    duration: 0.9,
    delay: 0,
    overlayColor: "#111111",
    borderRadius: 0,
    replay: false,
}

addPropertyControls(WipeReveal, {
    image: {
        type: ControlType.Image,
        title: "Image",
    },
    direction: {
        type: ControlType.Enum,
        title: "Direction",
        options: ["left", "right", "top", "bottom"],
        optionTitles: ["From Left", "From Right", "From Top", "From Bottom"],
        defaultValue: "left",
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        min: 0.2,
        max: 3,
        step: 0.1,
        defaultValue: 0.9,
    },
    delay: {
        type: ControlType.Number,
        title: "Delay",
        min: 0,
        max: 2,
        step: 0.1,
        defaultValue: 0,
    },
    overlayColor: {
        type: ControlType.Color,
        title: "Overlay Color",
        defaultValue: "#111111",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
    },
    replay: {
        type: ControlType.Boolean,
        title: "Replay",
        description: "Wipe again every time it re-enters view, instead of only the first time.",
        defaultValue: false,
    },
})
