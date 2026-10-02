import { Textarea } from "../textarea";

const SENTENCE = "A very long reason that runs past the limit and keeps going. ";
const REASON = SENTENCE.repeat(Math.ceil(528 / SENTENCE.length)).slice(0, 528);

export function TextareaGoodCounterOverLimitExample() {
  return <Textarea label="Why it was skipped" defaultValue={REASON} limit={512} />;
}
