import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";
import { useGlobalStateContext } from "./GlobalStateContext";

interface TracksContextType {
    tracks: TrackType[]
    setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>
    globalPlay: () => void
}

const NUM_BUTTONS = 16

const initialTracks: TrackType[] = [
    {index: 0, name: "KICK", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/KICK.wav", autostart: false,}).toDestination()},
    {index: 1, name: "CLAP", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/CLAP.wav", autostart: false,}).toDestination()},
    {index: 2, name: "OPEN HAT", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/OH.wav", autostart: false,}).toDestination()},
    {index: 3, name: "SNARE", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/SNARE.wav", autostart: false,}).toDestination()},
]

const TracksContext = createContext<TracksContextType | null>(null)

export const TracksProvider = ({children}: {children: ReactNode}) => {
    const {BPM} = useGlobalStateContext()
    const [tracks, setTracks] = useState<TrackType[]>(initialTracks)
    const beatRef = useRef(0)

    const globalPlay = () => {
        Tone.getTransport().cancel()
        Tone.getTransport().scheduleRepeat(time => {
            
            tracks.forEach(track => {
                if (track.trackButtons[beatRef.current]) {
                    track.player.start(time)
                }
            })
            beatRef.current = (beatRef.current + 1) % NUM_BUTTONS
        }, "8n")
        Tone.getTransport().start()

    }

    useEffect( () => {
        Tone.getTransport().bpm.value = BPM
    }, [BPM])

    return (
        <TracksContext.Provider value={{tracks, setTracks, globalPlay}}>
            {children}
        </TracksContext.Provider>
    )
}

export const useTracksContext = () => {
    const context = useContext(TracksContext)
    
    if (!context) {
        throw new Error('No Tracks Context')
    }
    return context
}

