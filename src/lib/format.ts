const TIME_ZONE = "Europe/Prague"

/** ISO date-time → "10:00" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("cs-CZ", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** → "pondělí 16. listopadu" */
export function formatDay(date: Date | string): string {
  return new Date(date).toLocaleDateString("cs-CZ", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

/** ISO date-time → "2026-11-16" */
export function dayOf(iso: string): string {
  // The en-CA locale formats dates as YYYY-MM-DD.
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE })
}

/** Date picked in the calendar → "2026-11-16" */
export function toDayString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}
