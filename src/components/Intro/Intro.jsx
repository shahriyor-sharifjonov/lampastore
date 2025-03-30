import Image from 'next/image'
import React from 'react'
import styles from './Intro.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion';
import 'swiper/css';
import { useRouter } from 'next/router'

const Intro = () => {
    const router = useRouter()
    const promo = useSelector((state) => state.promo)
    return ( 
        <motion.section key={`${router.asPath}intro`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${styles.intro} intro`}>
            <Swiper  
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
            >
                {promo.map(el => (
                    <SwiperSlide key={el._id}><img src={el.images[0].url} alt="" width={1920} height={1080} draggable={false}/></SwiperSlide>
                ))}
            </Swiper>
        </motion.section>
    )
}

export default Intro