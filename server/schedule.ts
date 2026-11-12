import { CLOSES_AT, MECHANICS, OPENS_AT, SLOT_STEP_MINUTES } from "./config"
import { addMinutes, isWorkday, minutesToTime, toDate } from "./time"
import type { Booking, Service, Slot } from "./types"

/** Start times on `day` when at least one mechanic is free for the whole service. */
export function getFreeSlots(
  day: string,
  service: Service,
  bookings: Booking[]
): Slot[] {
  if (!isWorkday(day)) return []

  const slots: Slot[] = []

  for (
    let minutes = OPENS_AT;
    minutes + service.durationMinutes < CLOSES_AT;
    minutes += SLOT_STEP_MINUTES
  ) {
    const time = minutesToTime(minutes)
    const start = toDate(day, time)
    const end = addMinutes(start, service.durationMinutes)

    const mechanic = MECHANICS.find((m) =>
      isMechanicFree(m.id, start, end, bookings)
    )
    if (mechanic) slots.push({ time, mechanicId: mechanic.id })
  }

  return slots
}

function isMechanicFree(
  mechanicId: string,
  start: Date,
  end: Date,
  bookings: Booking[]
): boolean {
  return bookings
    .filter((booking) => booking.mechanicId === mechanicId)
    .every(
      (booking) =>
        end <= new Date(booking.start) || start >= new Date(booking.end)
    )
}
