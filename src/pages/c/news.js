import Footer from '@/components/Footer/Footer'
import NewProducts from '@/components/Catalog/Catalog'
import Top from '@/components/Top/Top'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Product from '@/components/Product/Product'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import FourOhFour from '@/pages/404'
import { useRouter } from 'next/router'
import Catalog from '@/components/Catalog/Catalog'


export default function Home() {
  const loading = useSelector((state) => state.loading)
  const router = useRouter()
  return (
    <>
        <Head>
            <title>Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор</title>
            <meta name="description" content="Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Top news={true}/>
        <motion.section key={`${router.asPath}categorycatalog`} transition={{duration: 0.5, delay: 0.5, easings: "linear"}} exit={{opacity: 0}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='catalog'>
          <Catalog categoryTitle={'НОВИНКИ'} category={'news'} more={false} filter={true}/>
        </motion.section>
    </>
  )
}
