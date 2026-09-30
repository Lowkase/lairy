import { color } from "@lairy/tokens";
import { TokenEntrySchema } from "../../schema/token";

/**
 * Alarm is non-themeable by design (AGENTS.md rule 4, ADR-0007): every entry
 * here carries the prototype's own rationale verbatim (colorDocs()'s Alarm
 * row, archive/v1/Workspace Shell.dc.html:14608) rather than a paraphrase —
 * the ticket's explicit acceptance criterion. `--alarm-soft` and
 * `--alarm-line` are the prototype's consolidated alpha set (docs/prd.md
 * §8.1, reference/token-harvest.md); `--alarm-ink` has no prototype
 * counterpart at all — see its own rationale below.
 */
const ALARM_RATIONALE =
  'Failure, and only failure. It is written literally rather than tokenised on purpose: a theme should never be able to redefine what broken looks like, and nothing should be able to borrow the colour by accident.';

const raw = [
  {
    name: "--alarm",
    group: "Alarm",
    value: color.alarm.alarm,
    themeable: false,
    useFor: ["Failure, and only failure."],
    neverFor: [
      "Anything that is not a failure state — no theme may redefine what \"broken\" looks like, and nothing may borrow the colour by accident.",
    ],
    rationale: ALARM_RATIONALE,
  },
  {
    name: "--alarm-soft",
    group: "Alarm",
    value: color.alarm.alarmSoft,
    themeable: false,
    useFor: ["Failure-state fill, low opacity — e.g. Callout's Error tone background."],
    rationale: ALARM_RATIONALE,
  },
  {
    name: "--alarm-line",
    group: "Alarm",
    value: color.alarm.alarmLine,
    themeable: false,
    useFor: ["Failure-state border, reduced opacity — e.g. Callout and Toast's Warning/Error border."],
    rationale: ALARM_RATIONALE,
  },
  {
    name: "--alarm-ink",
    group: "Alarm",
    value: color.alarm.alarmInk,
    themeable: false,
    useFor: [
      "Text and icon colour for content set on a solid --alarm fill — the primary action button on a Warning or Error tone.",
    ],
    neverFor: [
      "Anything not sitting on a solid --alarm fill — for a failure-tinted border or wash, use --alarm-line or --alarm-soft against the ordinary text ranks instead.",
    ],
    rationale:
      `${ALARM_RATIONALE} Not itself in the prototype: renderCallout() used var(--bg) for text on a solid alarm fill, which fails AA in the light theme (2.03:1) because --bg is themeable but --alarm is not. --alarm-ink is proposed to close that gap and, for the same reason as --alarm itself, is non-themeable — a themeable ink colour paired with a non-themeable fill would drift out of contrast in exactly one theme.`,
  },
] as const;

export const alarmTokens = raw.map((entry) => TokenEntrySchema.parse(entry));
