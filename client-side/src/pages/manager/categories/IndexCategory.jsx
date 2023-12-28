import Layout from "../../../layouts/Layout.jsx";
import axios from "axios";
import classNames from "classnames";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {RiThreadsFill} from "react-icons/ri";
import {HiOutlineTrash} from "react-icons/hi";

export default function IndexCategory(){
    const [categories, setCategories] = useState(false);

    const navigate = useNavigate();
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token") ? sessionStorage.getItem("token") : false);

    useEffect(() => {
        axios.get("/categories")
            .then( (resp) => {
                setCategories( resp.data.data)

            }).catch( (err) => {
            toast.error(err.response.data.message)
        })
    }, [navigate]);

    const deleteHandle = (id) => {
        axios.delete(`/categories/delete/${id}`,{
            withCredentials: true,
            headers: {
                'sess_id': sess_id
            }
        })
            .then( (resp) => {
                toast.success(resp.data.message)
                window.location.reload()
            }).catch( (err) => {
            toast.error(err.response.data.message)
            console.log(err.response.data)
        })

    }



    return(
        <Layout>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Kategoriler</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Tüm Kategoriler Listelendi
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <a
                            href="/categories/create"
                            type="button"
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Kategori Ekle
                        </a>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Kategori Adı
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Eklenme Tarihi
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {categories && categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {category.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{category.created_at}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 flex justify-end gap-4 text-right text-sm font-medium sm:pr-6">
                                                <a href={`/categories/update/${category.id}`}
                                                   className="text-indigo-600 hover:text-indigo-900">
                                                    Düzenle<span className="sr-only">Edit</span>
                                                </a>
                                                <button onClick={() => {
                                                    deleteHandle(category.id)
                                                }}
                                                        className="text-red-500 transition-all duration-300 hover:scale-105 hover:text-red-600">
                                                    <HiOutlineTrash size={16}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}