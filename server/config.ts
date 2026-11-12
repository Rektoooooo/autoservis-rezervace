import type { Mechanic, Service } from "./types"

// Open Monday–Friday, times are minutes since midnight.
export const OPENS_AT = 8 * 60 // 8:00
export const CLOSES_AT = 17 * 60 // 17:00

export const SLOT_STEP_MINUTES = 30

export const SERVICES: Service[] = [
  { id: "tyres", name: "Přezutí pneumatik", durationMinutes: 30 },
  { id: "inspection", name: "STK prohlídka", durationMinutes: 60 },
  { id: "service", name: "Servis", durationMinutes: 120 },
]

export const MECHANICS: Mechanic[] = [
  { id: "petr", name: "Petr" },
  { id: "jana", name: "Jana" },
  { id: "tomas", name: "Tomáš" },
]
