import { DateTime } from "luxon";

export function toRelative(
  dateTime?: DateTime | string | null,
): string | null | undefined {
  if (dateTime instanceof DateTime) {
    return dateTime.toRelative();
  } else if (typeof dateTime === "string") {
    const parsedDateTime = DateTime.fromISO(dateTime);
    return parsedDateTime.toRelative();
  }
  return null;
}
