export const formatVolume = (value: number) => {
    const MIN_VOLUME_DBS = 24
    const volumeDbs = (-1 *MIN_VOLUME_DBS) + ((value / 100) * MIN_VOLUME_DBS)
    return `${volumeDbs.toFixed(0)} dB`
}

// export const formatLowCutFrequency = (value: number) => {
//     const freqRange = 2000 - 0  
//     const lowCutFreq = ((value / 100) * freqRange)
//     return `${} `
// }