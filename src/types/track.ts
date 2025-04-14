import * as Tone from 'tone';

export interface TrackType {
    index: number
    name: string
    sampleImgFile: string
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