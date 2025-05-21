import { useTracksContext } from "../context/TracksContext"

interface TimelineTickPropsType {
    text: string
    beatIndex: number
}

const TimelineTick = ({text, beatIndex}: TimelineTickPropsType) => {
    const {currentBeat} = useTracksContext()

    return (
        <p className={`text-sm ${currentBeat === beatIndex + 1 && "text-white"}`}>{text}</p>
    )
}

export default TimelineTick
