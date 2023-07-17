import Link from 'next/link'
import React from 'react'
import styles from './AdminSidebar.module.scss'

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
        <Link href="/admin">Главная</Link>
        <Link href="/admin/users">Пользователи</Link>
        <Link href="/admin/categories">Категории</Link>
        <Link href="/admin/products">Продукты</Link>
    </div>
  )
}

export default AdminSidebar