"use client";
import { useRef, useImperativeHandle, forwardRef, useState, useEffect } from "react";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleSignatureProps {
    className?: string;
    onSignatureChange?: (signature: string | null) => void;
    placeholder?: string;
    width?: number;
    height?: number;
    value?: string | null;
}

export interface SimpleSignatureRef {
    clear: () => void;
    getSignature: () => string | null;
    isEmpty: () => boolean;
}

export const SimpleSignature = forwardRef<SimpleSignatureRef, SimpleSignatureProps>(
    ({
        className,
        onSignatureChange,
        placeholder = "Sign here",
        width = 400,
        height = 150,
        value = null
    }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [hasSignature, setHasSignature] = useState(false);
        const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

        useImperativeHandle(ref, () => ({
            clear: () => {
                clearCanvas();
            },
            getSignature: () => {
                if (!hasSignature || !canvasRef.current) return null;
                return canvasRef.current.toDataURL('image/png');
            },
            isEmpty: () => {
                return !hasSignature;
            }
        }));

        const clearCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setHasSignature(false);
                onSignatureChange?.(null);
            }
        };

        const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return { x: 0, y: 0 };

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            if ('touches' in e) {
                const touch = e.touches[0] || e.changedTouches[0];
                return {
                    x: (touch.clientX - rect.left) * scaleX,
                    y: (touch.clientY - rect.top) * scaleY
                };
            } else {
                return {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                };
            }
        };

        const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx) return;

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        };

        const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault();
            const pos = getEventPos(e);
            setIsDrawing(true);
            setLastPoint(pos);
            setHasSignature(true);
        };

        const draw = (e: React.MouseEvent | React.TouchEvent) => {
            if (!isDrawing || !lastPoint) return;
            e.preventDefault();

            const currentPos = getEventPos(e);
            drawLine(lastPoint, currentPos);
            setLastPoint(currentPos);
        };

        const stopDrawing = () => {
            if (!isDrawing) return;
            setIsDrawing(false);
            setLastPoint(null);

            // Emit signature change
            const canvas = canvasRef.current;
            if (canvas && hasSignature) {
                const dataURL = canvas.toDataURL('image/png');
                onSignatureChange?.(dataURL);
            }
        };

        // Load existing signature when value changes
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // Set canvas size
            canvas.width = width;
            canvas.height = height;

            // Initialize canvas context
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear and set white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);

            // Load existing signature if provided
            if (value && value.trim()) {
                const img = new Image();
                img.onload = () => {
                    // Clear canvas first
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, width, height);

                    // Draw the existing signature
                    ctx.drawImage(img, 0, 0, width, height);
                    setHasSignature(true);
                };
                img.onerror = () => {
                    console.warn('Failed to load existing signature');
                    setHasSignature(false);
                };
                img.src = value;
            } else {
                setHasSignature(false);
            }
        }, [width, height, value]);

        return (
            <div className="flex flex-col gap-2">
                <div className="relative inline-block">
                    <canvas
                        ref={canvasRef}
                        className={cn(
                            "border border-neutral-300 rounded-lg bg-white cursor-crosshair",
                            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none",
                            "dark:border-neutral-600 dark:bg-neutral-800",
                            "dark:focus:border-blue-400 dark:focus:ring-blue-800",
                            "touch-none", // Prevents default touch behaviors
                            className,
                        )}
                        style={{
                            width: '100%',
                            maxWidth: `${width}px`,
                            height: `${height}px`
                        }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        tabIndex={0}
                    />

                    {/* Placeholder text */}
                    {!hasSignature && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-neutral-400 text-sm select-none">
                                {placeholder}
                            </span>
                        </div>
                    )}

                    {/* Clear button */}
                    {hasSignature && (
                        <button
                            type="button"
                            onClick={clearCanvas}
                            className="absolute top-2 right-2 inline-grid size-8 place-content-center rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 shadow-sm transition-colors dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            title="Clear signature"
                        >
                            <Eraser className="size-4" />
                            <span className="sr-only">Clear signature</span>
                        </button>
                    )}
                </div>

                {/* Status indicator */}
                <p className="text-xs text-neutral-500">
                    {hasSignature ? "✓ Signature captured" : "Draw your signature above"}
                </p>
            </div>
        );
    }
);

SimpleSignature.displayName = "SimpleSignature";