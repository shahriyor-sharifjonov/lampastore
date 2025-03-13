import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import Image from 'next/image'

export default function Loader() {
    const router = useRouter()
    const loading = useSelector((state) => state.loading)
    const categories = useSelector((state) => state.categories)
    const products = useSelector((state) => state.products)
    const dispatch = useDispatch()
  
    useEffect(() => {
        const handleStart = (url) => {
            if (url !== router.asPath) {
                dispatch(setLoading(true))
            }
        };
        
        const handleComplete = (url) => {
            if (url === router.asPath) {
                setTimeout(() => {
                    if(products.length !== 0 && categories.length !== 0){
                        dispatch(setLoading(false))
                    }
                }, 500)
            }else{
            }
        };
  
        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)
    
        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        };
    }, [dispatch, router, categories, products])
  
    useEffect(() => {
        if (loading.value === false || loading.value === 404) {
            setTimeout(() => {
                if(products.length !== 0 && categories.length !== 0){
                    document.querySelector('.loading').classList.remove('active')
                }
            }, 1000)
        }
    }, [loading, categories, products])
  
    return (
      <div className={`loading active ${loading.value ? 'active' : ''}`}>
        <Image src="/loading.svg" alt="loading" width={100} height={100} draggable={false}></Image>
      </div>
    )
}