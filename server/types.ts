export type Service = {
  id: string
  name: string
  description: string
  durationMinutes: number
}

export type Mechanic = {
  id: string
  name: string
  serviceId: string // each mechanic does one kind of service
}

export type Customer = {
  name: string
  phone: string
  licensePlate: string
}

export type Booking = {
  id: string
  serviceId: string
  mechanicId: string
  start: string // ISO date-time
  end: string // ISO date-time
  customer: Customer
}

export type BookingRequest = {
  serviceId: string
  day: string // "2026-11-16"
  time: string // "10:00"
  customer: Customer
}
