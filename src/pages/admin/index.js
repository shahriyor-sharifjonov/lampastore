import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'

import { useSession, signIn, signOut } from 'next-auth/react'
import FourOhFour from '../404'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import { setLoading } from '@/store/slices/loadingSlice'
import axios from 'axios'
import { setInfo } from '@/store/slices/infoSlice'

const AdminDashboard = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [tel1, setTel1] = useState("")
    const [tel2, setTel2] = useState("")
    const [email, setEmail] = useState("")
    const dispatch = useDispatch()
    const info = useSelector(state => state.info)

    useEffect(() => {
        setTel1(info.tel1)
        setTel2(info.tel2)
        setEmail(info.email)
    }, [])

    const handleSave = (e) => {
        e.preventDefault();

        if(tel1 !== '' && email !== ''){
            dispatch(setLoading(true));

            axios
                .post('/api/admin/updateInfo', {
                    tel1: tel1,
                    tel2: tel2,
                    email: email
                })
                .then(function (response) {
                    dispatch(setLoading(false))

                    axios.get('/api/getInfo')
                        .then((response) => {
                            console.log(response.data);
                            
                            dispatch(setInfo(response.data[0]))
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                })
                .catch(function (error) {
                    dispatch(setLoading(false))
                    console.error(error);
            })
        }
    }

    return (
        <>
            <Head>  
                <title>Админ панель - Lampastore</title>
            </Head>
            <motion.section key={`${router.asPath}admincategories`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Добро пожаловать, {session?.customUser?.name}</h1>
                        <form action="#" onSubmit={handleSave} className={styles.form}>
                            <p className={styles.subtitle}>Номер телефонов</p>
                            <div className={styles.row}>
                                <input className={styles.input} type="text" placeholder="Телефон 1" value={tel1} onChange={(e) => {setTel1(e.target.value)}} />
                                <input className={styles.input} type="text" placeholder="Телефон 2" value={tel2} onChange={(e) => {setTel2(e.target.value)}} />
                            </div>
                            <p className={styles.subtitle}>Имейл</p>
                            <input className={styles.input} type="text" placeholder="Имейл" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                            <button type="submit" className={styles.submit}>Сохранить</button>
                        </form>
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