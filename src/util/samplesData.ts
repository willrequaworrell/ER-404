interface SampleType {
    file: string
    kit: "House" | "Trap" | "Garage" | "BoomBap"
}


const kickSamples: SampleType[] = [
    {file: "/samples/HOUSE_KICK.wav", kit: "House"},
    {file: "/samples/TRAP_KICK.wav", kit: "Trap"},
    {file: "/samples/GARAGE_KICK.wav", kit: "Garage"},
    {file: "/samples/BB_KICK.wav", kit: "BoomBap"}
]

const clapSamples: SampleType[] = [
    {file: "/samples/HOUSE_CLAP.wav", kit: "House"},
    {file: "/samples/TRAP_CLAP.wav", kit: "Trap"},
    {file: "/samples/GARAGE_CLAP.wav", kit: "Garage"},
    {file: "/samples/BB_CLAP.wav", kit: "BoomBap"}
]

const snareSamples: SampleType[] = [
    {file: "/samples/HOUSE_SNARE.wav", kit: "House"},
    {file: "/samples/TRAP_SNARE.wav", kit: "Trap"},
    {file: "/samples/GARAGE_SNARE.wav", kit: "Garage"},
    {file: "/samples/BB_SNARE.wav", kit: "BoomBap"}
]

const openHatSamples: SampleType[] = [
    {file: "/samples/HOUSE_OH.wav", kit: "House"},
    {file: "/samples/TRAP_OH.wav", kit: "Trap"},
    {file: "/samples/GARAGE_OH.wav", kit: "Garage"},
    {file: "/samples/BB_OH.wav", kit: "BoomBap"}
]

const closedHatSamples: SampleType[] = [
    {file: "/samples/HOUSE_CH.wav", kit: "House"},
    {file: "/samples/TRAP_CH.wav", kit: "Trap"},
    {file: "/samples/GARAGE_CH.wav", kit: "Garage"},
    {file: "/samples/BB_CH.wav", kit: "BoomBap"}
]

export const allSamples = {
    kick: kickSamples,
    clap: clapSamples,
    snare: snareSamples,
    openHat: openHatSamples,
    closedHat: closedHatSamples
}