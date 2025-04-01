import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";

interface TracksContextType {
    tracks: TrackType[]
    setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>
    currentTrack: number
    setCurrentTrack: React.Dispatch<React.SetStateAction<number>>
    BPM: number
    setBPM: React.Dispatch<React.SetStateAction<number>>
    currentBeat: number
    isPlaying: boolean
    globalPlay: () => void
    globalStop: () => void
    globalReset: () => void
}

const NUM_BUTTONS = 16

const initialTracks: TrackType[] = [
    {index: 0, name: "KICK", sampleImgFile: "/KICK_IMG.png",trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/KICK.wav", autostart: false,}).toDestination()},
    {index: 1, name: "CLAP", sampleImgFile: "/CLAP_IMG.png", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/CLAP.wav", autostart: false,}).toDestination()},
    {index: 2, name: "SNARE", sampleImgFile: "/SNARE_IMG.png", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/SNARE.wav", autostart: false,}).toDestination()},
    {index: 3, name: "OPEN HAT", sampleImgFile: "/OH_IMG.png", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/OH.wav", autostart: false,}).toDestination()},
    {index: 4, name: "CLOSED HAT", sampleImgFile: "/CH_IMG.png", trackButtons: new Array(NUM_BUTTONS).fill(false), player: new Tone.Player({url: "/CH.wav", autostart: false,}).toDestination()},
]

const TracksContext = createContext<TracksContextType | null>(null)

export const TracksProvider = ({children}: {children: ReactNode}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(120)
    const [tracks, setTracks] = useState<TrackType[]>(initialTracks)
    const [currentTrack, setCurrentTrack] = useState<number>(0)
    const [currentBeat, setCurrentBeat] = useState<number>(0)

    const beatRef = useRef(0)
    const tracksRef = useRef(tracks)
    const scheduleIdRef = useRef<number | null>(null)


    const confirmOrCreateSchedule = () => {
        if (!scheduleIdRef.current) {
            scheduleIdRef.current = Tone.getTransport().scheduleRepeat(time => {
        
                tracksRef.current.forEach(track => {
                    if (track.trackButtons[beatRef.current]) {
                        track.player.start(time)
                    }
                })
    
                Tone.getDraw().schedule(() => {
                    beatRef.current = (beatRef.current + 1) % NUM_BUTTONS
                    setCurrentBeat(beatRef.current)
                }, time)
    
            
            }, "8n")
        }
    }

    const globalPlay = async () => {

        try {
            await Tone.start()
    
            Tone.getTransport().position = 0
            beatRef.current = 0
            setCurrentBeat(0)

            confirmOrCreateSchedule()

            Tone.getTransport().start()
            setIsPlaying(true)
    
            
        } catch (error) {
            console.error("Audio context startup failed.", error)
        }

    }

    const globalStop = () => {
        if (!isPlaying) return

        Tone.getTransport().stop()
        Tone.getTransport().cancel()

        scheduleIdRef.current = null

        Tone.getTransport().position = 0;
        beatRef.current = 0;
        setCurrentBeat(0);

        setIsPlaying(false)
    }

    const globalReset = () => {
        globalStop()
        setTracks(initialTracks)
        tracksRef.current = initialTracks
    }

    useEffect(() => {
        
        return () => {
            if (scheduleIdRef.current !== null) {
                Tone.getTransport().clear(scheduleIdRef.current);
                scheduleIdRef.current = null;
            }
        };
       
    }, [])
    
    useEffect( () => {
        tracksRef.current = tracks
    }, [tracks])

    useEffect( () => {
        Tone.getTransport().bpm.value = BPM
    }, [BPM])

    return (
        <TracksContext.Provider value={{
            tracks: tracks, 
            setTracks: setTracks, 
            currentTrack: currentTrack,
            setCurrentTrack: setCurrentTrack,
            BPM: BPM, 
            setBPM: setBPM,
            currentBeat: currentBeat, 
            isPlaying: isPlaying,
            globalPlay: globalPlay, 
            globalStop: globalStop,
            globalReset: globalReset
        }}>
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

