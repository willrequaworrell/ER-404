import { useTracksContext } from "../context/TracksContext"

interface TimelineTickPropsType {
    text: string
    beatIndex: number
}

const TimelineTick = ({text, beatIndex}: TimelineTickPropsType) => {
    const {currentBeat} = useTracksContext()

    return (
        <div className="w-full flex justify-center">
            <p className={`text-sm ${currentBeat === beatIndex + 1 && "text-white"}`}>{text}</p>
        </div>
    )
}

export default TimelineTick
