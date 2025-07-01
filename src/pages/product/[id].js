import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { addCart } from '@/store/slices/cartSlice'
import styles from '@/styles/ProductPage.module.scss'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation, Controller } from 'swiper/modules'
import 'swiper/css'
import Link from 'next/link'
import FourOhFour from '../404'
import Catalog from '@/components/Catalog/Catalog'

const ProductPage = ({ product, news }) => {
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)
    const router = useRouter()

    const [kom, setKom] = useState("")
    const [popupOpen, setPopupOpen] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [animation, setAnimation] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const swiper1Ref = useRef(null)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 576)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const addToCartHandler = () => {
        setAnimation(false)
        setTimeout(() => setAnimation(true), 100)
        const updatedProduct = { ...product, selectedKom: kom }
        dispatch(addCart(updatedProduct))
    }

    const handleUznat = async (e) => {
        e.preventDefault()
        const dataObject = {
            'Имя': name,
            'Телефон': phone,
            'Товар': `[${product.title}](https://lampa-store.ru/product/${product._id})`,
        }

        await fetch('/api/sendprice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
        })

        setPopupOpen(false)
        setName("")
        setPhone("")
    }

    if (!product) return <FourOhFour />

    return (
      <>
          <Head>
              <title>{product.title} — Lampa-store.ru</title>
              <meta name="description" content={product.description} />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
          </Head>

          {/* Попап */}
          <div className={`popup ${popupOpen && 'active'}`}>
              <button onClick={() => setPopupOpen(false)} className="popup__overlay" />
              <div className="popup__content">
                  <p className="popup__title">Узнать оптовую стоимость</p>
                  <p className="popup__p">Оставьте заявку, мы скоро свяжемся с вами</p>
                  <form onSubmit={handleUznat} className="popup__form">
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Номер телефона" />
                      <button type="submit" className="popup__btn">Оставить заявку</button>
                  </form>
              </div>
          </div>

          {/* Тело страницы */}
          <motion.section
            key={`${router.asPath}-product`}
            transition={{ duration: 0.5, delay: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.body}
          >
              <h2 className={styles.title}>{product.title}</h2>
              <div className={styles.content}>
                  {/* Галерея */}
                  <div className={`${styles.swiper} productpage-swiper`}>
                      <Swiper
                        ref={swiper1Ref}
                        navigation
                        spaceBetween={0}
                        slidesPerView={1}
                        thumbs={{ swiper: null }}
                        modules={[Thumbs, Navigation, Controller]}
                        className={styles.slides}
                      >
                          {product.images.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <img src={img.url} alt="" width={845} height={845} draggable="false" />
                            </SwiperSlide>
                          ))}
                      </Swiper>

                      <Swiper
                        direction={isMobile ? 'horizontal' : 'vertical'}
                        spaceBetween={10}
                        slidesPerView={'auto'}
                        watchSlidesProgress
                        onSwiper={() => {}}
                        modules={[Thumbs]}
                        className={styles.thumbs}
                      >
                          {product.images.map((img, idx) => (
                            <SwiperSlide key={`thumb-${idx}`}>
                                <img src={img.url} alt="" width={216} height={216} draggable="false" />
                            </SwiperSlide>
                          ))}
                      </Swiper>
                  </div>

                  {/* Информация */}
                  <div className={styles.info}>
                      <p className={styles.subtitle}>{product.description}</p>

                      <p className={styles.price}>
                          {kom !== ""
                            ? Number(kom.match(/price-(\d+):/)[1]).toLocaleString()
                            : Number(product.price).toLocaleString()} ₽
                      </p>

                      <div className={styles.row}>
                          <b>Артикул</b>
                          <div></div>
                          <span>{product.num}</span>
                      </div>

                      {product.fields?.map((f, i) => (
                        <div key={i} className={styles.row}>
                            <b>{f.title}</b>
                            <div></div>
                            <span>{f.value}</span>
                        </div>
                      ))}

                      {product.kom?.length > 0 && (
                        <>
                            <p className={styles.kom}>Выберите комплектацию</p>
                            <select value={kom} onChange={(e) => setKom(e.target.value)} className={styles.komSelect}>
                                {product.kom.map((f, i) => (
                                  <option key={i} value={`price-${f.price}:title-${f.title}`}>{f.title}</option>
                                ))}
                            </select>
                        </>
                      )}

                      <motion.button whileTap={{ scale: 0.98 }} className={styles.button2} onClick={() => setPopupOpen(true)}>
                          Узнать оптовую стоимость
                      </motion.button>

                      <motion.button whileTap={{ scale: 0.98 }} className={styles.button} onClick={addToCartHandler}>
                          Добавить в корзину
                      </motion.button>

                      {animation && (
                        <motion.div transition={{ duration: 0.5 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.cart}>
                            <p>Товар добавлен. Сейчас в корзине {cartItems.length} товара.</p>
                            <Link href="/cart">Оформить заказ</Link>
                        </motion.div>
                      )}
                  </div>
              </div>
          </motion.section>

          {/* Новинки снизу */}
          <Catalog categoryTitle={'НОВИНКИ'} category={'news'} more={true} products={news} />
      </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params
    const API = process.env.NEXT_PUBLIC_NEXTAUTH_URL

    try {
        const res = await fetch(`${API}/api/products/${id}`)
        if (!res.ok) throw new Error('Not found')
        const product = await res.json()
        const newsRes = await fetch(`${API}/api/products?limit=10`)
        if (!newsRes.ok) throw new Error('Not found')
        const news = newsRes.ok ? await newsRes.json() : []

        return {
            props: {
                product,
                news,
            }
        }
    } catch (err) {
        return {
            props: { product: null, news: null }
        }
    }
}

export default ProductPage