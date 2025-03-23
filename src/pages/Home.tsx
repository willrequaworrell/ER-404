import GlobalControls from "../components/GlobalControls"
import RaisedContainer from "../components/RaisedContainer"



const Home = () => {
	return (
		<div className="flex flex-col min-h-screen p-24 ">
			<RaisedContainer styles="flex-1">
				<div className="flex flex-col flex-1 ">
					<div className="flex items-center h-1/8">
						<h1 className="flex-1 font-bold text-[4rem] font-title">ER-404</h1>
						<GlobalControls/>
					</div>
					<div className="border h-1/16">
						<p>TIMELINE</p>
					</div>
					<div className="flex-1 border ">
						<p>TRACKS</p>
					</div>
					
				</div>
			</RaisedContainer>
		</div>
	)
}

export default Home
