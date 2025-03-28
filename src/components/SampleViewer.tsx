import { FaHeadphones, FaVolumeMute } from "react-icons/fa"
import Button from "./Button"
import ScreenContainer from "./ScreenContainer"

const SampleViewer = () => {
    return (
        <div className="flex w-1/5 h-full gap-x-4 ">
            <ScreenContainer
                styles="h-full flex-1 p-4"
            >
                <img src="/OH_IMG.png" className="h-full" alt="current track sample visualized" />
            </ScreenContainer>
            <div className="flex flex-col items-center justify-center h-full gap-y-4">
                <Button icon={<FaHeadphones/>} styles="size-[2rem]"/>
                <Button icon={<FaVolumeMute/>} styles="size-[2rem]"/>
            </div>
        </div>
    )
}

export default SampleViewer
