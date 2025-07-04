import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import styles from '@/components/Top/Top.module.scss'

let searchTimeout = null

const Catalog = ({
                   categoryTitle,
                   category,
                   more,
                   categorySlug,
                   subcategory,
                   subcategorySlug,
                   filter,
                   products: initialProducts = [],
                   infinite = true,
                 }) => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef()

  const lastProductRef = useRef(null)

  // Поиск товаров (без редакса)
  useEffect(() => {
    if (category === 'search') {
      if (search.trim().length < 2) {
        setProducts([])
        return
      }

      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(async () => {
        setLoading(true)
        try {
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(search)}`)
          const data = await res.json()
          setProducts(data)
        } catch (e) {
          console.error('Search error:', e)
        }
        setLoading(false)
      }, 400)
    }
  }, [search])

  // Infinite Scroll (для категорий/подкатегорий)
  useEffect(() => {
    if (category === 'search' || !hasMore || loading || !infinite) return

    const observerInstance = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1)
      }
    }, { threshold: 0.5 })

    if (lastProductRef.current) {
      observerInstance.observe(lastProductRef.current)
    }

    return () => {
      if (lastProductRef.current) {
        observerInstance.unobserve(lastProductRef.current)
      }
    }
  }, [hasMore, loading, category, products])

  useEffect(() => {
    if (category !== 'search') {
      if (page === 1) {
        setProducts(initialProducts)
        return
      }

      const loadMore = async () => {
        setLoading(true)
        try {
          const base = subcategorySlug
            ? `/api/products?subcategory=${subcategorySlug}`
            : `/api/products?category=${category}`
          const res = await fetch(`${base}&page=${page}&limit=20`)
          const data = await res.json()

          if (data.length < 20) setHasMore(false)
          setProducts((prev) => {
            const existingIds = new Set(prev.map(p => p._id))
            const newProducts = data.filter(p => !existingIds.has(p._id))
            return [...prev, ...newProducts]
          })
        } catch (e) {
          console.error('Pagination error:', e)
        }
        setLoading(false)
      }

      loadMore()
    }
  }, [page])

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
            {loading ? (
              <h2 className="catalog__title center">Загрузка...</h2>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div ref={isLast ? lastProductRef : null} key={product._id}>
                  <Product
                    id={product._id}
                    img={product.images[0]?.url}
                    title={product.title}
                    price={product.price}
                    data={product.created_at}
                    vip={product.vip}
                  />
                </div>
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
        {products.length > 0 ? (
          <>
            {more && <h2 className="catalog__title">{categoryTitle}</h2>}
            <div className="catalog__content">
              {products.map((product, i) => {
                const isLast = i === products.length - 1
                return (
                  <div ref={isLast ? lastProductRef : null} key={product._id}>
                    <Product
                      id={product._id}
                      img={product.images[0]?.url}
                      title={product.title}
                      price={product.price}
                      data={product.created_at}
                      vip={product.vip}
                    />
                  </div>
                )
              })}
            </div>
            {loading && (
              <h2 className="catalog__title center">Загрузка...</h2>
            )}
            {!hasMore && (
              <h2 className="catalog__title center"></h2>
            )}
            {more ? (
              <Link href={`/c/${categorySlug}`} className='catalog__btn'>ПОСМОТРЕТЬ ВСЕ</Link>
            ) : ''}
          </>
        ) : (
          <h2 className="catalog__title center">Ничего не найдено.</h2>
        )}
      </div>
    </motion.section>
  )
}

export default Catalog
