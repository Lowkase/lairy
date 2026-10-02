// No Textarea here on purpose: the real component omits `maxLength` from
// its props entirely and never wires the native attribute (textarea.ts's
// own extractionNotes), because it silently stops accepting keystrokes at
// the limit with no feedback. Built from a raw <textarea maxlength> to show
// exactly the misuse the real component structurally can't produce.
export function TextareaBadSwallowedKeystrokesExample() {
  return (
    <textarea
      rows={2}
      maxLength={46}
      defaultValue="A very long reason that stops dead at the lim"
      className="block w-full resize-y rounded-ds border border-border bg-bg px-12 py-8 font-body text-body text-fg"
      style={{ lineHeight: 1.55 }}
    />
  );
}
