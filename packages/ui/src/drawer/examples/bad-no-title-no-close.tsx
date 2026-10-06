import { Button } from "../../button/button";
import { Drawer, DrawerBody, DrawerContent, DrawerTitle, DrawerTrigger } from "../drawer";

/** Do and don't, pair 3 (bad): never open a drawer with no title and no
 * visible close — the scrim is not an exit. The title is still present for
 * assistive tech (`DialogTitle` is required — Radix throws without one),
 * but visually hidden (`sr-only`) so the anti-pattern this illustrates is
 * "nothing a sighted operator can read as the record's name," not an
 * accessibility violation; no `DrawerClose` is rendered either, leaving
 * Escape and the scrim as the only ways out. */
export function DrawerBadNoTitleNoCloseExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Quick peek</Button>
      </DrawerTrigger>
      <DrawerContent size="sm">
        <DrawerTitle className="sr-only">Row details</DrawerTitle>
        <DrawerBody className="pt-22">
          <p>Status: Healthy</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
