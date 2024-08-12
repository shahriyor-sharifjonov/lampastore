import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from '@/styles/404.module.scss'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const FourOhFour = () => {
    const router = useRouter()
    return (
        <motion.div key={`${router.asPath}fourohfour`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`container ${styles.container}`}>
            <Image src='/404.svg' alt="" width={500} height={500} draggable={false}/>
            <h1 className={styles.title}>Такая страница не сушествует</h1>
            <p className={styles.p}>К сожалению, такой страницы нет, но Вы всегда можете найти то, что Вам нужно, перейти ко всем объявлениям</p>
            <Link href="/" className={styles.link}>Главная</Link>
        </motion.div>   
    )
}

export default FourOhFour