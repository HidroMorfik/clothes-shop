import Layout from "../../../layouts/Layout.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {HiOutlineTrash} from "react-icons/hi";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import classNames from "classnames";


export default function IndexProduct(){
    const [products, setProducts] = useState(false);

    const navigate = useNavigate();
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token") ? sessionStorage.getItem("token") : false);
    const [categories, setCategories] = useState([]);
    const [category_id, setCategory_id] = useState("all");
    const [importData, setImportData] = useState([]);

    useEffect(() => {
        axios.get("/products")
            .then( (resp) => {
                setProducts( resp.data.data)

            }).catch( (err) => {
            toast.error(err.response.data.message)
        });

        axios.get("/categories")
            .then( (resp) => {
                setCategories( resp.data.data)

            }).catch( (err) => {
            toast.error(err.response.data.message)
        })
    }, [navigate]);

    const deleteHandle = (id) => {
        axios.delete(`/products/delete/${id}`,{
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
        })

    }

    const get_by_category = () => {

        if (category_id === "all"){
            axios.get("/products")
                .then( (resp) => {
                    setProducts( resp.data.data)

                }).catch( (err) => {
                toast.error(err.response.data.message)
            });
        }
        else{
            axios.get(`/products/by-category/${category_id}`,{
                withCredentials: true,
                headers: {
                    'sess_id': sess_id
                }
            })
                .then( (resp) => {
                    setProducts(resp.data.data)
                    console.log(resp.data.data)

                }).catch( (err) => {
                toast.error(err.response.data.message)
            })
        }
    }

        const exportToCSV = (apiData, fileName) => {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';

            const ws = XLSX.utils.json_to_sheet(apiData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
        }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        readFile(file);
    };

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(worksheet);
            jsonData = jsonData.map(item => ({ ...item, sess_id: sess_id }));
            console.log(jsonData);
            setImportData(jsonData);
        };
        reader.readAsBinaryString(file);
    };

    const postData = (data) => {
        data.map((product)=>{
            axios.post('/products/create', product)
                .then(resp => {
                    toast.success(resp.data.message)
                    window.location.reload();
                })
                .catch(error => {
                    toast.error(error.response.data.message)
                });
        })
    };


    return(
        <Layout>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Ürünler</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Kategoriye Göre Listele
                        </p>
                        <div className="flex gap-4">
                            <select
                                onChange={({target}) => setCategory_id(target.value)}
                                id="category"
                                name="category"
                                className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value="all">Tümü</option>
                                {categories && categories.map((category) =>
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )}
                            </select>
                            <button className="border p-2 rounded-md bg-indigo-600 text-white" onClick={() => {
                                get_by_category()
                            }}>
                                Listele
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-2">
                        <div className="flex gap-2">
                            <input type="file" onChange={handleFileUpload}
                                   accept=".xls, .xlsx, .xlsx.number, .xls.number"
                                   className="border border-indigo-500 bg-indigo-100 rounded-xl w-56 file:bg-indigo-600 file:rounded-md file:text-white file:shadow-none file:font-semibold file:border-none file:h-full"/>
                            <button
                                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={() => {
                                importData !== [] && postData(importData)
                            }}>İçeri Aktar
                            </button>
                        </div>
                        <button
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => {
                                exportToCSV(products, "products")
                            }}>
                            Dışarı Aktar
                        </button>
                        <a
                            href="/products/create"
                            type="button"
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Ürün Ekle
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
                                            Ürün Adı
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Fiyatı
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Kategori
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Stock
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Oluşturulma Tarihi
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Güncelleme Tarihi
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {products && products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {product.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.price}₺</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.category_name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.stock}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.created_at}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.updated_at}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 flex justify-end gap-4 text-right text-sm font-medium sm:pr-6">
                                                <a href={`/products/update/${product.id}`}
                                                   className="text-indigo-600 hover:text-indigo-900">
                                                    Düzenle<span className="sr-only">Edit</span>
                                                </a>
                                                <button onClick={() => {
                                                    deleteHandle(product.id)
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