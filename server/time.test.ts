import { describe, expect, it } from "vitest"

import { toDate } from "./time"

describe("toDate", () => {
  it("uses winter time (UTC+1) in November", () => {
    expect(toDate("2026-11-16", "10:00").toISOString()).toBe(
      "2026-11-16T09:00:00.000Z"
    )
  })

  it("uses summer time (UTC+2) in July", () => {
    expect(toDate("2026-07-15", "10:00").toISOString()).toBe(
      "2026-07-15T08:00:00.000Z"
    )
  })
})
