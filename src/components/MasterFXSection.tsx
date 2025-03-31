import Knob from "./Knob"

const MasterFXSection = () => {
    return (
        <div>
            <div className="relative flex items-end h-full pb-3 pr-2 border-b-2 gap-x-8 border-text-primary">
                <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -bottom-3 left-1/2">MASTER</span>
                <Knob label="Low Cut" />
                <Knob label="High Cut" />
                <Knob label="Reverb" />
                <Knob label="Phaser" />
                <div className="relative flex gap-x-8 border-text-primary">
                    <div className="absolute w-[110%] -translate-x-[5%] h-[2px] -top-3 bg-text-primary "></div>
                    <div className="absolute h-2 border-l -left-2 -top-3 border-1 border-text-primary"></div>
                    <div className="absolute h-2 border-r -right-2 -top-3 border-1 border-text-primary"></div>
                    <span className="absolute px-2 text-[.85rem] -translate-x-1/2 text-text-primary bg-background -top-6 left-1/2">COMPRESSOR</span>
                    <Knob label="Ratio" />
                    <Knob label="Threshold" />
                </div>
                <Knob label="Volume" isMasterVol />
                
                <div className="absolute bottom-0 left-0 h-2 border-l border-1 border-text-primary"></div>
                <div className="absolute bottom-0 right-0 h-2 border-r border-1 border-text-primary"></div>

            </div>
        </div>
    )
}

export default MasterFXSection
