import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import { TracksProvider } from "./context/TracksContext"


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={
						<TracksProvider>
							<Home />
						</TracksProvider>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
