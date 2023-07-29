import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import CartProduct from '@/components/CartProduct/CartProduct'


const Cart = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)
    const [sortedItems, setSortedItems] = useState([])
    const [totalPrice, setTotalPrice] = useState('')

    useEffect(() => {
        console.log(cartItems);
        const newItems = cartItems.reduce((acc, item) => {
          const existingItem = acc.find((i) => i._id === item._id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            acc.push({ ...item, quantity: 1 });
          }
          return acc;
        }, []);


        let p = Number(0);
        cartItems.forEach(c => {
            p += Number(c.price)
        })
        setTotalPrice(p)
      
        setSortedItems(newItems);
    }, [cartItems]);

    return (
        <motion.section key={`${router.asPath}cart`} transition={{duration: 0.5, delay: 0.5, easings: 'linear'}} exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}} className="cart">
            {cartItems.length === 0 ? (
                <div className='cart-no'>Нет товаров в корзине.</div>
            ) : (
                <div className='cart__wrap'>
                    <div className='catalog__body'>
                        <h2 className='catalog__title'>Корзина</h2>
                        <div className='cart__content'>
                            {sortedItems.map((product, index) => (
                                <CartProduct key={index} props={product}/>
                            ))}
                            <div className='cart__total'>
                                <p className='cart__total-p cart__total-title'>Итого:</p>
                                <p className='cart__total-p cart__total-quantity'>{cartItems.length}</p>
                                <p className='cart__total-p cart__total-price'>{totalPrice !== '' ? Number(totalPrice).toLocaleString() : ''} ₽</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    )
}

export default Cart