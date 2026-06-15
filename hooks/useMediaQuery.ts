import * as React from 'react';

/**
 * useMediaQuery — returns true when the given CSS media query matches.
 * SSR-safe: defaults to false on the server.
 *
 * Usage:
 *   const isDesktop = useMediaQuery('(min-width: 1024px)');
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
