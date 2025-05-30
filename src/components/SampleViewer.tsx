import ScreenContainer from "./ScreenContainer"
import { usePlaybackContext } from "../context/PlaybackContext"


const SampleViewer = () => {
    const { tracks, currentTrack } = usePlaybackContext()

    return (
        <ScreenContainer
            styles="h-full w-full p-4"
        >
            <img src={tracks[currentTrack].currentSample.img} className="h-full" alt="current track sample visualized" />
        </ScreenContainer>

    )
}

export default SampleViewer
