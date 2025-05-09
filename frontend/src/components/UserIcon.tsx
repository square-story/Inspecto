"use client";

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";

const pathVariant: Variants = {
    normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        pathOffset: [1, 0],
    },
};

const circleVariant: Variants = {
    normal: {
        pathLength: 1,
        pathOffset: 0,
        scale: 1,
    },
    animate: {
        pathLength: [0, 1],
        pathOffset: [1, 0],
        scale: [0.5, 1],
    },
};

interface UserProps extends React.SVGAttributes<SVGSVGElement> {
    width?: number;
    height?: number;
    strokeWidth?: number;
    stroke?: string;
}

const User = ({
    width = 28,
    height = 28,
    strokeWidth = 2,
    stroke = "#ffffff",
    ...props
}: UserProps) => {
    const controls = useAnimation();

    return (
        <div
            style={{
                cursor: "pointer",
                userSelect: "none",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onMouseEnter={() => controls.start("animate")}
            onMouseLeave={() => controls.start("normal")}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                {...props}
            >
                <motion.circle
                    cx="12"
                    cy="8"
                    r="5"
                    animate={controls}
                    variants={circleVariant}
                />
                <motion.path
                    d="M20 21a8 8 0 0 0-16 0"
                    variants={pathVariant}
                    transition={{
                        delay: 0.2,
                        duration: 0.4,
                    }}
                    animate={controls}
                />
            </svg>
        </div>
    );
};

export { User };
