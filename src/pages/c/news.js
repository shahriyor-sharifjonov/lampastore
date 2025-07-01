import Footer from '@/components/Footer/Footer'
import Top from '@/components/Top/Top'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Catalog from '@/components/Catalog/Catalog'
import { useRouter } from 'next/router'

export default function NewsPage({ news }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Новинки | Lampa-store.ru</title>
        <meta
          name="description"
          content="Последние новинки дизайнерского освещения, мебели, сантехники и декора от Lampa-store.ru"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Top news={true} />

      <motion.section
        key={`${router.asPath}categorycatalog`}
        transition={{ duration: 0.5, delay: 0.5, easings: 'linear' }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="catalog"
      >
        <Catalog
          categoryTitle={'НОВИНКИ'}
          category={'news'}
          more={false}
          filter={true}
          products={news} // <-- передаём новинки напрямую
        />
      </motion.section>
    </>
  )
}

export async function getServerSideProps() {
  const API = process.env.NEXT_PUBLIC_NEXTAUTH_URL

  try {
    const res = await fetch(`${API}/api/products?limit=30`)
    const news = res.ok ? await res.json() : []

    return {
      props: {
        news,
      },
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    return {
      props: {
        news: [],
      },
    }
  }
}
