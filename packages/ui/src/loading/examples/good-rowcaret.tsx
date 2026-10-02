import { Loading } from "../loading";

export function LoadingGoodRowcaretExample() {
  return (
    <div className="flex items-center justify-between gap-16 border border-border p-12">
      <span className="text-small text-dim">AUT·02</span>
      <Loading variant="inline-caret" phase="syncing" />
    </div>
  );
}
