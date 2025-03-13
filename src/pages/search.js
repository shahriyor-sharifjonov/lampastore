
import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'

import { useRouter } from 'next/router'
import Catalog from '@/components/Catalog/Catalog'

export default function Search() {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор</title>
                <meta name="description" content="Lampa-store.ru - дизайнерское освещение, мебель, сантехника и декор" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Catalog categoryTitle={'ПОИСК'} category={'search'} more={false}/>
        </>
    )
}
