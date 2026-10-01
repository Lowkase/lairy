import {
  CardBadCrowdedExample,
  CardBadMixedkindsExample,
  CardBadNestedcontrolsExample,
  CardGoodConsistentkindExample,
  CardGoodOnequestionExample,
  CardGoodOnetargetExample,
  CardHudExample,
  CardPlainExample,
  CardStatExample,
  CardTileExample,
  CardWithHeaderExample,
} from "@lairy/ui/card/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const CARD_EXAMPLES: Record<string, ComponentType> = {
  "with-header": CardWithHeaderExample,
  plain: CardPlainExample,
  hud: CardHudExample,
  stat: CardStatExample,
  tile: CardTileExample,
  "good-consistentkind": CardGoodConsistentkindExample,
  "bad-mixedkinds": CardBadMixedkindsExample,
  "good-onequestion": CardGoodOnequestionExample,
  "bad-crowded": CardBadCrowdedExample,
  "good-onetarget": CardGoodOnetargetExample,
  "bad-nestedcontrols": CardBadNestedcontrolsExample,
};
