import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const Product = ({ id, img, title, price, data, vip }) => {
    const [isDataOld, setIsDataOld] = useState(false);

    useEffect(() => {
        const checkDataAge = () => {
            const dataCreationDate = new Date(data);
            const currentDate = new Date();
            const timeDifferenceInMilliseconds = currentDate - dataCreationDate;
            const timeDifferenceInDays = Math.floor(
                timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
            );
        
            if (timeDifferenceInDays >= 2) {
                setIsDataOld(true);
            } else {
                setIsDataOld(false);
            }
        };
    
        checkDataAge();
    }, []);

    return (
        <Link href={`/product/${id}`} className='product'>
            <div className='product__top'>
                {img ? (
                    <img src={img} alt="" width={344} height={344} draggable="false"/>
                ) : (
                    <img src="/noimage.png" alt="" width={344} height={344} draggable="false"/>
                )}
                {isDataOld ? "" : (
                    <div className='product__badge'>
                        <svg width="34" height="10" viewBox="0 0 34 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.2822 0.857999H8.5002V10H7.3942L1.5842 2.986H1.5702V10H0.352203V0.857999H1.4582L7.2682 7.872H7.2822V0.857999ZM16.8053 4.652V5.73H13.1093V8.922H19.5633V10H11.8913V0.857999H19.2413V1.936H13.1093V4.652H16.8053ZM20.8484 0.857999H22.1784L24.4464 8.166H24.5164L26.8544 0.857999H27.7784L30.1164 8.166H30.2004L32.4684 0.857999H33.7284L30.7884 10H29.5424L27.3304 3.14H27.2464L25.0344 10H23.7884L20.8484 0.857999Z" fill="black"/>
                        </svg>
                    </div>
                )}
                {/* {vip ? (
                    <div className='product__badge left'>
                        <svg width="25" height="10" viewBox="0 0 25 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.46713 0.857999H9.78313L5.52713 10H4.39313L0.137125 0.857999H1.50913L4.95313 8.474H5.03713L8.46713 0.857999ZM13.1288 10H11.9108V0.857999H13.1288V10ZM17.7362 10H16.5182V0.857999H21.4602C22.5802 0.857999 23.4342 1.166 24.0222 1.782C24.4889 2.29533 24.7222 2.88333 24.7222 3.546C24.7222 4.29267 24.4516 4.92267 23.9102 5.436C23.3316 5.996 22.5149 6.276 21.4602 6.276H17.7362V10ZM21.4602 1.936H17.7362V5.198H21.4602C22.1416 5.198 22.6642 5.02533 23.0282 4.68C23.3549 4.372 23.5182 3.99867 23.5182 3.56C23.5182 3.168 23.3736 2.81333 23.0842 2.496C22.7296 2.12267 22.1882 1.936 21.4602 1.936Z" fill="black"/>
                        </svg>
                    </div>
                ) : ''} */}
            </div>
            <div className='product__info'>
                <p className='product__info-title'>{title}</p>
                <p className='product__info-p'>{Number(price).toLocaleString()} ₽</p>
            </div>
        </Link>
    )
}

export default Product