/**
 * loading.tsx — root loading UI.
 * Shown as a fallback while any page-level async segment is loading.
 * Displayed instantly (no layout shift) because it's pre-rendered.
 */

export default function GlobalLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="h-9 w-9 rounded-full border-[3px] border-emerald-200 border-t-emerald-600 animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    </div>
  );
}
