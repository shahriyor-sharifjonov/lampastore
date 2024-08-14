import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import styles from '@/components/Top/Top.module.scss'

const Catalog = ({categoryTitle, category, more, categorySlug, subcategory, subcategorySlug, filter}) => {
    const router = useRouter()
    const products = useSelector((state) => state.products)
    const minPrice = useSelector((state) => state.filters.minPrice)
    const maxPrice = useSelector((state) => state.filters.maxPrice)
    const filters = useSelector((state) => state.filters)
    const [newProducts, setNewProducts] = useState([])
    const [search, setSearch] = useState('')
    const [productsByCategory, setProductsByCategory] = useState([])
    const [productsBySearch, setProductsBySearch] = useState([])
    const [productsBySubcategory, setProductsBySubcategory] = useState([])

    useEffect(() => {
        let newestProducts = [...products]
        if(products.length > 0){
            setNewProducts(newestProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
        }
        
        let prod = [...products]
        prod.sort((a, b) => {
            if (a.vip && !b.vip) return -1;
            if (!a.vip && b.vip) return 1;
            return 0;
        });
        let finalProd = null;
        if(filter){
            if(minPrice !== "" && maxPrice === ""){
                finalProd = prod.filter(product => product.price > Number(minPrice));
                setNewProducts(finalProd.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
            } else if (minPrice !== "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price > Number(minPrice) && product.price < Number(maxPrice));
                setNewProducts(finalProd.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
            } else if (minPrice === "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price < Number(maxPrice));
                setNewProducts(finalProd.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
            } else {
                finalProd = prod;
                setNewProducts(finalProd.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
            }
        }else {
            finalProd = prod.sort((a, b) => {
                new Date(b.created_at) - new Date(a.created_at)
            })
            finalProd = prod.sort((a, b) => {
                if (a.vip && !b.vip) return -1;
                if (!a.vip && b.vip) return 1;
                return 0;
            })
            setNewProducts(finalProd);
            if(more === true) {
                let finalProdCopy = [...finalProd];
                finalProdCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                finalProdCopy = finalProdCopy.slice(0, 10);
                setNewProducts(finalProdCopy.sort((a, b) => {
                    if (a.vip && !b.vip) return -1;
                    if (!a.vip && b.vip) return 1;
                    return 0;
                }))
            }
        }
        setProductsByCategory(finalProd)
        if(more === true) {
            let finalProdCopy = [...finalProd];
            finalProdCopy = finalProdCopy.slice(-10);
            setProductsByCategory(finalProdCopy)
        }
    }, [products, filters])
    

    // category 
    useEffect(() => {
        const prod = products.filter(product => product.category === category).sort((a, b) => {
            if (a.vip && !b.vip) return -1;
            if (!a.vip && b.vip) return 1;
            return 0;
        });
        let finalProd = null;
        if(filter){
            if(minPrice !== "" && maxPrice === ""){
                finalProd = prod.filter(product => product.price > Number(minPrice));
            } else if (minPrice !== "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price > Number(minPrice) && product.price < Number(maxPrice));
            } else if (minPrice === "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price < Number(maxPrice));
            } else {
                finalProd = prod;
            }
        }else {
            finalProd = prod.sort((a, b) => {
                if (a.vip && !b.vip) return -1;
                if (!a.vip && b.vip) return 1;
                return 0;
            });
        }
        setProductsByCategory(finalProd)
        if(more === true) {
            let finalProdCopy = [...finalProd];
            finalProdCopy = finalProdCopy.slice(0, 10);
            setProductsByCategory(finalProdCopy)
        }
    }, [products, category, filters])


    // subcategory 
    useEffect(() => {
        const prod = productsByCategory.filter(product => product.subcategory === subcategorySlug).sort((a, b) => {
            if (a.vip && !b.vip) return -1;
            if (!a.vip && b.vip) return 1;
            return 0;
        });
        let finalProd = null;
        if(filter){
            if(minPrice !== "" && maxPrice === ""){
                finalProd = prod.filter(product => product.price > Number(minPrice));
            } else if (minPrice !== "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price > Number(minPrice) && product.price < Number(maxPrice));
            } else if (minPrice === "" && maxPrice !== ""){
                finalProd = prod.filter(product => product.price < Number(maxPrice));
            } else {
                finalProd = prod;
            }
        }else {
            finalProd = prod;
        }
        setProductsBySubcategory(finalProd)
    }, [productsByCategory, subcategory, filters])

    useEffect(() => {
        if (search.length > 0) {
            const filteredProducts = products.filter((product) => {
                const searchLowerCase = search.toLowerCase();
                const titleMatch = product.title.toLowerCase().includes(searchLowerCase);
            
                // Check if the search term is a numeric string and matches the product num exactly
                const numMatch = !isNaN(search) && product.num.toString() === search;
            
                return titleMatch || numMatch;
            });
    
            setProductsBySearch(filteredProducts);
        } else {
            setProductsBySearch([]);
        }
    }, [search, products]);
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    if(category !== 'search') {
        return (
            <motion.section key={`${router.asPath}newproducts5121`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='catalog'>
                <div className='catalog__body'>
                    <>
                        {category === 'news' && newProducts.length >= 1 && (
                            <>
                                {more ? (
                                    <h2 className='catalog__title'>{categoryTitle}</h2>
                                ) : ''}
                                <div className='catalog__content'>
                                    {
                                    newProducts.map(product => (
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
                                    ))
                                    }
                                </div>
                                {more ? (
                                    <Link href="/c/news" className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ</Link>
                                ) : ''}
                            </>
                        )}
                        
                        {category !== 'news' && productsByCategory.length >= 1 ? (
                            <>
                                {more ? (
                                    <h2 className='catalog__title'>{categoryTitle}</h2>
                                ) : ''}
                                <div className='catalog__content'>
                                {
                                    !subcategory ? (productsByCategory.map(product => (
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
                                    ))) : (productsBySubcategory.map(product => (
                                        <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
                                    )))
                                }
                                </div>
                                {more ? (
                                    <Link href={`/c/${categorySlug}`} className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ</Link>
                                ) : ''}
                            </>
                        ) : ""}

                        {subcategory && category !== 'news' && category !== 'search' && productsBySubcategory.length === 0 ? (
                            <h2 className='catalog__title center'>Ничего не найдено.</h2>
                        ) : ""}
                        
                        {!subcategory && category !== 'news' && category !== 'search' && productsByCategory.length === 0 ? (
                            <h2 className='catalog__title center'>Ничего не найдено.</h2>
                        ) : ""}
                    </>
                </div>
            </motion.section>
        )
    } else {
        return (
            <>
                <motion.section key={`${router.asPath}top`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.top}>
                    <h1 className={styles.title}>ПОИСК</h1>
                    <form className={styles.search}>
                        <input type="text" placeholder='Поиск' value={search} onInput={(e) => {handleSearch(e)}}className={styles.input}/>
                    </form>
                </motion.section>
                <div className='catalog__body'>
                    <div className='catalog__content'>
                        {productsBySearch.length !== 0 ? (
                            productsBySearch.map(product => (
                                <Product key={product._id} id={product._id} img={product.images[0]?.url} title={product.title} price={product.price} data={product.created_at} vip={product.vip}/>
                            ))
                        ) : <h2 className='catalog__title center'>Ничего не найдено.</h2>}
                    </div>
                </div>
            </>
        )
    }
    
}
 
export default Catalog