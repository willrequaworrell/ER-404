export const formatSampleVolume = (value: number) => {
    const DB_RANGE = 24
    const volumeDbs = (-1 * DB_RANGE) + ((value / 100) * DB_RANGE)
    return `${volumeDbs.toFixed(0)} dB`
}


export const formatAttack = (value: number) => {
    const attackRange = 200 - 0
    const attackSeconds = ((value / 100) * attackRange)
    return `${attackSeconds.toFixed(0)} ms`
}

export const formatDecay = (value: number) => {
    const MIN_DECAY_TIME = 0.05
    const decayRange = 3 - MIN_DECAY_TIME
    const decaySeconds = MIN_DECAY_TIME + ((value / 100) * decayRange)
    return `${decaySeconds.toFixed(1)} sec`
}

export const formatLowCutFrequency = (value: number) => {
    const freqRange = 2000 - 0  
    const lowCutFreq = ((value / 100) * freqRange)
    return `${lowCutFreq.toFixed(0)} Hz`
}

export const formatHighCutFrequency = (value: number) => {
    const freqRange = 20000 - 2000 
    const highCutFreq = 20000 - ((value / 100) * freqRange)
    return `${highCutFreq.toFixed(0)} Hz`
}


export const formatMasterVolume = (value: number) => {
    const DB_RANGE = 60
    const volumeDbs = (-1 * DB_RANGE) + ((value / 100) * DB_RANGE)
    return `${volumeDbs.toFixed(0)} dB`
}

export const formatMasterCompressorThreshold = (value: number) => {
    const thresholdVal = -30 + ((value / 100) * 30)
    return `${thresholdVal.toFixed(0)} dB`
}

export const formatMasterCompressorRatio = (value: number) => {
    const ratioVal = 1 + ((value / 100) * 7)
    return `${ratioVal.toFixed(0)}:1`
}

