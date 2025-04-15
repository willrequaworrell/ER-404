import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";
import { initialTracks } from "../util/initialTrackData";

interface masterFXSettingsType {
    lowCut: number
    highCut: number
    reverb: number
    delay: number
    compressorRatio: number
    compressorThreshold: number
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
    handleToggleTrackMute: (trackIngex: number) => void
    handleToggleTrackSolo: (trackIngex: number) => void
    setTrackSetting: (settingName: keyof TrackType['knobSettings'], value: number) => void
    masterFXSettings: masterFXSettingsType
    handleSetMasterFXSettings: (settingName: keyof masterFXSettingsType, value: number) => void
    masterVolumeLevel: number
}



const TracksContext = createContext<TracksContextType | null>(null)
const NUM_BUTTONS = 32

export const TracksProvider = ({children}: {children: ReactNode}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(120)
    const [tracks, setTracks] = useState<TrackType[]>(initialTracks)
    const [currentTrack, setCurrentTrack] = useState<number>(0)
    const [currentBeat, setCurrentBeat] = useState<number>(0)
    const [masterVolumeLevel, setMasterVolumeLevel] = useState<number>(0)
    const [masterFXSettings, setMasterFXSettings] = useState<masterFXSettingsType>({
        lowCut: 0,
        highCut: 0,
        reverb: 0,
        delay: 0,
        compressorRatio: 0,
        compressorThreshold: 100,
        volume: 100,
    })

    const beatRef = useRef(0)
    const tracksRef = useRef(tracks)
    const scheduleIdRef = useRef<number | null>(null)
    const masterLowCutRef = useRef<Tone.Filter | null>(null)
    const masterHighCutRef = useRef<Tone.Filter | null>(null)
    const masterReverbRef = useRef<Tone.Reverb | null>(null)
    const masterCompressorRef = useRef<Tone.Compressor | null>(null)
    const masterLimiterRef = useRef<Tone.Limiter | null>(null)
    const masterMeterRef = useRef<Tone.Meter | null>(null)
    



    const confirmOrCreateSchedule = () => {
        if (!scheduleIdRef.current) {
            
            scheduleIdRef.current = Tone.getTransport().scheduleRepeat(time => {
                
                const currentBeatFromRef = beatRef.current;
                const nextBeat = (currentBeatFromRef + 1) % NUM_BUTTONS;
                beatRef.current = nextBeat;

                Tone.getDraw().schedule(() => {
                    setCurrentBeat(nextBeat);
                }, time);
            
                
                tracksRef.current.forEach(track => {
                    if (track.trackButtons[currentBeatFromRef]) {
                        track.player.start(time);
                        track.envelope.triggerAttack(time);
                        track.envelope.triggerRelease(
                            time + Number(track.envelope.attack) + Number(track.envelope.decay) + 0.001
                        );
                    }
                });  
              
            
            }, "16n")
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

    const handleToggleTrackMute = (trackIndex: number) => {
        
        setTracks(prevTracks => {
            return prevTracks.map((track, index) => {
                if (index !== trackIndex) return track

                const newMuteState = !track.isMuted

                const updatedTrack = {
                    ...track,
                    isMuted: newMuteState
                }
                
                updatedTrack.player.mute = newMuteState

                return updatedTrack
            })
        })
    }

    const handleToggleTrackSolo = (trackIndex: number) => {
        console.log("solo toggle for", tracks[trackIndex].name)
        setTracks(prevTracks => {
            
            // update track state with target track solo toggled
            const tracksSoloUpdated = prevTracks.map(track => {
                if (trackIndex !== track.index) return track
                
                return {
                    ...track,
                    isSoloed: !track.isSoloed
                }

            })
            
            // check if any tracks are soloed
            const anyTracksSoloed: boolean = tracksSoloUpdated.some(track => track.isSoloed === true)

            // update tracks mute states based on new soloed states
            const tracksWithSoloAndMuteUpdate = tracksSoloUpdated.map(track => {
                if (anyTracksSoloed) {
                    return {
                        ...track,
                        isMuted: !track.isSoloed
                    }
                } else {
                    return {
                        ...track, 
                        isMuted: false
                    }
                }
            })

            // sync new mute states with actual player mute states in tone.js
            tracksWithSoloAndMuteUpdate.forEach(track => {
                track.player.mute = track.isMuted
            })

            return tracksWithSoloAndMuteUpdate

        })

    }

    const handleSetMasterFXSettings = (settingName: keyof masterFXSettingsType, value: number) => {
        setMasterFXSettings(prevSettings => {
            return {
                ...prevSettings,
                [settingName]: value
            }
        })

        if (settingName === "volume") {
            const volumeDb = -60 + ((value / 100) * 60) 
            Tone.getDestination().volume.value = volumeDb
        }

        if (settingName === "compressorThreshold") {
            if (!masterCompressorRef.current) return 
            const thresholdVal = -30 + ((value / 100) * 30)
            masterCompressorRef.current.threshold.value = thresholdVal
        }

        if (settingName === "compressorRatio") {
            if (!masterCompressorRef.current) return 
            const ratioVal = 1 + ((value / 100) * 7)
            masterCompressorRef.current.ratio.value = ratioVal
        }

        if (settingName === "reverb") {
            if (!masterReverbRef.current) return 
            const WET_RANGE = 0.5
            const DECAY_RANGE = 2.9
            const wetVal = (value / 100) * WET_RANGE
            const decayVal = 0.1 + ((value / 100) * DECAY_RANGE)
            masterReverbRef.current.decay = decayVal
            masterReverbRef.current.wet.value = wetVal
        }

        if (settingName === "highCut") {
            if (!masterHighCutRef.current) return 
            const freqRange = 20000 - 2000 
            const highCutFreq = 20000 - ((value / 100) * freqRange)
            masterHighCutRef.current.frequency.value = highCutFreq
        }

        if (settingName === "lowCut") {
            if (!masterLowCutRef.current) return 
            const freqRange = 2000 - 0  
            const lowCutFreq = ((value / 100) * freqRange)
            masterLowCutRef.current.frequency.value = lowCutFreq
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
                const MIN_VOLUME_DBS = 24
                const volumeDb = (-1 * MIN_VOLUME_DBS) + ((value / 100) * MIN_VOLUME_DBS) // convert 0-100 value to decibels in -MIN_VOLUME_DBS to 0
                trackToUpdate.volume.volume.value = volumeDb
            }

            if (settingName === "lowCut") {
                // filter cutoff from 0 to 2k 
                const freqRange = 2000 - 0  
                const lowCutFreq = ((value / 100) * freqRange)
                trackToUpdate.lowCut.frequency.value = lowCutFreq
            }
            
            if (settingName === "highCut") {
                // filter cutoff from 20k to 2k  
                const freqRange = 20000 - 2000 
                const highCutFreq = 20000 - ((value / 100) * freqRange)
                trackToUpdate.highCut.frequency.value = highCutFreq
            }

            if (settingName === "attack") {
                const attackRange = 0.2 - 0
                const attackSeconds = ((value / 100) * attackRange)
                trackToUpdate.envelope.attack = attackSeconds
            }
            
            if (settingName === "decay") {
                const MIN_DECAY_TIME = 0.05
                const decayRange = 3 - MIN_DECAY_TIME
                const decaySeconds = MIN_DECAY_TIME + ((value / 100) * decayRange)
                trackToUpdate.envelope.decay = decaySeconds
            }

            if (settingName === "reverb") {
                const WET_RANGE = 0.5
                const DECAY_RANGE = 2.9
                const wetVal = (value / 100) * WET_RANGE
                const decayVal = 0.1 + ((value / 100) * DECAY_RANGE)
                trackToUpdate.reverb.wet.value = wetVal
                trackToUpdate.reverb.decay = decayVal
            }
            
            if (settingName === "delay") {
                const WET_RANGE = 1
                const wetVal = (value / 100) * WET_RANGE
                trackToUpdate.delay.wet.value = wetVal
            }

            return newTracks
        })
    }

    // initialize master chain refs & dispose on unmount
    useEffect(() => {
        masterLowCutRef.current = new Tone.Filter(0, "highpass")
        masterHighCutRef.current = new Tone.Filter(20000, "lowpass")
        masterReverbRef.current = new Tone.Reverb({
            wet: 0, 
            decay: 0.1,
            preDelay: 0.01
        })
        masterCompressorRef.current = new Tone.Compressor({
            ratio: 8,
            threshold: 0,
            attack: 0.02,
            release: 0.1
        })
        masterLimiterRef.current = new Tone.Limiter(-0.5)
        masterMeterRef.current = new Tone.Meter();
    
        
        return () => {
            masterLowCutRef.current?.dispose()
            masterHighCutRef.current?.dispose()
            masterReverbRef.current?.dispose()
            masterCompressorRef.current?.dispose()
            masterLimiterRef.current?.dispose()
            masterMeterRef.current?.dispose()
        };
    }, []);

    
    // Set up chain for each track
    useEffect( () => {

        tracks.forEach(track => {
            track.player.disconnect()
            track.player.chain(
                track.envelope,
                track.lowCut,
                track.highCut,
                track.volume,
                track.delay,
                track.reverb,
                masterLowCutRef.current!,
                masterHighCutRef.current!,
                masterCompressorRef.current!,
                masterLimiterRef.current!,
                masterMeterRef.current!,
                Tone.getDestination()
            )
        })
    }, [])

    // handle master volume tracking
    useEffect(() => {
        if (!isPlaying || !masterMeterRef.current) return;
        
        const meterInterval = setInterval(() => {
            const level = masterMeterRef.current!.getValue();
            
            const levelDB = typeof level === 'number' 
                ? level 
                : 20 * Math.log10(Math.max(level[0], level[1]));
                
            setMasterVolumeLevel(levelDB)
        }, 100); 
        
        // Clean up interval when not playing
        return () => clearInterval(meterInterval);
    }, [isPlaying]);

    useEffect( () => {
        tracksRef.current = tracks
    }, [tracks])

    useEffect( () => {
        Tone.getTransport().bpm.value = BPM
    }, [BPM])

    // handle transport schedule cleanup
    useEffect(() => {
        
        return () => {
            if (scheduleIdRef.current !== null) {
                Tone.getTransport().clear(scheduleIdRef.current);
                scheduleIdRef.current = null;
            }
        };
       
    }, [])
    


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
            handleToggleTrackMute: handleToggleTrackMute,
            handleToggleTrackSolo: handleToggleTrackSolo,
            setTrackSetting: setTrackSetting,
            masterFXSettings: masterFXSettings, 
            handleSetMasterFXSettings: handleSetMasterFXSettings,
            masterVolumeLevel: masterVolumeLevel
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

