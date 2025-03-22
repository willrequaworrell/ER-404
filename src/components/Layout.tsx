import { Outlet } from "react-router-dom"


const Layout = () => {
    return (
        <main>
            <div className="flex min-h-screen flex-col bg-[#e9edf0]">
                <Outlet/>
            </div>
        </main>
    )
}

export default Layout
