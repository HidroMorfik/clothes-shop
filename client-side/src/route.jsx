import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Aside from "./components/Aside.jsx";
import NotFound from "./pages/404.jsx";
import Index from "./pages/admin/users/Index.jsx";
import Login from "./pages/Login.jsx";


export default function route() {

    const links = [
        {
            to: "/",
            element: <Dashboard/>
        },
        {
            to: "/users",
            element: <Index/>
        },
        {
            to: "/login",
            element: <Login/>
        }
    ]


    return (
        <BrowserRouter>
            <Routes>
                { links.map((link, index) =>
                    <Route key={index} path={link.to} element={link.element}/>
                ) }
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}