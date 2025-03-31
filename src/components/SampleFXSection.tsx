import Knob from "./Knob"
import SampleViewer from "./SampleViewer"

const SampleFXSection = () => {
    return (
        <div className="relative flex items-center w-1/2 h-full pb-3 pr-2 border-b-2 gap-x-8 border-text-primary">
            <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">SAMPLE</span>
            <SampleViewer />
            <Knob label="Volume" />
            <Knob label="Attack" />
            <Knob label="Release" />
            <Knob label="Low Cut" />
            <Knob label="High Cut" />
            <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
            <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

        </div>
    )
}

export default SampleFXSection
