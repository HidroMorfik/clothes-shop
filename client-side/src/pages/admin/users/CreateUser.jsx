
import Layout from "../../../layouts/Layout.jsx";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function CreateUser() {
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token"));
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [zip, setCity] = useState("34");
    const [role, setRole] = useState("customer");


    const submitHandle = (e) => {
      e.preventDefault();

      axios.post("/users/create",{
          name,
          surname,
          email,
          password,
          zip,
          role,
          sess_id
      })
          .then((resp)=>{
              toast.success(resp.data.message)
              navigate("/users")
          })
          .catch((error)=>{
              toast.error(error.response.data.message)
          })
    }

    return (
        <Layout>
            <div className="space-y-10 divide-y divide-gray-900/10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                    <div className="px-4 sm:px-0">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
                    </div>

                    <form onSubmit={submitHandle} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        First name
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

                                <div className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Last name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setSurname(target.value)}
                                            required
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            autoComplete="family-name"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setEmail(target.value)}
                                            required
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setPassword(target.value)}
                                            required
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="password"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                        City
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            onChange={({ target }) => setCity(target.value)}
                                            id="city"
                                            name="city"
                                            defaultValue="34"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="34">Istanbul</option>
                                            <option value="43">Kocaeli</option>
                                            <option value="null">Mexico</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="sm:col-span-4">
                                    <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                        Role
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            onChange={({ target }) => setRole(target.value)}
                                            id="role"
                                            name="role"
                                            defaultValue="customer"
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="customer">Customer</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            <a href="/users" type="button" className="text-sm font-semibold leading-6 text-gray-900">
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
