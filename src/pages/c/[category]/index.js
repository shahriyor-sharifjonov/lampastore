import Head from 'next/head'
import Top from '@/components/Top/Top'
import FourOhFour from '@/pages/404'
import Catalog from '@/components/Catalog/Catalog'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function CategoryPage({ category, subcategory, products }) {
  const router = useRouter()

  if (!category) return <FourOhFour />

  return (
    <>
      <Head>
        <title>{category.name} | Lampa-store.ru</title>
        <meta name="description" content={`Категория: ${category.name}. Дизайнерская мебель, освещение и сантехника.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Top category={category} subcategory={subcategory} />

      <motion.section
        key={router.asPath}
        transition={{ duration: 0.5, delay: 0.5, easings: 'linear' }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="catalog"
      >
        <Catalog
          categorySlug={category.slug}
          categoryTitle={category.name}
          category={category._id}
          subcategory={subcategory?.name}
          subcategorySlug={subcategory?.slug}
          filter={true}
          more={false}
          products={products}
        />
      </motion.section>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const API = process.env.NEXT_PUBLIC_NEXTAUTH_URL

  const categorySlug = params.category
  const subcategorySlug = params.subcategory?.[0] || null

  try {
    const categoriesRes = await fetch(`${API}/api/categories`)
    const categories = categoriesRes.ok ? await categoriesRes.json() : []

    const category = categories.find((cat) => cat.slug === categorySlug)
    if (!category) return { props: { category: null } }

    let subcategory = null
    if (subcategorySlug) {
      subcategory = category.subcategories?.find((sub) => sub.slug === subcategorySlug) || null
    }

    const query = subcategory
      ? `/api/products?subcategory=${subcategorySlug}`
      : `/api/products?category=${category._id}`

    const productsRes = await fetch(`${API}${query}`)
    const products = productsRes.ok ? await productsRes.json() : []

    return {
      props: {
        category,
        subcategory,
        products,
      },
    }
  } catch (error) {
    console.error('Category page error:', error)
    return { props: { category: null } }
  }
}
