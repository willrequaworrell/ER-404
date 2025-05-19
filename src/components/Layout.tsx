import { Outlet } from "react-router-dom"

const MobileUnsupported = () => (
  <div className="flex flex-col  items-center min-h-screen h-screen backdrop-blur-3xl text-text-primary bg-gradient-to-br from-background to-[#5740807b] p-4 text-center">
    <div className="flex h-1/2 bg- flex-col justify-end items-center ">
        <img src="/logo2.png" className="w-full animate-pulse border-b-text-primary" alt="Logo Text: ER-404" />
        <h2 className="text-xs text-justify animate-pulse text-background font-digital">Currently unsupported on mobile. Please open on a larger screen for the full experience!</h2>
    </div>
    <div className="h-1/2 flex flex-col justify-end font-digital">
        
    </div>
    {/* <h2 className="text-2xl font-bold mb-2">Mobile Not Supported</h2>
    <p>Please open this app on a tablet or desktop for the full experience.</p> */}
    
  </div>
)

const Layout = () => (
  <main className="relative min-h-screen overflow-hidden">
    {/* 1) Show this on mobile (up to md breakpoint) */}
    <div className="flex md:hidden">
      <MobileUnsupported/>
    </div>

    {/* 2) Show your real app on md+ screens */}
    <div className="hidden md:flex flex-col min-h-screen backdrop-blur-3xl text-text-primary bg-gradient-to-br from-background to-[#5740807b]">
      <Outlet/>
    </div>
  </main>
)

export default Layout
