import React from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const Success = () => {
    const router = useRouter()
    return (
        <motion.div className='cart__success' key={`${router.asPath}success`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1>Спасибо за заказ</h1>
            <p>Мы свяжемся с вами в самое ближайшее время, чтобы уточнить детали и оформить покупку.</p>
        </motion.div>
    )
}

export default Success
