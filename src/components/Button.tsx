import { MouseEventHandler, ReactNode, TouchEventHandler } from "react"
import { useTracksContext } from "../context/TracksContext"

interface ButtonPropsType {
    icon: ReactNode
    playButton?: boolean
    styles?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    onMouseDown?: MouseEventHandler<HTMLButtonElement>
    onMouseUp?: () => void
    onMouseLeave?: () => void
    onTouchStart?: TouchEventHandler<HTMLButtonElement>
    onTouchEnd?: TouchEventHandler<HTMLButtonElement>
}

const activatedStyles = "shadow-[inset_-4px_-4px_9px_#ffffffe0,inset_2px_2px_4px_#718eab1a]"
const activatedStylesPlayButton = "shadow-[inset_-4px_-4px_9px_#ffffffe0,inset_2px_2px_4px_#718eab1a] cursor-not-allowed"

const Button = ({ icon, playButton = false, styles = "", onClick, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd }: ButtonPropsType) => {
    const { isPlaying } = useTracksContext()

    return (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className={`
                flex
                justify-center
                items-center
                bg-background 
                rounded-2xl 
                shadow-[4px_4px_6px_#b0c0c9,-4px_-4px_6px_#ffffff]
                transition-all
                cursor-pointer
                active:shadow-[inset_-4px_-4px_9px_#ffffffe0,inset_2px_2px_4px_#718eab1a]
                ${styles} 
                ${(playButton && isPlaying) && activatedStylesPlayButton}
            `}
            disabled={playButton && isPlaying}
        >
            {icon}
        </button>
    )
}

export default Button
