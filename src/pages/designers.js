import React, { useState } from 'react'
import styles from '@/styles/modules/Static.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const Designers = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const dataObject = {
            'Имя': name,
            'Телефон': phone,
        };

        const response = await fetch('/api/senddesigner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        })

        setName('')
        setPhone('')
        const message = await response.json()

        if(message.success === true){
            router.push('/cart/success')
        }
    }

    return (
        <motion.section key={`${router.asPath}top`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
            <h1 className={styles.title}>ДИЗАЙНЕРАМ</h1>
            <p className={styles.p}>В Lampastore действует очень гибкая программа работы с дизайнерами: мы предлагаем Вам только тщательно отобранный ассортимент дизайнерского света от проверенных производителей: с нашим выбором света Вы сможете скомплектовать объект Вашего клиента красивыми вещами и сэкономите ему бюджет. Также у нас действуют профессиональные скидки для постоянных партнеров.</p>
            <div className={styles.row}>
                <form className={styles.rowContent} onSubmit={handleSubmit}>
                    <p className={styles.subtitle}>Заполните форму, мы перезвоним и расскажем все подробности!</p>
                    <input type="text" placeholder='Ваше имя' className={styles.input} value={name} onChange={(e) => {setName(e.target.value)}} />
                    <input type="text" placeholder='Телефон' className={styles.input} value={phone} onChange={(e) => {setPhone(e.target.value)}} />
                    <button type="submit" className={styles.button}>Получить предложение</button>
                    <p className={styles.psm}>Нажимая кнопку «Получить предложение» Вы соглашаетесь на <Link href="#!">обработку персональных данных</Link></p>
                </form>
                <div className={styles.rowImage}>
                    <Image src="/designer.jpg" alt="" width={1522} height={1120} draggable={false} />
                </div>
            </div>
        </motion.section>
    )
}

export default Designers