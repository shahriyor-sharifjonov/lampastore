import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import CartProduct from '@/components/CartProduct/CartProduct'
import { setCart } from '@/store/slices/cartSlice'


const Cart = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)
    const [sortedItems, setSortedItems] = useState([])
    const [totalPrice, setTotalPrice] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
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

    const handleSubmit = async (event) => {
        event.preventDefault()

        const dataObject = {
            'Общая цена': totalPrice,
            'Имя': name,
            'Телефон': phone,
        };

        if (email !== '') {
            dataObject.Имейл = email;
        }
        
        dataObject.Товары = sortedItems;

        const response = await fetch('/api/sendmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        })

        setName('')
        setPhone('')
        setEmail('')
        const message = await response.json()

        if(message.success === true){
            dispatch(setCart([]))
            router.push('/cart/success')
        }
    }

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
                        <div className='cart__form'>
                            <div className='cart__form-top'>
                                <h2 className='catalog__title'>Оформить заказ</h2>
                                <p className='cart__p'>Поля, отмеченные <span>*</span> (звёздочной) обязательны к заполнению</p>
                            </div>
                            <form onSubmit={handleSubmit} className='cart__form-content'>
                                <div className='cart__form-group'>
                                    <p className='cart__form-p'>Имя, Фамилия <span>*</span></p>
                                    <input type='text' placeholder='' value={name} onChange={(e) => {setName(e.target.value)}} required={true}/>
                                </div>
                                <div className='cart__form-group'>
                                    <p className='cart__form-p'>Номер телефона <span>*</span></p>
                                    <input type='text' placeholder='' value={phone} onChange={(e) => {setPhone(e.target.value)}} required={true}/>
                                </div>
                                <div className='cart__form-group'>
                                    <p className='cart__form-p'>E-mail</p>
                                    <input type='text' placeholder='' value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                                </div>
                                <button type="submit" disabled={name === '' || phone === ''} className='cart__form-btn'>Отправить заказ</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    )
}

export default Cart