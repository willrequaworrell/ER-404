import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";
import { initialTracks } from "../util/initialTrackData";
import { defaultMasterFXSettings, MasterFXSettingsType } from "../types/masterFXSettings";
import { LoadStateFromLocalStorage, saveStateToLocalStorage } from "../util/localStorageinteraction";
import { SampleType } from "../types/sample";
import { applyMasterKnobSettings, applySampleKnobSettings, rebuildTrackChain } from "../util/tracksHelpers";
import { mapKnobIdToProperty, mapKnobValueToRange } from "../util/knobValueHelpers";


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
    resetMasterFXKnobValue: (knobId: string) => void
    resetSampleFXKnobValue: (trackIndex: number, knobId: string) => void
    handleToggleTrackMute: (trackIndex: number) => void
    handleToggleTrackSolo: (trackIndex: number) => void
    handleChangeTrackSample: (trackIndex: number, newSample: SampleType) => void
    setTrackSetting: (settingName: keyof TrackType['knobSettings'], value: number) => void
    masterFXSettings: MasterFXSettingsType
    handleSetMasterFXSettings: (settingName: keyof MasterFXSettingsType, value: number) => void
    masterVolumeLevel: number
}



const TracksContext = createContext<TracksContextType | null>(null)
const NUM_BUTTONS = 16

