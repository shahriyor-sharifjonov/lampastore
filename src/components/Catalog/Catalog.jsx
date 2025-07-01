import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import styles from '@/components/Top/Top.module.scss'

const Catalog = ({
                     categoryTitle,
                     category,
                     more,
                     categorySlug,
                     subcategory,
                     subcategorySlug,
                     filter,
                     products: propProducts = [],
                 }) => {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        let products = [...propProducts]

        // VIP в начало
        products.sort((a, b) => {
            if (a.vip && !b.vip) return -1
            if (!a.vip && b.vip) return 1
            return 0
        })

        // NEWS
        if (category === 'news') {
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            if (more) products = products.slice(0, 10)
            setFilteredProducts(products)
            return
        }

        // CATEGORY / SUBCATEGORY / PRICE FILTER
        if (filter) {
            const min = filter.minPrice ? Number(filter.minPrice) : 0
            const max = filter.maxPrice ? Number(filter.maxPrice) : Infinity
            products = products.filter(
              (p) => Number(p.price) >= min && Number(p.price) <= max
            )
        }

        if (subcategorySlug) {
            products = products.filter((p) => p.subcategory === subcategorySlug)
        }

        if (more) {
            products = products.slice(0, 10)
        }

        setFilteredProducts(products)
    }, [propProducts, category, subcategorySlug, more, filter])

    useEffect(() => {
        if (category === 'search') {
            if (search.length > 0) {
                const searchLower = search.toLowerCase()
                const matches = propProducts.filter((p) => {
                    const titleMatch = p.title.toLowerCase().includes(searchLower)
                    const numMatch = !isNaN(search) && p.num?.toString() === search
                    return titleMatch || numMatch
                })
                setFilteredProducts(matches)
            } else {
                setFilteredProducts([])
            }
        }
    }, [search, propProducts, category])

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    if (category === 'search') {
        return (
          <>
              <motion.section
                key={`${router.asPath}top`}
                transition={{ duration: 0.5, delay: 0.5, easings: 'linear' }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.top}
              >
                  <h1 className={styles.title}>ПОИСК</h1>
                  <form className={styles.search}>
                      <input
                        type="text"
                        placeholder="Поиск"
                        value={search}
                        onInput={handleSearch}
                        className={styles.input}
                      />
                  </form>
              </motion.section>
              <div className="catalog__body">
                  <div className="catalog__content">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <Product
                            key={product._id}
                            id={product._id}
                            img={product.images[0]?.url}
                            title={product.title}
                            price={product.price}
                            data={product.created_at}
                            vip={product.vip}
                          />
                        ))
                      ) : (
                        <h2 className="catalog__title center">Ничего не найдено.</h2>
                      )}
                  </div>
              </div>
          </>
        )
    }

    return (
      <motion.section
        key={`${router.asPath}catalog`}
        transition={{ duration: 0.5, delay: 0.5, easings: 'linear' }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="catalog"
      >
          <div className="catalog__body">
              {filteredProducts.length > 0 ? (
                <>
                    {more && <h2 className="catalog__title">{categoryTitle}</h2>}
                    <div className="catalog__content">
                        {filteredProducts.map((product) => (
                          <Product
                            key={product._id}
                            id={product._id}
                            img={product.images[0]?.url}
                            title={product.title}
                            price={product.price}
                            data={product.created_at}
                            vip={product.vip}
                          />
                        ))}
                    </div>
                    {more && (
                      <Link
                        href={
                            category === 'news'
                              ? '/c/news'
                              : `/c/${categorySlug || category}`
                        }
                        className="catalog__btn"
                      >
                          ПОСМОТРЕТЬ ВСЕ
                      </Link>
                    )}
                </>
              ) : (
                <h2 className="catalog__title center">Ничего не найдено.</h2>
              )}
          </div>
      </motion.section>
    )
}

export default Catalog