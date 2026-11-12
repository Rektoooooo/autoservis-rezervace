import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Booking, Mechanic, Service } from "@/lib/api"
import { formatDay, formatTime } from "@/lib/format"

import { SummaryRow } from "./BookingSummary"

type Props = {
  booking: Booking
  service?: Service
  mechanic?: Mechanic
  onStartOver: () => void
}

export function Confirmation({
  booking,
  service,
  mechanic,
  onStartOver,
}: Props) {
  const time = `${formatTime(booking.start)}–${formatTime(booking.end)}`

  return (
    <div className="mx-auto max-w-md animate-in rounded-xl border bg-card p-8 text-center duration-300 zoom-in-95 fade-in">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckIcon className="size-7" />
      </div>
      <h2 className="mt-4 font-heading text-2xl font-bold">
        Hotovo, máte zarezervováno
      </h2>
      <p className="mt-1 text-muted-foreground">
        Těšíme se na vás, {booking.customer.name}.
      </p>

      <dl className="mt-6 grid gap-3 rounded-lg bg-muted p-4 text-left text-sm">
        <SummaryRow label="Služba" value={service?.name} />
        <SummaryRow label="Den" value={formatDay(booking.start)} />
        <SummaryRow label="Čas" value={time} />
        <SummaryRow label="Mechanik" value={mechanic?.name} />
        <SummaryRow label="SPZ" value={booking.customer.licensePlate} />
      </dl>

      <Button variant="outline" className="mt-6 w-full" onClick={onStartOver}>
        Nová rezervace
      </Button>
    </div>
  )
}
