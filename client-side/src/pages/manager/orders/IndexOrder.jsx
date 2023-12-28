import axios from "axios";
import classNames from "classnames";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {RiThreadsFill} from "react-icons/ri";
import {HiOutlineTrash} from "react-icons/hi";
import Layout from "../../../layouts/Layout.jsx";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default function IndexOrder(){
    const [orders, setOrders] = useState(false);

    const navigate = useNavigate();
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token") ? sessionStorage.getItem("token") : false);
    const [paymentType, setPaymentType] = useState("all");
    const [importData, setImportData] = useState([]);

    useEffect(() => {
        axios.get("/orders",{
            withCredentials: true,
            headers: {
                'sess_id': sess_id
            }
        })
            .then( (resp) => {
                setOrders(resp.data.data)

            }).catch( (err) => {
            toast.error(err.response.data.message)
        })
    }, [navigate]);

    const deleteHandle = (id) => {
        axios.delete(`/orders/delete/${id}`,{
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

    const get_by_payment_type = () => {
        if (paymentType === "all"){
            axios.get("/orders",{
                withCredentials: true,
                headers: {
                    'sess_id': sess_id
                }
            })
                .then( (resp) => {
                    setOrders(resp.data.data)

                }).catch( (err) => {
                toast.error(err.response.data.message)
            })
        }
        else{
            axios.get(`/orders/by-payment-type/${paymentType}`,{
                withCredentials: true,
                headers: {
                    'sess_id': sess_id
                }
            })
                .then( (resp) => {
                    setOrders(resp.data.data)
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


    return(
        <Layout>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Siparişler</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Ödeme Tipine Göre Listele
                        </p>
                        <div className="flex gap-4">
                            <select
                                name="paymentType"
                                id="paymentType"
                                onChange={({target}) => {
                                    setPaymentType(target.value)
                                }}
                                className="border-2 w-fit pl-2"
                            >
                                <option value="all">Tümü</option>
                                <option value="cash">Cash</option>
                                <option value="EFT">EFT</option>
                                <option value="credit-card">Credit Card</option>
                            </select>
                            <button className="border p-2 rounded-md bg-indigo-600 text-white" onClick={() => {
                                get_by_payment_type()
                            }}>
                                Listele
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => {
                                exportToCSV(orders, "orders")
                            }}>
                            Dışarı Aktar
                        </button>
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
                                            Kullanıcı
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Ödeme Tipi
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Toplam Fiyat
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Tarih
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {orders && orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {order.user_name} {order.user_surname}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.payment_type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-left text-gray-500">{order.total_price} ₺</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-left text-gray-500">{order.created_at} ₺</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 flex justify-end gap-4 text-right text-sm font-medium sm:pr-6">
                                                <button onClick={() => {
                                                    deleteHandle(order.id)
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