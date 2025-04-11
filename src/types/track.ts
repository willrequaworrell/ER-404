import * as Tone from 'tone';

export interface TrackType {
    index: number
    name: string
    sampleImgFile: string
    trackButtons: boolean[]
    player: Tone.Player
    volume: Tone.Volume
    lowCut: Tone.Filter
    highCut: Tone.Filter
    delay: Tone.PingPongDelay
    envelope: Tone.AmplitudeEnvelope
    knobSettings: {
        volume: number
        attack: number
        decay: number
        delay: number
        lowCut: number
        highCut: number
    }
}