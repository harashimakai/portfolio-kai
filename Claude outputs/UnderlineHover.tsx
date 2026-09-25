import { addPropertyControls, ControlType } from "framer"
import { useState } from "react"

/**
 * Underline Hover — port of the .underline-hover class
 *
 * Line wipes IN from the left on hover, OUT to the right on exit
 * (transform-origin flips right → left, exactly like the CSS version).
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 180
 * @framerIntrinsicHeight 24
 */
export default function UnderlineHover(props) {
    const {
        text,
        link,
        newTab,
        font,
        color,
        hoverColor,
        lineColor,
        lineHoverColor,
        thickness,
        offset,
        duration,
        colorDuration,
        style,
    } = props

    const [active, setActive] = useState(false)

    const Tag = link ? "a" : "span"

    return (
        <Tag
            href={link || undefined}
            target={link && newTab ? "_blank" : undefined}
            rel={link && newTab ? "noopener noreferrer" : undefined}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                textDecoration: "none",
                cursor: link ? "pointer" : "default",
                whiteSpace: "pre",
                color: active ? hoverColor : color,
                transition: `color ${colorDuration}s ease-in-out`,
                ...font,
                ...style,
            }}
        >
            {text}
            <span
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: -offset,
                    width: "100%",
                    height: thickness,
                    backgroundColor: active ? lineHoverColor : lineColor,
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: active ? "left" : "right",
                    transition: `transform ${duration}s ease-out, background-color ${colorDuration}s ease-in-out`,
                    pointerEvents: "none",
                }}
            />
        </Tag>
    )
}

UnderlineHover.defaultProps = {
    text: "RÉSUMÉ ↗",
    link: "",
    newTab: true,
    color: "#0C2E08",
    hoverColor: "#226A14",
    lineColor: "#0C2E08",
    lineHoverColor: "#226A14",
    thickness: 1.5,
    offset: 3,
    duration: 0.25,
    colorDuration: 0.5,
}

addPropertyControls(UnderlineHover, {
    text: { type: ControlType.String, title: "Text", defaultValue: "RÉSUMÉ ↗" },
    link: { type: ControlType.Link, title: "Link" },
    newTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        defaultValue: true,
        hidden: (p) => !p.link,
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: 16,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
        },
    },
    color: { type: ControlType.Color, title: "Text", defaultValue: "#0C2E08" },
    hoverColor: {
        type: ControlType.Color,
        title: "Text Hover",
        defaultValue: "#226A14",
    },
    lineColor: {
        type: ControlType.Color,
        title: "Line",
        defaultValue: "#0C2E08",
    },
    lineHoverColor: {
        type: ControlType.Color,
        title: "Line Hover",
        defaultValue: "#226A14",
    },
    thickness: {
        type: ControlType.Number,
        title: "Thickness",
        defaultValue: 1.5,
        min: 0.5,
        max: 6,
        step: 0.5,
        unit: "px",
    },
    offset: {
        type: ControlType.Number,
        title: "Offset",
        defaultValue: 3,
        min: -4,
        max: 24,
        step: 1,
        unit: "px",
    },
    duration: {
        type: ControlType.Number,
        title: "Wipe",
        defaultValue: 0.25,
        min: 0.05,
        max: 1.5,
        step: 0.05,
        unit: "s",
    },
    colorDuration: {
        type: ControlType.Number,
        title: "Color Fade",
        defaultValue: 0.5,
        min: 0,
        max: 1.5,
        step: 0.05,
        unit: "s",
    },
})
