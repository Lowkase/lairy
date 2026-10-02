import { Card } from "../card";

export function CardBadCrowdedExample() {
  return (
    <Card
      kind="stat"
      label="Open items"
      value="32"
      unit={
        <span className="flex flex-wrap gap-12">
          <span>of 33</span>
          <span>4 today</span>
          <span>91% closed</span>
          <span>12 owners</span>
        </span>
      }
    />
  );
}
