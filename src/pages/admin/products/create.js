import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { setProducts } from '@/store/slices/productsSlice'
import { imageUpload } from '@/utils/imageUpload.js';

import { useSession, signIn, signOut } from 'next-auth/react'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

const AdminProductsCreate = () => {
    const router = useRouter()
    const { data: session, status } = useSession() 
    const dispatch = useDispatch()
    const categories = useSelector((state) => state.categories)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [images, setImages] = useState([])
    const [fields, setFields] = useState([])
    const [fieldTitle, setFieldTitle] = useState('')
    const [fieldValue, setFieldValue] = useState('')
    const [kom, setKom] = useState([])
    const [komTitle, setKomTitle] = useState('')
    const [komPrice, setKomPrice] = useState('')
    const [price, setPrice] = useState('')
    const [vip, setVip] = useState(false)

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

    const handleAddField = (e) => {
        e.preventDefault()
        if(fieldTitle !== '' && fieldValue !== ''){
            setFields(fields => [...fields, {'title': fieldTitle, 'value': fieldValue}])
            setFieldTitle('')
            setFieldValue('')
        }
    }


    const handleAddKom = (e) => {
        e.preventDefault()
        if(komTitle !== '' && komPrice !== ''){
            setKom(fields => [...fields, {'title': komTitle, 'price': komPrice}])
            setKomTitle('')
            setKomPrice('')
        }
    }

    const clearStates = () => {
        setTitle('')
        setDescription('')
        setCategory('')
        setSubcategory('')
        setImages([])
        setFields([])
        setFieldTitle('')
        setFieldValue('')
        setKom([])
        setKomTitle('')
        setKomPrice('')
        setPrice('')
        setVip(false)
    }

    const handleCreateProduct = (e) => {
        e.preventDefault()
        if(title !== '' && category !== ''){
            dispatch(setLoading(true));

            axios
                .post('/api/admin/product', {
                    title: title,
                    description: description,
                    category: category,
                    subcategory: subcategory,
                    images: images,
                    fields: fields,
                    kom: kom,
                    price: price,
                    vip: vip,
                })
                .then(function (response) {
                    dispatch(setLoading(false))
                    dispatch(setProducts(response.data.products))
                    router.push(`/product/${response.data.result.insertedId}`)
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
                            <p className={styles.subtitle}>Категория</p>
                            <div className={styles.row}>
                                <select className={styles.input} value={category} onChange={(e) => {setCategory(e.target.value);setSubcategory('')}}>
                                    {category === '' ? (<option value="">Выберите категорию</option>) : ''}
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                {category !== '' ? (
                                    <select className={styles.input} value={subcategory} onChange={(e) => {setSubcategory(e.target.value)}}>
                                        <option value="">Выберите подкатегорию</option>
                                        {categories.filter(cat => cat._id === category)[0]?.subcategories?.map(sub => (
                                            <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                                        ))}
                                    </select>
                                ) : ''}
                            </div>
                            <p className={styles.subtitle}>Название</p>
                            <input className={styles.input} type="text" placeholder="Название" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                            <p className={styles.subtitle}>Описание</p>
                            <textarea className={styles.textarea} type="text" placeholder="Описание" defaultValue={description} onChange={(e) => {setDescription(e.target.value)}}></textarea>
                            <p className={styles.subtitle}>Картинки</p>
                            <div className={styles.images}>
                                <div className={styles.imagesContent}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((key) => (
                                        <div className={styles.image} key={key}>
                                            <input type="file" required={key === 0} onChange={handleFileUpload} />
                                            {images.length > key && (
                                            <div className={styles.imageContainer}>
                                                <button className={styles.imageDelete} onClick={() => handleDeleteImage(key)}>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.99996 15.8333C4.99996 16.75 5.74996 17.5 6.66663 17.5H13.3333C14.25 17.5 15 16.75 15 15.8333V5.83333H4.99996V15.8333ZM15.8333 3.33333H12.9166L12.0833 2.5H7.91663L7.08329 3.33333H4.16663V5H15.8333V3.33333Z" fill="#fff"/>
                                                    </svg>
                                                </button>
                                                <img src={images[key].url} width={100} height={100} draggable={false} alt="Image" className={styles.imageItem} />
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
                                <p className={styles.p}>Первое фото будет отображаться в результатах поиска, выберите наиболее удачное.<br />Вы можете загрузить до 12 фотографий в формате JPG или PNG.<br />Максимальный размер фото — 3MB.</p>
                            </div>
                            <p className={styles.subtitle}>Поля</p>
                            {fields.length > 0 &&
                            fields.map((field, key) => (
                                <div key={key} className={styles.row}>
                                    <input type="text" value={field.title} onChange={(e) => {
                                        let newFields = [...fields];
                                        newFields[key].title = e.target.value;
                                        setFields(newFields);
                                    }}
                                    className={styles.input}/>
                                    <input type="text" value={field.value} onChange={(e) => {
                                        let newFields = [...fields];
                                        newFields[key].value = e.target.value;
                                        setFields(newFields);
                                    }}
                                    className={styles.input}/>
                                    <button type="button" className={`${styles.btn} ${styles.icon}`} onClick={() => {
                                        setFields(fields.filter((item) => item !== fields[key]));
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.00065 12.6667C4.00065 13.4 4.60065 14 5.33398 14H10.6673C11.4007 14 12.0007 13.4 12.0007 12.6667V4.66667H4.00065V12.6667ZM12.6673 2.66667H10.334L9.66732 2H6.33398L5.66732 2.66667H3.33398V4H12.6673V2.66667Z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <div className={`${styles.row} ${styles.one}`}>
                                <input type="text" placeholder="Название поля (Тип)" value={fieldTitle} onChange={(e) => setFieldTitle(e.target.value)} className={styles.input}/>
                                <input type="text" placeholder="Значение поля (Люстра)" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} className={styles.input}/>
                                <button type="submit" onClick={handleAddField} className={`${styles.btn} ${styles.icon}`}>+</button>
                            </div>
                            <p className={styles.subtitle}>Комплектация</p>
                            {kom.length > 0 &&
                            kom.map((field, key) => (
                                <div key={key} className={styles.row}>
                                    <input type="text" value={field.title} onChange={(e) => {
                                        let newFields = [...fields];
                                        newFields[key].title = e.target.value;
                                        setKom(newFields);
                                    }}
                                    className={styles.input}/>
                                    <input type="text" value={field.price} onChange={(e) => {
                                        let newFields = [...fields];
                                        newFields[key].price = e.target.value;
                                        setKom(newFields);
                                    }}
                                    className={styles.input}/>
                                    <button type="button" className={`${styles.btn} ${styles.icon}`} onClick={() => {
                                        setKom(fields.filter((item) => item !== fields[key]));
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.00065 12.6667C4.00065 13.4 4.60065 14 5.33398 14H10.6673C11.4007 14 12.0007 13.4 12.0007 12.6667V4.66667H4.00065V12.6667ZM12.6673 2.66667H10.334L9.66732 2H6.33398L5.66732 2.66667H3.33398V4H12.6673V2.66667Z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <div className={`${styles.row} ${styles.one}`}>
                                <input type="text" placeholder="Название комплектации" value={komTitle} onChange={(e) => setKomTitle(e.target.value)} className={styles.input}/>
                                <input type="text" placeholder="Новая цена" value={komPrice} onChange={(e) => setKomPrice(e.target.value)} className={styles.input}/>
                                <button type="submit" onClick={handleAddKom} className={`${styles.btn} ${styles.icon}`}>+</button>
                            </div>
                            <p className={styles.subtitle}>Цена ₽</p>
                            <input className={styles.input} type="number" placeholder="Цена" value={price} onChange={(e) => {setPrice(e.target.value)}} />
                            <div className={styles.chkrow}>
                                <label htmlFor='chkvip' className={styles.subtitle}>VIP</label>
                                <input id="chkvip" className={styles.chk} type="checkbox" value={vip} onChange={(e) => {setVip(!vip)}} />
                            </div>
                            <button type="submit" className={styles.submit}>Создать</button>
                        </form>
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminProductsCreate


AdminProductsCreate.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}