import MasterFXSection from "./MasterFXSection"
import SampleFXSection from "./SampleFXSection"

const FXSection = () => {
    return (
        <div className="flex items-end justify-between flex-1 w-full h-full gap-x-4">
            <SampleFXSection/>
            <MasterFXSection/>
        </div>
    )
}

export default FXSection
