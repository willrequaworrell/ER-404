import { FaPlay, FaPause, FaCaretUp, FaCaretDown } from "react-icons/fa"
import Button from "./Button"
import ScreenContainer from "./ScreenContainer"

const GlobalControls = () => {
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
                />
                <Button
                    icon={<FaCaretDown />}
                    styles="w-[3rem] h-1/2"
                />
            </div>
            <ScreenContainer
                styles="w-[6rem] text-[1.5rem]"
            >
                <p>128</p>
            </ScreenContainer>
        </div>
    )
}

export default GlobalControls
