import { FaPlay, FaStop, FaUndoAlt } from "react-icons/fa"
import Button from "./Button"
import { useTracksContext } from "../context/TracksContext"
import BPMDisplay from "./BPMDisplay"
import SpectrumAnalyzer from "./SpectrumAnalyzer"

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
        <div className="flex items-center w-3/5 h-full gap-x-4">
            <div className="flex h-full w-1/3 items-center justify-end gap-x-4 ">

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
            <SpectrumAnalyzer/>
            <div className="h-full flex items-center w-1/4">
                <BPMDisplay/>
            </div>
        </div>
    )
}

export default GlobalControls
