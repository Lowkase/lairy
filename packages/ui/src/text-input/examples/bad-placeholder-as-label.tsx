// No TextInput here on purpose: the real component always renders a real
// <label> (Text input anatomy #1, Content rule 1) and has no way to omit
// it, so this misuse — a placeholder standing in for the label — can't be
// produced by the real component. Built from a raw <input> sharing the
// shipped field's own classes instead, the same treatment scrollbar.ts's
// bad-widened.tsx and usage-card.ts's bad-single.tsx give a misuse their
// real component can't produce.
export function TextInputBadPlaceholderAsLabelExample() {
  return (
    <input
      type="text"
      placeholder="Pipeline name"
      className="block w-full rounded-ds border border-border bg-bg px-12 py-8 font-body text-body text-fg placeholder:text-mute"
    />
  );
}
