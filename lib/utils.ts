/**
 * Minimal className combiner — joins truthy class strings together.
 * If you already have shadcn/ui's `cn` (clsx + tailwind-merge), you can
 * delete this file and keep using that one instead; the components below
 * only rely on the same `cn(...)` signature.
 */
export function cn(...inputs: Array<string | undefined | null | false>) {
  return inputs.filter(Boolean).join(' ');
}
