import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.3,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

      // Set initial states - start more visible
      gsap.set(el, { 
        transformOrigin: '0% 50%', 
        rotate: baseRotation,
        y: 30,
        scale: 0.95
      });
      
      const wordElements = el.querySelectorAll('.word');
      
      // Set initial opacity higher for better visibility
      gsap.set(wordElements, { 
        opacity: Math.max(baseOpacity, 0.7), 
        y: 20,
        scale: 0.95,
        willChange: 'opacity, transform, filter',
        filter: enableBlur ? `blur(${blurStrength * 0.6}px)` : 'blur(0px)'
      });

      // Container rotation and position animation
      gsap.to(el, {
        ease: 'power2.out',
        rotate: 0,
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });

      // Opacity and transform animation with stagger
      gsap.to(wordElements, {
        ease: 'power2.out',
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: {
          amount: 0.3,
          from: 'start'
        },
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=15%',
          end: wordAnimationEnd,
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });

      // Blur animation with stagger
      if (enableBlur) {
        gsap.to(wordElements, {
          ease: 'power2.out',
          filter: 'blur(0px)',
          stagger: {
            amount: 0.3,
            from: 'start'
          },
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=15%',
            end: wordAnimationEnd,
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        });
      }

      // Refresh ScrollTrigger after a short delay to ensure proper initialization
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
