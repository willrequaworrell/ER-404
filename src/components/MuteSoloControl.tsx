import { FaHeadphones, FaVolumeMute } from "react-icons/fa"
import Button from "./Button"

interface MuteSoloControlPropsType {
    trackId: number, 
    isMuted: boolean,
    isSoloed: boolean,
    onToggleMute: (trackId: number) => void
    onToggleSolo: (trackId: number) => void
}

const MuteSoloControl = ({trackId, isMuted, isSoloed, onToggleMute, onToggleSolo}: MuteSoloControlPropsType) => {
    

    return (
        <div className="flex flex-col items-center justify-center h-full gap-y-4">
            <Button
                icon={<FaHeadphones />}
                styles={`size-[2rem] ${isSoloed && "text-accent shadow-[inset_-2px_-2px_4px_#ffffffe0,inset_1px_1px_2px_#718eab1a]"}`}
                onClick={() => onToggleSolo(trackId)}
            />
            <Button
                icon={<FaVolumeMute />}
                styles={`size-[2rem] ${(isMuted) && "text-accent shadow-[inset_-2px_-2px_4px_#ffffffe0,inset_1px_1px_2px_#718eab1a]"}`}
                onClick={() => onToggleMute(trackId)}
            />
        </div>
    )
}

export default MuteSoloControl
