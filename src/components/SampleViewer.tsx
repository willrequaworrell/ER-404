import { FaHeadphones, FaVolumeMute } from "react-icons/fa"
import Button from "./Button"
import ScreenContainer from "./ScreenContainer"
import { useTracksContext } from "../context/TracksContext"



const SampleViewer = () => {
    const { tracks, currentTrack } = useTracksContext()

    return (
        <ScreenContainer
            styles="h-full w-full p-4"
        >
            <img src={tracks[currentTrack].sampleImgFile} className="h-full" alt="current track sample visualized" />
        </ScreenContainer>

    )
}

export default SampleViewer
