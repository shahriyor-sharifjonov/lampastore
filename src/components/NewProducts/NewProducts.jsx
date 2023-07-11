import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Product from '../Product/Product'

const NewProducts = () => {
    return (
        <section className='catalog'>
            <div className='catalog__body'>
                <h2 className='catalog__title'>НОВИНКИ</h2>
                <div className='catalog__content'>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="CRATA" price="14 600₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                    <Product img="product-1" title="EVIAN ONE" price="12 800₽"/>
                </div>
            </div>
        </section>
    )
}
 
export default NewProducts