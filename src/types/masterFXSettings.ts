export interface MasterFXSettingsType {
    eqLow: number
    eqMid: number
    eqHigh: number
    compressorRatio: number
    compressorThreshold: number
    volume: number
}

export const defaultMasterFXSettings: MasterFXSettingsType = {
    eqLow: 50,
    eqMid: 50,
    eqHigh: 50,
    compressorRatio: 0,
    compressorThreshold: 100,
    volume: 100,
}