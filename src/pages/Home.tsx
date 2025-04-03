import FXSection from "../components/FXSection"
import GlobalControls from "../components/GlobalControls"
import RaisedContainer from "../components/RaisedContainer"
import Speaker from "../components/Speaker"
import Timeline from "../components/Timeline"
import TracksSection from "../components/TracksSection"
import { useTracksContext } from "../context/TracksContext"


const Home = () => {

	const {BPM} =  useTracksContext()
	console.log(BPM)
	return (
		<div className="flex flex-col min-h-screen p-20 ">
			<RaisedContainer styles="flex-1">
				<div className="flex flex-col flex-1 gap-y-2">
					<div className="relative flex items-center justify-between h-1/8">
						<h1 className="font-bold text-[4rem] font-title">ER-404</h1>
						<Speaker/>
						<GlobalControls/>
					</div>
					<div className="flex items-center justify-center h-1/16">
						<div className="w-1/8"></div>
						<Timeline/>
					</div>
					<div className="flex flex-col flex-1 gap-y-4 ">
						<TracksSection/>
					</div>
					<div className="flex items-center justify-between pt-4 h-1/6">
						<FXSection/>
					</div>
					
				</div>
			</RaisedContainer>
		</div>
	)
}

export default Home
