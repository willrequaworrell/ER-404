import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";
import { initialTracksMetadata } from "../util/initialTrackData";
import { defaultMasterFXSettings, MasterFXSettingsType } from "../types/masterFXSettings";
import { SampleType } from "../types/sample";
import { applyMasterKnobSettings, applySampleKnobSettings, rebuildTrackChain } from "../util/tracksHelpers";
import { mapKnobIdToProperty, mapKnobValueToRange } from "../util/knobValueHelpers";
import { useSamplePreload } from "../hooks/useSamplePreload";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTracksState } from "../hooks/useTracksState";
import { useMasterChain } from "../hooks/useMasterChain";


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
}


const TracksContext = createContext<TracksContextType | null>(null)
const NUM_BUTTONS = 16


export const TracksProvider = ({ children }: { children: ReactNode }) => {
    // Initialize app Refs
    const trackPlayersRef = useSamplePreload()
    const isPlayingRef = useRef<boolean>(false)
    const beatRef = useRef<number>(0)
    const scheduleIdRef = useRef<number | null>(null)

    // Get state & functions from hooks
    const [localStorageData, setLocalStorageData] = useLocalStorage()
    const {masterNodeRefs, masterNodes, masterChainReady} = useMasterChain()
    const {
        tracks, 
        setTracks, 
        tracksRef, 
        currentTrack,
        setCurrentTrack,
        handleToggleTrackMute, 
        handleToggleTrackSolo,
        handleChangeTrackSample,
        resetSampleFXKnobValue,
        setTrackSetting
    } = useTracksState(trackPlayersRef, localStorageData, masterNodeRefs)
    

   
    // Initialize other app State
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(localStorageData.BPM)
    const [masterFXSettings, setMasterFXSettings] = useState<MasterFXSettingsType>(localStorageData.masterFXSettings)
    const [currentBeat, setCurrentBeat] = useState<number>(0)

   
    // Set up Transport playback schedule 
    const confirmOrCreateSchedule = () => {
        const transport = Tone.getTransport()

        if (scheduleIdRef.current != null) {
            transport.clear(scheduleIdRef.current)     
            scheduleIdRef.current = null
        }
        scheduleIdRef.current = transport.scheduleRepeat(time => {

            // handle current beat ref update
            const current = beatRef.current
            const next = (current + 1) % NUM_BUTTONS
            beatRef.current = next

            // also set new current beat state inside Draw callback to sync w/ playback 
            Tone.getDraw().schedule(() => {
                if (isPlayingRef.current) {
                    setCurrentBeat(next)
                }
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

                // otherwise play sample if button activated and buffer loaded
                if (activatedNote && track.player.buffer?.loaded) {
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


    const globalPlay = async () => {
        if (isPlaying || !masterChainReady) return 

        const transport = Tone.getTransport()

        try {
            await Tone.start()

            // reset Transport and playback state
            transport.stop()
            transport.cancel()
            Tone.getDraw().cancel()
            transport.position = 0
            beatRef.current = 0
            setCurrentBeat(0)

            // sync audio nodes with UI state
            applySampleKnobSettings(tracksRef.current);
            applyMasterKnobSettings(
                masterFXSettings,
                masterNodeRefs.masterCompressorRef,
                masterNodeRefs.masterEQLowRef,
                masterNodeRefs.masterEQMidRef,
                masterNodeRefs.masterEQHighRef
            );

            tracksRef.current.forEach(track =>
                rebuildTrackChain(track, masterNodes)
            );

            // create new transport schedule and start playback
            confirmOrCreateSchedule()
            await new Promise(resolve => setTimeout(resolve, 10))
            transport.start()
            setIsPlaying(true)


        } catch (error) {
            console.error("Audio context startup failed.", error)
        }

    }

    const globalStop = () => {
        if (!isPlaying || !masterChainReady) return
        const transport = Tone.getTransport()
        
        // reset transport and playback state
        transport.stop()
        transport.cancel()
        Tone.getDraw().cancel()
        
        if (scheduleIdRef.current != null) {
            transport.clear(scheduleIdRef.current)
            scheduleIdRef.current = null
        }

        transport.position = 0;
        setIsPlaying(false)   
    } 

    const globalReset = () => {
        // stop playback
        globalStop()

        // rebuild each track with default settings
        const resetTracks = initialTracksMetadata.map((track) => {
            const preloadedPlayer = trackPlayersRef.current[track.currentSample.file]
            const player = (preloadedPlayer.buffer.loaded) ?
                new Tone.Player(preloadedPlayer.buffer) :
                new Tone.Player({ url: track.currentSample.file, autostart: false })

            const volume = new Tone.Volume(0);
            const delay = new Tone.PingPongDelay({ wet: 0, delayTime: "8n", feedback: 0.1});
            const reverb = new Tone.Reverb({ wet: 0, decay: 0.1, preDelay: 0.01 });
            const lowCut = new Tone.Filter(0, "highpass");
            const highCut = new Tone.Filter(20000, "lowpass");
            const envelope = new Tone.AmplitudeEnvelope({ attack: 0, decay: 3, sustain: 0, release: 0 });

            player.chain(
                envelope,
                lowCut,
                highCut,
                volume,
                delay,
                reverb
            )

            return {
                ...track,
                trackButtons: new Array(NUM_BUTTONS).fill(false),
                isMuted: false,
                isSoloed: false,
                knobSettings: { ...track.knobSettings },
                player,
                volume,
                delay,
                reverb,
                lowCut,
                highCut,
                envelope
            };
        })

        // set states to default/initial values + sync with ref
        setTracks(resetTracks)
        tracksRef.current = resetTracks
        setMasterFXSettings(defaultMasterFXSettings);
    }


    const resetMasterFXKnobValue = (knobId: string) => {
        // turn knob element id into masterSettings state property
        const property = mapKnobIdToProperty(knobId) as keyof MasterFXSettingsType
        if (!property) return

        // get default value for knob
        const defaultValue = defaultMasterFXSettings[property]

        // set state to default setting
        setMasterFXSettings(prevSettings => {
            const newSettings = {
                ...prevSettings,
                [property]: defaultValue
            }
            return newSettings
        })

        // sync audio nodes with state
        if (property === 'volume') {
            Tone.getDestination().volume.value = mapKnobValueToRange(defaultValue, -60, 0)
        } else if (property === 'compressorThreshold') {
            if (masterNodeRefs.masterCompressorRef.current) {
                masterNodeRefs.masterCompressorRef.current.threshold.value = mapKnobValueToRange(defaultValue, -30, 0)
            }
        } else if (property === 'compressorRatio') {
            if (masterNodeRefs.masterCompressorRef.current) {
                masterNodeRefs.masterCompressorRef.current.ratio.value = mapKnobValueToRange(defaultValue, 1, 8)
            }
        } else if (property === 'eqLow') {
            if (masterNodeRefs.masterEQLowRef.current) {
                masterNodeRefs.masterEQLowRef.current.gain.value = mapKnobValueToRange(defaultValue, -6, 6)
            }
        }
        else if (property === 'eqMid') {
            if (masterNodeRefs.masterEQMidRef.current) {
                masterNodeRefs.masterEQMidRef.current.gain.value = mapKnobValueToRange(defaultValue, -6, 6)
            }
        }
        else if (property === 'eqHigh') {
            if (masterNodeRefs.masterEQHighRef.current) {
                masterNodeRefs.masterEQHighRef.current.gain.value = mapKnobValueToRange(defaultValue, -6, 6)
            }
        }

    }


    const handleSetMasterFXSettings = (settingName: keyof MasterFXSettingsType, value: number) => {
        // update given setting in state
        console.log(settingName, value)
        setMasterFXSettings(prevSettings => {
            return {
                ...prevSettings,
                [settingName]: value
            }
        })

        // sync audio nodes with updated state
        if (settingName === "volume") {
            Tone.getDestination().volume.value = mapKnobValueToRange(value, -60, 0)
        }
        else if (settingName === "compressorThreshold") {
            if (!masterNodeRefs.masterCompressorRef.current) return
            masterNodeRefs.masterCompressorRef.current.threshold.value = mapKnobValueToRange(value, -30, 0)
        }
        else if (settingName === "compressorRatio") {
            if (!masterNodeRefs.masterCompressorRef.current) return
            masterNodeRefs.masterCompressorRef.current.ratio.value = mapKnobValueToRange(value, 1, 8)
        }
        else if (settingName === "eqLow") {
            if (!masterNodeRefs.masterEQLowRef.current) return
            masterNodeRefs.masterEQLowRef.current.gain.value = mapKnobValueToRange(value, -6, 6)
        }
        else if (settingName === "eqMid") {
            if (!masterNodeRefs.masterEQMidRef.current) return
            masterNodeRefs.masterEQMidRef.current.gain.value = mapKnobValueToRange(value, -6, 6)
        }
        else if (settingName === "eqHigh") {
            if (!masterNodeRefs.masterEQHighRef.current) return
            masterNodeRefs.masterEQHighRef.current.gain.value = mapKnobValueToRange(value, -6, 6)
        }

    }
    
    // handle previous transport schedule cleanup
    useEffect(() => {

        return () => {
            const transport = Tone.getTransport()
            if (scheduleIdRef.current !== null) {
                transport.clear(scheduleIdRef.current);
                scheduleIdRef.current = null;
            }
            if (isPlayingRef.current) {
                transport.stop();
              }
        };

    }, []) 

    // setup local storage sync interval
    useEffect(() => {
        setLocalStorageData({
            tracks: tracks.map(track => ({
                trackButtons: track.trackButtons,
                knobSettings: track.knobSettings,
                isMuted: track.isMuted,
                isSoloed: track.isSoloed,
                currentSample: track.currentSample,
            })),
            masterFXSettings: masterFXSettings,
            BPM: BPM
        })
    }, [tracks, masterFXSettings, BPM, setLocalStorageData])

    // Set up chain for each track any time tracks or master chain changes
    useEffect(() => {

        if (!masterChainReady) return 

        // 1) apply all track FX values (including delay wet = 0)
        applySampleKnobSettings(tracks);

        // 2) apply master FX values
        applyMasterKnobSettings(
            masterFXSettings,
            masterNodeRefs.masterCompressorRef,
            masterNodeRefs.masterEQLowRef,
            masterNodeRefs.masterEQMidRef,
            masterNodeRefs.masterEQHighRef
        );

        // 3) rebuild each track’s chain
        tracks.forEach(track => rebuildTrackChain(track, masterNodes));

    }, [tracks, masterFXSettings, masterNodes, masterChainReady])


    // handle changes in swing knob by applying them to transport 
    useEffect(() => {
        const newSwing = mapKnobValueToRange(masterFXSettings.swing, 0, 0.5)
        Tone.getTransport().swingSubdivision = "16n"
        Tone.getTransport().swing = newSwing

    }, [masterFXSettings.swing])
    
    // handle key stroke functionality
    useEffect( () => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (isPlaying) {
                    globalStop();
                } else {
                    globalPlay();
                }
            } else if (e.code === "KeyS") {
                handleToggleTrackSolo(currentTrack)
            } else if (e.code === "KeyM") {
                handleToggleTrackMute(currentTrack)
            }
        };

        window.addEventListener("keydown", handleKeyDown)

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, globalPlay, globalStop])

    

    // reset timeline if playback is stopped
    useEffect( () => {
        if (!isPlaying) {
            beatRef.current = 0 
            setCurrentBeat(0)
        }
    }, [isPlaying])


    // keep isPlayingRef in sync with state
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);


    // reset transport when the user leaves the tab so that a fresh one is created when they return
    useEffect(() => {
        const handleVisibilityChange = () => {

            if (document.hidden && !isPlayingRef.current) {
                console.log("user left page")
                const transport = Tone.getTransport()
                transport.stop()
                transport.cancel()
                Tone.getDraw().cancel()
                if (scheduleIdRef.current != null) {
                    transport.clear(scheduleIdRef.current)
                    scheduleIdRef.current = null
                }

            }
            
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    // keep BPM in sync with UI state
    useEffect(() => {
        Tone.getTransport().bpm.value = BPM
    }, [BPM])

    
    useEffect(() => {
        if (!masterChainReady) return 
        applySampleKnobSettings(tracks)
        applyMasterKnobSettings(
            masterFXSettings,
            masterNodeRefs.masterCompressorRef,
            masterNodeRefs.masterEQLowRef,
            masterNodeRefs.masterEQMidRef,
            masterNodeRefs.masterEQHighRef
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
        }}>
            {children}
        </TracksContext.Provider>
    )
}

export const useTracksContext = () => {
    const context = useContext(TracksContext)
    if (!context) throw new Error('No Tracks Context')
    return context
}

