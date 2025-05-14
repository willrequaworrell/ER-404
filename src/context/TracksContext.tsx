import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { TrackType } from "../types/track";
import { initialTracksMetadata } from "../util/initialTrackData";
import { defaultMasterFXSettings, MasterFXSettingsType } from "../types/masterFXSettings";
import { LoadStateFromLocalStorage, saveStateToLocalStorage } from "../util/localStorageinteraction";
import { SampleType } from "../types/sample";
import { applyMasterKnobSettings, applySampleKnobSettings, rebuildTrackChain } from "../util/tracksHelpers";
import { mapKnobIdToProperty, mapKnobValueToRange } from "../util/knobValueHelpers";
import { allSamples } from "../util/samplesData";


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
    const savedState = LoadStateFromLocalStorage()

    // Initialize tracks State & Ref
    const trackPlayersRef = useRef<Record<string, Tone.Player>>({})
    const [tracks, setTracks] = useState<TrackType[]>(() => {
        return initialTracksMetadata.map((defaultTrack):TrackType => {
            const trackIndex = defaultTrack.index

            // get sample from localStorage or fallback to default
            const sample = savedState?.tracks[trackIndex].currentSample ?? defaultTrack.currentSample

            const player = new Tone.Player({ url: sample.file, autostart: false })

            // Instantiate the track chain nodes and chain them to the Player
            const volume = new Tone.Volume(0);
            const delay = new Tone.PingPongDelay({ wet: 0, delayTime: "8n", feedback: 0.05 });
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
            
            // Return the default track, but substitute in any saved state from local storage if it exists
            return {
                ...defaultTrack,
                currentSample: sample,
                trackButtons: savedState?.tracks[trackIndex]?.trackButtons ?? defaultTrack.trackButtons,
                knobSettings: savedState?.tracks[trackIndex]?.knobSettings ?? defaultTrack.knobSettings,
                isMuted: savedState?.tracks[trackIndex]?.isMuted ?? false,
                isSoloed: savedState?.tracks[trackIndex]?.isSoloed ?? false,
                player,
                volume,
                delay,
                reverb,
                lowCut,
                highCut,
                envelope
            };
        });
    });

    // Initialize other app State
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [BPM, setBPM] = useState<number>(savedState?.BPM || 120)
    const [masterFXSettings, setMasterFXSettings] = useState<MasterFXSettingsType>(savedState?.masterFXSettings || defaultMasterFXSettings)
    const [currentTrack, setCurrentTrack] = useState<number>(0)
    const [currentBeat, setCurrentBeat] = useState<number>(0)
    const [masterVolumeLevel, setMasterVolumeLevel] = useState<number>(0)

    // Initialize other app Refs
    const beatRef = useRef(0)
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
        if (!scheduleIdRef.current) {
            scheduleIdRef.current = Tone.getTransport().scheduleRepeat(time => {

                const current = beatRef.current
                const next = (current + 1) % NUM_BUTTONS
                beatRef.current = next
                
            
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
    }


    const globalPlay = async () => {

        try {
            await Tone.start()

            // reset Transport and playback state
            Tone.getTransport().stop()
            Tone.getTransport().cancel()
            Tone.getTransport().position = 0
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
            Tone.getTransport().start()
            setIsPlaying(true)


        } catch (error) {
            console.error("Audio context startup failed.", error)
        }

    }

    const globalStop = () => {
        if (!isPlaying) return

        // reset transport and playback state
        Tone.getTransport().stop()
        Tone.getTransport().cancel()
        Tone.getDraw().cancel(0)
        scheduleIdRef.current = null
        Tone.getTransport().position = 0;
        beatRef.current = 0;
        setCurrentBeat(0);
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
            const delay = new Tone.PingPongDelay({ wet: 0, delayTime: "8n", feedback: 0.05 });
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

                // get preloaded sample 
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
                // const newPlayer = new Tone.Player({url: newSample.file, autostart: false})
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
                trackToUpdate.delay.wet.value = mapKnobValueToRange(value, 0, .75)
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

    // preload samples 
    useEffect(() => {

        const allSampleFilePaths = Object.values(allSamples).flat().map(sample => sample.file)

        allSampleFilePaths.forEach(async (filePath) => {
            if (!trackPlayersRef.current[filePath]) {
                const player = new Tone.Player({ autostart: false })
                trackPlayersRef.current[filePath] = player
                try {
                    await player.load(filePath)
                    console.log("Successfully preloaded", filePath)
                } catch (error) {
                    console.log("Failed to preload", filePath, error)
                }
            }
        });


    }, [])

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

    useEffect(() => {
        console.log("swing Effect")
        const newSwing = mapKnobValueToRange(masterFXSettings.swing, 0, 0.5)
        Tone.getTransport().swingSubdivision = "16n"
        Tone.getTransport().swing = newSwing

    }, [masterFXSettings.swing])

    // keep tracks Ref in sync with tracks state
    useEffect(() => {
        tracksRef.current = tracks
    }, [tracks])

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

