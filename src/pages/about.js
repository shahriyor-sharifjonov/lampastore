import React from 'react'
import styles from '@/styles/modules/Static.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const About = () => {
    const router = useRouter()
    return (
        <motion.section key={`${router.asPath}top`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
            <h1 className={styles.title}>О МАГАЗИНЕ</h1>
            <p className={styles.p}>Lampastore - это современный интернет-магазин освещения, где каждый сможет найти идеальные светильники, чтобы создать особую атмосферу в своем доме. Мы гордимся тем, что предлагаем широкий выбор актуальных и стильных моделей по доступным ценам.</p>
            <div className={styles.img}>
                <Image src="/intro.png" alt="" width={1920} height={1080} draggable={false}/>
            </div>
            <h2 className={styles.subtitle}>Наша история</h2>
            <p className={styles.p}>Наша история началась из нашей страсти к дизайну и освещению. Мы сами искали качественные и привлекательные светильники, но столкнулись с трудностями в их поиске. Тогда мы решили создать место, где каждый сможет найти светильник, который идеально впишется в его интерьер. С 2019 года мы работаем над этой идеей, стремясь предложить лучшие модели и удовлетворить потребности наших клиентов.</p>
            <h2 className={styles.subtitle}>Наша команда</h2>
            <p className={styles.p}>Наша команда состоит из экспертов в области дизайна и освещения. Мы постоянно следим за последними трендами и ищем самые качественные и инновационные светильники. Мы стремимся предложить широкий ассортимент товаров различных стилей, чтобы каждый клиент мог найти то, что подходит именно ему.</p>
            <h2 className={styles.subtitle}>Наш каталог</h2>
            <p className={styles.p}>В нашем каталоге вы найдете разнообразные типы светильников: потолочные, настольные, напольные, настенные и другие. Мы тщательно подбираем каждую модель, чтобы убедиться, что она соответствует нашим высоким стандартам качества. Мы работаем только с проверенными поставщиками, чтобы гарантировать надежность и долговечность наших продуктов.</p>
            <div id="staticContacts" className={styles.contacts}>
                <h2 className={styles.subtitle}>Контакты</h2>
                <Link href="#!" className={styles.soc}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.89583 11.2396C8.39583 14.1875 10.8125 16.5937 13.7604 18.1042L16.0521 15.8125C16.3333 15.5312 16.75 15.4375 17.1146 15.5625C18.2812 15.9479 19.5417 16.1562 20.8333 16.1562C21.4062 16.1562 21.875 16.625 21.875 17.1979V20.8333C21.875 21.4062 21.4062 21.875 20.8333 21.875C11.0521 21.875 3.125 13.9479 3.125 4.16667C3.125 3.59375 3.59375 3.125 4.16667 3.125H7.8125C8.38542 3.125 8.85417 3.59375 8.85417 4.16667C8.85417 5.46875 9.0625 6.71875 9.44792 7.88542C9.5625 8.25 9.47917 8.65625 9.1875 8.94792L6.89583 11.2396Z" fill="#1A1A19"/>
                    </svg>
                    <span>+7(991)761-70-72</span>
                </Link>
                <Link href="#!" className={styles.soc}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_523_2163)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.5002 2.08337C6.74704 2.08337 2.0835 6.74692 2.0835 12.5C2.0835 14.4688 2.63037 16.3125 3.58141 17.8834L2.65225 21.0417C2.5989 21.223 2.59539 21.4154 2.64208 21.5986C2.68878 21.7817 2.78396 21.9489 2.91762 22.0826C3.05128 22.2162 3.21848 22.3114 3.40164 22.3581C3.5848 22.4048 3.77716 22.4013 3.9585 22.348L7.11683 21.4188C8.74045 22.4012 10.6025 22.9193 12.5002 22.9167C18.2533 22.9167 22.9168 18.2532 22.9168 12.5C22.9168 6.74692 18.2533 2.08337 12.5002 2.08337ZM10.1439 14.8573C12.2512 16.9636 14.2627 17.2417 14.9731 17.2677C16.0533 17.3073 17.1054 16.4823 17.5147 15.525C17.5664 15.406 17.5852 15.2752 17.5691 15.1464C17.5529 15.0175 17.5025 14.8954 17.4231 14.7927C16.8522 14.0636 16.0804 13.5396 15.3262 13.0188C15.1687 12.9099 14.9752 12.8662 14.7863 12.8969C14.5973 12.9276 14.4276 13.0303 14.3127 13.1834L13.6877 14.1365C13.6548 14.1877 13.6036 14.2245 13.5445 14.2392C13.4855 14.2539 13.423 14.2455 13.37 14.2157C12.946 13.973 12.3283 13.5605 11.8845 13.1167C11.4408 12.673 11.0533 12.0834 10.8356 11.6865C10.8086 11.6361 10.8008 11.5776 10.8136 11.5218C10.8264 11.4661 10.859 11.4169 10.9054 11.3834L11.8679 10.6688C12.0052 10.5494 12.0939 10.3836 12.1169 10.203C12.14 10.0225 12.0958 9.83974 11.9929 9.68962C11.5262 9.00629 10.9825 8.13754 10.1939 7.5615C10.0921 7.48775 9.97294 7.44177 9.84801 7.42807C9.72308 7.41437 9.59674 7.43343 9.48141 7.48337C8.52308 7.89379 7.69391 8.94587 7.7335 10.0282C7.75954 10.7386 8.03766 12.75 10.1439 14.8573Z" fill="#1A1A19"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_523_2163">
                        <rect width="25" height="25" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                    <span>+7(991)761-70-72</span>
                </Link>
                <Link href="#!" className={styles.soc}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16683 20.8333C3.59391 20.8333 3.10329 20.6291 2.69496 20.2208C2.28662 19.8125 2.0828 19.3222 2.0835 18.75V6.24996C2.0835 5.67704 2.28766 5.18642 2.696 4.77809C3.10433 4.36975 3.59461 4.16593 4.16683 4.16663H20.8335C21.4064 4.16663 21.897 4.37079 22.3054 4.77913C22.7137 5.18746 22.9175 5.67774 22.9168 6.24996V18.75C22.9168 19.3229 22.7127 19.8135 22.3043 20.2218C21.896 20.6302 21.4057 20.834 20.8335 20.8333H4.16683ZM12.5002 13.5416L20.8335 8.33329V6.24996L12.5002 11.4583L4.16683 6.24996V8.33329L12.5002 13.5416Z" fill="#111111"/>
                    </svg>
                    <span>lampastore@inbox.ru</span>
                </Link>
            </div>
        </motion.section>
    )
}

export default About