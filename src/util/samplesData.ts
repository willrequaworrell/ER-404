import { SampleType } from "../types/sample"



const kickSamples: SampleType[] = [
    {file: "/samples/HOUSE_KICK.wav", kit: "House", img: "/waveforms/HOUSE_KICK.png"},
    {file: "/samples/TRAP_KICK.wav", kit: "Trap", img: "/waveforms/TRAP_KICK.png"},
    {file: "/samples/GARAGE_KICK.wav", kit: "Garage", img: "/waveforms/GARAGE_KICK.png"},
    {file: "/samples/BB_KICK.wav", kit: "BoomBap", img: "/waveforms/BB_KICK.png"}
]

const clapSamples: SampleType[] = [
    {file: "/samples/HOUSE_CLAP.wav", kit: "House", img: "/waveforms/HOUSE_CLAP.png"},
    {file: "/samples/TRAP_CLAP.wav", kit: "Trap", img: "/waveforms/TRAP_CLAP.png"},
    {file: "/samples/GARAGE_CLAP.wav", kit: "Garage", img: "/waveforms/GARAGE_CLAP.png"},
    {file: "/samples/BB_CLAP.wav", kit: "BoomBap", img: "/waveforms/BB_CLAP.png"}
]

const snareSamples: SampleType[] = [
    {file: "/samples/HOUSE_SNARE.wav", kit: "House", img: "/waveforms/HOUSE_SNARE.png"},
    {file: "/samples/TRAP_SNARE.wav", kit: "Trap", img: "/waveforms/TRAP_SNARE.png"},
    {file: "/samples/GARAGE_SNARE.wav", kit: "Garage", img: "/waveforms/GARAGE_SNARE.png"},
    {file: "/samples/BB_SNARE.wav", kit: "BoomBap", img: "/waveforms/BB_SNARE.png"}
]

const openHatSamples: SampleType[] = [
    {file: "/samples/HOUSE_OH.wav", kit: "House", img: "/waveforms/HOUSE_OH.png"},
    {file: "/samples/TRAP_OH.wav", kit: "Trap", img: "/waveforms/TRAP_OH.png"},
    {file: "/samples/GARAGE_OH.wav", kit: "Garage", img: "/waveforms/GARAGE_OH.png"},
    {file: "/samples/BB_OH.wav", kit: "BoomBap", img: "/waveforms/BB_OH.png"}
]

const closedHatSamples: SampleType[] = [
    {file: "/samples/HOUSE_CH.wav", kit: "House", img: "/waveforms/HOUSE_CH.png"},
    {file: "/samples/TRAP_CH.wav", kit: "Trap", img: "/waveforms/TRAP_CH.png"},
    {file: "/samples/GARAGE_CH.wav", kit: "Garage", img: "/waveforms/GARAGE_CH.png"},
    {file: "/samples/BB_CH.wav", kit: "BoomBap", img: "/waveforms/BB_CH.png"}
]

export const allSamples = {
    kick: kickSamples,
    clap: clapSamples,
    snare: snareSamples,
    openHat: openHatSamples,
    closedHat: closedHatSamples
}