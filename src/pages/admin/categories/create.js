import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { setCategories } from '@/store/slices/categoriesSlice'

import { useSession, signIn, signOut } from 'next-auth/react'
import FourOhFour from '../../404'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'
import Link from 'next/link'

const AdminCategoriesCreate = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')

    const [subcategories, setSubcategories] = useState([])
    const [subName, setSubName] = useState('')
    const [subSlug, setSubSlug] = useState('')

    const handleAddSubcategory = (e) => {
        e.preventDefault()
        if(subName !== '' && subSlug !== ''){
            setSubcategories(subcategories => [...subcategories, {'name': subName, 'slug': subSlug}])
            setSubName('')
            setSubSlug('')
        }
    }

    const clearStates = () => {
        setName('')
        setSlug('')
        setSubcategories([])
        setSubName('')
        setSubSlug('')
    }

    const handleCreateCategory = (e) => {
        e.preventDefault()
        if(name !== '' && slug !== ''){
            dispatch(setLoading(true));

            axios
                .post('/api/admin/category', {
                    name: name,
                    slug: slug,
                    subcategories: subcategories,
                })
                .then(function (response) {
                    dispatch(setLoading(false))
                    dispatch(setCategories(response.data))
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
            <motion.section key={`${router.asPath}admincategoriescreateee`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Создать категорию
                            <Link href="/admin/categories">Назад</Link>
                        </h1>
                        <form action="#" onSubmit={handleCreateCategory} className={styles.form}>
                            <input className={styles.input} type="text" placeholder="Название" value={name} onChange={(e) => {setName(e.target.value)}} />
                            <input className={styles.input} type="text" placeholder="Ссылка (slug)" value={slug} onChange={(e) => {setSlug(e.target.value)}} />
                            <p className={styles.subtitle}>Подкатегории</p>
                            {subcategories.length > 0 &&
                            subcategories.map((subcategory, key) => (
                                <div key={key} className={styles.row}>
                                    <input type="text" value={subcategory.name} onChange={(e) => {
                                        let newSubcategories = [...subcategories];
                                        newSubcategories[key].name = e.target.value;
                                        setSubcategories(newSubcategories);
                                    }}
                                    className={styles.input}/>
                                    <input type="text" value={subcategory.slug} onChange={(e) => {
                                        let newSubcategories = [...subcategories];
                                        newSubcategories[key].slug = e.target.value;
                                        setSubcategories(newSubcategories);
                                    }}
                                    className={styles.input}/>
                                    <button type="button" className={`${styles.btn} ${styles.icon}`} onClick={() => {
                                        setSubcategories(subcategories.filter((item) => item !== subcategories[key]));
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.00065 12.6667C4.00065 13.4 4.60065 14 5.33398 14H10.6673C11.4007 14 12.0007 13.4 12.0007 12.6667V4.66667H4.00065V12.6667ZM12.6673 2.66667H10.334L9.66732 2H6.33398L5.66732 2.66667H3.33398V4H12.6673V2.66667Z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <div className={styles.row}>
                                <input type="text" placeholder="Название" value={subName} onChange={(e) => setSubName(e.target.value)} className={styles.input}/>
                                <input type="text" placeholder="Ссылка (slug)" value={subSlug} onChange={(e) => setSubSlug(e.target.value)} className={styles.input}/>
                                <button type="submit" onClick={handleAddSubcategory} className={`${styles.btn} ${styles.icon}`}>+</button>
                            </div>
                            <button type="submit" className={styles.submit}>Создать</button>
                        </form>
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminCategoriesCreate


AdminCategoriesCreate.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}