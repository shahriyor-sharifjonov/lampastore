import React, { useState, useEffect } from 'react'
import Top from '@/components/Top/Top'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { setLoading } from '@/store/slices/loadingSlice'
import { useSelector, useDispatch } from 'react-redux'
import FourOhFour from '@/pages/404'
import { useRouter } from 'next/router'
import Catalog from '@/components/Catalog/Catalog'

export default function Home() {
  const categories = useSelector((state) => state.categories)
  const loading = useSelector((state) => state.loading)
  const router = useRouter()
  const dispatch = useDispatch()
  const [category, setCategory] = useState({})
  const [subcategory, setSubCategory] = useState({})

  useEffect(() => {
    setCategory(categories.find(category => category.slug === router.query.category))
    if(router.query.subcategory){
      setSubCategory(category?.subcategories?.find(sub => sub.slug === router.query.subcategory))
    }
  }, [router, categories, category, subcategory])

  useEffect(() => {
    dispatch(setLoading(true));
    if(category?.name){
      dispatch(setLoading(false));
    }
    if(category === undefined){
      dispatch(setLoading(404));
    }
  }, [category])

  return (
    <>
      <Head>
        <title>Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор</title>
        <meta name="description" content="Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading.value !== 404 ? (
        <>
          <Top category={category} subcategory={subcategory} />
          <Catalog key={category?._id} categorySlug={category?.slug} categoryTitle={category?.name} category={category?._id} more={false} subcategory={subcategory?.name} subcategorySlug={subcategory?.slug} filter={true}/>
        </>
      ) : (
        <FourOhFour />
      )}
    </>
  )
}