import { Loading, LoadingSkeletonLine } from "../loading";

// Never generic grey slabs (Loading Do and don't) — uniform bars with no
// leading column lie about the real row shape, which is exactly the jump a
// skeleton exists to prevent.
export function LoadingBadGenericslabsExample() {
  return (
    <Loading variant="skeleton">
      <LoadingSkeletonLine className="h-22 w-full" />
      <LoadingSkeletonLine className="h-22 w-full" />
    </Loading>
  );
}
