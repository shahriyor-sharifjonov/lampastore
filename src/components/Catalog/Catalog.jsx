import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

const Catalog = ({categoryTitle, category, more, categorySlug, subcategory, subcategorySlug, filter}) => {
    const router = useRouter()
    const products = useSelector((state) => state.products)
    const minPrice = useSelector((state) => state.filters.minPrice)
    const maxPrice = useSelector((state) => state.filters.maxPrice)
    const filters = useSelector((state) => state.filters)
    const [newProducts, setNewProducts] = useState([])
    const [productsByCategory, setProductsByCategory] = useState([])
    const [productsBySubcategory, setProductsBySubcategory] = useState([])

    useEffect(() => {
        setNewProducts(products)
        let prod = [...products]
        prod.sort((a, b) => {
            if (a.vip && !b.vip) return -1;
            if (!a.vip && b.vip) return 1;
            return 0;
        });
        let finalProd = null;
        if(filter){
            if(minPrice !== "" && maxPrice === ""){
                finalProd = prod.filter(product => product.price > Number(minPrice));
                setNewProducts(finalProd)
            } else if (minPrice !== "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price > Number(minPrice) && product.price < Number(maxPrice));
                setNewProducts(finalProd)
            } else if (minPrice === "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price < Number(maxPrice));
                setNewProducts(finalProd)
            } else {
                finalProd = prod;
                setNewProducts(finalProd)
            }
        }else {
            finalProd = prod;
            setNewProducts(finalProd)
        }
        setProductsByCategory(finalProd)
    }, [products, filters])
    
    useEffect(() => {
        const prod = products.filter(product => product.category === category).sort((a, b) => {
            if (a.vip && !b.vip) return -1;
            if (!a.vip && b.vip) return 1;
            return 0;
        });
        let finalProd = null;
        if(filter){
            if(minPrice !== "" && maxPrice === ""){
                finalProd = prod.filter(product => product.price > Number(minPrice));
            } else if (minPrice !== "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price > Number(minPrice) && product.price < Number(maxPrice));
            } else if (minPrice === "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price < Number(maxPrice));
            } else {
                finalProd = prod;
            }
        }else {
            finalProd = prod;
        }
        setProductsByCategory(finalProd)
    }, [products, category, filters])

    useEffect(() => {
        const prod = productsByCategory.filter(product => product.subcategory === subcategorySlug).sort((a, b) => {
            if (a.vip && !b.vip) return -1;
            if (!a.vip && b.vip) return 1;
            return 0;
        });
        let finalProd = null;
        if(filter){
            if(minPrice !== "" && maxPrice === ""){
                finalProd = prod.filter(product => product.price > Number(minPrice));
            } else if (minPrice !== "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price > Number(minPrice) && product.price < Number(maxPrice));
            } else if (minPrice === "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price < Number(maxPrice));
            } else {
                finalProd = prod;
            }
        }else {
            finalProd = prod;
        }
        setProductsBySubcategory(finalProd)
    }, [productsByCategory, subcategory, filters])

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
                                    <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
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
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
                                    ))) : (productsBySubcategory.map(product => (
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
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