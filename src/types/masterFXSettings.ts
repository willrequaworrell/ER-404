export interface MasterFXSettingsType {
    lowCut: number
    highCut: number
    delay: number
    compressorRatio: number
    compressorThreshold: number
    volume: number
}

export const defaultMasterFXSettings: MasterFXSettingsType = {
    lowCut: 0,
    highCut: 100,
    delay: 0,
    compressorRatio: 0,
    compressorThreshold: 100,
    volume: 100,
}