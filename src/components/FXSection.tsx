import Knob from "./Knob"
import SampleViewer from "./SampleViewer"

const FXSection = () => {
    return (
        <div className="flex items-center flex-1 w-full h-full gap-x-4 ">
            <SampleViewer/>
            <Knob label="Volume"/>
            <Knob label="Attack"/>
            <Knob label="Release"/>
            <Knob label="Low Cut"/>
            <Knob label="High Cut"/>
        </div>
    )
}

export default FXSection