export const TracksProvider = ({children}: {children: ReactNode}) => {
    const savedState = LoadStateFromLocalStorage()

    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(savedState?.BPM || 120)
    const [tracks, setTracks] = useState<TrackType[]>(initialTracks.map((track, index) => {
        // get saved sample if it exists, otherwise fallback on initial
        const playerSample = savedState?.tracks[index].currentSample.file || track.currentSample.file
        const newPlayer = new Tone.Player({url: playerSample, autostart: false})
        
        return {
            ...track, 
            trackButtons: savedState?.tracks[index].trackButtons || track.trackButtons,
            knobSettings: savedState?.tracks[index].knobSettings || track.knobSettings,
            isMuted: savedState?.tracks[index].isMuted || track.isMuted,
            isSoloed: savedState?.tracks[index].isSoloed || track.isSoloed,
            currentSample: savedState?.tracks[index].currentSample || track.currentSample,
            player: savedState?.tracks[index].currentSample ? newPlayer : track.player
        }
    }))


    const [masterFXSettings, setMasterFXSettings] = useState<MasterFXSettingsType>(savedState?.masterFXSettings || defaultMasterFXSettings)

    const [currentTrack, setCurrentTrack] = useState<number>(0)
    const [currentBeat, setCurrentBeat] = useState<number>(0)
    const [masterVolumeLevel, setMasterVolumeLevel] = useState<number>(0)

    const beatRef = useRef(0)
    const tracksRef = useRef(tracks)
    const scheduleIdRef = useRef<number | null>(null)
    const masterLowCutRef = useRef<Tone.Filter | null>(null)
    const masterHighCutRef = useRef<Tone.Filter | null>(null)
    const masterCompressorRef = useRef<Tone.Compressor | null>(null)
    const masterLimiterRef = useRef<Tone.Limiter | null>(null)
    const masterMeterRef = useRef<Tone.Meter | null>(null)
    


    const confirmOrCreateSchedule = () => {
        if (!scheduleIdRef.current) {
            scheduleIdRef.current = Tone.getTransport().scheduleRepeat(time => {

                const current = beatRef.current
                const next = (current + 1) % NUM_BUTTONS
                beatRef.current = next
                // update UI
                Tone.getDraw().schedule(() => {
                    
                    setCurrentBeat(next)
                }, time)

                // determine if any track is soloed
                const anySoloed = tracksRef.current.some(t => t.isSoloed)

                // play each track according to solo/mute state
                tracksRef.current.forEach(track => {
                    const activatedNote = track.trackButtons[current]

                    // if solos exist, skip non-soloed tracks
                    if (anySoloed && !track.isSoloed) return

                    // if no solos, skip muted tracks
                    if (!anySoloed && track.isMuted) return

                    if (activatedNote) {
                        track.player.start(time)
                        track.envelope.triggerAttack(time)
                        track.envelope.triggerRelease(
                            time + Number(track.envelope.attack)
                            + Number(track.envelope.decay)
                            + 0.001
                        )
                    }
                })

            }, "16n")
        }
    }
      

    const globalPlay = async () => {

        try {
            await Tone.start()
            
            Tone.getTransport().stop()
            Tone.getTransport().cancel()
            Tone.getTransport().position = 0
            beatRef.current = 0
            setCurrentBeat(0)

            const masterNodes = [
                masterLowCutRef.current!,
                masterHighCutRef.current!,
                masterCompressorRef.current!,
                masterLimiterRef.current!,
                masterMeterRef.current!,
            ]

            applySampleKnobSettings(tracksRef.current);
            applyMasterKnobSettings(
                masterFXSettings,
                masterCompressorRef,
                masterLowCutRef,
                masterHighCutRef
            );
            tracksRef.current.forEach(track =>
                rebuildTrackChain(track, masterNodes)
            );

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

        const resetTracks = initialTracks.map(track => ({
            ...track,
            trackButtons: new Array(NUM_BUTTONS).fill(false),
            isMuted: false,
            isSoloed: false,
            knobSettings: { ...track.knobSettings }
        }))

        const resetMasterFXSettings = {
            lowCut: 0,
            highCut: 0,
            reverb: 0,
            delay: 0,
            compressorRatio: 0,
            compressorThreshold: 100,
            volume: 100,
        }

        setTracks(resetTracks)
        setMasterFXSettings(resetMasterFXSettings);

        tracksRef.current = resetTracks
    }


    const resetMasterFXKnobValue = (knobId: string) => {
        const property = mapKnobIdToProperty(knobId) as keyof MasterFXSettingsType
        if (!property) return

        const defaultValue = defaultMasterFXSettings[property] 

        setMasterFXSettings(prevSettings => {
            const newSettings = {
                ...prevSettings,
                [property]: defaultValue
            }
            return newSettings
        })

        if (property === 'volume') {
            Tone.getDestination().volume.value =
                mapKnobValueToRange(defaultValue, -60, 0)
        } else if (property === 'compressorThreshold') {
            if (masterCompressorRef.current) {
                masterCompressorRef.current.threshold.value =
                    mapKnobValueToRange(defaultValue, -30, 0)
            }
        } else if (property === 'compressorRatio') {
            if (masterCompressorRef.current) {
                masterCompressorRef.current.ratio.value =
                    mapKnobValueToRange(defaultValue, 1, 8)
            }
        } else if (property === 'lowCut') {
            if (masterLowCutRef.current) {
                masterLowCutRef.current.frequency.value =
                    mapKnobValueToRange(defaultValue, 0, 2000)
            }
        } else if (property === 'highCut') {
            if (masterHighCutRef.current) {
                masterHighCutRef.current.frequency.value =
                    mapKnobValueToRange(defaultValue, 2000, 20000)
            }
        }
          
    }

    const resetSampleFXKnobValue = (trackIndex: number, knobId: string ) => {

        setTracks(prevTracks => {
            return prevTracks.map(track => {
                if (track.index !== trackIndex) return track

                // update ui state to default 
                const property = mapKnobIdToProperty(knobId) as keyof TrackType['knobSettings']
                if (!property) return track
                const defaultValue = initialTracks[trackIndex].knobSettings[property]

                const newKnobSettings = {
                    ...track.knobSettings,
                    [property]: defaultValue
                }

                // update tone.js state to match ui state
                if (property === 'volume') {
                    track.volume.volume.value = mapKnobValueToRange(defaultValue, -24, 4)
                } else if (property === 'attack') {
                    track.envelope.attack = mapKnobValueToRange(defaultValue, 0, 20)
                } else if (property === 'decay') {
                    track.envelope.decay = mapKnobValueToRange(defaultValue, 0.05, 3)
                } else if (property === 'reverb') {
                    track.reverb.wet.value = mapKnobValueToRange(defaultValue, 0, 0.5)
                    track.reverb.decay = mapKnobValueToRange(defaultValue, 0.1, 3)
                } else if (property === 'delay') {
                    track.delay.wet.value = mapKnobValueToRange(defaultValue, 0, 0.75)
                } else if (property === 'lowCut') {
                    track.lowCut.frequency.value = mapKnobValueToRange(defaultValue, 0, 2000)
                } else if (property === 'highCut') {
                    track.highCut.frequency.value = mapKnobValueToRange(defaultValue, 2000, 20000)
                }

                return {
                    ...track,
                    knobSettings: newKnobSettings
                }
            })
        })
    }

    const handleChangeTrackSample = (trackIndex: number, newSample: SampleType) => {
        setTracks(prevTracks => {
            return prevTracks.map((track, index) => {
                if (index !== trackIndex) return track


                // get rid of old track player
                track.player.stop()
                track.player.dispose()
                const newTrack: TrackType = {
                    ...track,
                }
                // create new player with new sample and connect it to signal chain 
                const newPlayer = new Tone.Player({url: newSample.file, autostart: false})
                newPlayer.chain(
                    track.envelope,
                    track.lowCut,
                    track.highCut,
                    track.volume,
                    // track.delay,
                    track.reverb,
                    masterLowCutRef.current!,
                    masterHighCutRef.current!,
                    masterCompressorRef.current!,
                    masterLimiterRef.current!,
                    masterMeterRef.current!,
                    Tone.getDestination()

                )

                // return the track with the new sample & player
                return {
                    ...newTrack,
                    currentSample: newSample,
                    player: newPlayer,
                    sampleImgFile: newSample.img
                }
            })
        })
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
                
                return updatedTrack
            })
        })
    }

    const handleToggleTrackSolo = (trackIndex: number) => {
        console.log("solo toggle for", tracks[trackIndex].name)
        setTracks(prevTracks => {
            
            return prevTracks.map(track => {
                if (trackIndex !== track.index) return track
                
                const newSoloState = !track.isSoloed

                return {
                    ...track,
                    isSoloed: newSoloState
                }

            })

        })

    }

    const handleSetMasterFXSettings = (settingName: keyof MasterFXSettingsType, value: number) => {
        setMasterFXSettings(prevSettings => {
            return {
                ...prevSettings,
                [settingName]: value
            }
        })

        if (settingName === "volume") {
            Tone.getDestination().volume.value = mapKnobValueToRange(value, -60, 0)
        }

        if (settingName === "compressorThreshold") {
            if (!masterCompressorRef.current) return 
            masterCompressorRef.current.threshold.value = mapKnobValueToRange(value, -30, 0)
        }

        if (settingName === "compressorRatio") {
            if (!masterCompressorRef.current) return 
            masterCompressorRef.current.ratio.value = mapKnobValueToRange(value, 1, 8)
        }


        if (settingName === "highCut") {
            if (!masterHighCutRef.current) return 
            masterHighCutRef.current.frequency.value = mapKnobValueToRange(value, 2000, 20000)
        }

        if (settingName === "lowCut") {
            if (!masterLowCutRef.current) return 
            masterLowCutRef.current.frequency.value = mapKnobValueToRange(value, 0, 2000)
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
                trackToUpdate.volume.volume.value = mapKnobValueToRange(value, -24, 4)
            }

            if (settingName === "lowCut") {
                trackToUpdate.lowCut.frequency.value = mapKnobValueToRange(value, 0, 2000)
            }
            
            if (settingName === "highCut") {
                trackToUpdate.highCut.frequency.value = mapKnobValueToRange(value, 2000, 20000)
            }

            if (settingName === "attack") {
                trackToUpdate.envelope.attack = mapKnobValueToRange(value, 0, 20)
            }
            
            if (settingName === "decay") {
                trackToUpdate.envelope.decay = mapKnobValueToRange(value, 0.05, 3)
            }

            if (settingName === "reverb") {
                trackToUpdate.reverb.wet.value = mapKnobValueToRange(value, 0, 0.5)
                trackToUpdate.reverb.decay = mapKnobValueToRange(value, 0.1, 3)
            }
            
            if (settingName === "delay") {
                trackToUpdate.delay.wet.value = mapKnobValueToRange(value, 0, .75)
            }

            const masterNodes = [
                masterLowCutRef.current!,
                masterHighCutRef.current!,
                masterCompressorRef.current!,
                masterLimiterRef.current!,
                masterMeterRef.current!,
            ]
            rebuildTrackChain(trackToUpdate, masterNodes);

            return newTracks
        })
    }

    // handle previous transport schedule cleanup
    useEffect(() => {
        
        return () => {
            if (scheduleIdRef.current !== null) {
                Tone.getTransport().clear(scheduleIdRef.current);
                scheduleIdRef.current = null;
            }
        };
       
    }, [])

    // initialize master chain refs & dispose on unmount
    useEffect(() => {
        masterLowCutRef.current = new Tone.Filter(0, "highpass")
        masterHighCutRef.current = new Tone.Filter(20000, "lowpass")
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
            masterCompressorRef.current?.dispose()
            masterLimiterRef.current?.dispose()
            masterMeterRef.current?.dispose()
        };
    }, []);

    // setup local storage sync interval
    useEffect(() => {
        const saveCurrentState = () => {
            const state = {
                tracks: tracks.map(track => ({
                    trackButtons: track.trackButtons,
                    knobSettings: track.knobSettings,
                    isMuted: track.isMuted, 
                    isSoloed: track.isSoloed,
                    currentSample: track.currentSample
                })), 
                masterFXSettings: masterFXSettings,
                BPM: BPM,
            }
            saveStateToLocalStorage(state)
        }
        
        const localStorageUpdateInterval = setInterval(saveCurrentState, 1000)

        return () => {
            clearInterval(localStorageUpdateInterval)
            saveCurrentState()
        }

    }, [tracks, masterFXSettings, BPM])

    // Set up chain for each track
    useEffect( () => {
        const masterNodes = [
            masterLowCutRef.current!,
            masterHighCutRef.current!,
            masterCompressorRef.current!,
            masterLimiterRef.current!,
            masterMeterRef.current!,
        ];


        // 1) apply all track FX values (including delay wet = 0)
        applySampleKnobSettings(tracks);

        // 2) apply master FX values
        applyMasterKnobSettings(
            masterFXSettings,
            masterCompressorRef,
            masterLowCutRef,
            masterHighCutRef
        );

        // 3) rebuild each track’s chain, skipping delay when delay=0
        tracks.forEach(track => rebuildTrackChain(track, masterNodes));
        
    }, [tracks, masterFXSettings])

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



    // keep tracks Ref in sync with tracks state
    useEffect( () => {
        tracksRef.current = tracks
    }, [tracks])

    // keep BPM in sync with UI state
    useEffect( () => {
        Tone.getTransport().bpm.value = BPM
    }, [BPM])

    

    useEffect(() => {
        applySampleKnobSettings(tracks)
        applyMasterKnobSettings(
            masterFXSettings,
            masterCompressorRef,
            masterLowCutRef,
            masterHighCutRef
        )
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
            resetMasterFXKnobValue: resetMasterFXKnobValue,
            resetSampleFXKnobValue: resetSampleFXKnobValue,
            handleToggleTrackMute: handleToggleTrackMute,
            handleToggleTrackSolo: handleToggleTrackSolo,
            handleChangeTrackSample,
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

