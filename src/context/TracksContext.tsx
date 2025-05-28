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


export const TracksProvider = ({ children }: { children: ReactNode }) => {
    const trackPlayersRef = useSamplePreload()
    const [localStorageData, setLocalStorageData] = useLocalStorage()

    // initialize tracks state from local storage or defaults
    const [tracks, setTracks] = useState<TrackType[]>(() => {
        return localStorageData.tracks.map((track, i) => {
            const preloadedPlayer = trackPlayersRef.current[track.currentSample.file]

            // get player from preloaded buffer ro fallback on new one from sample file
            const player = preloadedPlayer?.buffer.loaded ? 
                new Tone.Player(preloadedPlayer?.buffer) : 
                new Tone.Player({url: track.currentSample.file, autostart: false})
            
            // Instantiate the track chain nodes and chain them to the Player
            const volume = new Tone.Volume(0);
            const delay = new Tone.PingPongDelay({ wet: 0, delayTime: "8n", feedback: 0.1 });
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
                ...initialTracksMetadata[i],
                currentSample: track.currentSample,
                trackButtons: track.trackButtons,
                knobSettings: track.knobSettings,
                isMuted: track.isMuted,
                isSoloed: track.isSoloed,
                player: player,
                volume: volume, 
                delay: delay,
                reverb: reverb,
                lowCut: lowCut,
                highCut: highCut,
                envelope: envelope
            }
        })})

    // Initialize other app State
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(localStorageData.BPM)
    const [masterFXSettings, setMasterFXSettings] = useState<MasterFXSettingsType>(localStorageData.masterFXSettings)
    const [currentTrack, setCurrentTrack] = useState<number>(0)
    const [currentBeat, setCurrentBeat] = useState<number>(0)
    const [masterVolumeLevel, setMasterVolumeLevel] = useState<number>(0)

    // Initialize other app Refs
    const isPlayingRef = useRef<boolean>(false)
    const beatRef = useRef<number>(0)
    const scheduleIdRef = useRef<number | null>(null)
    const tracksRef = useRef<TrackType[]>(tracks)
    const masterEQLowRef = useRef<Tone.Filter | null>(null)
    const masterEQMidRef = useRef<Tone.Filter | null>(null)
    const masterEQHighRef = useRef<Tone.Filter | null>(null)
    const masterCompressorRef = useRef<Tone.Compressor | null>(null)
    const masterLimiterRef = useRef<Tone.Limiter | null>(null)
    const masterMeterRef = useRef<Tone.Meter | null>(null)


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
        if (isPlaying) return 
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
                masterCompressorRef,
                masterEQLowRef,
                masterEQMidRef,
                masterEQHighRef
            );

            // rebuild track chain to go through masterNodes
            const masterNodes = [
                masterEQLowRef.current!,
                masterEQMidRef.current!,
                masterEQHighRef.current!,
                masterCompressorRef.current!,
                masterLimiterRef.current!,
                masterMeterRef.current!,
            ]
            
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
        if (!isPlaying) return
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
        // beatRef.current = 0;
        // setCurrentBeat(0)
        
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
            if (masterCompressorRef.current) {
                masterCompressorRef.current.threshold.value = mapKnobValueToRange(defaultValue, -30, 0)
            }
        } else if (property === 'compressorRatio') {
            if (masterCompressorRef.current) {
                masterCompressorRef.current.ratio.value = mapKnobValueToRange(defaultValue, 1, 8)
            }
        } else if (property === 'eqLow') {
            if (masterEQLowRef.current) {
                masterEQLowRef.current.gain.value = mapKnobValueToRange(defaultValue, -6, 6)
            }
        }
        else if (property === 'eqMid') {
            if (masterEQMidRef.current) {
                masterEQMidRef.current.gain.value = mapKnobValueToRange(defaultValue, -6, 6)
            }
        }
        else if (property === 'eqHigh') {
            if (masterEQHighRef.current) {
                masterEQHighRef.current.gain.value = mapKnobValueToRange(defaultValue, -6, 6)
            }
        }

    }

    const resetSampleFXKnobValue = (trackIndex: number, knobId: string) => {

        setTracks(prevTracks => {
            return prevTracks.map(track => {
                if (track.index !== trackIndex) return track

                // update ui state to default 
                const property = mapKnobIdToProperty(knobId) as keyof TrackType['knobSettings']
                if (!property) return track
                const defaultValue = initialTracksMetadata[trackIndex].knobSettings[property]

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

                // get preloaded sample or return or return original track if no preload
                const preloadedPlayer = trackPlayersRef.current[newSample.file]
                if (!preloadedPlayer) {
                    console.warn("No preload found for", newSample.file)
                    return track
                } else if (!preloadedPlayer.buffer?.loaded) {
                    console.warn("Buffer still loading for", newSample.file)
                }

                // clone preloaded buffer into new player
                const audioBuf = preloadedPlayer.buffer.get() as AudioBuffer
                const newPlayer = new Tone.Player(audioBuf)

                // create new player with new sample and connect it to signal chain 
                newPlayer.chain(
                    track.envelope,
                    track.lowCut,
                    track.highCut,
                    track.volume,
                    track.delay,
                    track.reverb,
                    Tone.getDestination()

                )

                // return the track with the new sample & player
                return {
                    ...track,
                    currentSample: newSample,
                    player: newPlayer,
                }
            })
        })
    }

    // mute/unmute a single track
    const handleToggleTrackMute = (trackIndex: number) => {

        setTracks(prevTracks => {
            return prevTracks.map((track, index) => {
                if (index !== trackIndex) return track

                const newMuteState = !track.isMuted
                return {
                    ...track,
                    isMuted: newMuteState
                }
            })
        })
    }

    // solo/unsolo a single track
    const handleToggleTrackSolo = (trackIndex: number) => {

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
            if (!masterCompressorRef.current) return
            masterCompressorRef.current.threshold.value = mapKnobValueToRange(value, -30, 0)
        }
        else if (settingName === "compressorRatio") {
            if (!masterCompressorRef.current) return
            masterCompressorRef.current.ratio.value = mapKnobValueToRange(value, 1, 8)
        }
        else if (settingName === "eqLow") {
            if (!masterEQLowRef.current) return
            masterEQLowRef.current.gain.value = mapKnobValueToRange(value, -6, 6)
        }
        else if (settingName === "eqMid") {
            if (!masterEQMidRef.current) return
            masterEQMidRef.current.gain.value = mapKnobValueToRange(value, -6, 6)
        }
        else if (settingName === "eqHigh") {
            if (!masterEQHighRef.current) return
            masterEQHighRef.current.gain.value = mapKnobValueToRange(value, -6, 6)
        }


    }

    
    const setTrackSetting = (settingName: keyof TrackType['knobSettings'], value: number) => {
        
        setTracks(prevTracks => {
            // get copy of selected track
            const newTracks = [...prevTracks]
            const trackToUpdate = newTracks[currentTrack]

            // update track knob setting state
            trackToUpdate.knobSettings = {
                ...trackToUpdate.knobSettings,
                [settingName]: value
            }

            // sync fx node value with track state
            if (settingName === "volume") {
                trackToUpdate.volume.volume.value = mapKnobValueToRange(value, -24, 4)
            }
            else if (settingName === "lowCut") {
                trackToUpdate.lowCut.frequency.value = mapKnobValueToRange(value, 0, 2000)
            }
            else if (settingName === "highCut") {
                trackToUpdate.highCut.frequency.value = mapKnobValueToRange(value, 2000, 20000)
            }
            else if (settingName === "attack") {
                trackToUpdate.envelope.attack = mapKnobValueToRange(value, 0, 20)
            }
            else if (settingName === "decay") {
                trackToUpdate.envelope.decay = mapKnobValueToRange(value, 0.05, 3)
            }
            else if (settingName === "reverb") {
                trackToUpdate.reverb.wet.value = mapKnobValueToRange(value, 0, 0.5)
                trackToUpdate.reverb.decay = mapKnobValueToRange(value, 0.1, 3)
            }
            else if (settingName === "delay") {
                trackToUpdate.delay.wet.value = mapKnobValueToRange(value, 0, .5)
            }

            // rebuild track + connect to master chain
            const masterNodes = [
                masterEQLowRef.current!,
                masterEQMidRef.current!,
                masterEQHighRef.current!,
                masterCompressorRef.current!,
                masterLimiterRef.current!,
                masterMeterRef.current!,
            ]
            rebuildTrackChain(trackToUpdate, masterNodes);

            // set tracks state to copy of tracks with new updated track
            return newTracks
        })
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

    // initialize master chain refs & dispose on unmount
    useEffect(() => {
        masterEQLowRef.current = new Tone.Filter(200, "lowshelf")
        masterEQMidRef.current = new Tone.Filter({
            type: "peaking",
            frequency: 1000,
            Q: 1,
            gain: 0
        })
        masterEQHighRef.current = new Tone.Filter(5000, "highshelf")
        masterCompressorRef.current = new Tone.Compressor({
            ratio: 8,
            threshold: 0,
            attack: 0.02,
            release: 0.1
        })
        masterLimiterRef.current = new Tone.Limiter(-0.5)
        masterMeterRef.current = new Tone.Meter();


        return () => {
            masterEQLowRef.current?.dispose()
            masterEQMidRef.current?.dispose()
            masterEQHighRef.current?.dispose()
            masterCompressorRef.current?.dispose()
            masterLimiterRef.current?.dispose()
            masterMeterRef.current?.dispose()
        };
    }, []);

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
        const masterNodes = [
            masterEQLowRef.current!,
            masterEQMidRef.current!,
            masterEQHighRef.current!,
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
            masterEQLowRef,
            masterEQMidRef,
            masterEQHighRef
        );

        // 3) rebuild each track’s chain
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

    // keep tracks Ref in sync with tracks state
    useEffect(() => {
        tracksRef.current = tracks
    }, [tracks])

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
        applySampleKnobSettings(tracks)
        applyMasterKnobSettings(
            masterFXSettings,
            masterCompressorRef,
            masterEQLowRef,
            masterEQMidRef,
            masterEQHighRef
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

