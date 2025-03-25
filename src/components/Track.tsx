import ScreenContainer from "./ScreenContainer"
import TrackButton from "./TrackButton"
import { TrackType } from '../types/track';


interface TrackPropsType {
    track: TrackType
    setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>
}

const Track = ({track, setTracks}:TrackPropsType) => {
    

    return (
        <div className="flex items-center py-2 h-1/8">
            <div className="h-full pr-4 w-1/8">
                <ScreenContainer 
                    styles="h-full text-[1.1rem]"
                >
                    <p>{track.name}</p>
                </ScreenContainer>
            </div>
            <div className="flex h-full w-7/8 gap-x-4 ">
                {track.trackButtons.map( (_, i)  => (
                    <TrackButton trackIndex={track.index} buttonIndex={i} trackButtons={track.trackButtons} setTracks={setTracks} key={i + Math.random()}/>
                ))}
            </div>
        </div>
    )
}

export default Track
