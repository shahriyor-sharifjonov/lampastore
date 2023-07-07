import Header from '@/components/Header/Header'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import '@/styles/globals.scss'
import { store } from '@/store/index'
import { useSelector, useDispatch } from 'react-redux'
import Router, { useRouter } from 'next/router'
import { setLoading } from '@/store/slices/loadingSlice'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '@/components/Footer/Footer'


export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Provider store={store}>
      <AnimatePresence mode='wait'>
        <Loader />
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </AnimatePresence>
    </Provider>
  );
}

const Loader = () => {
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
    if (loading.value === false) {
      document.querySelector('.loading').classList.remove('active');
    }
  }, [loading]);

  return (
    <div className={`loading active ${loading.value ? 'active' : ''}`}></div>
  );
};