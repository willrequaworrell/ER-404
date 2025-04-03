import * as Tone from "tone";
import { TrackType } from "../types/track";

const NUM_BUTTONS = 16

export const initialTracks: TrackType[] = [
    {
        index: 0, name: "KICK", 
        sampleImgFile: "/KICK_IMG.png", 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        volume: new Tone.Volume(0), 
        player: new Tone.Player({ url: "/KICK.wav", autostart: false, }).toDestination(),
        knobSettings: {
            volume: 100
        }
    },
    {
        index: 1, 
        name: "CLAP", 
        sampleImgFile: "/CLAP_IMG.png", 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        volume: new Tone.Volume(0), 
        player: new Tone.Player({url: "/CLAP.wav", autostart: false,}).toDestination(),
        knobSettings: {
            volume: 100
        }
    },
    {
        index: 2, 
        name: "SNARE", 
        sampleImgFile: "/SNARE_IMG.png", 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        volume: new Tone.Volume(0), 
        player: new Tone.Player({url: "/SNARE.wav", autostart: false,}).toDestination(),
        knobSettings: {
            volume: 100
        }
    },
    {
        index: 3, 
        name: "OPEN HAT", 
        sampleImgFile: "/OH_IMG.png", 
        trackButtons: new Array(NUM_BUTTONS).fill(false),
        volume: new Tone.Volume(0), 
        player: new Tone.Player({url: "/OH.wav", autostart: false,}).toDestination(),
        knobSettings: {
            volume: 100
        }
    },
    {
        index: 4, 
        name: "CLOSED HAT", 
        sampleImgFile: "/CH_IMG.png", 
        trackButtons: new Array(NUM_BUTTONS).fill(false), 
        volume: new Tone.Volume(0),
        player: new Tone.Player({url: "/CH.wav", autostart: false,}).toDestination(),
        knobSettings: {
            volume: 100
        }
    },
]