import { Outlet } from "react-router-dom"


const Layout = () => {
    return (
        <main>
            <div className="flex flex-col min-h-screen bg-background text-text-primary">
                <Outlet/>
            </div>
        </main>
    )
}

export default Layout
