import { FaHeadphones, FaVolumeMute } from "react-icons/fa"
import Button from "./Button"

interface MuteSoloControlPropsType {
    trackId: number, 
    isMuted: boolean,
    onToggleMute: (trackId: number) => void
}

const MuteSoloControl = ({trackId, isMuted, onToggleMute}: MuteSoloControlPropsType) => {
    

    return (
        <div className="flex flex-col items-center justify-center h-full gap-y-4">
            <Button
                icon={<FaHeadphones />}
                styles="size-[2rem]"
            />
            <Button
                icon={<FaVolumeMute />}
                styles={`size-[2rem] ${isMuted && "text-accent"}`}
                onClick={() => onToggleMute(trackId)}
            />
        </div>
    )
}

export default MuteSoloControl
