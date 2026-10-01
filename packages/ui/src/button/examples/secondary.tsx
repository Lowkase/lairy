import { InlineIcon } from "../../icons";
import { Button } from "../button";

export function ButtonSecondaryExample() {
  return (
    <Button variant="secondary" icon={<InlineIcon name="arrow" />}>
      Run pipeline
    </Button>
  );
}
