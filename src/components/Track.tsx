import ScreenContainer from "./ScreenContainer"
import TrackButton from "./TrackButton"

interface TrackPropsType {
    trackName: string
}

const NUM_BUTTONS = 16
const buttonNumArray = new Array(NUM_BUTTONS).fill(0)

const Track = ({trackName}:TrackPropsType) => {
    return (
        <div className="flex items-center py-2 h-1/8">
            <div className="h-full pr-4 w-1/8">
                <ScreenContainer styles="h-full">
                    <p>{trackName}</p>
                </ScreenContainer>
            </div>
            <div className="flex h-full w-7/8 gap-x-4 ">
                {buttonNumArray.map( i => (
                    <TrackButton key={i + Math.random()}/>
                ))}
            </div>
        </div>
    )
}

export default Track
