import Knob from "./Knob"
import SampleViewer from "./SampleViewer"
import { useTracksContext } from "../context/TracksContext"
import { formatAttack, formatDecay, formatHighCutFrequency, formatLowCutFrequency, formatSampleVolume } from "../util/knobValueHelpers"
import MuteSoloControl from "./MuteSoloControl"


const SampleFXSection = () => {
    const {tracks, currentTrack, setTrackSetting, handleToggleTrackMute, handleToggleTrackSolo} = useTracksContext()
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
        } else if (knobId === "sampleReverb") {
            setTrackSetting("reverb", newLevel) 
        } else if (knobId === "sampleDelay") {
            setTrackSetting("delay", newLevel) 
        } 
    }

    return (
        <div className="relative flex items-center justify-between flex-1 max-w-3/5 h-full pb-3 pr-2 border-b-2 gap-x-[1vw] border-text-primary">
            <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">SAMPLE FX</span>
            <div className="flex flex-1 h-full gap-x-4">
                <SampleViewer />
                <MuteSoloControl
                    trackId={currentTrack}
                    isMuted={tracks[currentTrack].isMuted}
                    isSoloed={tracks[currentTrack].isSoloed}
                    onToggleMute={handleToggleTrackMute}
                    onToggleSolo={handleToggleTrackSolo}
                />
            </div>
            <Knob 
                id="sampleVolume"
                label="Volume"
                value={currentSettings.volume}
                min={0}
                max={100}
                valueFormatter={formatSampleVolume}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleAttack"
                label="Attack"
                value={currentSettings.attack}
                min={0}
                max={100}
                valueFormatter={formatAttack}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleDecay"
                label="Decay"
                value={currentSettings.decay}
                min={0}
                max={100}
                valueFormatter={formatDecay}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleReverb"
                label="Reverb"
                value={currentSettings.reverb}
                min={0}
                max={100}
                onChange={handleKnobChange}
            />
            <Knob
                id="sampleDelay"
                label="Delay"
                value={currentSettings.delay}
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
                valueFormatter={formatLowCutFrequency}
                onChange={handleKnobChange}
            />
            <Knob 
                id="sampleHighCut"
                label="Hi Cut"
                value={currentSettings.highCut}
                min={0}
                max={100}
                valueFormatter={formatHighCutFrequency}
                onChange={handleKnobChange}
            />
            
            <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
            <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

        </div>
    )
}

export default SampleFXSection
