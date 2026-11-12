import { serve } from "@hono/node-server"
import { Hono } from "hono"

import { MECHANICS, SERVICES } from "./config"
import { addBooking, getFreeTimes } from "./schedule"
import type { Booking, BookingRequest } from "./types"

// In-memory storage – good enough for a demo, data is lost on restart.
const bookings: Booking[] = []

const app = new Hono().basePath("/api")

app.get("/services", (c) => c.json(SERVICES))

app.get("/mechanics", (c) => c.json(MECHANICS))

app.get("/times", (c) => {
  const day = c.req.query("day")
  const service = SERVICES.find((s) => s.id === c.req.query("serviceId"))
  if (!day || !service) return c.json({ error: "Missing day or service" }, 400)

  return c.json(getFreeTimes(day, service, bookings))
})

app.get("/bookings", (c) => c.json(bookings))

app.post("/bookings", async (c) => {
  const request = await c.req.json<BookingRequest>()
  const service = SERVICES.find((s) => s.id === request.serviceId)
  if (!service) return c.json({ error: "Unknown service" }, 400)

  const booking = addBooking(request, service, bookings)
  if (!booking) return c.json({ error: "This time is not available" }, 409)

  return c.json(booking, 201)
})

serve({ fetch: app.fetch, port: 3001 }, () =>
  console.log("API running on http://localhost:3001")
)
