import React, { useState, useEffect } from 'react'
import styles from './Top.module.scss'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'

const Top = () => {
    const categories = useSelector((state) => state.categories)

    return ( 
        <motion.section transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
            <h1 className={styles.title}>
                {/* {category.name} */}asas
            </h1>
            {/* {category.subcategories && (
                <div className={styles.items}>
                    {category.subcategories.map(item => (
                        <Link href={`/c/${category.link}/${item.link}`} key={item.link} className={styles.item}>{item.name}</Link>
                    ))}
                </div>
            )} */}
        </motion.section>
    ) 
}

export default Top