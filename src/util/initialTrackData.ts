import * as Tone from "tone";
import { TrackType } from "../types/track";
import { allSamples } from "./samplesData";


const NUM_BUTTONS = 16



export const initialTracks: TrackType[] = [
    {
        index: 0, name: "KICK", 
        availableSamples: allSamples.kick,
        currentSample: allSamples.kick[0],
        sampleImgFile: allSamples.kick[0].img, 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        player: new Tone.Player({ url: allSamples.kick[0].file, autostart: false, }),
        volume: new Tone.Volume(0),
        delay: new Tone.PingPongDelay({
            wet: 0,
            delayTime: "8n",
            feedback: 0.05,
            maxDelay: 1
        }),
        reverb: new Tone.Reverb({
            wet: 0, 
            decay: 0.1,
            preDelay: 0.01
        }), 
        lowCut: new Tone.Filter(0, "highpass"),
        highCut: new Tone.Filter(20000, "lowpass"),
        envelope: new Tone.AmplitudeEnvelope({
            attack: 0,
            decay: 3,
            sustain: 0,
            release: 0
        }),
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
        sampleImgFile: allSamples.clap[0].img, 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        player: new Tone.Player({url: allSamples.clap[0].file, autostart: false,}),
        volume: new Tone.Volume(0),
        delay: new Tone.PingPongDelay({
            wet: 0,
            delayTime: "8n",
            feedback: 0.05,
            maxDelay: 1
        }),
        reverb: new Tone.Reverb({
            wet: 0, 
            decay: 0.1,
            preDelay: 0.01
        }), 
        lowCut: new Tone.Filter(0, "highpass"),
        highCut: new Tone.Filter(20000, "lowpass"),
        envelope: new Tone.AmplitudeEnvelope({
            attack: 0,
            decay: 3,
            sustain: 0,
            release: 0
        }), 
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
        sampleImgFile: allSamples.snare[0].img, 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        player: new Tone.Player({url: allSamples.snare[0].file, autostart: false,}),
        volume: new Tone.Volume(0),
        delay: new Tone.PingPongDelay({
            wet: 0,
            delayTime: "8n",
            feedback: 0.05,
            maxDelay: 1
        }),
        reverb: new Tone.Reverb({
            wet: 0, 
            decay: 0.1,
            preDelay: 0.01
        }), 
        lowCut: new Tone.Filter(0, "highpass"),
        highCut: new Tone.Filter(20000, "lowpass"),
        envelope: new Tone.AmplitudeEnvelope({
            attack: 0,
            decay: 3,
            sustain: 0,
            release: 0
        }), 
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
        sampleImgFile: allSamples.openHat[0].img, 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false,
        player: new Tone.Player({url: allSamples.openHat[0].file, autostart: false,}),
        volume: new Tone.Volume(0),
        delay: new Tone.PingPongDelay({
            wet: 0,
            delayTime: "8n",
            feedback: 0.05,
            maxDelay: 1
        }),
        reverb: new Tone.Reverb({
            wet: 0, 
            decay: 0.1,
            preDelay: 0.01
        }), 
        lowCut: new Tone.Filter(0, "highpass"),
        highCut: new Tone.Filter(20000, "lowpass"),
        envelope: new Tone.AmplitudeEnvelope({
            attack: 0,
            decay: 3,
            sustain: 0,
            release: 0
        }), 
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
        sampleImgFile: allSamples.closedHat[0].img, 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        isMuted: false,
        isSoloed: false, 
        player: new Tone.Player({url: allSamples.closedHat[0].file, autostart: false,}),
        volume: new Tone.Volume(0),
        delay: new Tone.PingPongDelay({
            wet: 0,
            delayTime: "8n",
            feedback: 0.05,
            maxDelay: 1
        }),
        reverb: new Tone.Reverb({
            wet: 0, 
            decay: 0.1,
            preDelay: 0.01
        }), 
        lowCut: new Tone.Filter(0, "highpass"),
        highCut: new Tone.Filter(20000, "lowpass"),
        envelope: new Tone.AmplitudeEnvelope({
            attack: 0,
            decay: 3,
            sustain: 0,
            release: 0
        }),
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
]