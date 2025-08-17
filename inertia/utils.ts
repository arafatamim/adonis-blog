import { DateTime } from "luxon";

export function toRelative(
  dateTime?: DateTime | string | null,
  short = false,
): string | null | undefined {
  if (dateTime instanceof DateTime) {
    return dateTime.toRelative();
  } else if (typeof dateTime === "string") {
    const parsedDateTime = DateTime.fromISO(dateTime);
    return parsedDateTime.toRelative({ style: short ? "narrow" : "long" });
  }
  return null;
}
