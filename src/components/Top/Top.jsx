import React, { useState, useEffect } from 'react'
import styles from './Top.module.scss'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setLoading } from '@/store/slices/loadingSlice'

const Top = () => {
    const categories = useSelector((state) => state.categories)
    const loading = useSelector((state) => state.loading)
    const router = useRouter()
    const [category, setCategory] = useState({})
    const [subcategory, setSubCategory] = useState({})
    const dispatch = useDispatch()


    useEffect(() => {
        setTimeout(() => {
            setCategory(categories.find(category => category.link === router.query.category))
        }, 500)
        if(router.query.subcategory){
            setSubCategory(category?.subcategories?.find(sub => sub.link === router.query.subcategory))
        }
    }, [router, categories, category, subcategory])

    useEffect(() => {
        dispatch(setLoading(true));
        if(category?.name){
            dispatch(setLoading(false));
        }
    }, [category])


    return ( 
        <motion.section transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
            <h1 className={styles.title}>
                {category?.name}
            </h1>
            {category?.subcategories && (
                <div className={styles.items}>
                    {category.subcategories.map(item => (
                        <Link href={`/c/${category.link}/${item.link}`} key={item.link} className={`${styles.item} ${item.link === subcategory?.link ? styles.active : ''}`}>{item.name}</Link>
                    ))}
                </div>
            )}
        </motion.section>
    ) 
}

export default Top