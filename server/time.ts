// The shop is in Prague (UTC+2).
const PRAGUE_UTC_OFFSET = "+02:00"

/** "2026-11-16" + "10:00" → Date */
export function toDate(day: string, time: string): Date {
  return new Date(`${day}T${time}:00${PRAGUE_UTC_OFFSET}`)
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
