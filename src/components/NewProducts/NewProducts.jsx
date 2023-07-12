import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Product from '../Product/Product'
import { motion } from 'framer-motion'

const NewProducts = () => {
    return (
        <motion.section key="newproducts" transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='catalog'>
            <div className='catalog__body'>
                <h2 className='catalog__title'>НОВИНКИ</h2>
                <div className='catalog__content'>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-2" title="CRATA" price="14 600₽"/>
                    <Product img="product-3" title="PIET CONE" price="12 800₽"/>
                    <Product img="product-4" title="NIORD" price="19 900₽"/>
                    <Product img="product-5" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-6" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-7" title="CRATA" price="14 600₽"/>
                    <Product img="product-8" title="PIET CONE" price="12 800₽"/>
                    <Product img="product-1" title="NIORD" price="19 900₽"/>
                    <Product img="product-2" title="EVIAN ONE" price="12 800₽"/>
                </div>
                <Link href="/c/mebel" className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ НОВИНКИ</Link>
            </div>
        </motion.section>
    )
}
 
export default NewProducts