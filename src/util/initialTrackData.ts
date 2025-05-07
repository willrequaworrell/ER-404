// import * as Tone from "tone";
import { SampleType } from "../types/sample"
import { allSamples } from "./samplesData"

const NUM_BUTTONS = 16

export interface TrackMetadata {
    index: number
    name: string
    availableSamples: SampleType[]
    currentSample: SampleType
    trackButtons: boolean[]
    isMuted: boolean
    isSoloed: boolean
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

export const initialTracksMetadata: TrackMetadata[] = [
    {
        index: 0,
        name: "KICK",
        availableSamples: allSamples.kick,
        currentSample: allSamples.kick[0],
        trackButtons: Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        knobSettings: {
            volume: 85,
            attack: 0,
            decay: 100,
            reverb: 0,
            delay: 0,
            lowCut: 0,
            highCut: 100
        }
    },
    {
        index: 1,
        name: "CLAP",
        availableSamples: allSamples.clap,
        currentSample: allSamples.clap[0],
        trackButtons: Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        knobSettings: {
            volume: 85,
            attack: 0,
            decay: 100,
            reverb: 0,
            delay: 0,
            lowCut: 0,
            highCut: 100
        }
    },
    {
        index: 2,
        name: "SNARE",
        availableSamples: allSamples.snare,
        currentSample: allSamples.snare[0],
        trackButtons: Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        knobSettings: {
            volume: 85,
            attack: 0,
            decay: 100,
            reverb: 0,
            delay: 0,
            lowCut: 0,
            highCut: 100
        }
    },
    {
        index: 3,
        name: "OPEN HAT",
        availableSamples: allSamples.openHat,
        currentSample: allSamples.openHat[0],
        trackButtons: Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        knobSettings: {
            volume: 85,
            attack: 0,
            decay: 100,
            reverb: 0,
            delay: 0,
            lowCut: 0,
            highCut: 100
        }
    },
    {
        index: 4,
        name: "CLOSED HAT",
        availableSamples: allSamples.closedHat,
        currentSample: allSamples.closedHat[0],
        trackButtons: Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        knobSettings: {
            volume: 85,
            attack: 0,
            decay: 100,
            reverb: 0,
            delay: 0,
            lowCut: 0,
            highCut: 100
        }
    }
]

