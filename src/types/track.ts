import * as Tone from 'tone';
import { SampleType } from './sample';

export interface TrackType {
    index: number
    name: string
    availableSamples: SampleType[]
    currentSample: SampleType
    trackButtons: boolean[]
    isMuted: boolean
    isSoloed: boolean
    player: Tone.Player
    volume: Tone.Volume
    lowCut: Tone.Filter
    highCut: Tone.Filter
    delay: Tone.PingPongDelay
    reverb: Tone.Reverb
    envelope: Tone.AmplitudeEnvelope
    knobSettings: {
        volume: number
        attack: number
        decay: number
        reverb: number
        delay: number
        lowCut: number
        highCut: number
    }
}