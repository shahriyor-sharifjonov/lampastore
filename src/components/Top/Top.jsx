import React, { useState, useEffect } from 'react'
import styles from './Top.module.scss'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setLoading } from '@/store/slices/loadingSlice'
import { setFilter } from '@/store/slices/filterSlice'
import { setMinPrice, setMaxPrice } from '@/store/slices/filtersSlice'

const Top = ({news, category, subcategory}) => {
    const categories = useSelector((state) => state.categories)
    const loading = useSelector((state) => state.loading)
    const filter = useSelector((state) => state.filter)
    const filters = useSelector((state) => state.filters)
    const router = useRouter()
    const dispatch = useDispatch()

    const [dropOpen, setDropOpen] = useState(false)

    const clearFilters = () => {
        dispatch(setMinPrice(""))
        dispatch(setMaxPrice(""))
    }

    return ( 
        <motion.section key={`${router.asPath}top`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
            <h1 className={styles.title}>
                {news ? 'НОВИНКИ' : category?.name}
            </h1>
            {!news && category?.subcategories?.length !== 0 && (
                <div className={styles.items}>
                    <Link href={`/c/${category?.slug}`} className={`${styles.item} ${router.query.subcategory ? '' : styles.active}`}>Все</Link>
                    {category?.subcategories?.map(item => (
                        <Link href={`/c/${category.slug}/${item.slug}`} key={`${item.slug}`} className={`${styles.item} ${item.slug === subcategory?.slug ? styles.active : ''}`}>{item.name}</Link>
                    ))}
                </div>
            )}
            {!filter.value ? (
                <motion.div key={`${router.asPath}notopenedfilter`} transition={{duration: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.filters}>
                    <button className={styles.filterBtn} onClick={() => {dispatch(setFilter(!filter.value))}}>ФИЛЬТР & СОРТИРОВКА</button>
                </motion.div>
            ) : (
                <motion.div key={`${router.asPath}openedfilter`} transition={{duration: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.filter}>
                    <div className={styles.filterTop}>
                        <button className={styles.filterBtn} onClick={() => {dispatch(setFilter(!filter.value))}}>ФИЛЬТР & СОРТИРОВКА</button>
                        <button className={styles.filterReset} onClick={clearFilters}>СБРОСИТЬ</button>
                    </div>
                    <div className={styles.filterBot}>
                        <div className={styles.filterItem}>
                            <p className={styles.filterTitle}>ЦЕНА</p>
                            <div className={styles.filterPrice}>
                                <div className={styles.filterPriceItem}>
                                    <p className={styles.filterPriceP}>от</p>
                                    <input type="number" placeholder='Мин.' value={filters.minPrice} onChange={(e) => {dispatch(setMinPrice(e.target.value))}} />
                                </div>
                                <div className={styles.filterPriceItem}>
                                    <p className={styles.filterPriceP}>до</p>
                                    <input type="number" placeholder='Макс.' value={filters.maxPrice} onChange={(e) => {dispatch(setMaxPrice(e.target.value))}} />
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