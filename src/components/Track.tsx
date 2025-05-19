import * as Tone from 'tone'
import ScreenContainer from "./ScreenContainer"
import TrackButton from "./TrackButton"
import { TrackType } from '../types/track';
import { useTracksContext } from "../context/TracksContext";
import DropdownSelect from './DropdownSelect';
import { useState } from 'react';


interface TrackPropsType {
    track: TrackType
    setTracks: React.Dispatch<React.SetStateAction<TrackType[]>>
}

const Track = ({track, setTracks}:TrackPropsType) => {
    const {currentTrack, setCurrentTrack, isPlaying, handleChangeTrackSample} = useTracksContext()
    const [showDropdownSelectArrow, setShowDropdownSelectArrow] = useState<boolean>(false)

    const sampleOptions = track.availableSamples.map(sample => sample.kit)
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

    const handleMouseEnterTrackName = () => {
        setShowDropdownSelectArrow(true)
    }

    const handleMouseLeaveTrackName = () => {
        setShowDropdownSelectArrow(false)
    }

    const handleSampleChange = (trackIndex: number, selectedKit: string) => {
        const newSample = track.availableSamples.find(sample => sample.kit === selectedKit)
        if (!newSample) return
        
        handleChangeTrackSample(trackIndex, newSample)
    }

    return (
        <div className="flex items-center flex-1 py-[.75vh]">
            <div 
                onClick={handleClick} 
                onMouseEnter={handleMouseEnterTrackName} 
                onMouseLeave={handleMouseLeaveTrackName}
                className="h-full pr-4 cursor-pointer w-1/9"
            >
                <ScreenContainer 
                    styles={`relative flex-row-reverse px-4 h-full gap-2 text-[.9rem] ${currentTrack === track.index && "text-white"}`}
                >
                    <DropdownSelect 
                        trackIndex={track.index}
                        options={sampleOptions}
                        value={track.currentSample.kit}
                        onChange={handleSampleChange}
                        arrowVisible={showDropdownSelectArrow}
                    />
                    <div className='flex-1 '>
                        <button className=' text-nowrap'>{track.name}</button>
                    </div>
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
