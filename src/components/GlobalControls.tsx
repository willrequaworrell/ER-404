import { FaPlay, FaStop, FaUndoAlt } from "react-icons/fa"
import Button from "./Button"
import { usePlaybackContext } from "../context/PlaybackContext"
import BPMDisplay from "./BPMDisplay"
import SpectrumAnalyzer from "./SpectrumAnalyzer"

const GlobalControls = () => {
    const {globalPlay, globalStop, globalReset} = usePlaybackContext()


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
        <div className="flex items-center justify-end w-3/5 h-full gap-x-4 ">
            <div className="flex h-full w-1/3 items-center justify-end gap-x-4  ">

                <Button
                    icon={<FaPlay />}
                    playButton
                    styles="h-3/4 w-1/4 rounded-full"
                    onClick={handlePlay}
                />
                <Button
                    icon={<FaStop />}
                    styles="h-3/4 w-1/4 rounded-full"
                    onClick={handleStop}
                />
                <Button
                    icon={<FaUndoAlt />}
                    styles="h-3/4 w-1/4 rounded-full"
                    onClick={handleReset}
                />
            </div>
            <div className="flex items-center flex-1 h-full justify-center w-full min-w-[100px] max-w-[300px]">
                <SpectrumAnalyzer/>
            </div>
            <div className="h-full flex items-center w-1/4 ">
                <BPMDisplay/>
            </div>
        </div>
    )
}

export default GlobalControls
