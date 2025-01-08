import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div>
            <Outlet />
            I am Layout
        </div>
    )
}

export default Layout