import { createContext, ReactNode, useContext, useState } from "react"
import { defaultMasterFXSettings, MasterFXSettingsType } from "../types/masterFXSettings"
import { PersistedDataType, useLocalStorage } from "../hooks/useLocalStorage"
import { useMasterChain } from "../hooks/useMasterChain"
import { applyMasterKnobSettings } from "../util/tracksHelpers"
import { mapKnobIdToProperty } from "../util/knobValueHelpers"
import { MasterNodeRefsType } from "../types/MasterNodeRefs"
import * as Tone from 'tone'

export interface MasterFXContextType {
    masterFXSettings: MasterFXSettingsType
    setMasterFXSettings: React.Dispatch<React.SetStateAction<MasterFXSettingsType>>
    handleSetMasterFXSettings: (settingName: keyof MasterFXSettingsType, value: number) => void
    resetMasterFXKnobValue: (knobId: string) => void
    masterNodeRefs: MasterNodeRefsType
    masterNodes: Tone.ToneAudioNode[]
    masterChainReady: boolean
    localStorageData: PersistedDataType
    setLocalStorageData: (localStorageData: PersistedDataType) => void
}

const MasterFXContext = createContext<MasterFXContextType | undefined>(undefined)

export const MasterFXProvider = ({ children }: { children: ReactNode }) => {
    const [localStorageData, setLocalStorageData] = useLocalStorage()
    const { masterNodeRefs, masterNodes, masterChainReady } = useMasterChain()

    const [masterFXSettings, setMasterFXSettings] = useState(localStorageData.masterFXSettings)

    const handleSetMasterFXSettings = (settingName: keyof MasterFXSettingsType, value: number) => {
        // update given setting in state
        setMasterFXSettings(prevSettings => {
            const newSettings = { ...prevSettings, [settingName]: value }

            applyMasterKnobSettings(
                newSettings,
                masterNodeRefs.masterCompressorRef,
                masterNodeRefs.masterEQLowRef,
                masterNodeRefs.masterEQMidRef,
                masterNodeRefs.masterEQHighRef
            );

            return newSettings
        })

    }

    const resetMasterFXKnobValue = (knobId: string) => {
        // turn knob element id into masterSettings state property
        const property = mapKnobIdToProperty(knobId) as keyof MasterFXSettingsType
        if (!property) return

        // get default value for knob
        const defaultValue = defaultMasterFXSettings[property]

        // set state to default setting
        setMasterFXSettings(prevSettings => {
            const newSettings = {
                ...prevSettings,
                [property]: defaultValue
            }

            applyMasterKnobSettings(
                newSettings,
                masterNodeRefs.masterCompressorRef,
                masterNodeRefs.masterEQLowRef,
                masterNodeRefs.masterEQMidRef,
                masterNodeRefs.masterEQHighRef
            );
            return newSettings
        })

    }

    return (
        <MasterFXContext.Provider value={{
            masterFXSettings: masterFXSettings,
            setMasterFXSettings: setMasterFXSettings,
            handleSetMasterFXSettings: handleSetMasterFXSettings,
            resetMasterFXKnobValue: resetMasterFXKnobValue,
            masterNodeRefs,
            masterNodes,
            masterChainReady,
            localStorageData,
            setLocalStorageData
        }}>
            {children}
        </MasterFXContext.Provider>
    );
}


export const useMasterFXContext = () => {
    const context = useContext(MasterFXContext);
    if (!context) throw new Error("useMasterFXContext must be used within MasterFXProvider");
    return context;
  };