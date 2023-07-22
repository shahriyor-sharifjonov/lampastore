import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

const NewProducts = () => {
    const router = useRouter()
    const products = useSelector((state) => state.products)
    return (
        <motion.section key={`${router.asPath}newproducts`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='catalog'>
            <div className='catalog__body'>
                <h2 className='catalog__title'>НОВИНКИ</h2>
                <div className='catalog__content'>
                    {products.map(product => (
                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={`${product.price}₽`}/>
                    ))}
                </div>
                <Link href="/c/news" className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ НОВИНКИ</Link>
            </div>
        </motion.section>
    )
}
 
export default NewProducts