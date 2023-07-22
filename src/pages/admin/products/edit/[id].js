import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/modules/Admin.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { setProducts } from '@/store/slices/productsSlice'

import { useSession, signIn, signOut } from 'next-auth/react'
import Loader from '@/components/Loader/Loader'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar'
import axios from 'axios'
import Link from 'next/link'

const AdminProductsUpdate = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const categories = useSelector((state) => state.categories)
    const products = useSelector((state) => state.products)

    const [product, setProduct] = useState({})

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [images, setImages] = useState([])
    const [fields, setFields] = useState([])
    const [fieldTitle, setFieldTitle] = useState('')
    const [fieldValue, setFieldValue] = useState('')
    const [price, setPrice] = useState('')
    const [vip, setVip] = useState(false)

    useEffect(() => {
        dispatch(setLoading(true));
        const pd = products?.filter(product => product._id === router.query.id)
        setProduct(pd[0])
    }, [products])

    useEffect(() => {
        if(product === undefined){
            dispatch(setLoading(404))
        }
        if(product?._id){
            dispatch(setLoading(false))
            console.log(product.subcategory);
            setTitle(product.title)
            setDescription(product.description)
            setCategory(product.category)
            setSubcategory(product.subcategory)
            setImages(product.images)
            setFields(product.fields)
            setPrice(product.price)
            setVip(product.vip)
        }
    }, [product])

    const handleAddField = (e) => {
        e.preventDefault()
        if(fieldTitle !== '' && fieldValue !== ''){
            setFields(fields => [...fields, {'title': fieldTitle, 'value': fieldValue}])
            setFieldTitle('')
            setFieldValue('')
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
        setPrice('')
        setVip(false)
    }

    const handleUpdateProduct = (e) => {
        e.preventDefault()
        if(title !== '' && category !== ''){
            dispatch(setLoading(true));

            axios
                .put(`/api/admin/product/${product._id}`, {
                    title: title,
                    description: description,
                    category: category,
                    subcategory: subcategory,
                    images: images,
                    fields: fields,
                    price: price,
                    vip: vip,
                })
                .then(function (response) {
                    dispatch(setLoading(false))
                    dispatch(setProducts(response.data.products))
                    router.push(`/product/${response.data.result._id}`)
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
            <motion.section key={`${router.asPath}adminproductupdate`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`section ${styles.admin}`}>
                <div className={styles.wrapper}>
                    <AdminSidebar />
                    <div className={styles.content}>
                        <h1 className={styles.title}>Создать продукт
                            <Link href="/admin/products">Назад</Link>
                        </h1>
                        <form action="#" onSubmit={handleUpdateProduct} className={styles.form}>
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
                            <p className={styles.subtitle}>Поля</p>
                            {fields.length > 0 &&
                            fields.map((field, key) => (
                                <div key={key} className={styles.row}>
                                    <input type="text" value={field.title} onChange={(e) => {
                                        let newFields = [...fields];
                                        newFields[key] = {
                                            ...newFields[key],
                                            title: e.target.value
                                        };
                                        setFields(newFields);
                                    }}
                                    className={styles.input}/>
                                    <input type="text" value={field.value} onChange={(e) => {
                                        let newFields = [...fields];
                                        newFields[key] = {
                                            ...newFields[key],
                                            value: e.target.value
                                        };
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
                            <p className={styles.subtitle}>Цена ₽</p>
                            <input className={styles.input} type="number" placeholder="Цена" value={price} onChange={(e) => {setPrice(e.target.value)}} />
                            <div className={styles.chkrow}>
                                <label htmlFor='chkvip' className={styles.subtitle}>VIP</label>
                                <input id="chkvip" className={styles.chk} type="checkbox" value={vip} onChange={(e) => {setVip(!vip)}} />
                            </div>
                            <button type="submit" className={styles.submit}>Сохранить</button>
                        </form>
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default AdminProductsUpdate


AdminProductsUpdate.auth = {
    role: "admin",
    loading: <Loader />,
    unauthorized: "/",
}