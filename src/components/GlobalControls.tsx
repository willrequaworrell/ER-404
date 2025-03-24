import { FaPlay, FaPause, FaCaretUp, FaCaretDown } from "react-icons/fa"
import Button from "./Button"
import ScreenContainer from "./ScreenContainer"
import { useGlobalStateContext } from "../context/GlobalStateContext"

const GlobalControls = () => {
    const {BPM, setBPM} = useGlobalStateContext()

    const handleIncrementBPM = () => {
        setBPM(prev => Math.min((prev + 1), 200))
    }

    const handleDecrementBPM = () => {
        setBPM(prev => Math.max((prev - 1), 50))
    }

    return (
        <div className="flex gap-x-4">
            <Button
                icon={<FaPlay />}
                styles="size-[3rem]"
            />
            <Button
                icon={<FaPause />}
                styles="size-[3rem]"
            />
            <div className="flex flex-col justify-between gap-y-2">
                <Button
                    icon={<FaCaretUp />}
                    styles="w-[3rem] h-1/2"
                    onClick={handleIncrementBPM}
                />
                <Button
                    icon={<FaCaretDown />}
                    styles="w-[3rem] h-1/2"
                    onClick={handleDecrementBPM}
                />
            </div>
            <ScreenContainer
                styles="w-[6rem] text-[1.5rem]"
            >
                <p>{BPM}</p>
            </ScreenContainer>
        </div>
    )
}

export default GlobalControls
