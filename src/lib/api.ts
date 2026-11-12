import type {
  Booking,
  BookingRequest,
  Mechanic,
  Service,
} from "../../server/types"

export type * from "../../server/types"

/** An API error with its HTTP status, e.g. 409 when a time was just taken. */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API ${path} failed: ${response.status}`
    )
  }
  return response.json()
}

export const api = {
  services: () => request<Service[]>("/services"),
  mechanics: () => request<Mechanic[]>("/mechanics"),
  times: (serviceId: string, day: string) =>
    request<string[]>(`/times?serviceId=${serviceId}&day=${day}`),
  bookings: () => request<Booking[]>("/bookings"),
  createBooking: (body: BookingRequest) =>
    request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),
}
