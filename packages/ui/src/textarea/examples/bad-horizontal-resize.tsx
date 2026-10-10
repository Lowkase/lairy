// No Textarea here on purpose: the real component only ever renders
// `resize-y` (Textarea anatomy #3, States "no auto-growing variant") and
// has no prop to widen it. Built from a raw <textarea> sharing the shipped
// field's own classes, resize overridden to "both", the same treatment
// text-input.ts's own bad-placeholder-as-label.tsx gives a misuse the real
// component can't produce.
export function TextareaBadHorizontalResizeExample() {
  return (
    <textarea
      aria-label="Reason"
      rows={2}
      defaultValue="Dragged wider than the form."
      className="block w-full rounded-ds border border-border bg-bg px-12 py-8 font-body text-body text-fg"
      style={{ resize: "both", lineHeight: 1.55, width: "140%" }}
    />
  );
}
