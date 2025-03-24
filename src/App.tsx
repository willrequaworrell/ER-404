import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import { GlobalStateProvider } from "./context/GlobalStateContext"


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout/>}>
					<Route index element={
						<GlobalStateProvider>
							<Home/>
						</GlobalStateProvider>
					}/>
				</Route>
			</Routes>
		</BrowserRouter>
  	)
}

export default App
