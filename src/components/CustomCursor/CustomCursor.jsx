import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.scss';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const beforeRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const before = beforeRef.current;

    const onMouseMove = (e) => {
        const vw = window.innerWidth / 100;;

        const xValue = e.clientX + (0 * vw);
        const yValue = e.clientY + (0 * vw);

        const xValue2 = e.clientX + (-1 * vw);
        const yValue2 = e.clientY + (-1 * vw);

        gsap.to(cursor, {
            duration: 0.2,
            x: xValue,
            y: yValue,
            ease: 'power3.out',
        });

        gsap.to(before, {
            duration: 1,
            x: xValue2,
            y: yValue2,
            ease: 'power3.out',
        });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, {
        duration: 0.2,
        scale: 1.5,
        opacity: 0.5,
        ease: 'power3.out',
      });
      gsap.to(before, {
        duration: 0.2,
        scale: 1.5,
        opacity: 0.5,
        ease: 'power3.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, {
        duration: 0.2,
        scale: 1,
        opacity: 1,
        ease: 'power3.out',
      });
      gsap.to(before, {
        duration: 0.2,
        scale: 1,
        opacity: 1,
        ease: 'power3.out',
      });
    };

    const onCursorDown = () => {
      gsap.to(cursor, {
        duration: 0.2,
        scale: 0.7,
        ease: 'power3.out',
      });
      gsap.to(before, {
        duration: 0.2,
        scale: 0.7,
        ease: 'power3.out',
      });
    };

    const onCursorUp = () => {
      gsap.to(cursor, {
        duration: 0.2,
        scale: 1,
        ease: 'power3.out',
      });
      gsap.to(before, {
        duration: 0.2,
        scale: 1,
        ease: 'power3.out',
      });
    };

    const clickableElements = document.querySelectorAll('a, button, input, textarea, select, label');

    clickableElements.forEach((element) => {
      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onCursorDown);
    document.addEventListener('mouseup', onCursorUp);

    if (window.matchMedia('(pointer: coarse)').matches) {
        // Remove the event listeners for the cursor
        document.removeEventListener('mousemove', onMouseMove);
        clickableElements.forEach((element) => {
          element.removeEventListener('mouseenter', onMouseEnter);
          element.removeEventListener('mouseleave', onMouseLeave);
        });
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onCursorDown);
      document.removeEventListener('mouseup', onCursorUp);
      clickableElements.forEach((element) => {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.cursor} ref={cursorRef}></div>
      <div className={styles.cursorBefore} ref={beforeRef}></div>
    </div>
  );
};

export default CustomCursor;
