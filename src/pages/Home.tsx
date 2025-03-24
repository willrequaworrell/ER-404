import GlobalControls from "../components/GlobalControls"
import RaisedContainer from "../components/RaisedContainer"
import Timeline from "../components/Timeline"
import TracksSection from "../components/TracksSection"
import { useGlobalStateContext } from "../context/GlobalStateContext"


const Home = () => {

	const {BPM} =  useGlobalStateContext()
	console.log(BPM)
	return (
		<div className="flex flex-col min-h-screen p-24 ">
			<RaisedContainer styles="flex-1">
				<div className="flex flex-col flex-1 ">
					<div className="flex items-center h-1/8">
						<h1 className="flex-1 font-bold text-[4rem] font-title">ER-404</h1>
						<GlobalControls/>
					</div>
					<div className="flex items-center justify-center h-1/16">
						<div className="w-1/8"></div>
						<Timeline/>
					</div>
					<div className="flex flex-col flex-1 gap-y-4 ">
						<TracksSection/>
					</div>
					
				</div>
			</RaisedContainer>
		</div>
	)
}

export default Home
