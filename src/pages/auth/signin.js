import React, { useState } from 'react'
import styles from '@/styles/modules/Signin.module.scss'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '@/store/slices/loadingSlice'
import { useRouter } from 'next/router'

const Signin = () => {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const router = useRouter()
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        // dispatch(setLoading(true))
 
        try {
            const res = await signIn("credentials", {
                email, 
                password,
                redirect: false,
            })

            if(res.error) {
                setError(res.error)
                // setError("Неправильный пароль или номер телефона")
                dispatch(setLoading(false))
                return 
            }

            dispatch(setLoading(false))
            // router.replace('admin')
        } catch (error) {
            console.log(error);
            setError("Что-то пошло не так.")
            dispatch(setLoading(false))
        }
    }

    return (
        <div className={styles.signin}>
            {session?.user?.role === 'admin' ? (
                <p className={styles.p}>Вы уже зарегистрированы</p>
            ) : (
                <div className={styles.form}>
                    <input type="email" placeholder='Имейл' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && (
                        <p className={styles.error}>{error}</p>
                    )}
                    <button onClick={handleSubmit} className={styles.btn}>Вход</button>
                    {/* <span>или</span>
                    <button onClick={() => signIn("yandex")} className={styles.btn}>Вход через Яндекс</button> */}
                </div>
            )}
        </div>
    )
}

export default Signin