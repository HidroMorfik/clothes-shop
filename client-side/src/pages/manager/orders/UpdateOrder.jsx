
import Layout from "../../../layouts/Layout.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function UpdateOrder() {
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token"));
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [category_id, setCategory_id] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [categories, setCategories] = useState([])
    const [id, setId] = useState(window.location.pathname.split('/')[3])

    const [product, setProduct] = useState({})


    useEffect(() => {
        axios.get(`/orders/${id}`)
            .then((resp) => {
                console.log(resp.data.data)
                setProduct(resp.data.data)
            })
            .catch((err) => {
                toast.error(err.response.data.message)
                console.log(err)
            })

        axios.get("/categories")
            .then((resp)=>{
                setCategories(resp.data.data)
            })
            .catch((err)=>{
                toast.error(err.response.data.message)
            })
    }, [navigate]);


    const submitHandle = (e) => {
        e.preventDefault();

        axios.put(`/products/update/${id}`,{
            category_id,
            name,
            price,
            description,
            stock,
            sess_id

        })
            .then((resp)=>{
                toast.success(resp.data.message)
                navigate("/products")
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
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Products Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Do not forget to select the category of the product.</p>
                    </div>

                    <form onSubmit={submitHandle} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Ürün Adı
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setName(target.value)}
                                            required
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            defaultValue={product.name}
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Fiyatı
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setPrice(target.value)}
                                            required
                                            type="number"
                                            name="price"
                                            id="price"
                                            defaultValue={product.price}
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Stok adeti
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onKeyUpCapture={({ target }) => setStock(target.value)}
                                            required
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            defaultValue={product.stock}
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                        Açıklama
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            onKeyUpCapture={({ target }) => setDescription(target.value)}
                                            required
                                            id="description"
                                            name="description"
                                            defaultValue={product.descripton}
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                                        Kategori
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            onChange={({ target }) => setCategory_id(target.value)}
                                            id="category"
                                            name="category"
                                            value={product.category_id}
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="default">Kategori Seçin</option>
                                            {categories && categories.map((category)=>
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            )}

                                        </select>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            <a href="/products" type="button" className="text-sm font-semibold leading-6 text-gray-900">
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
