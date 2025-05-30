import Track from "./Track"
import { usePlaybackContext } from "../context/PlaybackContext";

const TracksSection = () => {
    const {tracks, setTracks} = usePlaybackContext()

    return (   
        <>
            {tracks && tracks.map((track, i) => (
                <Track key={i} track={track} setTracks={setTracks} />
            ))}

        </>
    )
}

export default TracksSection
