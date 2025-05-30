import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import { MasterFXProvider } from "./context/MasterFXContext"
import { PlaybackProvider } from "./context/PlaybackContext"


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={
						<MasterFXProvider>
							<PlaybackProvider>
								<Home />
							</PlaybackProvider>
						</MasterFXProvider>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
