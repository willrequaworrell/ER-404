import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useState } from "react"

interface FaderPropsType {
  id: string
  label: string
  value: number
  min?: number
  max?: number
  valueFormatter?: (value: number) => string
  onChange: (id: string, value: number) => void
  onDoubleClick?: () => void
}

const FADER_WIDTH = "w-[4vw]"     // matches Knob’s outerWidth
const TRACK_WIDTH  = "w-[.3vw]"   // slim track inside the slot
const HANDLE_SIZE  = "w-[3vw] h-[1.75vh]"    // matches Knob’s innerWidth

const Fader = ({
  id,
  label,
  value,
  min = 0,
  max = 100,
  valueFormatter,
  onChange,
  onDoubleClick,
}: FaderPropsType) => {
  const [isDragging, setIsDragging] = useState(false)

  // 0% → top (max), 100% → bottom (min)
  const initialPct = ((max - value) / (max - min)) * 100
  const dragY = useMotionValue(initialPct)
  const topPct = useTransform(dragY, [0, 100], ["0%", "100%"])

  const handleDrag = (_: any, info: { delta: { y: number } }) => {
    setIsDragging(true)
    const raw = dragY.get() + info.delta.y
    const clamped = Math.min(100, Math.max(0, raw))
    dragY.set(clamped)

    const newVal = Math.round(max - (clamped / 100) * (max - min))
    if (newVal !== value) onChange(id, newVal)
  }

  useEffect(() => {
    const pos = ((max - value) / (max - min)) * 100
    dragY.set(pos)
  }, [value, min, max, dragY])

  return (
    <div className={`relative flex flex-col items-center h-[9vh] ${FADER_WIDTH} `}>
      {/* Track */}
      <div
        className={`relative h-full ${TRACK_WIDTH} rounded bg-gray-600 `}
        style={{
          boxShadow: `
            inset -1px -2px 4px rgba(0,0,0,0.3),
            inset  1px  2px 4px rgba(255,255,255,0.6)
          `,
        }}
      >
        {/* Handle */}
        <motion.div
          id={id}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={() => setIsDragging(false)}
          onDoubleClick={onDoubleClick}
          style={{
            top: topPct,
            boxShadow: `
              inset -2px -4px 8px rgba(0,0,0,0.3),
              inset  2px  4px 8px rgba(255,255,255,0.6),
              -4px  -8px 12px rgba(255,255,255,0.9),
               4px   8px 12px rgba(0,0,0,0.2)
            `,
            cursor: "ns-resize",
          }}
          className={`absolute ${HANDLE_SIZE} -translate-x-1/2 -translate-y-1/2 left-1/2 rounded-full bg-background flex items-center justify-center`}
        >
          <div className="h-1 w-1/3 rounded bg-accent/50"></div>
        </motion.div>
      </div>

      {/* Label or value */}
      <div className="text-[.75rem] text-text-primary mt-2">
        {isDragging
          ? valueFormatter
            ? valueFormatter(value)
            : value
          : label}
      </div>
    </div>
  )
}

export default Fader
