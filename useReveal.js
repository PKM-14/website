import { useEffect, useRef } from 'react';

/**
 * useReveal — attaches an IntersectionObserver that adds `.in` to elements
 * with the `.reveal` class once they enter the viewport.
 * Singleton observer, cleaned up on unmount.
 */
export function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef?.current ?? document;
    const targets = root.querySelectorAll?.('.reveal');
    if (!targets || targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [rootRef]);
}
