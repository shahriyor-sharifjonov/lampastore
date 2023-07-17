
import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'

export default function Loader() {
    const router = useRouter();
    const loading = useSelector((state) => state.loading);
    const dispatch = useDispatch();
  
    useEffect(() => {
        const handleStart = (url) => {
            if (url !== router.asPath) {
            dispatch(setLoading(true));
            }
        };
        
        const handleComplete = (url) => {
            if (url === router.asPath) {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 500);
            }else{
                console.log(router.asPath);
            }
        };
  
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
    
        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [dispatch, router]);
  
    useEffect(() => {
      if (loading.value === false || loading.value === 404) {
        document.querySelector('.loading').classList.remove('active');
      } 
    }, [loading]);
  
    return (
      <div className={`loading active ${loading.value ? 'active' : ''}`}></div>
    );
};