import { Outlet } from "react-router-dom"

const MobileUnsupported = () => (
  <div className="flex flex-col  items-center w-screen min-h-screen max-h-screen h-screen backdrop-blur-3xl text-text-primary bg-gradient-to-br from-background to-[#5740807b] p-4 text-center">
    <div className="flex h-1/2 bg- flex-col justify-end items-center ">
        <img src="/logo2.png" className="w-full animate-pulse border-b-text-primary" alt="Logo Text: ER-404" />
        <h2 className="text-xs text-justify animate-pulse text-white font-bold font-digital">Currently unsupported on mobile. Please open on a larger screen for the full experience!</h2>
    </div>
  </div>
)

const Layout = () => (
  <main className="relative min-h-screen overflow-hidden">
    <div className="flex lg:hidden">
      <MobileUnsupported/>
    </div>

    <div className="hidden md:flex flex-col min-h-screen backdrop-blur-3xl text-text-primary bg-gradient-to-br from-background to-[#5740807b]">
      <Outlet/>
    </div>
  </main>
)

export default Layout
