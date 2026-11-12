import { describe, expect, it } from "vitest"

import { SERVICES } from "./config"
import { addBooking, getFreeTimes } from "./schedule"
import { toDate } from "./time"
import type { Booking } from "./types"

const MONDAY = "2026-11-16"
const SATURDAY = "2026-11-21"
const tyres = SERVICES.find((s) => s.id === "tyres")!
const inspection = SERVICES.find((s) => s.id === "inspection")!

function booking(mechanicId: string, from: string, to: string): Booking {
  return {
    id: `${mechanicId}-${from}`,
    serviceId: "tyres",
    mechanicId,
    start: toDate(MONDAY, from).toISOString(),
    end: toDate(MONDAY, to).toISOString(),
    customer: { name: "Test", phone: "", licensePlate: "" },
  }
}

const times = (day: string, bookings: Booking[] = []) =>
  getFreeTimes(day, tyres, bookings)

describe("getFreeTimes", () => {
  it("is closed on weekends", () => {
    expect(times(SATURDAY)).toEqual([])
  })

  it("hides a time when the mechanic is busy", () => {
    const petrBusy = [booking("petr", "10:30", "11:00")]
    expect(times(MONDAY, petrBusy)).not.toContain("10:30")
  })

  it("offers the last car that finishes exactly at closing time", () => {
    expect(times(MONDAY).at(-1)).toBe("16:30")
    expect(getFreeTimes(MONDAY, inspection, []).at(-1)).toBe("16:00")
  })

  it("leaves a 10 minute break between cars", () => {
    // Planned back from 17:00, so the spare time is at the start of the day.
    expect(times(MONDAY).slice(0, 3)).toEqual(["08:30", "09:10", "09:50"])
  })

  it("keeps the break next to an older booking", () => {
    // Booked before the break existed, on the old 30-minute times.
    const petrBusy = [booking("petr", "11:00", "11:30")]
    const free = times(MONDAY, petrBusy)

    expect(free).not.toContain("10:30") // would end right as that car arrives
    expect(free).toContain("11:50")
  })

  it("ignores other mechanics' bookings", () => {
    const janaBusy = [booking("jana", "10:30", "11:30")]
    expect(times(MONDAY, janaBusy)).toContain("10:30")
  })
})

describe("addBooking", () => {
  it("refuses a time that was booked in the meantime", () => {
    const bookings: Booking[] = []
    const request = {
      serviceId: "tyres",
      day: MONDAY,
      time: "10:30",
      customer: { name: "Test", phone: "", licensePlate: "" },
    }

    expect(addBooking(request, tyres, bookings)).toBeDefined()
    expect(addBooking(request, tyres, bookings)).toBeUndefined()
    expect(bookings).toHaveLength(1)
  })
})
