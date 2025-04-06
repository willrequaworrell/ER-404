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
    knobSettings: {
        volume: number
        attack: number
        release: number
        lowCut: number
        highCut: number
    }
}