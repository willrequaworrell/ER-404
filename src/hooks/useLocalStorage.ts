import { useEffect, useState } from "react"
import { MasterFXSettingsType } from "../types/masterFXSettings"
import { SampleType } from "../types/sample"
import { TrackType } from "../types/track"
import { defaultLocalStorageData } from "../util/initialTrackData"


const STORAGE_KEY = "ER-404 Settings"
const MAX_STORAGE_AGE = 7 * 24 * 60 * 60 * 1000 // first number is # days

export interface PersistedDataType {
    tracks: Array<{
        trackButtons: boolean[]
        knobSettings: TrackType['knobSettings']
        isMuted: boolean
        isSoloed: boolean
        currentSample: SampleType
    }>
    masterFXSettings: MasterFXSettingsType
    BPM: number
}

interface TimestampedPersistedDataType extends PersistedDataType {
    savedAt: number
}

export const useLocalStorage = (): [PersistedDataType, (localStorageData: PersistedDataType) => void] => {
    // Load from local storage or fall back 
    const [localStorageData, setLocalStorageData] = useState<PersistedDataType>(() => {
        try {
            const rawData = localStorage.getItem(STORAGE_KEY)
            if (rawData) {
                const parsedData = JSON.parse(rawData) as TimestampedPersistedDataType
                if ((Date.now() - parsedData.savedAt) < MAX_STORAGE_AGE) {
                    // strip off time stamp to return 
                    const {savedAt, ...rest} = parsedData
                    return rest as PersistedDataType
                }
                localStorage.removeItem(STORAGE_KEY)
                
            }
        } catch (error) {
            console.error("Failed to load data from local storage", error)
        }
        return defaultLocalStorageData
    })

    useEffect(() => {
        try {
            const stringifiedData = JSON.stringify({savedAt: Date.now(), ...localStorageData})
            localStorage.setItem(STORAGE_KEY, stringifiedData)
        } catch (error) {
            console.error("Failed to save data to local storage", error)
        }
    } , [localStorageData])

    return [localStorageData, setLocalStorageData]
}