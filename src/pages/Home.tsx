import FXSection from "../components/FXSection"
import GlobalControls from "../components/GlobalControls"
import RaisedContainer from "../components/RaisedContainer"
import Timeline from "../components/Timeline"
import TracksSection from "../components/TracksSection"

const Home = () => {

	return (
		<div className="flex flex-col min-h-screen lg:p-10 xl:p-18 ">
			<RaisedContainer
			styles="
				flex-1
				bg-background
				border-t border-l border-gray-100/40
				border-b border-r border-gray-900/30
				shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.5),inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.2)]
			"
			noShadow
			>
				<div className="flex flex-col flex-1 gap-y-2">
					<div className="relative flex items-center justify-between w-full h-1/10 gap-x-4">
						<img src="/logo2.png" className="h-2/3" alt="Logo Text: ER-404" />
						<GlobalControls />

					</div>
					<div className="flex items-center justify-center h-1/12">
						<div className="w-1/10"></div>
						<Timeline />
					</div>
					<div className="flex flex-col flex-1 gap-y-4 ">
						<TracksSection />
					</div>
					<div className="flex items-center justify-between pt-4 h-1/5">
						<FXSection />
					</div>

				</div>
			</RaisedContainer>
		</div>
	)
}

export default Home
