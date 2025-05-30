import Knob from "./Knob"
import {formatMasterCompressorRatio, formatMasterCompressorThreshold, formatMasterEQKnob, formatMasterVolume, mapKnobIdToProperty } from "../util/knobValueHelpers"
import { MasterFXSettingsType } from "../types/masterFXSettings"
import Fader from "./Fader"
import { useMasterFXContext } from "../context/MasterFXContext"


const MasterFXSection = () => {
    const {masterFXSettings, handleSetMasterFXSettings, resetMasterFXKnobValue} = useMasterFXContext()


    const handleKnobChange = (knobId: string, newValue: number) => {
        handleSetMasterFXSettings(mapKnobIdToProperty(knobId) as keyof MasterFXSettingsType, newValue)
    }

    
    return (
        <div>
            <div className="relative flex items-end h-full pb-3 border-b-2 gap-x-[1vw] border-text-primary">
                <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">MASTER</span>
                <div className="relative flex gap-x-[1vw] h-[10vh] items-end">
                    <div className="absolute w-full  h-[2px] -top-3 bg-text-primary "></div>
                    <div className="absolute left-0 h-2 border-l -top-3 border-1 border-text-primary"></div>
                    <div className="absolute right-0 h-2 border-r -top-3 border-1 border-text-primary"></div>
                    <span className="absolute px-2 text-[.8rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">EQUALIZER</span>
                    <Fader 
                        id="masterEQLow"
                        label="Bass"
                        value={masterFXSettings.eqLow}
                        min={0}
                        max={100}
                        valueFormatter={formatMasterEQKnob}
                        onChange={handleKnobChange}
                        onDoubleClick={() => resetMasterFXKnobValue("masterEQLow")}
                    />
                    <Fader 
                        id="masterEQMid"
                        label="Mid"
                        value={masterFXSettings.eqMid}
                        min={0}
                        max={100}
                        valueFormatter={formatMasterEQKnob}
                        onChange={handleKnobChange}
                        onDoubleClick={() => resetMasterFXKnobValue("masterEQMid")}
                    />
                    <Fader
                       id="masterEQHigh"
                       label="Treble"
                       value={masterFXSettings.eqHigh}
                       min={0}
                       max={100}
                       valueFormatter={formatMasterEQKnob}
                       onChange={handleKnobChange}
                       onDoubleClick={() => resetMasterFXKnobValue("masterEQHigh")} 
                    />
                </div>
                
                <div className="relative flex gap-x-[1vw] justify-between  h-[10vh] border-text-primary ">
                    <div className="absolute w-full h-[2px] -top-3 bg-text-primary "></div>
                    <div className="absolute left-0 h-2 border-l -top-3 border-1 border-text-primary"></div>
                    <div className="absolute right-0 h-2 border-r -top-3 border-1 border-text-primary"></div>
                    <span className="absolute px-2 text-[.8rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">COMPRESSOR</span>
                    <Knob
                        id="masterCompressorRatio"
                        label="Ratio"
                        value={masterFXSettings.compressorRatio}
                        min={0}
                        max={100}
                        size="md"
                        valueFormatter={formatMasterCompressorRatio}
                        onChange={handleKnobChange}
                        onDoubleClick={() => resetMasterFXKnobValue("masterCompressorRatio")}
                    />
                    <Knob
                        id="masterCompressorThreshold"
                        label="Threshold"
                        value={masterFXSettings.compressorThreshold}
                        min={0}
                        max={100}
                        size="md"
                        valueFormatter={formatMasterCompressorThreshold}
                        onChange={handleKnobChange}
                        onDoubleClick={() => resetMasterFXKnobValue("masterCompressorThreshold")}
                    />
                </div>
                <Knob
                    id="masterVolume"
                    label="Volume"
                    value={masterFXSettings.volume}
                    min={0}
                    max={100}
                    size="lg"
                    valueFormatter={formatMasterVolume}
                    onChange={handleKnobChange}
                    onDoubleClick={() => resetMasterFXKnobValue("masterVolume")}
                />

                <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
                <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

            </div>
        </div>
    )
}

export default MasterFXSection
