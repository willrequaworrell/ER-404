import { FaHeadphones, FaVolumeMute } from "react-icons/fa"
import Button from "./Button"

const MuteSoloControl = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-y-4">
            <Button icon={<FaHeadphones />} styles="size-[2rem]" />
            <Button icon={<FaVolumeMute />} styles="size-[2rem]" />
        </div>
    )
}

export default MuteSoloControl
