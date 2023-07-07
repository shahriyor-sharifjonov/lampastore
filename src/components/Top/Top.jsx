import React, { useState, useEffect } from 'react'
import styles from './Top.module.scss'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setLoading } from '@/store/slices/loadingSlice'
import { setFilter } from '@/store/slices/filterSlice'

const Top = () => {
    const categories = useSelector((state) => state.categories)
    const loading = useSelector((state) => state.loading)
    const filter = useSelector((state) => state.filter)
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
        <motion.section key={router.asPath} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
            <h1 className={styles.title}>
                {category?.name}
            </h1>
            {category?.subcategories?.length !== 0 && (
                <div className={styles.items}>
                    {category?.subcategories?.map(item => (
                        <Link href={`/c/${category.link}/${item.link}`} key={item.link} className={`${styles.item} ${item.link === subcategory?.link ? styles.active : ''}`}>{item.name}</Link>
                    ))}
                </div>
            )}
            {!filter.value ? (
                <motion.div key="notopenedfilter" transition={{duration: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.filters}>
                    <button className={styles.filterBtn} onClick={() => {dispatch(setFilter(!filter.value))}}>ФИЛЬТР & СОРТИРОВКА</button>
                </motion.div>
            ) : (
                <motion.div key="openedfilter" transition={{duration: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.filter}>
                    <div className={styles.filterTop}>
                        <button className={styles.filterBtn} onClick={() => {dispatch(setFilter(!filter.value))}}>ФИЛЬТР & СОРТИРОВКА</button>
                        <button className={styles.filterReset}>СБРОСИТЬ</button>
                    </div>
                    <div className={styles.filterBot}>
                        <div className={styles.filterItem}>
                            <p className={styles.filterTitle}>ЦЕНА</p>
                            <div className={styles.filterPrice}>
                                <div className={styles.filterPriceItem}>
                                    <p className={styles.filterPriceP}>от</p>
                                    <input type="number" placeholder='Мин.'/>
                                </div>
                                <div className={styles.filterPriceItem}>
                                    <p className={styles.filterPriceP}>до</p>
                                    <input type="number" placeholder='Макс.'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.section>
    ) 
}

export default Top