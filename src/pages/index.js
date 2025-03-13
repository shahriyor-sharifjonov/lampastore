import Intro from '@/components/Intro/Intro'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '@/components/Footer/Footer'
import Catalog from '@/components/Catalog/Catalog'
import { useSelector, useDispatch } from 'react-redux'

export default function Home({categories}) {
  return (
    <> 
      <Head>
        <title>Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор</title>
        <meta name="description" content="Компания Lampastore работает с 2016 года и предлагает коллекции дизайнерской мебели, освещение, аксессуары для оформления жилых и коммерческих помещений и всевозможную сантехнику. Мы являемся эксклюзивным дистрибьютером многих брендов в России, а также поставляем продукцию из других стран Азии и Европы. Модели, которые мы подбираем, отвечают современным тенденциям и сочетают в себе актуальные материалы, линии и формы." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="yandex-verification" content="88ce5f5a0b0d9b68" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* <Intro /> */}
      <Catalog categoryTitle={'НОВИНКИ'} category={'news'} more={true} filter={false}/>
      {categories.map(cat => (
        <Catalog key={cat._id} categorySlug={cat.slug} categoryTitle={cat.name} category={cat._id} more={true}/>
      ))}
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/categories`);
    if (!response.ok) {
      throw new Error('Categories not found');
    }
    const categories = await response.json();

    return {
      props: {
        categories: categories, 
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        categories: null,
      },
    };
  }
}