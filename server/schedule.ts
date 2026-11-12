import {
  BREAK_BETWEEN_CARS_MINUTES,
  CLOSES_AT,
  MECHANICS,
  OPENS_AT,
} from "./config"
import { addMinutes, isWorkday, minutesToTime, toDate } from "./time"
import type { Booking, BookingRequest, Mechanic, Service } from "./types"

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

  // Plan the day backwards from closing time, so the last car finishes
  // exactly at 17:00. Every car is followed by a short break.
  const step = service.durationMinutes + BREAK_BETWEEN_CARS_MINUTES

  for (
    let minutes = CLOSES_AT - service.durationMinutes;
    minutes >= OPENS_AT;
    minutes -= step
  ) {
    const time = minutesToTime(minutes)
    const start = toDate(day, time)
    const end = addMinutes(start, service.durationMinutes)

    if (isMechanicFree(mechanic.id, start, end, bookings)) times.unshift(time)
  }

  return times
}

/**
 * Saves the booking if the time is still free, otherwise returns undefined.
 *
 * The customer picked the time minutes ago, so it is checked again here.
 * The check and the save run without any `await` in between, so two
 * requests for the same time cannot both get through.
 */
export function addBooking(
  request: BookingRequest,
  service: Service,
  bookings: Booking[]
): Booking | undefined {
  const freeTimes = getFreeTimes(request.day, service, bookings)
  if (!freeTimes.includes(request.time)) return undefined

  const start = toDate(request.day, request.time)
  const booking: Booking = {
    id: crypto.randomUUID(),
    serviceId: service.id,
    mechanicId: mechanicFor(service).id,
    start: start.toISOString(),
    end: addMinutes(start, service.durationMinutes).toISOString(),
    customer: request.customer,
  }

  bookings.push(booking)
  return booking
}

/** Free = no other car of this mechanic overlaps, including the break. */
function isMechanicFree(
  mechanicId: string,
  start: Date,
  end: Date,
  bookings: Booking[]
): boolean {
  const plusBreak = (date: Date) => addMinutes(date, BREAK_BETWEEN_CARS_MINUTES)

  return bookings
    .filter((booking) => booking.mechanicId === mechanicId)
    .every(
      (booking) =>
        plusBreak(end) <= new Date(booking.start) ||
        start >= plusBreak(new Date(booking.end))
    )
}
