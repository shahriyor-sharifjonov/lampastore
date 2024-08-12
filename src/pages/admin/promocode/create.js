import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { setPromocode } from '@/store/slices/promocodeSlice'

import { useSession, signIn, signOut } from 'next-auth/react'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

const AdminPromocodeCreate = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [discount, setDiscount] = useState("")
    const [type, setType] = useState("fix")
    const [promoCode, setPromoCode] = useState("")
    const [otPrice, setOtPrice] = useState(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const clearStates = () => {
        setTitle('')
        setType('fix')
        setPromoCode()
        setOtPrice(0)
        setDiscount('')
        setStartDate([])
        setEndDate([])
    }

    const handleCreatePromocode = (e) => {
        e.preventDefault()
        if(title !== '' && type !== '' && promoCode !== '' && otPrice !== '' && discount !== '' && startDate !== '' && endDate !== ''){
            dispatch(setLoading(true));

            axios
                .post('/api/admin/promocode', {
                    title: title,
                    type: type,
                    promoCode: promoCode,
                    otPrice: otPrice,
                    discount: discount,
                    startDate: startDate,
                    endDate: endDate
                })
                .then(function (response) {
                    dispatch(setLoading(false))
                    dispatch(setPromocode(response.data.promocode))
                    router.push(`/admin/promocode/`)
                    clearStates()
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
            <motion.section key={`${router.asPath}adminpromocodecreate`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Создать промокод
                            <Link href="/admin/promocode">Назад</Link>
                        </h1>
                        <form action="#" onSubmit={handleCreatePromocode} className={styles.form}>
                            <p className={styles.subtitle}>Название</p>
                            <input className={styles.input} type="text" placeholder="Название" value={title} onChange={(e) => {setTitle(e.target.value)}} required/>
                            <p className={styles.subtitle}>Промокод (например B2YQT)</p>
                            <input className={styles.input} type="text" placeholder="Промокод" value={promoCode} onChange={(e) => {setPromoCode(e.target.value)}} required/>
                            <p className={styles.subtitle}>От (промокод будет действовать если сумма заказа от *)</p>
                            <input className={styles.input} type="text" placeholder="От" value={otPrice} onChange={(e) => {setOtPrice(e.target.value)}} required/>
                            <div className={styles.row}>
                                <div className={styles.col}>
                                    <p className={styles.subtitle}>Значение</p>
                                    <select className={styles.input} value={type} onChange={(e) => {setType(e.target.value)}}>              
                                        <option value={"fix"}>Фиксированная</option>
                                        <option value={"per"}>Процент от суммы</option>
                                    </select>
                                </div>
                                <div className={styles.col}>
                                    <p className={styles.subtitle}>Значение</p>
                                    <input className={styles.input} type="text" placeholder="Пример -10" value={discount} onChange={(e) => {setDiscount(e.target.value)}} required/>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.col}>
                                    <p className={styles.subtitle}>Начало</p>
                                    <input className={styles.input} type="date" placeholder="" value={startDate} onChange={(e) => {setStartDate(e.target.value)}} required/>
                                </div>
                                <div className={styles.col}>
                                    <p className={styles.subtitle}>Действует до</p>
                                    <input className={styles.input} type="date" placeholder="" value={endDate} onChange={(e) => {setEndDate(e.target.value)}} required/>
                                </div>
                            </div>
                            <button type="submit" className={styles.submit}>Создать</button>
                        </form>
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminPromocodeCreate


AdminPromocodeCreate.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}