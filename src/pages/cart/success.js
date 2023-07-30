import React from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const Success = () => {
    const router = useRouter()
    return (
        <div className='cart__success' key={`${router.asPath}success`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Спасибо за заказ</h1>
            <p>МЫ СВЯЖЕМСЯ С ВАМИ В САМОЕ БЛИЖАЙШЕЕ ВРЕМЯ, ЧТОБЫ УТОЧНИТЬ ДЕТАЛИ И ОФОРМИТЬ ПОКУПКУ.</p>
        </div>
    )
}

export default Success
