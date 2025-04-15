import * as Tone from 'tone'
import ScreenContainer from "./ScreenContainer"
import TrackButton from "./TrackButton"
import { TrackType } from '../types/track';
import { useTracksContext } from "../context/TracksContext";


interface TrackPropsType {
    track: TrackType
    setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>
}

const Track = ({track, setTracks}:TrackPropsType) => {
    const {currentTrack, setCurrentTrack, isPlaying} = useTracksContext()

    const handleClick = async () => {
        setCurrentTrack(track.index)
        
        if (isPlaying) return 
        
        await Tone.start();
        track.player.stop()

        const now = Tone.now()
        track.envelope.triggerAttack(now)
        track.envelope.triggerRelease(now + Number(track.envelope.attack) + Number(track.envelope.decay) + 0.01)
        track.player.start(now)
    }

    return (
        <div className="flex items-center flex-1 py-[.75vh]">
            <div onClick={handleClick} className="h-full pr-4 cursor-pointer w-1/10">
                <ScreenContainer 
                    styles={`relative h-full text-[1.1rem] ${currentTrack === track.index && "text-white"}`}
                >
                    {/* {(currentTrack === track.index) && <p className="absolute -translate-y-1/2 top-1/2 left-[10%]">•</p>} */}
                    <p>{track.name}</p>
                </ScreenContainer>
            </div>
            <div className="flex h-full items-center w-9/10 gap-x-[1vw]">
                {track.trackButtons.map( (_, i)  => {
                    const isDownbeat = (i + 4) % 4 === 0
                    return <TrackButton trackIndex={track.index} buttonIndex={i} isDownbeat={isDownbeat} trackButtons={track.trackButtons} setTracks={setTracks} key={`${track.index}-${i}`}/>
                })}
            </div>
        </div>
    )
}

export default Track
