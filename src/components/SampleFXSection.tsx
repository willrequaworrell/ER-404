import Knob from "./Knob"
import SampleViewer from "./SampleViewer"
import { useTracksContext } from "../context/TracksContext"
import { formatVolume } from "../util/knobValueFormatters"


const SampleFXSection = () => {
    const {tracks, currentTrack, setTrackSetting} = useTracksContext()
    const currentSettings = tracks[currentTrack].knobSettings


    const handleKnobChange = (knobId: string, newLevel: number) => {

        if (knobId === "sampleVolume") {
            setTrackSetting("volume", newLevel)
        } else if (knobId === "sampleAttack") {
            setTrackSetting("attack", newLevel) 
        } else if (knobId === "sampleDecay") {
            setTrackSetting("decay", newLevel) 
        } else if (knobId === "sampleLowCut") {
            setTrackSetting("lowCut", newLevel) 
        } else if (knobId === "sampleHighCut") {
            setTrackSetting("highCut", newLevel) 
        } 
    }

    return (
        <div className="relative flex items-center w-1/2 h-full pb-3 pr-2 border-b-2 gap-x-[1vw] border-text-primary">
            <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">SAMPLE</span>
            <SampleViewer />
            <Knob 
                id="sampleVolume"
                label="Volume"
                value={currentSettings.volume}
                min={0}
                max={100}
                valueFormatter={formatVolume}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleAttack"
                label="Attack"
                value={currentSettings.attack}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleDecay"
                label="Decay"
                value={currentSettings.decay}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleLowCut"
                label="Lo Cut"
                value={currentSettings.lowCut}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleHighCut"
                label="Hi Cut"
                value={currentSettings.highCut}
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
