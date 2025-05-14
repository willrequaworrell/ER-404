import { MasterFXSettingsType } from "../types/masterFXSettings"
import { TrackType } from "../types/track"

// Helper to convert a knobId into the corresponding property name in a track object
export const mapKnobIdToProperty = (knobId: string): keyof TrackType['knobSettings'] | keyof MasterFXSettingsType => {
    const map: Record<string, (keyof TrackType['knobSettings'] | keyof MasterFXSettingsType)> = {
        sampleVolume: 'volume',
        sampleAttack: 'attack',
        sampleDecay: 'decay',
        sampleReverb: 'reverb',
        sampleDelay: 'delay',
        sampleLowCut: 'lowCut',
        sampleHighCut: 'highCut',
        masterLowCut: 'lowCut',
        masterHiCut: 'highCut',
        masterEQLow: 'eqLow',
        masterEQMid: 'eqMid',
        masterEQHigh: 'eqHigh',
        masterDelay: 'delay',
        masterCompressorRatio: 'compressorRatio',
        masterCompressorThreshold: 'compressorThreshold',
        masterVolume: 'volume',
        masterSwing: 'swing',
        
    }

    return map[knobId]
}



// Helper to convert a knob value 0-100 to a relative value in a range from min-max
export const mapKnobValueToRange = (value: number, min: number, max: number) => {
    const range = max - min
    return (min) + ((value / 100) * range)
}

// Sample Knob Formatters
export const formatSampleVolume = (value: number) => {
    const converted = Math.trunc(mapKnobValueToRange(value, -24, 4))
    const formatted = `${converted > 0 ? "+": ""}${converted.toFixed(0)} dB`

    return formatted

}

export const formatLowCutFrequency = (value: number) => {
    const converted = mapKnobValueToRange(value, 0, 2000)
    const formatted = `${converted.toFixed(0)} Hz`

    return formatted 
}

export const formatHighCutFrequency = (value: number) => {
    const converted = mapKnobValueToRange(value, 2000, 20000)
    const formatted = `${converted.toFixed(0)} Hz`

    return formatted
}

export const formatAttack = (value: number) => {
    const converted = mapKnobValueToRange(value, 0, 20)
    const formatted = `${converted.toFixed(0)} ms`

    return formatted 
}


export const formatDecay = (value: number) => {
    const converted = mapKnobValueToRange(value, 0.05, 3)
    const formatted = `${converted.toFixed(1)} sec`

    return formatted
}



// Master Knob formatters


export const formatMasterEQKnob = (value: number) => {
    const converted = Math.trunc(mapKnobValueToRange(value, -6, 6))
    const formatted = `${converted > 0 ? "+": ""}${converted.toFixed(0)} dB`
    
    return formatted
}

export const formatMasterCompressorThreshold = (value: number) => {
    const converted = mapKnobValueToRange(value, -30, 0)
    const formatted = `${converted.toFixed(0)} dB`

    return formatted
}

export const formatMasterCompressorRatio = (value: number) => {
    const converted = mapKnobValueToRange(value, 1, 8)
    const formatted = `${converted.toFixed(0)}:1`

    return formatted
}

export const formatMasterVolume = (value: number) => {
    const converted = mapKnobValueToRange(value, -60, 0)
    const formatted = `${converted.toFixed(0)} dB`

    return formatted
}


