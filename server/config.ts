import type { Mechanic, Service } from "./types"

// Open Monday–Friday, times are minutes since midnight.
export const OPENS_AT = 8 * 60 // 8:00
export const CLOSES_AT = 17 * 60 // 17:00

export const SERVICES: Service[] = [
  {
    id: "tyres",
    name: "Přezutí pneumatik",
    description: "Výměna letních a zimních kol včetně vyvážení.",
    durationMinutes: 30,
  },
  {
    id: "inspection",
    name: "STK prohlídka",
    description: "Kontrola vozu, aby prošel technickou napoprvé.",
    durationMinutes: 60,
  },
  {
    id: "service",
    name: "Servis",
    description: "Pravidelná prohlídka, výměna oleje a filtrů.",
    durationMinutes: 120,
  },
]

export const MECHANICS: Mechanic[] = [
  { id: "petr", name: "Petr", serviceId: "tyres" },
  { id: "jana", name: "Jana", serviceId: "inspection" },
  { id: "tomas", name: "Tomáš", serviceId: "service" },
]
