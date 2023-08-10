import Intro from '@/components/Intro/Intro'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '@/components/Footer/Footer'
import Catalog from '@/components/Catalog/Catalog'
import { useSelector, useDispatch } from 'react-redux'


export default function Home() {
  const categories = useSelector((state) => state.categories)
  return (
    <>
      <Head>
        <title>Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор</title>
        <meta name="description" content="Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Intro />
      <Catalog categoryTitle={'НОВИНКИ'} category={'news'} more={true} filter={false}/>
      {categories.map(cat => (
        <Catalog key={cat._id} categorySlug={cat.slug} categoryTitle={cat.name} category={cat._id} more={true}/>
      ))}
    </>
  )
}
