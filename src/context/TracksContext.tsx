import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";
import { initialTracks } from "../util/initialTrackData";

interface masterFXSettingsType {
    volume: number
}

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
    setTrackSetting: (settingName: keyof TrackType['knobSettings'], value: number) => void
    masterFXSettings: masterFXSettingsType
    handleSetMasterFXSettings: (settingName: keyof masterFXSettingsType, value: number) => void
}



const TracksContext = createContext<TracksContextType | null>(null)
const NUM_BUTTONS = 16

export const TracksProvider = ({children}: {children: ReactNode}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(120)
    const [tracks, setTracks] = useState<TrackType[]>(initialTracks)
    const [currentTrack, setCurrentTrack] = useState<number>(0)
    const [currentBeat, setCurrentBeat] = useState<number>(0)
    const [masterFXSettings, setMasterFXSettings] = useState<masterFXSettingsType>({
        volume: 100
    })

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

    const handleSetMasterFXSettings = (settingName: keyof masterFXSettingsType, value: number) => {
        setMasterFXSettings(prevSettings => {
            return {
                ...prevSettings,
                [settingName]: value
            }
        })

        if (settingName === "volume") {
            const volumeDb = ((value / 100) * 60) - 60
            Tone.getDestination().volume.value = volumeDb
        }
    }

    const setTrackSetting = (settingName: keyof TrackType['knobSettings'], value: number) => {
        setTracks( prevTracks => {
            const newTracks = [...prevTracks]
            const trackToUpdate = newTracks[currentTrack]

            trackToUpdate.knobSettings = {
                ...trackToUpdate.knobSettings,
                [settingName]: value
            }

            if (settingName === "volume") {
                const volumeDb = ((value / 100) * 60) - 60 // convert to decibels from -60 to 0
                trackToUpdate.volume.volume.value = volumeDb
            }

            return newTracks
        })
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
        tracks.forEach(track => {
            track.player.disconnect()

            track.player.chain(track.volume, Tone.getDestination())
        })
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
            globalReset: globalReset,
            setTrackSetting: setTrackSetting,
            masterFXSettings: masterFXSettings, 
            handleSetMasterFXSettings: handleSetMasterFXSettings,
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

