import { fromZonedTime } from "date-fns-tz"

// A time zone name instead of a fixed offset, so summer and winter time
// are handled automatically (UTC+2 in summer, UTC+1 in winter).
const SHOP_TIME_ZONE = "Europe/Prague"

/** "2026-11-16" + "10:00" in Prague → Date */
export function toDate(day: string, time: string): Date {
  return fromZonedTime(`${day}T${time}:00`, SHOP_TIME_ZONE)
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

/** 600 → "10:00" */
export function minutesToTime(minutes: number): string {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0")
  const mins = String(minutes % 60).padStart(2, "0")
  return `${hours}:${mins}`
}

/** Monday–Friday */
export function isWorkday(day: string): boolean {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay()
  return weekday >= 1 && weekday <= 5
}
