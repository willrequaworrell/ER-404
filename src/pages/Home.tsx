import FXSection from "../components/FXSection"
import GlobalControls from "../components/GlobalControls"
import RaisedContainer from "../components/RaisedContainer"
import Timeline from "../components/Timeline"
import TracksSection from "../components/TracksSection"

const Home = () => {

	return (
		<div className="flex flex-col min-h-screen p-18 ">
			<RaisedContainer styles="flex-1">
				<div className="flex flex-col flex-1 gap-y-2">
					<div className="relative flex items-center justify-between w-full h-1/10 gap-x-4">
						<img src="/logo.png" className="h-3/5" alt="Logo Text: ER-404" />
						<GlobalControls/>
						
					</div>
					<div className="flex items-center justify-center h-1/16">
						<div className="w-1/10"></div>
						<Timeline/>
					</div>
					<div className="flex flex-col flex-1 gap-y-4 ">
						<TracksSection/>
					</div>
					<div className="flex items-center justify-between pt-4 h-1/5">
						<FXSection/>
					</div>
					
				</div>
			</RaisedContainer>
		</div>
	)
}

export default Home
