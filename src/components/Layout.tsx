import { Outlet } from "react-router-dom"

const Layout = () => (
  <main
    className="
      min-h-screen backdrop-blur-3xl flex flex-col text-text-primary
      bg-gradient-to-br
      from-background
      to-[#5740807b]
    "
  >
    <Outlet/>
  </main>
)

export default Layout
