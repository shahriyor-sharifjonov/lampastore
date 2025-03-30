import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { setPromo } from '@/store/slices/promoSlice'

import { useSession, signIn, signOut } from 'next-auth/react'
import FourOhFour from '../../404'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

const AdminPromo = () => {
    const router = useRouter()
    const promo = useSelector((state) => state.promo)
    const { data: session, status } = useSession()
    const dispatch = useDispatch()

    const handleDelete = (productId) => {
        dispatch(setLoading(true))
        axios
            .delete(`/api/admin/promo/${productId}`)
            .then(function (response) {
                dispatch(setLoading(false))
                dispatch(setPromo(response.data))
            })
            .catch(function (error) {
                console.error(error)
                dispatch(setLoading(false))
        })
    }

    return (
        <>
            <Head>  
                <title>Админ панель - Lampastore</title>
            </Head>
            <motion.section key={`${router.asPath}AdminPromo`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Промо
                            <Link href="/admin/promo/create">Создать</Link>
                        </h1>
                        {promo.map(el => (
                            <div key={el._id} className={`${styles.row} ${styles.border}`}>
                                <div className={styles.rowLeft}>
                                    {el.images[0] ? (
                                        <img src={el.images[0].url} alt="" width={50} height={50} draggable={false} />
                                    ) : ""}
                                    <p className={styles.p}>{el.title}</p>
                                </div>
                                <div className={styles.rowButtons}>
                                    <button type="button" onClick={() => handleDelete(el._id)} className={`${styles.button} ${styles.icon}`}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.00065 12.6667C4.00065 13.4 4.60065 14 5.33398 14H10.6673C11.4007 14 12.0007 13.4 12.0007 12.6667V4.66667H4.00065V12.6667ZM12.6673 2.66667H10.334L9.66732 2H6.33398L5.66732 2.66667H3.33398V4H12.6673V2.66667Z" fill="white"></path></svg>
                                    </button>
                                </div>                               
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminPromo


AdminPromo.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}