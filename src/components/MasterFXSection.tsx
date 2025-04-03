// import { useState } from "react"
import Knob from "./Knob"
import VolumeMeter from "./VolumeMeter"
import { useTracksContext } from "../context/TracksContext"

// interface MasterFXKnobsStateType {
//     masterHiCut: number
//     masterLoCut: number
//     masterPhaser: number
//     masterReverb: number
//     masterRatio: number
//     masterThreshold: number
//     masterVolume: number
// }

const MasterFXSection = () => {
    const {masterFXSettings, handleSetMasterFXSettings} = useTracksContext()
    // const [FXLevelValues, setFXLevelValues] = useState<MasterFXKnobsStateType>({
    //     masterLoCut: 0,
    //     masterHiCut: 0,
    //     masterReverb: 0,
    //     masterPhaser: 0,
    //     masterRatio: 0,
    //     masterThreshold: 0,
    //     masterVolume: 0,
    // })

    const VALUE_PLACEHOLDER = 50

    const handleKnobChange = (knobId: string, newValue: number) => {
        // setFXLevelValues(prev => ({ ...prev, [knobId]: newVolumeLevel }))
        if (knobId === "masterVolume") {
            handleSetMasterFXSettings("volume", newValue)
        }
    }

    
    return (
        <div>
            <div className="relative flex items-end h-full pb-3 pr-2 border-b-2 gap-x-[1vw] border-text-primary">
                <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">MASTER</span>
                <Knob 
                    id="masterLoCut"
                    label="Lo Cut"
                    value={VALUE_PLACEHOLDER}
                    min={0}
                    max={100}
                    onChange={handleKnobChange}
                />
                <Knob 
                    id="masterHiCut"
                    label="Hi Cut"
                    value={VALUE_PLACEHOLDER}
                    min={0}
                    max={100}
                    onChange={handleKnobChange}
                />
                <Knob 
                    id="masterReverb"
                    label="Reverb"
                    value={VALUE_PLACEHOLDER}
                    min={0}
                    max={100}
                    onChange={handleKnobChange}
                />
                <Knob 
                    id="masterPhaser"
                    label="Phaser"
                    value={VALUE_PLACEHOLDER}
                    min={0}
                    max={100}
                    onChange={handleKnobChange}
                />
                <div className="relative flex gap-x-[1vw] border-text-primary">
                    <div className="absolute w-[110%] -translate-x-[5%] h-[2px] -top-3 bg-text-primary "></div>
                    <div className="absolute h-2 border-l -left-2 -top-3 border-1 border-text-primary"></div>
                    <div className="absolute h-2 border-r -right-2 -top-3 border-1 border-text-primary"></div>
                    <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">COMPRESSOR</span>
                    <Knob
                        id="masterRatio"
                        label="Ratio"
                        value={VALUE_PLACEHOLDER}
                        min={0}
                        max={100}
                        onChange={handleKnobChange}
                    />
                    <Knob
                        id="masterThreshold"
                        label="Threshold"
                        value={VALUE_PLACEHOLDER}
                        min={0}
                        max={100}
                        onChange={handleKnobChange}
                    />
                    {/* <Knob label="Ratio" />
                    <Knob label="Threshold" /> */}
                </div>
                <Knob
                    id="masterVolume"
                    label="Volume"
                    value={masterFXSettings.volume}
                    min={0}
                    max={100}
                    onChange={handleKnobChange}
                    isMasterVol
                />
                <VolumeMeter />
                <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
                <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

            </div>
        </div>
    )
}

export default MasterFXSection
