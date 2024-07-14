import React, { useEffect, useState, useContext } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Link } from "react-router-dom";
import { FaEye, FaPencilAlt, MdDelete } from "react-icons/fa";
import Pagination from '@mui/material/Pagination';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Rating from '@mui/material/Rating';

const Dashboard = () => {
    const context = useContext(MyContext);
    const [productList, setProductList] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalProductsReviews, setTotalProductsReviews] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [showBy, setShowBy] = useState(8);
    const [categoryVal, setCategoryVal] = useState('all');

    useEffect(() => {
        context.setisHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(40);

        fetchDataFromApi("/api/products?page=1&perPage=8")
            .then((res) => {
                if (Array.isArray(res)) {
                    setProductList(res);
                    context.setProgress(100);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

        fetchDataFromApi("/api/user/get/count")
            .then((res) => {
                if (typeof res === 'number') {
                    setTotalUsers(res);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching user count:", error);
            });

        fetchDataFromApi("/api/orders/get/count")
            .then((res) => {
                if (typeof res === 'number') {
                    setTotalOrders(res);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching order count:", error);
            });

        fetchDataFromApi("/api/products/get/count")
            .then((res) => {
                if (typeof res === 'number') {
                    setTotalProducts(res);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching products count:", error);
            });

        fetchDataFromApi("/api/productReviews/get/count")
            .then((res) => {
                if (typeof res === 'number') {
                    setTotalProductsReviews(res);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching product reviews count:", error);
            });

        fetchDataFromApi("/api/orders/")
            .then((res) => {
                if (Array.isArray(res)) {
                    let sales = 0;
                    res.forEach(item => {
                        sales += parseInt(item.amount);
                    });
                    setTotalSales(sales);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });

    }, []);

    const deleteProduct = (id) => {
        context.setProgress(40);
        deleteData(`/api/products/${id}`)
            .then((res) => {
                context.setProgress(100);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Product Deleted!'
                });
                fetchDataFromApi(`/api/products?page=${1}&perPage=${showBy}`)
                    .then((res) => {
                        if (Array.isArray(res)) {
                            setProductList(res);
                        } else {
                            console.error("Invalid response from API:", res);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching products after deletion:", error);
                    });
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/products?page=${value}&perPage=${showBy}`)
            .then((res) => {
                if (Array.isArray(res)) {
                    setProductList(res);
                    context.setProgress(100);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching products for page:", value, error);
            });
    };

    const showPerPage = (e) => {
        const perPage = parseInt(e.target.value);
        setShowBy(perPage);
        fetchDataFromApi(`/api/products?page=${1}&perPage=${perPage}`)
            .then((res) => {
                if (Array.isArray(res)) {
                    setProductList(res);
                    context.setProgress(100);
                } else {
                    console.error("Invalid response from API:", res);
                }
            })
            .catch((error) => {
                console.error("Error fetching products for per page:", perPage, error);
            });
    };

    const handleChangeCategory = (event) => {
        const category = event.target.value;
        setCategoryVal(category);
        if (category !== "all") {
            fetchDataFromApi(`/api/products?category=${category}`)
                .then((res) => {
                    if (Array.isArray(res)) {
                        setProductList(res);
                        context.setProgress(100);
                    } else {
                        console.error("Invalid response from API:", res);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching products for category:", category, error);
                });
        } else {
            fetchDataFromApi(`/api/products?page=${1}&perPage=${showBy}`)
                .then((res) => {
                    if (Array.isArray(res)) {
                        setProductList(res);
                        context.setProgress(100);
                    } else {
                        console.error("Invalid response from API:", res);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching all products:", error);
                });
        }
    };

    return (
        <>
            {/* Your JSX for displaying dashboard content */}
        </>
    );
};

export default Dashboard;
