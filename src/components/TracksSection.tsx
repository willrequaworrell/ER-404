import Track from "./Track"
import { useTracksContext } from "../context/TracksContext";

const TracksSection = () => {
    const {tracks, setTracks} = useTracksContext()

    return (   
        <>
            {tracks && tracks.map((track, i) => (
                <Track key={i} track={track} setTracks={setTracks} />
            ))}

        </>
    )
}

export default TracksSection
