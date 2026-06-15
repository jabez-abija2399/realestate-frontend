import * as React from 'react';

/**
 * useDebounce — returns a debounced copy of `value` that only updates
 * after `delay` milliseconds of inactivity.
 *
 * Usage:
 *   const debouncedQuery = useDebounce(query, 350);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
