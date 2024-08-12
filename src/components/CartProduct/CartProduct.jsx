import { useEffect, useState } from 'react';
import { addCart, deleteCart } from '@/store/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './CartProduct.module.scss'

const CartProduct = ({props}) => {
    const dispatch = useDispatch()
    const [animation, setAnimation] = useState(true)
    const [price, setPrice] = useState()

    useEffect(() => {
        setPrice(props?.selectedKom ? props?.selectedKom.match(/price-(\d+):/)[1] : props.price);
    }, [props])

    const addToCart = (props) => {
        setAnimation(false)
        dispatch(addCart(props))
        setTimeout(() => {
            setAnimation(true)
        }, 100)
    }

    const deleteFromCart = (props) => {
        setAnimation(false)
        dispatch(deleteCart(props))
        setTimeout(() => {
            setAnimation(true)
        }, 100)
    }

    return (
        <div className={styles.product}>
            <div className={styles.left}>
                <div className={styles.img}>
                    <Image src={props.images[0].url} alt={props.title} width={70} height={70} draggable={false} />
                </div>
                <div className={styles.name}>
                    <Link href={`/product/${props._id}`} className={styles.title}>{props.title}</Link>
                    <p className={styles.num}>Номер продукта: {props.num}</p>
                </div>
            </div>
            <div className={styles.calc}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => {deleteFromCart(props)}} className={styles.calcButton}>-</motion.button>
                <div className={styles.calcP}>{animation && <motion.span transition={{duration: 0.5, delay: 0, easings: 'ease'}} exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}}>{props.quantity}</motion.span>}</div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => {addToCart(props)}} className={styles.calcButton}>+</motion.button>
            </div>
            <p className={styles.price}>{(price * props.quantity).toLocaleString()} ₽</p>
        </div>
    )
}

export default CartProduct
