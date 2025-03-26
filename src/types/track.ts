import * as Tone from 'tone';

export interface TrackType {
    index: number
    name: string
    // sampleFile: string
    trackButtons: boolean[]
    player: Tone.Player
}