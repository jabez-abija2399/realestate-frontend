import * as React from 'react';

/**
 * useLocalStorage — NOT used for app state (per spec).
 * Only for non-sensitive UI preferences: e.g. dismissed banners, theme.
 *
 * Usage:
 *   const [dismissed, setDismissed] = useLocalStorage('banner-dismissed', false);
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value: T) {
    try {
      setStored(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Silently fail — localStorage may be blocked
    }
  }

  return [stored, setValue];
}
