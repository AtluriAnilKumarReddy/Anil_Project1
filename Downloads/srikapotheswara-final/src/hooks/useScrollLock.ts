import { useEffect } from 'react';

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const html = document.documentElement;

    // Get current scroll position
    const scrollY = window.scrollY || window.pageYOffset;

    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    // Lock scroll on both body and html
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollbarWidth}px`;
    body.style.position = 'relative';

    // Also lock html element
    html.style.overflow = 'hidden';

    return () => {
      body.style.overflow = '';
      body.style.paddingRight = '';
      body.style.position = '';
      html.style.overflow = '';
    };
  }, [locked]);
}
