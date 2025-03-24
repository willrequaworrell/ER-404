import { useState } from "react"

const TrackButton = () => {
    const [active, setActive] = useState<boolean>(false)

    return (
        <button
            type="button"
            onClick={() => setActive(prev => !prev)}
            className={`
                h-full
                w-full
                ${active ? "bg-accent/20" : "bg-background"} 
                rounded-2xl 
                shadow-[4px_4px_6px_#b0c0c9,-4px_-4px_6px_#ffffff]
                transition-all
                cursor-pointer
                ${active && "shadow-[inset_-4px_-4px_9px_#ffffffe0,inset_2px_2px_4px_#718eab1a]"}
            `}
        >
            
        </button>
    )
}

export default TrackButton
