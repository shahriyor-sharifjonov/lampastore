import Head from 'next/head'
import Catalog from '@/components/Catalog/Catalog'

export default function Home({ categories, newsProducts }) {
  const meta = {
    title: 'Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор',
    description:
      'Компания Lampastore работает с 2016 года и предлагает коллекции дизайнерской мебели, освещение, аксессуары для оформления жилых и коммерческих помещений и всевозможную сантехнику. Мы являемся эксклюзивным дистрибьютером многих брендов в России, а также поставляем продукцию из других стран Азии и Европы. Модели, которые мы подбираем, отвечают современным тенденциям и сочетают в себе актуальные материалы, линии и формы.',
    favicon: '/favicon.png',
    yandexVerification: '88ce5f5a0b0d9b68',
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="yandex-verification" content={meta.yandexVerification} />
        <link rel="icon" href={meta.favicon} />
      </Head>

      {/* <Intro /> — если нужен, раскомментируй */}
      {/*<Catalog*/}
      {/*  categoryTitle="НОВИНКИ"*/}
      {/*  category="news"*/}
      {/*  more={true}*/}
      {/*  filter={false}*/}
      {/*  products={newsProducts}*/}
      {/*/>*/}

      {categories?.map((cat) => (
        <Catalog
          key={cat._id}
          categorySlug={cat.slug}
          categoryTitle={cat.name}
          category={cat._id}
          products={cat.products}
          more={true}
        />
      ))}
    </>
  )
}

export async function getServerSideProps() {
  const API = process.env.NEXT_PUBLIC_NEXTAUTH_URL

  const fetchData = async (endpoint) => {
    try {
      const res = await fetch(`${API}${endpoint}`)
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
      return await res.json()
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      return null
    }
  }

  const categories = (await fetchData('/api/categories')) || []

  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const products = await fetchData(`/api/products?category=${cat._id}&limit=10`)
      return {
        ...cat,
        products: products || [],
      }
    })
  )

  const newsProducts = (await fetchData('/api/products?limit=10')) || []

  return {
    props: {
      categories: categoriesWithProducts,
      newsProducts,
    },
  }
}
