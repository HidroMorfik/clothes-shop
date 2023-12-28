import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/manager/Dashboard.jsx";
import Aside from "./components/Aside.jsx";
import NotFound from "./pages/404.jsx";
import IndexUser from "./pages/admin/users/IndexUser.jsx";
import Login from "./pages/Login.jsx";
import {useState} from "react";
import CreateUser from "./pages/admin/users/CreateUser.jsx";
import Home from "./pages/Home.jsx";
import UpdateUser from "./pages/admin/users/UpdateUser.jsx";
import IndexProduct from "./pages/manager/products/IndexProduct.jsx";
import CreateProduct from "./pages/manager/products/CreateProduct.jsx";
import UpdateProduct from "./pages/manager/products/UpdateProduct.jsx";
import IndexCategory from "./pages/manager/categories/IndexCategory.jsx";
import CreateCategory from "./pages/manager/categories/CreateCategory.jsx";
import UpdateCategory from "./pages/manager/categories/UpdateCategory.jsx";
import IndexOrder from "./pages/manager/orders/IndexOrder.jsx";


export default function route() {
    const links = [
        {
            to: "/dashboard",
            element: <Dashboard/>
        },
        {
            to: "/",
            element: <Home/>
        },
        {
            to: "/users",
            element: <IndexUser/>
        },

        {
            to: "/users/create",
            element: <CreateUser/>
        },
        {
            to: "/users/update/:id",
            element: <UpdateUser/>
        },
        {
            to: "/products",
            element: <IndexProduct/>
        },
        {
            to: "/products/create",
            element: <CreateProduct/>
        },
        {
            to: "/products/update/:id",
            element: <UpdateProduct/>
        },
        {
            to: "/categories",
            element: <IndexCategory/>
        },
        {
            to: "/categories/create",
            element: <CreateCategory/>
        },
        {
            to: "/categories/update/:id",
            element: <UpdateCategory/>
        },
        {
            to: "/orders",
            element: <IndexOrder/>
        },
        {
            to: "/orders/create",
            element: <CreateCategory/>
        },
        {
            to: "/orders/update/:id",
            element: <UpdateCategory/>
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