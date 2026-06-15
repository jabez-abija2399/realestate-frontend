import * as React from 'react';

/**
 * useIntersectionObserver — fires a callback when an element enters
 * or leaves the viewport. Used for infinite scroll and lazy loading.
 *
 * Usage:
 *   const ref = useIntersectionObserver(() => fetchNextPage(), { threshold: 0.1 });
 *   <div ref={ref} />
 */
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
): React.RefCallback<Element> {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  const observerRef = React.useRef<IntersectionObserver | null>(null);

  return React.useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) callbackRef.current();
      }, options);

      observerRef.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.threshold, options.root, options.rootMargin]
  );
}
