import Navbar from "./Navbar"
import { ToastContainer } from "react-toastify"

export default function Layout({children}) {
  return (
  <>
    <Navbar/>
    <ToastContainer/>
    <main className="PageMain">
        {children}
    </main>
  </>
  )
}
