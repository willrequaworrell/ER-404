import { FaCaretUp, FaCaretDown } from "react-icons/fa"
import Button from "./Button"
import ScreenContainer from "./ScreenContainer"
import { useTracksContext } from "../context/TracksContext"
import { useRef } from "react"

const BPMDisplay = () => {
    const { BPM, setBPM } = useTracksContext()
    const intervalRef = useRef<number | null>(null)
    const timeoutRef = useRef<number | null>(null)


    const handleButtonActivate = ( type: 'increment' | 'decrement') => {
        
        if (type === "increment") {
            setBPM(prev => Math.min((prev + 1), 200))
        } else {
            setBPM(prev => Math.max((prev - 1), 50))
        }
        
        timeoutRef.current = setTimeout(() => {
            
            intervalRef.current = setInterval(() => {
                if (type === "increment") {
                    setBPM(prev => Math.min((prev + 1), 200))
                } else {
                    setBPM(prev => Math.max((prev - 1), 50))
                }
            }, 100)
            

        }, 500)
    }

    const handleButtonCleanup = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

    }

    return (
        <>
            <div className="flex flex-col justify-between gap-y-2">
                <Button
                    icon={<FaCaretUp />}
                    styles="w-[3rem] h-1/2"
                    onMouseDown={() => handleButtonActivate("increment")}
                    onMouseUp={handleButtonCleanup}
                    onMouseLeave={handleButtonCleanup}
                    onTouchStart={() => handleButtonActivate("increment")}
                    onTouchEnd={handleButtonCleanup}
                />
                <Button
                    icon={<FaCaretDown />}
                    styles="w-[3rem] h-1/2"
                    onMouseDown={() => handleButtonActivate("decrement")}
                    onMouseUp={handleButtonCleanup}
                    onMouseLeave={handleButtonCleanup}
                    onTouchStart={() => handleButtonActivate("increment")}
                    onTouchEnd={handleButtonCleanup}
                />
            </div>
            <ScreenContainer
                styles="w-[6rem] text-[1.5rem]"
            >
                <p>{BPM}</p>
            </ScreenContainer>
        </>
    )
}

export default BPMDisplay
