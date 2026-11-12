import type {
  Booking,
  BookingRequest,
  Mechanic,
  Service,
  Slot,
} from "../../server/types"

export type * from "../../server/types"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!response.ok) throw new Error(`API ${path} failed: ${response.status}`)
  return response.json()
}

export const api = {
  services: () => request<Service[]>("/services"),
  mechanics: () => request<Mechanic[]>("/mechanics"),
  slots: (serviceId: string, day: string) =>
    request<Slot[]>(`/slots?serviceId=${serviceId}&day=${day}`),
  bookings: () => request<Booking[]>("/bookings"),
  createBooking: (body: BookingRequest) =>
    request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),
}
