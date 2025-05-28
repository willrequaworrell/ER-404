import * as Tone from 'tone'
import { PersistedDataType } from './useLocalStorage'
import { initialTracksMetadata } from '../util/initialTrackData'
import { useEffect, useRef, useState } from 'react'
import { TrackType } from '../types/track'
import { SampleType } from '../types/sample'
import { mapKnobIdToProperty, mapKnobValueToRange } from '../util/knobValueHelpers'
import { rebuildTrackChain } from '../util/tracksHelpers'
import { MasterNodeRefsType } from '../types/MasterNodeRefs'

interface UseTracksStateReturnType {
    tracks: TrackType[]
    setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>
    tracksRef: React.RefObject<TrackType[]>
    currentTrack: number
    setCurrentTrack: React.Dispatch<React.SetStateAction<number>>
    setTrackSetting: (settingName: keyof TrackType["knobSettings"], value: number) => void
    handleToggleTrackMute: (trackIndex: number) => void
    handleToggleTrackSolo:(trackIndex: number) => void
    handleChangeTrackSample:(trackIndex: number, newSample: SampleType) => void
    resetSampleFXKnobValue: (trackIndex: number, knobId: string) => void
}

export const useTracksState = (trackPlayersRef: React.RefObject<Record<string, Tone.Player>>, localStorageData: PersistedDataType, masterNodeRefs: MasterNodeRefsType): UseTracksStateReturnType => {
    
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

    const tracksRef = useRef<TrackType[]>(tracks)
    useEffect(() => {
        tracksRef.current = tracks
    }, [tracks])
    
    const [currentTrack, setCurrentTrack] = useState<number>(0)

    // Handler Functions

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

    const handleChangeTrackSample = (trackIndex: number, newSample: SampleType) => {
        setTracks(prevTracks => {
            return prevTracks.map((track, index) => {
                if (index !== trackIndex) return track

                // get rid of old track player
                track.player.stop()
                track.player.dispose()

                // get player from preloaded buffer ro fallback on new one from sample file
                const preloadedPlayer = trackPlayersRef.current[newSample.file]
                const player = preloadedPlayer?.buffer?.loaded ?
                    new Tone.Player(preloadedPlayer.buffer) :
                    new Tone.Player({url: newSample.file, autostart: false})

                // create new player with new sample and connect it to signal chain 
                player.chain(
                    track.envelope,
                    track.lowCut,
                    track.highCut,
                    track.volume,
                    track.delay,
                    track.reverb,
                )

                // return the track with the new sample & player
                return {
                    ...track,
                    currentSample: newSample,
                    player: player
                }
            })
        })
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

    const setTrackSetting = (settingName: keyof TrackType['knobSettings'], value: number) => {
        
        setTracks(prevTracks => {

            return prevTracks.map((track, index) => {
                if (index !== currentTrack) return track

                // create new copy of track with updated knob settings
                const newTrack: TrackType = {
                    ...track, 
                    knobSettings: {
                        ...track.knobSettings,
                        [settingName]: value
                    }
                }

                // sync fx node value with track state
                if (settingName === "volume") {
                    newTrack.volume.volume.value = mapKnobValueToRange(value, -24, 4)
                }
                else if (settingName === "lowCut") {
                    newTrack.lowCut.frequency.value = mapKnobValueToRange(value, 0, 2000)
                }
                else if (settingName === "highCut") {
                    newTrack.highCut.frequency.value = mapKnobValueToRange(value, 2000, 20000)
                }
                else if (settingName === "attack") {
                    newTrack.envelope.attack = mapKnobValueToRange(value, 0, 20)
                }
                else if (settingName === "decay") {
                    newTrack.envelope.decay = mapKnobValueToRange(value, 0.05, 3)
                }
                else if (settingName === "reverb") {
                    newTrack.reverb.wet.value = mapKnobValueToRange(value, 0, 0.5)
                    newTrack.reverb.decay = mapKnobValueToRange(value, 0.1, 3)
                }
                else if (settingName === "delay") {
                    newTrack.delay.wet.value = mapKnobValueToRange(value, 0, .5)
                }

                const masterNodes = [
                    masterNodeRefs.masterEQLowRef.current!,
                    masterNodeRefs.masterEQMidRef.current!,
                    masterNodeRefs.masterEQHighRef.current!,
                    masterNodeRefs.masterCompressorRef.current!,
                    masterNodeRefs.masterLimiterRef.current!,
                    masterNodeRefs.masterMeterRef.current!,
                ]
            
                // rebuild track + connect to master chain
                rebuildTrackChain(newTrack, masterNodes);

                return newTrack
            })
            
        })
    }

    // keep tracks Ref in sync with tracks state
    useEffect(() => {
        tracksRef.current = tracks
    }, [tracks])

    return {
        tracks, 
        setTracks, 
        tracksRef,
        currentTrack,
        setCurrentTrack,
        setTrackSetting, 
        handleToggleTrackMute, 
        handleToggleTrackSolo,
        handleChangeTrackSample,
        resetSampleFXKnobValue,
    }
}