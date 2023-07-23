import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const Product = ({ id, img, title, price, data }) => {
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
                    <Image src={img} alt="" width={344} height={344} draggable="false"/>
                ) : (
                    <Image src="/noimage.png" alt="" width={344} height={344} draggable="false"/>
                )}
                    {isDataOld ? "" : (
                        <div className='product__badge'>
                            <svg width="34" height="10" viewBox="0 0 34 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.2822 0.857999H8.5002V10H7.3942L1.5842 2.986H1.5702V10H0.352203V0.857999H1.4582L7.2682 7.872H7.2822V0.857999ZM16.8053 4.652V5.73H13.1093V8.922H19.5633V10H11.8913V0.857999H19.2413V1.936H13.1093V4.652H16.8053ZM20.8484 0.857999H22.1784L24.4464 8.166H24.5164L26.8544 0.857999H27.7784L30.1164 8.166H30.2004L32.4684 0.857999H33.7284L30.7884 10H29.5424L27.3304 3.14H27.2464L25.0344 10H23.7884L20.8484 0.857999Z" fill="black"/>
                            </svg>
                        </div>
                    )}
            </div>
            <div className='product__info'>
                <p className='product__info-title'>{title}</p>
                <p className='product__info-p'>{price}</p>
            </div>
        </Link>
    )
}

export default Product