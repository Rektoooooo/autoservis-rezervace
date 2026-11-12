import { CLOSES_AT, MECHANICS, OPENS_AT } from "./config"
import { addMinutes, isWorkday, minutesToTime, toDate } from "./time"
import type { Booking, Mechanic, Service } from "./types"

/** Each mechanic does one kind of service. */
export function mechanicFor(service: Service): Mechanic {
  return MECHANICS.find((mechanic) => mechanic.serviceId === service.id)!
}

/** Start times ("10:00") on `day` when the service's mechanic is free. */
export function getFreeTimes(
  day: string,
  service: Service,
  bookings: Booking[]
): string[] {
  if (!isWorkday(day)) return []

  const mechanic = mechanicFor(service)
  const times: string[] = []

  for (
    let minutes = OPENS_AT;
    minutes + service.durationMinutes < CLOSES_AT;
    minutes += service.durationMinutes
  ) {
    const time = minutesToTime(minutes)
    const start = toDate(day, time)
    const end = addMinutes(start, service.durationMinutes)

    if (isMechanicFree(mechanic.id, start, end, bookings)) times.push(time)
  }

  return times
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
