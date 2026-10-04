import {
  TableAutomationsDemoExample,
  TableBadEveryActionSpelledOutExample,
  TableBadOverflowingColumnsExample,
  TableBadStackedToolbarExample,
  TableGoodFewColumnsExample,
  TableGoodReservedActionsColumnExample,
  TableGoodSelectionSwapExample,
} from "@lairy/ui/table/examples";
import type { ComponentType } from "react";

export const TABLE_EXAMPLES: Record<string, ComponentType> = {
  "automations-demo": TableAutomationsDemoExample,
  "good-few-columns": TableGoodFewColumnsExample,
  "bad-overflowing-columns": TableBadOverflowingColumnsExample,
  "good-selection-swap": TableGoodSelectionSwapExample,
  "bad-stacked-toolbar": TableBadStackedToolbarExample,
  "good-reserved-actions-column": TableGoodReservedActionsColumnExample,
  "bad-every-action-spelled-out": TableBadEveryActionSpelledOutExample,
};
