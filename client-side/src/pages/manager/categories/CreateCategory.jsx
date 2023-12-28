
import Layout from "../../../layouts/Layout.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function CreateCategory() {
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token"));
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const submitHandle = (e) => {
        e.preventDefault();

        axios.post(`/categories/create`,{
            name,
            sess_id

        })
            .then((resp)=>{
                toast.success(resp.data.message)
                navigate("/categories")
            })
            .catch((error)=>{
                toast.error(error.response.data.message)
                console.log(error.response.data)
            })
    }

    return (
        <Layout>
            <div className="space-y-10 divide-y divide-gray-900/10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                    <div className="px-4 sm:px-0">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Categories Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Make sure you entered the category name correctly</p>
                    </div>

                    <form onSubmit={submitHandle} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Kategori Adı
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setName(target.value)}
                                            required
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            <a href="/categories" type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                Cancel
                            </a>
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
