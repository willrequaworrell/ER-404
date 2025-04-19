// import { useState } from "react"
import Knob from "./Knob"
import { useTracksContext } from "../context/TracksContext"
import { formatHighCutFrequency, formatLowCutFrequency, formatMasterCompressorRatio, formatMasterCompressorThreshold, formatMasterVolume } from "../util/knobValueFormatters"


const MasterFXSection = () => {
    const {masterFXSettings, handleSetMasterFXSettings} = useTracksContext()


    const handleKnobChange = (knobId: string, newValue: number) => {
        if (knobId === "masterLowCut") {
            handleSetMasterFXSettings("lowCut", newValue)
        } else if (knobId === "masterHiCut") {
            handleSetMasterFXSettings("highCut", newValue)
        } else if (knobId === "masterCompressorRatio") {
            handleSetMasterFXSettings("compressorRatio", newValue)
        } else if (knobId === "masterCompressorThreshold") {
            handleSetMasterFXSettings("compressorThreshold", newValue)
        } else if (knobId === "masterVolume") {
            handleSetMasterFXSettings("volume", newValue)
        }
    }

    
    return (
        <div>
            <div className="relative flex items-end h-full pb-3 pr-2 border-b-2 gap-x-[1vw] border-text-primary">
                <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">MASTER</span>
                
                <Knob 
                    id="masterLowCut"
                    label="Lo Cut"
                    value={masterFXSettings.lowCut}
                    min={0}
                    max={100}
                    valueFormatter={formatLowCutFrequency}
                    onChange={handleKnobChange}
                />
                <Knob 
                    id="masterHiCut"
                    label="Hi Cut"
                    value={masterFXSettings.highCut}
                    min={0}
                    max={100}
                    valueFormatter={formatHighCutFrequency}
                    onChange={handleKnobChange}
                />
                
                <div className="relative flex gap-x-[1vw] justify-between  border-text-primary">
                    <div className="absolute w-[110%] -translate-x-[5%] h-[2px] -top-3 bg-text-primary "></div>
                    <div className="absolute h-2 border-l -left-2 -top-3 border-1 border-text-primary"></div>
                    <div className="absolute h-2 border-r -right-2 -top-3 border-1 border-text-primary"></div>
                    <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">COMPRESSOR</span>
                    <Knob
                        id="masterCompressorRatio"
                        label="Ratio"
                        value={masterFXSettings.compressorRatio}
                        min={0}
                        max={100}
                        valueFormatter={formatMasterCompressorRatio}
                        onChange={handleKnobChange}
                    />
                    <Knob
                        id="masterCompressorThreshold"
                        label="Threshold"
                        value={masterFXSettings.compressorThreshold}
                        min={0}
                        max={100}
                        valueFormatter={formatMasterCompressorThreshold}
                        onChange={handleKnobChange}
                    />
                </div>
                <Knob
                    id="masterVolume"
                    label="Volume"
                    value={masterFXSettings.volume}
                    min={0}
                    max={100}
                    valueFormatter={formatMasterVolume}
                    onChange={handleKnobChange}
                    isMasterVol
                />

                <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
                <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

            </div>
        </div>
    )
}

export default MasterFXSection
