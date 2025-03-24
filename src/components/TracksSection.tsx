import { useEffect, useState } from "react"
import Track from "./Track"

const dummyTracks = [
    "KICK",
    "CLAP",
    "SNARE",
    "OPEN HAT",
]

const TracksSection = () => {

    const [tracks, setTracks] = useState<string[]>([])


    useEffect( () => {
        setTracks(dummyTracks)
    }, [])
    return (
        <>
            {tracks && tracks.map((track, i) => (
                <Track key={i} trackName={track} />
            ))}

        </>
    )
}

export default TracksSection
