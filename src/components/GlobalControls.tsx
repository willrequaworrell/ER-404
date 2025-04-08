import { FaPlay, FaStop, FaUndoAlt } from "react-icons/fa"
import Button from "./Button"
import { useTracksContext } from "../context/TracksContext"
import BPMDisplay from "./BPMDisplay"

const GlobalControls = () => {
    const {globalPlay, globalStop, globalReset} = useTracksContext()


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
                playButton
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
            <BPMDisplay/>
        </div>
    )
}

export default GlobalControls
