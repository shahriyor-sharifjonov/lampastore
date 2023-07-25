import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import Product from '../components/Product/Product'


const Cart = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)

    return (
        <motion.section key={`${router.asPath}cart`} transition={{duration: 0.5, delay: 0.5, easings: 'linear'}} exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}} className="cart">
            {cartItems.length === 0 ? (
                <div className='cart-no'>Нет товаров в корзине.</div>
            ) : (
                <div className='catalog'>
                    <div className='catalog__body'>
                        <h2 className='catalog__title'>Корзина</h2>
                        <div className='catalog__content'>
                            {cartItems.map((product, index) => (
                                <Product key={index} id={product._id} img={product.images[0]?.url} title={product.title} price={`${product.price}₽`} data={product.created_at}/>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    )
}

export default Cart