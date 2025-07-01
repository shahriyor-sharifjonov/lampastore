import Head from 'next/head'
import Catalog from '@/components/Catalog/Catalog'
import { useRouter } from 'next/router'

export default function SearchPage({ products }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Поиск | Lampa-store.ru</title>
        <meta name="description" content="Результаты поиска по товарам Lampa-store.ru" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Catalog
        categoryTitle="ПОИСК"
        category="search"
        more={false}
        products={products}
      />
    </>
  )
}

export async function getServerSideProps({ query }) {
  const API = process.env.NEXT_PUBLIC_NEXTAUTH_URL
  const search = query.q || ''

  if (!search || search.length < 2) {
    return {
      props: {
        products: [],
      },
    }
  }

  try {
    const res = await fetch(`${API}/api/products/search?q=${encodeURIComponent(search)}`)
    const products = res.ok ? await res.json() : []

    return {
      props: {
        products,
      },
    }
  } catch (error) {
    console.error('Search error:', error)
    return {
      props: {
        products: [],
      },
    }
  }
}
