import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'

import { useSession, signIn, signOut } from 'next-auth/react'
import FourOhFour from '../404'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'

const AdminUsers = () => {
    const router = useRouter()
    const [users, setUsers] = useState([])
    const { data: session, status } = useSession()
    const dispatch = useDispatch()

    useEffect(() => {
        axios
            .get('/api/users')
            .then(function (response) {
                setUsers(response.data)
            })
            .catch(function (error) {
                console.error(error)
            })
    }, [])

    const makeAdmin = (id) => {
        dispatch(setLoading(true))
        axios
            .put(`/api/admin/user/${id}`, {role: "admin"})
            .then(function (response) {
                dispatch(setLoading(false))
                const updatedUser = response.data.updatedUser
                axios
                    .get('/api/users')
                    .then(function (response) {
                        setUsers(response.data)
                    })
                    .catch(function (error) {
                        console.error(error)
                    })
            })
            .catch(function (error) {
                dispatch(setLoading(false))
                console.error(error)
            })
    }

    const makeUser = (id) => {
        dispatch(setLoading(true))
        axios
            .put(`/api/admin/user/${id}`, {role: "user"})
            .then(function (response) {
                dispatch(setLoading(false))
                const updatedUser = response.data.updatedUser
                axios
                    .get('/api/users')
                    .then(function (response) {
                        setUsers(response.data)
                    })
                    .catch(function (error) {
                        console.error(error)
                    })
            })
            .catch(function (error) {
                dispatch(setLoading(false))
                console.error(error)
            })
    }

    return (
        <>
            <Head>  
                <title>Админ панель - Lampastore</title>
            </Head>
            <motion.section key={`${router.asPath}adminusers`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Пользователи</h1>
                        {users.map(el => (
                            <div key={el._id} className={`${styles.row} ${styles.border}`}>
                                <p className={styles.p}>{el.name}</p>
                                <p className={styles.p}>{el.role}</p>
                                {el.role === 'user' ? <button type="button" onClick={() => makeAdmin(el._id)} className={styles.button}>Сделать Админ</button> : <button onClick={() => makeUser(el._id)} className={styles.button}>Сделать Юсер</button>}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminUsers

AdminUsers.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}