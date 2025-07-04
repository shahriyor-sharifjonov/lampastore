import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Header.module.scss'
import { setCategories } from '@/store/slices/categoriesSlice'
import { setProducts } from '@/store/slices/productsSlice'
import { setPromo } from '@/store/slices/promoSlice'
import { setLoading } from '@/store/slices/loadingSlice'
import { setCart } from '@/store/slices/cartSlice'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { setPromocode } from '@/store/slices/promocodeSlice'
import { setInfo } from '@/store/slices/infoSlice'

const Header = () => {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const cartItems = useSelector((state) => state.cart)
    const products = useSelector((state) => state.products)
    const promo = useSelector((state) => state.promo)
    const categories = useSelector((state) => state.categories)
    const info = useSelector((state) => state.info)

    useEffect(() => {
        dispatch(setLoading(true))

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories')
                dispatch(setCategories(response.data))
            } catch (error) {
                console.error(error)
            }
        }

        const fetchInfo = async () => {
            try {
                const response = await axios.get('/api/getInfo')
                dispatch(setInfo(response.data[0]))
            } catch (error) {
                console.error(error)
            }
        }

        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products?limit=50')
                dispatch(setProducts(response.data))
            } catch (error) {
                console.error(error)
            }
        }

        const fetchPromo = async () => {
            try {
                const response = await axios.get('/api/promo')
                dispatch(setPromo(response.data))
            } catch (error) {
                console.error(error)
            }
        }

        const fetchPromocode = async () => {
            try {
                const response = await axios.get('/api/promocode')
                dispatch(setPromocode(response.data))
            } catch (error) {
                console.error(error)
            }
        }

        fetchCategories()
        fetchInfo()
        fetchProducts()
        fetchPromo()
        fetchPromocode()
    }, [router.asPath]);

    useEffect(() => {
        if(products.length !== 0 && categories.length !== 0){
            dispatch(setLoading(false))
        }
    }, [products, categories])

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems')
        if (storedCartItems) {
            dispatch(setCart(JSON.parse(storedCartItems)))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
        document.body.classList.toggle('oh')
    }
 
    return (
        <header className={styles.header}>
            <div className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
                <div className={styles.menuList}>
                    <Link href="/about" onClick={toggleMenu} className={styles.menuLink}>О магазине</Link>
                    <Link href="/designers" onClick={toggleMenu} className={styles.menuLink}>Дизайнерам</Link>
                    <Link href="/about#staticContacts" onClick={toggleMenu} className={styles.menuLink}>Контакты</Link>
                </div>
                <div className={styles.menuImg}>
                    <img src="/menu-img.png" alt="" width={1000} height={600} draggable={false} />
                </div>
                <div className={styles.menuSm}>
                    <div className={styles.menuTrack}>
                        <div className={styles.menuItems}>
                            {categories.map(cat => (
                                <Link key={cat.slug} href={`/c/${cat.slug}`} onClick={toggleMenu} className={`${styles.menuLink} ${router.query?.category == cat.slug ? styles.active : ''}`}>{cat.name}</Link>
                            ))}
                            <Link href="/about" onClick={toggleMenu} className={styles.menuLink}>О магазине</Link>
                            <Link href="/designers" onClick={toggleMenu} className={styles.menuLink}>Дизайнерам</Link>
                            <Link href="/about#staticContacts" onClick={toggleMenu} className={styles.menuLink}>Контакты</Link>
                        </div>
                        <div className={styles.menuSoc}>
                            <Link href={`tel:${info.tel1}`} className={styles.menuSocLink}>{info.tel1}</Link>
                            {info.tel2 !== "" && (
                                <Link href={`tel:${info.tel2}`} className={styles.menuSocLink}>{info.tel2}</Link>
                            )}
                            <Link href={`mailto:${info.email}`} className={styles.menuSocLink}>{info.email}</Link>
                            <Link href="https://wa.link/5z6tut" target="_blank" rel="noreferrer" className={styles.menuSocIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.05 4.91C18.1332 3.98392 17.0412 3.24967 15.8377 2.75005C14.6341 2.25043 13.3432 1.99546 12.04 2C6.58005 2 2.13005 6.45 2.13005 11.91C2.13005 13.66 2.59005 15.36 3.45005 16.86L2.05005 22L7.30005 20.62C8.75005 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.9501 17.38 21.9501 11.92C21.9501 9.27 20.92 6.78 19.05 4.91ZM12.04 20.15C10.56 20.15 9.11005 19.75 7.84005 19L7.54005 18.82L4.42005 19.64L5.25005 16.6L5.05005 16.29C4.2278 14.977 3.79119 13.4592 3.79005 11.91C3.79005 7.37 7.49005 3.67 12.03 3.67C14.23 3.67 16.3 4.53 17.85 6.09C18.6175 6.85396 19.2257 7.76266 19.6394 8.76342C20.0531 9.76419 20.2641 10.8371 20.26 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.3C14.14 13.55 13.67 14.11 13.53 14.27C13.39 14.44 13.24 14.46 12.99 14.33C12.74 14.21 11.94 13.94 11 13.1C10.26 12.44 9.77005 11.63 9.62005 11.38C9.48005 11.13 9.60005 11 9.73005 10.87C9.84005 10.76 9.98005 10.58 10.1 10.44C10.22 10.3 10.27 10.19 10.35 10.03C10.43 9.86 10.39 9.72 10.33 9.6C10.27 9.48 9.77005 8.26 9.57005 7.76C9.37005 7.28 9.16005 7.34 9.01005 7.33H8.53005C8.36005 7.33 8.10005 7.39 7.87005 7.64C7.65005 7.89 7.01005 8.49 7.01005 9.71C7.01005 10.93 7.90005 12.11 8.02005 12.27C8.14005 12.44 9.77005 14.94 12.25 16.01C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.69 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.03 14.27C16.96 14.16 16.81 14.11 16.56 13.99Z"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.top}>
                <div className={styles.topBody}>
                    <div className={styles.left}>
                        <Link href={`tel:${info.tel1}`} className={styles.link}>{info.tel1}</Link>
                        <Link href="https://wa.link/5z6tut" target="_blank" rel="noreferrer" className={styles.link}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.05 4.91C18.1332 3.98392 17.0412 3.24967 15.8377 2.75005C14.6341 2.25043 13.3432 1.99546 12.04 2C6.58005 2 2.13005 6.45 2.13005 11.91C2.13005 13.66 2.59005 15.36 3.45005 16.86L2.05005 22L7.30005 20.62C8.75005 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.9501 17.38 21.9501 11.92C21.9501 9.27 20.92 6.78 19.05 4.91ZM12.04 20.15C10.56 20.15 9.11005 19.75 7.84005 19L7.54005 18.82L4.42005 19.64L5.25005 16.6L5.05005 16.29C4.2278 14.977 3.79119 13.4592 3.79005 11.91C3.79005 7.37 7.49005 3.67 12.03 3.67C14.23 3.67 16.3 4.53 17.85 6.09C18.6175 6.85396 19.2257 7.76266 19.6394 8.76342C20.0531 9.76419 20.2641 10.8371 20.26 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.3C14.14 13.55 13.67 14.11 13.53 14.27C13.39 14.44 13.24 14.46 12.99 14.33C12.74 14.21 11.94 13.94 11 13.1C10.26 12.44 9.77005 11.63 9.62005 11.38C9.48005 11.13 9.60005 11 9.73005 10.87C9.84005 10.76 9.98005 10.58 10.1 10.44C10.22 10.3 10.27 10.19 10.35 10.03C10.43 9.86 10.39 9.72 10.33 9.6C10.27 9.48 9.77005 8.26 9.57005 7.76C9.37005 7.28 9.16005 7.34 9.01005 7.33H8.53005C8.36005 7.33 8.10005 7.39 7.87005 7.64C7.65005 7.89 7.01005 8.49 7.01005 9.71C7.01005 10.93 7.90005 12.11 8.02005 12.27C8.14005 12.44 9.77005 14.94 12.25 16.01C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.69 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.03 14.27C16.96 14.16 16.81 14.11 16.56 13.99Z" fill="#1A1A19"/>
                            </svg>
                        </Link>
                        <Link href={`mailto:${info.email}`} className={styles.link}>{info.email}</Link>
                    </div>
                    <Link href="/" className={styles.logo} onClick={() => {menuOpen ? toggleMenu() : ''}}>
                        <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.31572 1.328H2.40372V15.152H12.2917V17H0.31572V1.328ZM20.5387 17H18.3787L25.6507 1.328H27.6187L34.8907 17H32.6107L30.4747 12.296H22.6507L20.5387 17ZM26.4907 3.776L23.3947 10.616H29.7307L26.6347 3.776H26.4907ZM59.441 17H57.353V5.12H57.233L51.569 14.648H51.137L45.473 5.12H45.353V17H43.361V1.328H45.569L51.425 11.192H51.473L57.329 1.328H59.441V17ZM72.1397 17H70.0517V1.328H78.5237C80.4437 1.328 81.9077 1.856 82.9157 2.912C83.7157 3.792 84.1157 4.8 84.1157 5.936C84.1157 7.216 83.6517 8.296 82.7237 9.176C81.7317 10.136 80.3317 10.616 78.5237 10.616H72.1397V17ZM78.5237 3.176H72.1397V8.768H78.5237C79.6917 8.768 80.5877 8.472 81.2117 7.88C81.7717 7.352 82.0517 6.712 82.0517 5.96C82.0517 5.288 81.8037 4.68 81.3077 4.136C80.6997 3.496 79.7717 3.176 78.5237 3.176ZM91.7981 17H89.6381L96.9101 1.328H98.8781L106.15 17H103.87L101.734 12.296H93.9101L91.7981 17ZM97.7501 3.776L94.6541 10.616H100.99L97.8941 3.776H97.7501ZM127.028 3.2L125.78 4.64C125.204 4.128 124.412 3.68 123.404 3.296C122.412 2.896 121.268 2.696 119.972 2.696C118.836 2.696 117.868 2.92 117.068 3.368C116.284 3.8 115.892 4.472 115.892 5.384C115.892 5.704 115.948 5.992 116.06 6.248C116.188 6.488 116.396 6.688 116.684 6.848C116.988 6.992 117.252 7.112 117.476 7.208C117.7 7.304 118.068 7.384 118.58 7.448C119.108 7.512 119.492 7.552 119.732 7.568C119.972 7.584 120.404 7.608 121.028 7.64C121.604 7.672 122.028 7.704 122.3 7.736C122.588 7.768 123.028 7.832 123.62 7.928C124.212 8.008 124.676 8.112 125.012 8.24C125.348 8.352 125.74 8.528 126.188 8.768C126.652 8.992 127.004 9.256 127.244 9.56C127.5 9.864 127.716 10.256 127.892 10.736C128.084 11.2 128.18 11.72 128.18 12.296C128.18 13.464 127.852 14.44 127.196 15.224C126.54 16.008 125.7 16.568 124.676 16.904C123.652 17.24 122.484 17.408 121.172 17.408C118.02 17.408 115.276 16.336 112.94 14.192L114.212 12.752C116.276 14.672 118.612 15.632 121.22 15.632C122.644 15.632 123.812 15.376 124.724 14.864C125.636 14.336 126.092 13.568 126.092 12.56C126.092 12 125.964 11.536 125.708 11.168C125.452 10.784 125.06 10.496 124.532 10.304C124.004 10.096 123.484 9.952 122.972 9.872C122.46 9.792 121.812 9.72 121.028 9.656C120.26 9.608 119.676 9.568 119.276 9.536C118.892 9.488 118.356 9.416 117.668 9.32C116.996 9.208 116.476 9.064 116.108 8.888C115.74 8.712 115.356 8.488 114.956 8.216C114.556 7.928 114.26 7.568 114.068 7.136C113.892 6.688 113.804 6.168 113.804 5.576C113.804 4.728 113.988 3.992 114.356 3.368C114.74 2.728 115.244 2.24 115.868 1.904C116.508 1.568 117.172 1.32 117.86 1.16C118.564 1 119.292 0.92 120.044 0.92C121.516 0.92 122.868 1.152 124.1 1.616C125.332 2.08 126.308 2.608 127.028 3.2ZM135.049 3.176V1.328H149.305V3.176H143.233V17H141.145V3.176H135.049ZM155.946 9.128C155.946 6.856 156.786 4.92 158.466 3.32C160.146 1.72 162.202 0.92 164.634 0.92C167.05 0.92 169.106 1.72 170.802 3.32C172.514 4.92 173.37 6.856 173.37 9.128C173.37 11.432 172.522 13.392 170.826 15.008C169.13 16.608 167.066 17.408 164.634 17.408C162.202 17.408 160.146 16.608 158.466 15.008C156.786 13.392 155.946 11.432 155.946 9.128ZM158.13 9.128C158.13 10.92 158.754 12.44 160.002 13.688C161.266 14.936 162.81 15.56 164.634 15.56C166.458 15.56 168.002 14.936 169.266 13.688C170.546 12.424 171.186 10.904 171.186 9.128C171.186 7.368 170.546 5.872 169.266 4.64C168.002 3.392 166.458 2.768 164.634 2.768C162.81 2.768 161.266 3.392 160.002 4.64C158.754 5.872 158.13 7.368 158.13 9.128ZM184.64 17H182.552V1.328H191.192C193.112 1.328 194.576 1.856 195.584 2.912C196.384 3.76 196.784 4.784 196.784 5.984C196.784 7.024 196.456 7.936 195.8 8.72C195.144 9.504 194.256 10.048 193.136 10.352L197 17H194.624L191.024 10.616H184.64V17ZM191.192 3.176H184.64V8.768H191.72C192.568 8.768 193.28 8.496 193.856 7.952C194.432 7.408 194.72 6.744 194.72 5.96C194.72 5.272 194.472 4.664 193.976 4.136C193.336 3.496 192.408 3.176 191.192 3.176ZM214.713 7.832V9.68H208.377V15.152H219.441V17H206.289V1.328H218.889V3.176H208.377V7.832H214.713Z" fill="#1A1A19"/>
                        </svg>
                    </Link>
                    <div className={styles.right}>
                        {session?.user?.role === 'admin' ? (
                            <Link href="/admin" className={styles.link} onClick={() => {menuOpen ? toggleMenu() : ''}}>
                                АДМИН
                            </Link>
                        ) : ''}
                        <Link href="/search" className={`${styles.link} ${styles.lg} ${styles.svg}`} onClick={() => {menuOpen ? toggleMenu() : ''}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.4995 14H14.7095L14.4295 13.73C15.0544 13.0039 15.5112 12.1487 15.767 11.2256C16.0229 10.3024 16.0715 9.33413 15.9095 8.38998C15.4395 5.60998 13.1195 3.38997 10.3195 3.04997C9.3351 2.92544 8.33527 3.02775 7.39651 3.34906C6.45775 3.67038 5.60493 4.20219 4.90332 4.90381C4.20171 5.60542 3.66989 6.45824 3.34858 7.397C3.02726 8.33576 2.92495 9.33559 3.04949 10.32C3.38949 13.12 5.60949 15.44 8.38949 15.91C9.33364 16.072 10.3019 16.0234 11.2251 15.7675C12.1483 15.5117 13.0035 15.0549 13.7295 14.43L13.9995 14.71V15.5L18.2495 19.75C18.6595 20.16 19.3295 20.16 19.7395 19.75C20.1495 19.34 20.1495 18.67 19.7395 18.26L15.4995 14ZM9.49949 14C7.00949 14 4.99949 11.99 4.99949 9.49997C4.99949 7.00997 7.00949 4.99997 9.49949 4.99997C11.9895 4.99997 13.9995 7.00997 13.9995 9.49997C13.9995 11.99 11.9895 14 9.49949 14Z" fill="#1A1A19"/>
                            </svg>
                        </Link>
                        <Link href="/cart" className={`${styles.link} ${styles.lg}`} onClick={() => {menuOpen ? toggleMenu() : ''}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 18C7.89782 18 8.27936 18.158 8.56066 18.4393C8.84196 18.7206 9 19.1022 9 19.5C9 19.8978 8.84196 20.2794 8.56066 20.5607C8.27936 20.842 7.89782 21 7.5 21C7.10218 21 6.72064 20.842 6.43934 20.5607C6.15804 20.2794 6 19.8978 6 19.5C6 19.1022 6.15804 18.7206 6.43934 18.4393C6.72064 18.158 7.10218 18 7.5 18ZM16.5 18C16.8978 18 17.2794 18.158 17.5607 18.4393C17.842 18.7206 18 19.1022 18 19.5C18 19.8978 17.842 20.2794 17.5607 20.5607C17.2794 20.842 16.8978 21 16.5 21C16.1022 21 15.7206 20.842 15.4393 20.5607C15.158 20.2794 15 19.8978 15 19.5C15 19.1022 15.158 18.7206 15.4393 18.4393C15.7206 18.158 16.1022 18 16.5 18Z" stroke="#1A1A19" strokeWidth="1.5"/>
                                <path d="M2.24902 2.29202C2.06125 2.22598 1.85493 2.23724 1.67546 2.32332C1.49599 2.4094 1.35806 2.56325 1.29202 2.75102C1.22598 2.9388 1.23724 3.14511 1.32332 3.32458C1.4094 3.50406 1.56325 3.64198 1.75102 3.70802L2.24902 2.29202ZM20.658 9.88302L21.392 10.034L21.393 10.03L20.658 9.88302ZM20.734 6.69802L20.14 7.15402L20.735 6.69702L20.734 6.69802ZM5.70802 9.76002V7.03802H4.20802V9.76002H5.70802ZM2.51002 2.38402L2.24902 2.29202L1.75102 3.70802L2.01202 3.79902L2.51002 2.38402ZM10.938 16.25H16.24V14.75H10.938V16.25ZM5.70802 7.03802C5.70802 6.33102 5.70902 5.74102 5.65802 5.26202C5.60302 4.76502 5.48802 4.31202 5.20602 3.90002L3.96702 4.74602C4.05702 4.87802 4.12702 5.06002 4.16602 5.42302C4.20702 5.80302 4.20802 6.29802 4.20802 7.03802H5.70802ZM2.01202 3.79902C2.68002 4.03402 3.11902 4.19002 3.44202 4.35002C3.74502 4.49802 3.87902 4.61802 3.96702 4.74702L5.20602 3.90002C4.92202 3.48402 4.54302 3.21802 4.10202 3.00102C3.68202 2.79502 3.14402 2.60702 2.51002 2.38402L2.01202 3.79902ZM4.20802 9.76002C4.20802 11.213 4.22202 12.26 4.35802 13.06C4.50502 13.914 4.79802 14.526 5.34302 15.102L6.43202 14.07C6.11202 13.732 5.93902 13.402 5.83702 12.807C5.72702 12.157 5.70802 11.249 5.70802 9.76002H4.20802ZM10.938 14.75C9.52102 14.75 8.53802 14.748 7.79702 14.643C7.08202 14.542 6.70502 14.358 6.43202 14.07L5.34302 15.102C5.93702 15.729 6.69002 16.002 7.58602 16.128C8.45602 16.252 9.56702 16.25 10.938 16.25V14.75ZM4.95802 6.87002H17.088V5.37002H4.95902L4.95802 6.87002ZM19.923 9.73102L19.423 12.156L20.893 12.458L21.392 10.034L19.923 9.73102ZM17.09 6.87002C17.946 6.87002 18.7 6.87102 19.295 6.93702C19.59 6.97102 19.812 7.01702 19.967 7.07102C20.128 7.12802 20.154 7.17102 20.141 7.15402L21.33 6.24002C21.095 5.93402 20.765 5.76102 20.464 5.65602C20.1385 5.54901 19.8021 5.47858 19.461 5.44602C18.766 5.36902 17.918 5.37002 17.09 5.37002V6.87002ZM21.393 10.03C21.563 9.18202 21.707 8.47002 21.742 7.90002C21.779 7.31402 21.712 6.73602 21.33 6.24002L20.141 7.15402C20.203 7.23502 20.271 7.38002 20.245 7.80802C20.218 8.25202 20.101 8.84502 19.923 9.73602L21.393 10.03ZM16.24 16.25C17.002 16.25 17.642 16.251 18.158 16.188C18.693 16.123 19.182 15.979 19.608 15.632L18.66 14.469C18.535 14.571 18.358 14.653 17.975 14.699C17.572 14.749 17.04 14.75 16.24 14.75V16.25ZM19.425 12.156C19.263 12.939 19.155 13.459 19.025 13.844C18.902 14.21 18.785 14.367 18.66 14.469L19.608 15.632C20.035 15.284 20.274 14.835 20.446 14.323C20.612 13.831 20.74 13.205 20.894 12.459L19.425 12.156Z" fill="#1A1A19"/>
                                <path d="M9.5 9L10.028 12.118M15.528 9L15 12.118" stroke="#1A1A19" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <p>КОРЗИНА</p>
                            <span>{cartItems.length}</span>
                        </Link>
                        <button className={`${styles.button} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}>
                            <div className={styles.buttonLine}></div>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.bot}>
                {categories.map(cat => (
                    <Link key={cat.slug} href={`/c/${cat.slug}`} className={`${styles.botLink} ${router.query?.category == cat.slug ? styles.active : ''}`}>{cat.name}</Link>
                ))}
            </div>
        </header>
    )
}

export default Header
