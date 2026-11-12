import { describe, expect, it } from "vitest"

import { SERVICES } from "./config"
import { getFreeSlots } from "./schedule"
import { toDate } from "./time"
import type { Booking } from "./types"

const MONDAY = "2026-11-16"
const SATURDAY = "2026-11-21"
const tyres = SERVICES.find((s) => s.id === "tyres")!

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
  getFreeSlots(day, tyres, bookings).map((slot) => slot.time)

describe("getFreeSlots", () => {
  it("starts at opening time", () => {
    expect(times(MONDAY)[0]).toBe("08:00")
  })

  it("is closed on weekends", () => {
    expect(times(SATURDAY)).toEqual([])
  })

  it("hides a time when all mechanics are busy", () => {
    const allBusy = ["petr", "jana", "tomas"].map((id) =>
      booking(id, "10:00", "10:30")
    )
    expect(times(MONDAY, allBusy)).not.toContain("10:00")
  })

  it("keeps a time when at least one mechanic is free", () => {
    const twoBusy = ["petr", "jana"].map((id) => booking(id, "10:00", "10:30"))
    expect(times(MONDAY, twoBusy)).toContain("10:00")
  })
})
