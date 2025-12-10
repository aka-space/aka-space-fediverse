import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
    const elementRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const elements = elementRefs.current.filter(Boolean);

        elements.forEach((element, index) => {
            if (!element) return;

            gsap.set(element, {
                opacity: 0,
                y: 50,
                scale: 0.95,
            });

            ScrollTrigger.create({
                trigger: element,
                start: 'top bottom-=100',
                end: 'bottom top',
                onEnter: () => {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'power2.out',
                    });
                },
                once: true,
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !elementRefs.current.includes(el)) {
            elementRefs.current.push(el);
        }
    };

    return { addToRefs };
};
