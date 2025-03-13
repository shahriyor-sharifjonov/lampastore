import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { setPromo } from '@/store/slices/promoSlice'
import { imageUpload } from '@/utils/imageUpload.js';

import { useSession, signIn, signOut } from 'next-auth/react'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

const AdminPromoCreate = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const categories = useSelector((state) => state.categories)

    const [title, setTitle] = useState('')
    const [num, setNum] = useState("")
    const [images, setImages] = useState([])

    const handleFileUpload = async (event) => {
        dispatch(setLoading(true))
        const files = event.target.files;
      
        const uploadedImages = await imageUpload(files);
      
        const imageUrls = uploadedImages.map((image) => image.url);
      
        setImages((prevImages) => [...prevImages, ...uploadedImages]);
        dispatch(setLoading(false))
    }

    const handleDeleteImage = async (index) => {
        dispatch(setLoading(true))
        setImages((prevImages) => {
            const updatedImages = [...prevImages]
            updatedImages.splice(index, 1)
            return updatedImages
        })
        dispatch(setLoading(false))
    }

    const clearStates = () => {
        setTitle('')
        setNum('')
        setImages([])
    }

    const handleCreateProduct = (e) => {
        e.preventDefault()
        if(title !== '' && images !== '' && num !== ''){
            dispatch(setLoading(true));

            axios
                .post('/api/admin/promo', {
                    title: title,
                    images: images,
                    num: num
                })
                .then(function (response) {
                    dispatch(setLoading(false))
                    dispatch(setPromo(response.data.promo))
                    router.push(`/admin/promo/`)
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
            <motion.section key={`${router.asPath}adminproductcreate`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Создать продукт
                            <Link href="/admin/products">Назад</Link>
                        </h1>
                        <form action="#" onSubmit={handleCreateProduct} className={styles.form}>
                            <p className={styles.subtitle}>Название</p>
                            <input className={styles.input} type="text" placeholder="Название" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                            <p className={styles.subtitle}>Позиция в списке</p>
                            <textarea className={styles.textarea} type="number" placeholder="Позиция в списке" defaultValue={num} onChange={(e) => {setNum(e.target.value)}}></textarea>
                            <p className={styles.subtitle}>Картинка</p>
                            <div className={styles.images}>
                                <div className={styles.imagesContent}>
                                    {[0].map((key) => (
                                        <div className={styles.image} key={key}>
                                            <input type="file" required={key === 0} onChange={handleFileUpload} />
                                            {images.length > key && (
                                            <div className={styles.imageContainer}>
                                                <button className={styles.imageDelete} onClick={() => handleDeleteImage(key)}>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.99996 15.8333C4.99996 16.75 5.74996 17.5 6.66663 17.5H13.3333C14.25 17.5 15 16.75 15 15.8333V5.83333H4.99996V15.8333ZM15.8333 3.33333H12.9166L12.0833 2.5H7.91663L7.08329 3.33333H4.16663V5H15.8333V3.33333Z" fill="#fff"/>
                                                    </svg>
                                                </button>
                                                <Image src={images[key].url} width={100} height={100} draggable={false} alt="Image" className={styles.imageItem} />
                                            </div>
                                            )}
                                            {images.length <= key && (
                                            <div className={styles.imageOverlay}>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.50004 18.3334C2.04171 18.3334 1.64921 18.1701 1.32254 17.8434C0.995875 17.5167 0.83282 17.1245 0.833375 16.6667V6.66675C0.833375 6.20841 0.996709 5.81591 1.32338 5.48925C1.65004 5.16258 2.04226 4.99953 2.50004 5.00008H5.12504L6.66671 3.33341H11.6667V6.66675H14.1667V9.16675H17.5V16.6667C17.5 17.1251 17.3367 17.5176 17.01 17.8442C16.6834 18.1709 16.2912 18.334 15.8334 18.3334H2.50004ZM9.16671 15.4167C10.2084 15.4167 11.0939 15.052 11.8234 14.3226C12.5528 13.5931 12.9173 12.7079 12.9167 11.6667C12.9167 10.6251 12.552 9.73953 11.8225 9.01008C11.0931 8.28064 10.2078 7.91619 9.16671 7.91675C8.12504 7.91675 7.23949 8.28147 6.51004 9.01091C5.7806 9.74036 5.41615 10.6256 5.41671 11.6667C5.41671 12.7084 5.78143 13.594 6.51088 14.3234C7.24032 15.0529 8.1256 15.4173 9.16671 15.4167ZM9.16671 13.7501C8.58338 13.7501 8.09032 13.5487 7.68754 13.1459C7.28476 12.7431 7.08338 12.2501 7.08338 11.6667C7.08338 11.0834 7.28476 10.5904 7.68754 10.1876C8.09032 9.7848 8.58338 9.58341 9.16671 9.58341C9.75004 9.58341 10.2431 9.7848 10.6459 10.1876C11.0487 10.5904 11.25 11.0834 11.25 11.6667C11.25 12.2501 11.0487 12.7431 10.6459 13.1459C10.2431 13.5487 9.75004 13.7501 9.16671 13.7501ZM15.8334 6.66675V5.00008H14.1667V3.33341H15.8334V1.66675H17.5V3.33341H19.1667V5.00008H17.5V6.66675H15.8334Z" fill="#8f8f8f"/>
                                                </svg>
                                                <p>Добавить</p>
                                            </div>
                                            )}
                                        </div>
                                    ))}
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

export default AdminPromoCreate


AdminPromoCreate.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}