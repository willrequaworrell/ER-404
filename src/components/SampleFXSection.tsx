import { useState } from "react"
import Knob from "./Knob"
import SampleViewer from "./SampleViewer"
import { useTracksContext } from "../context/TracksContext"

interface SampleFXKnobsStateType {
    sampleVolume: number
    sampleAttack: number
    sampleRelease: number
    sampleHiCut: number
    sampleLoCut: number
}

const SampleFXSection = () => {
    const {setTrackVolume} = useTracksContext()
    const [FXLevelValues, setFXLevelValues] = useState<SampleFXKnobsStateType>({
        sampleVolume: 0,
        sampleAttack: 0,
        sampleRelease: 0,
        sampleLoCut: 0,
        sampleHiCut: 0,
    })

    const handleKnobChange = (knobId: string, newVolumeLevel: number) => {
        setFXLevelValues(prev => ({ ...prev, [knobId]: newVolumeLevel }))

        if (knobId === "sampleVolume") {
            setTrackVolume(newVolumeLevel)
        }
    }

    return (
        <div className="relative flex items-center w-1/2 h-full pb-3 pr-2 border-b-2 gap-x-[1vw] border-text-primary">
            <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">SAMPLE</span>
            <SampleViewer />
            <Knob 
                id="sampleVolume"
                label="Volume"
                value={FXLevelValues.sampleVolume}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleAttack"
                label="Attack"
                value={FXLevelValues.sampleAttack}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleRelease"
                label="Release"
                value={FXLevelValues.sampleRelease}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleLoCut"
                label="Lo Cut"
                value={FXLevelValues.sampleLoCut}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleHiCut"
                label="Hi Cut"
                value={FXLevelValues.sampleHiCut}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            
            <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
            <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

        </div>
    )
}

export default SampleFXSection
