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
    const promocode = useSelector((state) => state.promocode)
    const [sortedItems, setSortedItems] = useState([])
    const [totalPrice, setTotalPrice] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [promo, setPromo] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isPromoActive, setIsPromoActive] = useState(false)
    const [isPromoPer, setIsPromoPer] = useState(false)
    const [discount, setDiscount] = useState('')
    const [totalPriceWithDiscount, setTotalPriceWithDiscount] = useState(0)

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
            p += Number(c?.selectedKom ? c?.selectedKom.match(/price-(\d+):/)[1] : c.price)
        })
        setTotalPrice(p)
        
        function sortByNum(a, b) {
            return a.num - b.num;
        }

        newItems.sort(sortByNum);
      
        setSortedItems(newItems);
    }, [cartItems]);

    const handleSubmit = async (event) => {
        event.preventDefault()

        const dataObject = {
            'Общая цена': totalPrice,
            'Общая цена со скидкой': totalPriceWithDiscount,
            'Скидка': `${discount}`,
            'Имя': name,
            'Телефон': phone,
            'Промокод': isPromoActive ? promo : ''
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
        setPromo('')
        setSuccess('')
        setDiscount('')
        setTotalPriceWithDiscount('')
        setIsPromoPer(false)
        setIsPromoActive(false)
        const message = await response.json()

        if(message.success === true){
            dispatch(setCart([]))
            router.push('/cart/success')
        }
    }

    useEffect(() => {
        // Здесь вы можете выполнять действия, зависящие от обновленного значения discount
        // console.log(discount);
        // console.log(totalPriceWithDiscount);
    }, [discount,totalPriceWithDiscount]);

    const handlePromoEntered = () => {
        const havePromo = promocode.filter(el => el.promoCode === promo)
        if (havePromo.length === 0) {
            setError("Промокод не найден")
            setTimeout(() => {
                setError("")
            }, 3000)
        }else{
            const promo = havePromo[0]
            const startDate = new Date(promo.startDate).getTime();
            const endDate = new Date(promo.endDate).getTime();
            const currentDate = Date.now();
            if (startDate <= currentDate && currentDate <= endDate) {
                if(totalPrice > promo.otPrice){
                    if(promo.type === 'fix'){
                        const ds = `${Math.abs(parseInt(promo.discount))} ₽`
                        setDiscount(ds)
                        setIsPromoPer(false)
                        const q = ds.replace(" ₽", "")
                        const discountPercentage = parseFloat(Number(q))
                        const stotalPriceWithDiscount = Number(totalPrice) - Number(discountPercentage)
                        const r = `${stotalPriceWithDiscount} ₽`
                        setTotalPriceWithDiscount(r)
                    }
                    else if(promo.type === 'per'){
                        const ds = `${Math.abs(parseInt(promo.discount))}%`
                        setDiscount(ds)
                        setIsPromoPer(true)
                        const q = ds.replace("%", "");
                        const discountPercentage = parseFloat(Number(q)) / 100;
                        const discountAmount = totalPrice * discountPercentage;
                        const stotalPriceWithDiscount = totalPrice - discountAmount;
                        const r = `${stotalPriceWithDiscount} ₽`
                        setTotalPriceWithDiscount(r)
                    }
                    setIsPromoActive(true)
                    setSuccess("Промокод активирован")
                    console.log(totalPrice);
                    console.log(discount);
                    console.log(totalPriceWithDiscount);
                }else{
                    setError(`Применение промокода возможно при совершении заказа на сумму от ${promo.otPrice} ₽`)
                    setTimeout(() => {
                        setError("")
                    }, 3000)
                }
            } else {
                setError("Промокод не найден")
                setTimeout(() => {
                    setError("")
                }, 3000)
            }
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
                                <div>
                                    <p className='cart__total-p cart__total-price'>Общая сумма: {totalPrice !== '' ? Number(totalPrice).toLocaleString() : ''} ₽</p>
                                    {discount !== '' && <p className='cart__total-p cart__total-price'>Скидка: {!isPromoPer ? `${Number(discount.replace(" ₽", "")).toLocaleString()}  ₽` : `${Number(discount.replace("%", "")).toLocaleString()}%`}</p>}
                                    {totalPriceWithDiscount !== 0 && <p className='cart__total-p cart__total-price'>Общая сумма со скидкой: {Number(totalPriceWithDiscount.replace(" ₽", "")).toLocaleString()} ₽</p>}
                                </div>
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
                                    <div className='cart__form-group-input'>
                                        <input type='text' placeholder='' value={name} onChange={(e) => {setName(e.target.value)}} required={true}/>
                                    </div>
                                </div>
                                <div className='cart__form-group'>
                                    <p className='cart__form-p'>Номер телефона <span>*</span></p>
                                    <div className='cart__form-group-input'>
                                        <input type='text' placeholder='' value={phone} onChange={(e) => {setPhone(e.target.value)}} required={true}/>
                                    </div>
                                </div>
                                <div className='cart__form-group'>
                                    <p className='cart__form-p'>E-mail</p>
                                    <div className='cart__form-group-input'>
                                        <input type='text' placeholder='' value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className='cart__form-group'>
                                    <p className='cart__form-p'>Промокод</p>
                                    <div className='cart__form-group-input'>
                                        {isPromoActive ? (
                                            <>
                                                <input type='text' placeholder='' disabled value={promo} onChange={(e) => {setPromo(e.target.value)}}/>
                                                <button type="button" disabled className='cart__form-group-activate' onClick={handlePromoEntered}>Применить</button>
                                            </>
                                        ) : (
                                            <>
                                                <input type='text' placeholder='' value={promo} onChange={(e) => {setPromo(e.target.value)}}/>
                                                <button type="button" disabled={promo === ''} className='cart__form-group-activate' onClick={handlePromoEntered}>Применить</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {error && (
                                    <div className='cart__form-group'>
                                        <p className='cart__form-p'></p>
                                        <div className='cart__form-group-error'>
                                            {error}
                                        </div>
                                    </div>
                                )}
                                {success && (
                                    <div className='cart__form-group'>
                                        <p className='cart__form-p'></p>
                                        <div className='cart__form-group-success'>
                                            {success}
                                        </div>
                                    </div>
                                )}
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