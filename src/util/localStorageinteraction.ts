import { masterFXSettingsType } from "../types/masterFXSettings"
import { TrackType } from "../types/track"

export const STORAGE_KEY = "ER-404 Settings"
const MAX_STORAGE_AGE = 7 * 24 * 60 * 60 * 1000 // first number is # days

export interface PersistedDataType {
    tracks: Array<{
        trackButtons: boolean[]
        knobSettings: TrackType['knobSettings']
        isMuted: boolean
        isSoloed: boolean
    }>
    masterFXSettings: masterFXSettingsType
    BPM: number
}

export interface TimestampedPersistedDataType extends PersistedDataType {
    savedAt: number
}

export const saveStateToLocalStorage = (state: PersistedDataType) => {
    try {
        const item: TimestampedPersistedDataType = {
            savedAt: Date.now(),
            ...state
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(item))
    } catch (error) {
        console.error("Failed to save sequencer data to local storage", error)
    }
}

export const LoadStateFromLocalStorage = (): TimestampedPersistedDataType | null => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY)
        if (!serializedState) return null

        const parsedState = JSON.parse(serializedState) as TimestampedPersistedDataType
        // return null and remove stored item if stale data
        if ((Date.now() - parsedState.savedAt) > MAX_STORAGE_AGE) {
            localStorage.removeItem(STORAGE_KEY)
            return null
        }

        return parsedState
        
    } catch (error) {
        console.error("Failed to load sequencer data from local storage" , error)
    }
    return null
}