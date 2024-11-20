import Header from '@/components/Header/Header'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { SessionProvider, useSession } from 'next-auth/react'
import { useSelector, useDispatch } from 'react-redux'
import '@/styles/globals.scss'
import { store } from '@/store/index'
import Router, { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '@/components/Footer/Footer'
import FourOhFour from './404'
import Loader from '@/components/Loader/Loader'
import { setLoading } from '@/store/slices/loadingSlice'
import Script from 'next/script'
import Head from 'next/head'


export default function App({ Component, pageProps: { session, ...pageProps } }) {  
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <AnimatePresence mode='wait'>
          <Loader key='loader'/>
          <div className='wrapper'>
            <Header />
            <main>
              {Component.auth ? (
                <Auth>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </main>
            <Footer />
          </div>
        </AnimatePresence>
        <Script id="yandex">
          {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(96090585, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `}
        </Script>
      </SessionProvider>
    </Provider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true })
  const role = children.type.auth.role || 'user';
  const router = useRouter()
  const dispatch = useDispatch()

  if (status === "loading") {
    return ''
  } else {

  }

  if (role){
    if(role === 'admin'){
      if(session.user.role){
        if(session.user.role === 'admin'){
          return children
        }else{
          return <FourOhFour />
        }
      } else{
        return <FourOhFour />
      }
    }
  } 
  return children
}
