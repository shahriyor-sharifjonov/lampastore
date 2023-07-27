import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

const Catalog = ({categoryTitle, category, more, categorySlug, subcategory, subcategorySlug, filter}) => {
    const router = useRouter()
    const products = useSelector((state) => state.products)
    const [newProducts, setNewProducts] = useState([])
    const [productsByCategory, setProductsByCategory] = useState([])
    const [productsBySubcategory, setProductsBySubcategory] = useState([])

    useEffect(() => {
        setNewProducts(products)
        setProductsByCategory(products.filter(product => product.category === category))
        
    }, [products, category])

    useEffect(() => {
        setProductsBySubcategory(productsByCategory.filter(product => product.subcategory === subcategorySlug))
    }, [productsByCategory, subcategory])

    return (
        <>
            {
                category === 'news' && newProducts.length >= 1 ? (
                    <motion.section key={`${router.asPath}newproducts`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='catalog'>
                        <div className='catalog__body'>
                            {more ? (
                                <h2 className='catalog__title'>{categoryTitle}</h2>
                            ) : ''}
                            <div className='catalog__content'>
                                {
                                newProducts.map(product => (
                                    <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at}/>
                                ))}
                            </div>
                            {more ? (
                                <Link href="/c/news" className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ</Link>
                            ) : ''}
                        </div>
                    </motion.section>
                ) : (
                    <>
                        {productsByCategory.length >= 1 ? (
                        <motion.section key={`${router.asPath}newproducts`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='catalog'>
                            <div className='catalog__body'>
                                {more ? (
                                    <h2 className='catalog__title'>{categoryTitle}</h2>
                                ) : ''}
                                <div className='catalog__content'>
                                {
                                    !subcategory ? (productsByCategory.map(product => (
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at}/>
                                    ))) : (productsBySubcategory.map(product => (
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at}/>
                                    )))
                                }
                                </div>
                                {more ? (
                                    <Link href={`/c/${categorySlug}`} className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ</Link>
                                ) : ''}
                            </div>
                        </motion.section>
                        ) : ""}
                    </>
                )
            }
        </>
    )
}
 
export default Catalog