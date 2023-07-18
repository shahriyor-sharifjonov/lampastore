import React from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'

import { useSession, signIn, signOut } from 'next-auth/react'
import FourOhFour from '../404'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'

const AdminDashboard = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    return (
        <>
            <Head>  
                <title>Админ панель - Lampastore</title>
            </Head>
            <motion.section key={`${router.asPath}categorycatalog`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Пользователи</h1>
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminDashboard


AdminDashboard.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}