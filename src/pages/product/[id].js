import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/ProductPage.module.scss'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation, Controller } from 'swiper/modules'
import { addCart } from '@/store/slices/cartSlice'
import 'swiper/css';
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import FourOhFour from '../404'
import Link from 'next/link'
import Catalog from '@/components/Catalog/Catalog'

const ProductPage = () => {
    const router = useRouter()
    const { id } = router.query
    const dispatch = useDispatch()
    const categories = useSelector((state) => state.categories)
    const products = useSelector((state) => state.products)
    const loading = useSelector((state) => state.loading)
    const cartItems = useSelector((state) => state.cart)
    const [isMobile, setIsMobile] = useState(false)
    const [animation, setAnimation] = useState(false)
    
    const [product, setProduct] = useState(null);
    
    const addToCart = (product) => {
        setAnimation(false)
        setTimeout(() => {
            setAnimation(true)
        }, 100)
      
        dispatch(addCart(product))
    };
    
    const [thumbsSwiper, setThumbsSwiper] = useState();
    const [firstSwiper, setFirstSwiper] = useState();
    const [secondSwiper, setSecondSwiper] = useState();
    const swiper1Ref = useRef(null);
    const swiper2Ref = useRef();

    useLayoutEffect(() => {
        if (swiper1Ref.current !== null) {
          swiper1Ref.current.controller.control = swiper2Ref.current;
        }
    }, [router.asPath]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };
        
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    })

    useEffect(() => {
        setProduct(products.filter(i => i._id === id)[0]);
    }, [id, products]);

    return (
        <>
            <Head>
                <title>Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор</title>
                <meta name="description" content="Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <motion.section key={`${router.asPath}subcategorycatalog`} transition={{duration: 0.5, delay: 0.5, easings: 'linear'}} exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}} className={styles.body}>
                {loading.value !== true && product !== null && product ? (
                    <>
                        <h2 className={styles.title}>{product?.title}</h2>
                        <div className={styles.content}>
                            <div className={`${styles.swiper} productpage-swiper`}>
                                <Swiper
                                    onSwiper={(swiper) => {
                                        if (swiper1Ref.current !== null) {
                                            swiper1Ref.current = swiper;
                                        }
                                    }}
                                    controller={{ control: secondSwiper }}
                                    navigation={true}
                                    spaceBetween={0}
                                    slideToClickedSlide={true}
                                    slidesPerView={1}
                                    thumbs={{
                                        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                                    }}
                                    modules={[Thumbs, Navigation, Controller]}
                                    className={styles.slides}
                                >
                                    {product.images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <Image src={img.url} alt="" width={845.44} height={845.44} draggable="false" />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                
                                <Swiper
                                    controller={{ control: firstSwiper }}
                                    spaceBetween={0}
                                    slidesPerView={'auto'}
                                    direction={isMobile ? 'horizontal' : 'vertical'}
                                    watchSlidesProgress 
                                    onSwiper={setThumbsSwiper}
                                    modules={[Thumbs, Controller]}
                                    slideToClickedSlide={true}
                                >
                                    {product?.images?.map((img, index) => (
                                        <SwiperSlide key={`asf${index}`}>
                                            <Image
                                                src={img.url}
                                                alt=""
                                                width={216.36}
                                                height={216.36}
                                                draggable="false"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className={styles.info}>
                                <p className={styles.subtitle}>{product?.description}</p>
                                <p className={styles.price}>{(Number(product.price)).toLocaleString()} ₽</p>
                                {product?.fields.map((f, index) => (
                                    <div key={index} className={styles.row}>
                                        <b>{f.title}</b>
                                        <div></div>
                                        <span>{f.value}</span>
                                    </div>
                                ))}
                                <motion.button whileTap={{ scale: 0.98 }} type="button" className={styles.button} onClick={() => {addToCart(product)}}>Добавить в корзину</motion.button>
                                {animation && (
                                    <motion.div transition={{duration: 0.5, delay: 0, easings: 'linear'}} exit={{opacity: 0}} initial={{opacity: 0}} animate={{opacity: 1}} className={styles.cart}>
                                        <p>Товар добавлен.<br/>Сейчас в корзине {cartItems.length} товара.</p>
                                        <Link href="/cart">Оформить заказ</Link>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </>
                ) : <FourOhFour />}
            </motion.section>
            <Catalog categoryTitle={'НОВИНКИ'} category={'news'} more={true}/>
        </>
    );
};

export default ProductPage;