import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect } from "react"

interface KnobPropsType {
    label: string
    value: number
    min?: number
    max?: number
    isMasterVol?: boolean
    onChange: (value: number) => void
}

const ROTATION_RANGE = 300; 
const ROTATION_OFFSET = 10;
const DRAG_RANGE = 200


const Knob = ({label, value=50, min=0, max=100, isMasterVol=false, onChange}: KnobPropsType) => {

    const dragY = useMotionValue(0)

    const rotationDegreesFromDragValue = useTransform(
        dragY, 
        [0,DRAG_RANGE], 
        [ROTATION_OFFSET , ROTATION_OFFSET + ROTATION_RANGE]
    ) 

    const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: {delta: {y: number}}) => {
        const yDragValue = Math.max(0, Math.min(DRAG_RANGE, dragY.get() - info.delta.y))
        const newRotationFraction = (yDragValue / DRAG_RANGE)
        const newRotationValue = min + (newRotationFraction * (max - min))

        dragY.set(yDragValue)
        onChange(newRotationValue)
    }

    useEffect( () => {
        const percent = (value - min) / (max - min)
        dragY.set(percent * DRAG_RANGE)
    }, [value, min, max])

  return (
    <div className='flex flex-col items-center justify-end h-full gap-y-2'>

        <div className={`relative flex items-center justify-center  ${isMasterVol ? "size-[5rem]" : "size-[2.75rem]"}`}>
        {/* Outer bevel ring */}
        <div
            className="absolute inset-0 rounded-full bg-accent/50
            shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)]"
        ></div>

        {/* Main knob */}
        <motion.div
            drag="y"
            dragConstraints={{top:0, bottom: 0}}
            dragElastic={0}
            dragMomentum={false}
            style={{
                rotate: rotationDegreesFromDragValue, // Bind rotation to motion value
                cursor: "ns-resize",
              }}
            onDrag={handleDrag}
            className={`relative ${isMasterVol ? "size-[4.54rem]" : "size-[2.5rem]"} rounded-full bg-background 
            shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)]`}
            
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
        <div className="text-[.75rem] text-text-primary">{label}</div>
    </div>
    
  );
};

export default Knob;
