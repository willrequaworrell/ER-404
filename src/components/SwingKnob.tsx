import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useState } from "react"

interface KnobPropsType {
    id: string
    label: string
    value: number
    min?: number
    max?: number
    valueFormatter?: (value: number) => string
    onChange: (id: string, value: number) => void
    onDoubleClick?: () => void
}

const ROTATION_RANGE = 300;
const ROTATION_OFFSET = 10;
const DRAG_RANGE = 200


const SwingKnob = ({ id, label, value, min = 0, max = 100, valueFormatter, onChange, onDoubleClick }: KnobPropsType) => {

    const [isDragging, setIsDragging] = useState<boolean>(false)

    const initialDragY = ((value - min) / (max - min)) * DRAG_RANGE;
    const dragY = useMotionValue(initialDragY)

    const rotationDegreesFromDragValue = useTransform(
        dragY,
        [0, DRAG_RANGE],
        [ROTATION_OFFSET, ROTATION_OFFSET + ROTATION_RANGE]
    )

    const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: { delta: { y: number } }) => {
        setIsDragging(true)
        const yDragValue = Math.max(0, Math.min(DRAG_RANGE, dragY.get() - info.delta.y))
        const newRotationFraction = (yDragValue / DRAG_RANGE)
        const newRotationValue = min + (newRotationFraction * (max - min))

        dragY.set(yDragValue)

        // round value and only update state if changed 
        const newRotationValueRounded = Math.round(newRotationValue)
        if (newRotationValueRounded === value) return
        onChange(id, newRotationValueRounded)
    }

    useEffect(() => {
        const percent = (value - min) / (max - min)
        dragY.set(percent * DRAG_RANGE)
    }, [value, min, max])

    return (
        <div className={`flex flex-col h-full items-center `}>

            <div className={`relative flex items-center justify-center size-[2.3rem] `}>
                {/* Outer bevel ring */}
                <div
                    style={{
                        boxShadow: `
                    inset -2px -4px 8px rgba(0,0,0,0.3), 
                    inset 2px 4px 8px rgba(255,255,255,0.6), 
                    -4px -8px 12px rgba(255,255,255,0.9), 
                    4px 8px 12px rgba(0,0,0,0.2) 
                    `,
                    }}
                    className="absolute inset-0 rounded-full bg-accent/50 "
                // shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)]
                ></div>

                {/* Main knob */}
                <motion.div
                    id={id}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    style={{
                        rotate: rotationDegreesFromDragValue, // Bind rotation to motion value
                        cursor: "ns-resize",
                    }}
                    onDrag={handleDrag}
                    onDragEnd={() => setIsDragging(false)}
                    onDoubleClick={onDoubleClick}
                    className={`relative  size-[2rem] rounded-full bg-background 
                `}
                >
                    {/* Small recessed circular area (dot) */}
                    <div
                        className="absolute size-[0.25rem] bg-accent rounded-full 
                    shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]"
                        style={{
                            top: "75%",
                            left: "35%",
                        }}
                    ></div>
                </motion.div>

            </div>
            {/* <div className="absolute w-full  h-[2px] -bottom-3 bg-text-primary "></div>
            <div className="absolute h-2 border-l left-0 -bottom-3 border-1 border-text-primary"></div>
            <div className="absolute h-2 border-r right-0 -bottom-3 border-1 border-text-primary"></div> */}
            <span className="absolute px-2  text-[.75rem] -translate-x-1/2 text-text-primary  -bottom-6 left-1/2">Swing</span>
            {/* <div className="text-[.75rem] text-text-primary">{isDragging ? (valueFormatter ? valueFormatter(value) : value) : label}</div> */}
        </div>

    );
};

export default SwingKnob;
