import { Loading, LoadingSkeletonLine } from "../loading";

export function LoadingGoodMatchedgeometryExample() {
  return (
    <Loading variant="skeleton">
      <div className="flex items-center gap-8">
        <LoadingSkeletonLine className="w-44 shrink-0" />
        <LoadingSkeletonLine className="flex-1" />
      </div>
      <div className="flex items-center gap-8">
        <LoadingSkeletonLine className="w-44 shrink-0" />
        <LoadingSkeletonLine className="flex-1" />
      </div>
      <div className="flex items-center gap-8">
        <LoadingSkeletonLine className="w-44 shrink-0" />
        <LoadingSkeletonLine className="flex-1" />
      </div>
    </Loading>
  );
}
