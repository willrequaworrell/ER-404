import { FaPlay, FaCaretUp, FaCaretDown, FaStop, FaUndoAlt } from "react-icons/fa"
import Button from "./Button"
import ScreenContainer from "./ScreenContainer"
import { useTracksContext } from "../context/TracksContext"

const GlobalControls = () => {
    const {globalPlay, globalStop, globalReset, BPM, setBPM} = useTracksContext()

    const handleIncrementBPM = () => {
        setBPM(prev => Math.min((prev + 1), 200))
    }

    const handleDecrementBPM = () => {
        setBPM(prev => Math.max((prev - 1), 50))
    }

    const handlePlay = () => {
        globalPlay()
    }

    const handleStop = () => {
        globalStop()
    }

    const handleReset = () => {
        globalReset()
    }

    return (
        <div className="flex gap-x-4">
            <Button
                icon={<FaPlay />}
                styles="size-[3rem]"
                onClick={handlePlay}
            />
            <Button
                icon={<FaStop />}
                styles="size-[3rem]"
                onClick={handleStop}
            />
            <Button
                icon={<FaUndoAlt />}
                styles="size-[3rem]"
                onClick={handleReset}
            />
            <div className="flex flex-col justify-between gap-y-2">
                <Button
                    icon={<FaCaretUp />}
                    styles="w-[3rem] h-1/2"
                    onClick={handleIncrementBPM}
                />
                <Button
                    icon={<FaCaretDown />}
                    styles="w-[3rem] h-1/2"
                    onClick={handleDecrementBPM}
                />
            </div>
            <ScreenContainer
                styles="w-[6rem] text-[1.5rem]"
            >
                <p>{BPM}</p>
            </ScreenContainer>
        </div>
    )
}

export default GlobalControls
