import {Fragment, useEffect, useState} from 'react'
import {Menu, Popover, Transition} from '@headlessui/react'
import { MagnifyingGlassIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import classNames from "classnames";
import {HiX} from "react-icons/hi";
import {BellIcon} from "@heroicons/react/24/outline/index.js";
import {ChevronDownIcon} from "@heroicons/react/20/solid/index.js";


export default function Home() {
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token") ? sessionStorage.getItem("token") : false);
    const [user, setUser] = useState(sessionStorage.getItem("user") ?  JSON.parse(sessionStorage.getItem("user")) : false);
    const [modal, setModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart(prevItems => {
            const existingItem = prevItems.find(item => item.product_id === product.id);
            if (existingItem) {
                // Ürün zaten sepette varsa, miktarını güncelle
                return prevItems.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1, total_price: item.unit_price * (item.quantity + 1) }
                        : item
                );
            } else {
                // Yeni ürünü sepete ekle
                return [...prevItems, { product_id: product.id, name: product.name, quantity: 1, unit_price: product.price, total_price: product.price }];
            }
        });
    };

    useEffect(() => {
        console.log(cart)
    }, [cart]);


    useEffect(() => {
        if (sess_id === false){
            toast.warning("Please Login First !")
            navigate("/login")
        }

        axios.get("/categories")
            .then( (resp) => {
                setCategories( resp.data.data)

            }).catch( (err) => {
            toast.error(err.response.data.message)
        });

        axios.get("/products")
            .then( (resp) => {
                setProducts( resp.data.data)

            }).catch( (err) => {
            toast.error(err.response.data.message)
        });
    }, [navigate]);

    const get_by_category = (id) => {
        if (id === 0){
            axios.get("/products")
                .then( (resp) => {
                    setProducts( resp.data.data)

                }).catch( (err) => {
                toast.error(err.response.data.message)
            });
        }else{
            axios.get(`/products/by-category/${id}`,{
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

    const logout = (e) => {
        e.preventDefault()

        axios.post('/logout', {
            sess_id
        })
            .then(response => {
                sessionStorage.removeItem("user")
                sessionStorage.removeItem("token")
                toast.success(response.data.message);
                navigate("/login")

            })
            .catch(error => {
                if (error.message) {
                    toast.error(error.message);
                }
            });
    }

    const userNavigation = [
        { name: 'Your profile', href: '#', action: null },
        { name: 'Sign out', href: '/login', action: ()=>{setModal(!modal)} },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <main className="relative w-screen">
            {modal &&
                <div className="flex justify-center items-center absolute h-full w-full z-50 bg-gray-900 bg-opacity-50">
                    <div className="flex flex-col gap-y-8 bg-white p-12 rounded-xl relative">
                        <button onClick={()=>setModal(!modal)} className="rounded-full absolute top-2 right-2 border text-l flex justify-center items-center p-1">
                            <HiX/>
                        </button>
                        <h4>
                            Çıkış yapmak istediğnize emin misiniz
                        </h4>
                        <div className="grid grid-cols-2 gap-10 justify-between items-center px-8">
                            <button className="transition-transform duration-300 hover:scale-105 text-red-500 border border-red-600 bg-red-50 px-2 py-1 rounded-md" onClick={logout}>
                                Evet
                            </button>
                            <button className="transition-transform duration-300 hover:scale-105 text-blue-500 border border-blue-600 bg-blue-50 px-2 py-1 rounded-md" onClick={()=>{setModal(false)}}>
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            }
            <div className="bg-white absolute top-0 w-full z-20">
                <header className="relative bg-white">
                    <nav aria-label="Top" className="sm:px-6 lg:px-8 border-b ">
                        <div className="border-gray-200 px-4 pb-14 sm:px-0 sm:pb-0">
                            <div className="flex h-16 items-center justify-between">
                                {/* Logo */}
                                <div className="flex flex-1">
                                    <a href="#">
                                        <span className="sr-only">Your Company</span>
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                            alt=""
                                        />
                                    </a>
                                </div>

                                {/* Flyout menus */}
                                <Popover.Group
                                    className="absolute inset-x-0 bottom-0 sm:static sm:flex-1 sm:self-stretch">
                                    <div
                                        className="flex h-14 space-x-8 overflow-x-auto border-t px-4 pb-px sm:h-full sm:justify-center sm:overflow-visible sm:border-t-0 sm:pb-0">
                                        <Popover className="flex">
                                                {({open}) => (
                                                    <>
                                                        <div className="relative flex">
                                                            <Popover.Button
                                                                className={classNames(
                                                                    open
                                                                        ? 'border-indigo-600 text-indigo-600'
                                                                        : 'border-transparent text-gray-700 hover:text-gray-800',
                                                                    'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out'
                                                                )}
                                                            >
                                                                Kategoriler
                                                            </Popover.Button>
                                                        </div>

                                                        <Transition
                                                            as={Fragment}
                                                            enter="transition ease-out duration-200"
                                                            enterFrom="opacity-0"
                                                            enterTo="opacity-100"
                                                            leave="transition ease-in duration-150"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Popover.Panel
                                                                className="absolute inset-x-0 top-full text-gray-500 sm:text-sm">
                                                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                                                <div
                                                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                                                    aria-hidden="true"/>

                                                                <div className="relative bg-white">
                                                                    <div
                                                                        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                                                        <div
                                                                            className="grid grid-cols-1 items-start gap-x-6 gap-y-10 pb-12 pt-10 md:grid-cols-2 lg:gap-x-8">
                                                                            <div
                                                                                className="grid grid-cols-1 gap-x-6 gap-y-10 lg:gap-x-8">
                                                                                <div>
                                                                                    <div
                                                                                        className="pt-2 sm:grid sm:grid-cols-2 sm:gap-x-6">
                                                                                        <ul
                                                                                            role="list"
                                                                                            aria-labelledby="clothing-heading"
                                                                                            className="space-y-6 sm:space-y-4"
                                                                                        >
                                                                                            <li className="flex">
                                                                                                <button onClick={()=>{get_by_category(0)}}
                                                                                                        className="hover:text-gray-800">
                                                                                                    Tümü
                                                                                                </button>
                                                                                            </li>
                                                                                            {categories.map((item) => (
                                                                                                <li key={item.name}
                                                                                                    className="flex">
                                                                                                    <button onClick={()=>{get_by_category(item.id)}}
                                                                                                       className="hover:text-gray-800">
                                                                                                        {item.name}
                                                                                                    </button>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Popover.Panel>
                                                        </Transition>
                                                    </>
                                                )}
                                            </Popover>
                                        
                                    </div>
                                </Popover.Group>

                                <div className="flex flex-1 items-center justify-end">
                                    {/* Search */}
                                    <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Search</span>
                                        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true"/>
                                    </a>

                                    {/* Cart */}
                                    <div className="ml-4 flow-root lg:ml-8">
                                        <a href="#" className="group -m-2 flex items-center p-2">
                                            <ShoppingBagIcon
                                                className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                            <span
                                                className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cart.length}</span>
                                            <span className="sr-only">items in cart, view bag</span>
                                        </a>
                                    </div>
                                    <div className="pl-3">
                                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                                            {/* Separator */}
                                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                                                 aria-hidden="true"/>

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="relative">
                                                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img
                                                        className="h-8 w-8 rounded-full bg-gray-50"
                                                        src={`https://avatar.oxro.io/avatar.svg?name=${user.name} ${user.surname}`}
                                                        alt=""
                                                    />
                                                    <span className="hidden lg:flex lg:items-center">
                      <div className="ml-4 text-sm font-semibold flex flex-col leading-6 text-gray-900"
                           aria-hidden="true">
                            {user.name} {user.surname}
                      </div>

                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true"/>
                    </span>
                                                </Menu.Button>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items
                                                        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                                        {userNavigation.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({active}) => (
                                                                    <button
                                                                        onClick={item.action}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-50' : '',
                                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
            <div className="bg-white h-screen">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-xl font-bold text-gray-900">Customers also bought</h2>

                    <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <div key={product.id}>
                                <div className="relative">
                                    <div className="relative h-72 w-full overflow-hidden rounded-lg">
                                        <img
                                            src={product.picture}
                                            alt="fotograf"
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="relative mt-4 flex justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                        <h2 className="text-xs font-light text-gray-600">{product.category_name}</h2>
                                    </div>
                                    <div
                                        className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                                        />
                                        <p className="relative text-lg font-semibold text-white">{product.price}₺</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={()=>{addToCart(product)}}
                                        className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                                    >
                                        Add to bag<span className="sr-only">, {product.name}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
