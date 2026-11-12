import { useEffect, useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { cs } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api, type Booking, type Mechanic, type Service } from "@/lib/api"
import { dayOf, formatDay, formatTime, toDayString } from "@/lib/format"

type Props = {
  services: Service[]
  mechanics: Mechanic[]
}

/** The shop's view: all bookings of one day, one column per mechanic. */
export function DayOverview({ services, mechanics }: Props) {
  const [date, setDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])

  const refresh = () => api.bookings().then(setBookings)

  useEffect(() => {
    refresh()
  }, [])

  const bookingsOfDay = bookings
    .filter((b) => dayOf(b.start) === toDayString(date))
    .sort((a, b) => a.start.localeCompare(b.start))

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name

  return (
    <div className="grid items-start gap-4 md:grid-cols-[auto_1fr]">
      <Card>
        <CardContent>
          <Calendar
            mode="single"
            required
            locale={cs}
            selected={date}
            onSelect={setDate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="first-letter:uppercase">
            {formatDay(date)}
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCwIcon /> Obnovit
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {mechanics.map((mechanic) => {
            const own = bookingsOfDay.filter(
              (b) => b.mechanicId === mechanic.id
            )
            return (
              <div key={mechanic.id} className="grid content-start gap-2">
                <h3 className="font-medium">{mechanic.name}</h3>
                {own.length === 0 && (
                  <p className="text-sm text-muted-foreground">Volno</p>
                )}
                {own.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-md border p-2 text-sm"
                  >
                    <p className="font-medium">
                      {formatTime(booking.start)}–{formatTime(booking.end)}
                    </p>
                    <p>{serviceName(booking.serviceId)}</p>
                    <p className="text-muted-foreground">
                      {booking.customer.name} · {booking.customer.licensePlate}
                    </p>
                  </div>
                ))}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
