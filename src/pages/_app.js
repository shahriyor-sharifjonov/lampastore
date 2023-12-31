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
      if(session.customUser.role){
        if(session.customUser.role === 'admin'){
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