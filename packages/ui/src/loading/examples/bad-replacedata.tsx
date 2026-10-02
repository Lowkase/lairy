import { Loading, LoadingSkeletonLine } from "../loading";

// Never replace data already on screen with skeletons on refresh (Loading Do
// and don't) — the row's real value is gone, and the operator loses what
// they were reading. Inline caret (good-rowcaret.tsx) is the refresh variant
// that keeps it.
export function LoadingBadReplacedataExample() {
  return (
    <div className="flex items-center justify-between gap-16 border border-border p-12">
      <span className="text-small text-dim">AUT·05</span>
      <Loading variant="skeleton">
        <LoadingSkeletonLine className="w-44" />
      </Loading>
    </div>
  );
}
