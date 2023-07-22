import React from 'react'
import styles from '@/styles/modules/Signin.module.scss'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

const Signin = () => {
    const { data: session, status } = useSession()
    return (
        <div className={styles.signin}>
            {session?.customUser?.role === 'admin' ? (
                <p className={styles.p}>Вы уже зарегистрированы</p>
            ) : <button onClick={() => signIn("yandex")} className={styles.btn}>Sign In</button>}
        </div>
    )
}

export default Signin