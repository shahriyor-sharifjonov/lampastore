import React, { useState } from 'react'
import styles from '@/styles/modules/Static.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const Privacy = () => {
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
            <h1 className={`${styles.title} ${styles.sm}`}>Политика конфиденциальности</h1>
            <p className={styles.p}>Информация на сайте, касающаяся технических характеристик, наличия на складе, стоимости товаров, носит информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями Статьи 437(2) Гражданского кодекса РФ.
Нажатие на кнопок «Добавить в корзину» и «Оформить заказ», а также последующее заполнение тех или иных форм, не накладывает на владельцев сайта никаких обязательств.
Все материалы, размещенные на сайте являются собственностью магазина Lampastore. Копирование любой информации может повлечь за собой уголовное преследование.
Регистрируясь на сайте или оставляя тем или иным способом свою персональную информацию, Вы делегируете право сотрудникам компании обрабатывать вашу персональную информацию, которая хранится на защищенных серверах, принадлежащих магазину Lampastore  и находящихся на территории РФ в соответствии с федеральным законом
от 21 июля 2014 г. № 242-ФЗ «О внесении изменений в отдельные законодательные акты Российской Федерации в части уточнения порядка обработки персональных данных в информационно-телекоммуникационных сетях».
Для аналитических целей на сайте работает система статистики, которая собирает информацию о посещенных страницах сайта, заполненных формах и т.д. Сотрудники компании имеют доступ к этой информации</p>
        </motion.section>
    )
}

export default Privacy