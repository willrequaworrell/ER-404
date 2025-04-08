export const formatVolume = (value: number) => {
    const MIN_VOLUME_DBS = 24
    const volumeDbs = (-1 *MIN_VOLUME_DBS) + ((value / 100) * MIN_VOLUME_DBS)
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