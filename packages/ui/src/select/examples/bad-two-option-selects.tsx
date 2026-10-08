import { Select } from "../select";

/** Anti-pattern: two selects that each hold two options — two radio groups
 * paying rent on a click each. Kept as a bad example only. */
export function SelectBadTwoOptionSelectsExample() {
  return (
    <div className="flex flex-col gap-12">
      <Select
        label="Scope"
        defaultValue="every"
        options={[
          { value: "every", label: "Every stage" },
          { value: "failures", label: "Failures only" },
        ]}
      />
      <Select
        label="Order"
        defaultValue="newest"
        options={[
          { value: "newest", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
        ]}
      />
    </div>
  );
}
