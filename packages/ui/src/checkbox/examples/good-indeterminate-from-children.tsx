import { Checkbox } from "../checkbox";

// The prototype indents its children by a literal 26px — between the ramp's
// own Space-22 and Space-32 steps with nothing to snap to (docs/prd.md
// §8.3 only documents a snap table up to 20). `pl-32` stands in as the
// nearer token-backed step, illustrating the pattern rather than
// reproducing the exact figure.
export function CheckboxGoodIndeterminateFromChildrenExample() {
  return (
    <div className="flex flex-col gap-12">
      <Checkbox label="All workspaces" indeterminate />
      <div className="flex flex-col gap-12 pl-32">
        <Checkbox label="Fleet" defaultChecked />
        <Checkbox label="Research" />
      </div>
    </div>
  );
}
