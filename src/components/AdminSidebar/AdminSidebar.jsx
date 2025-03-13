import Link from 'next/link'
import React from 'react'
import styles from './AdminSidebar.module.scss'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

const AdminSidebar = () => {
    const router = useRouter()
    return (
        <div className={styles.sidebar}>
            <Link href="/admin" className={`${styles.link} ${router.asPath === '/admin' ? styles.active : ''}`}>Главная</Link>
            <Link href="/admin/users" className={`${styles.link} ${router.asPath === '/admin/users' ? styles.active : ''}`}>Пользователи</Link>
            <Link href="/admin/categories" className={`${styles.link} ${router.asPath === '/admin/categories' ? styles.active : ''}`}>Категории</Link>
            <Link href="/admin/products" className={`${styles.link} ${router.asPath === '/admin/products' ? styles.active : ''}`}>Продукты</Link>
            <Link href="/admin/promo" className={`${styles.link} ${router.asPath === '/admin/promo' ? styles.active : ''}`}>Промо</Link>
            <Link href="/admin/promocode" className={`${styles.link} ${router.asPath === '/admin/promocode' ? styles.active : ''}`}>Промокоды</Link>
            <button onClick={() => {signOut()}} className={`${styles.link}`}>Выйти</button>
        </div>
    )
}

export default AdminSidebar