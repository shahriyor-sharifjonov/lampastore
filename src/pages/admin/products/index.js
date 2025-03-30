import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/modules/Admin.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';
import { setProducts } from '@/store/slices/productsSlice';
import { useSession } from 'next-auth/react';
import FourOhFour from '../../404';
import Loader from '@/components/Loader/Loader';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const AdminProducts = () => {
    const router = useRouter();
    const products = useSelector((state) => state.products);
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const [visibleProducts, setVisibleProducts] = useState(50); // Number of products initially visible

    const handleDelete = (productId) => {
        dispatch(setLoading(true));
        axios
            .delete(`/api/admin/product/${productId}`)
            .then(function (response) {
                dispatch(setLoading(false));
                dispatch(setProducts(response.data));
            })
            .catch(function (error) {
                console.error(error);
                dispatch(setLoading(false));
            });
    };

    return (
        <>
            <Head>  
                <title>Админ панель - Lampastore</title>
            </Head>
            <motion.section key={`${router.asPath}adminproducts`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Продукты
                            <Link href="/admin/products/create">Создать</Link>
                        </h1>
                        {products.slice(0, visibleProducts).map(el => (
                            <div key={el._id} className={`${styles.row} ${styles.border}`}>
                                <div className={styles.rowLeft}>
                                    {el.images[0] ? (
                                        <img src={el.images[0].url} alt="" width={50} height={50} draggable={false} />
                                    ) : ""}
                                    <p className={styles.p}>{el.title}</p>
                                </div>
                                <p className={`${styles.p} ${styles.rowPrice}`}>{el.price}₽</p>
                                <div className={styles.rowButtons}>
                                    <Link href={`/admin/products/edit/${el._id}`} className={`${styles.button} ${styles.icon}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.4217 2.75 18.8923 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.655 21.1083 7.11733 20.725 7.5L19.3 8.925ZM4 21C3.71667 21 3.479 20.904 3.287 20.712C3.095 20.52 2.99934 20.2827 3 20V17.175C3 17.0417 3.025 16.9123 3.075 16.787C3.125 16.6617 3.2 16.5493 3.3 16.45L13.6 6.15L17.85 10.4L7.55 20.7C7.45 20.8 7.33767 20.875 7.213 20.925C7.08834 20.975 6.959 21 6.825 21H4Z" fill="white"/>
                                        </svg>
                                    </Link>                                
                                    <button type="button" onClick={() => handleDelete(el._id)} className={`${styles.button} ${styles.icon}`}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.00065 12.6667C4.00065 13.4 4.60065 14 5.33398 14H10.6673C11.4007 14 12.0007 13.4 12.0007 12.6667V4.66667H4.00065V12.6667ZM12.6673 2.66667H10.334L9.66732 2H6.33398L5.66732 2.66667H3.33398V4H12.6673V2.66667Z" fill="white"></path></svg>
                                    </button>
                                </div>                               
                            </div>
                        ))}
                        {visibleProducts < products.length && (
                            <button className={styles.showmore} onClick={() => setVisibleProducts(prev => prev + 50)}>Show More</button>
                        )}
                    </div>
                </div>
            </motion.section>
        </>
    );
};

export default AdminProducts;

AdminProducts.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
};
