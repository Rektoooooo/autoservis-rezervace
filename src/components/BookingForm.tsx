import {
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react"
import { CircleCheckIcon } from "lucide-react"
import { cs } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  api,
  type Booking,
  type Customer,
  type Mechanic,
  type Service,
  type Slot,
} from "@/lib/api"
import { formatDay, formatTime, toDayString } from "@/lib/format"

type Props = {
  services: Service[]
  mechanics: Mechanic[]
}

const EMPTY_CUSTOMER: Customer = { name: "", phone: "", licensePlate: "" }

export function BookingForm({ services, mechanics }: Props) {
  const [service, setService] = useState<Service>()
  const [date, setDate] = useState<Date>()
  const [slots, setSlots] = useState<Slot[]>([])
  const [slot, setSlot] = useState<Slot>()
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)
  const [booking, setBooking] = useState<Booking>()
  const [error, setError] = useState("")

  const day = date && toDayString(date)

  useEffect(() => {
    if (service && day) api.slots(service.id, day).then(setSlots)
  }, [service, day])

  function chooseService(service: Service) {
    setService(service)
    setSlot(undefined)
  }

  function chooseDate(date?: Date) {
    setDate(date)
    setSlot(undefined)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!service || !day || !slot) return

    setError("")
    try {
      const created = await api.createBooking({
        serviceId: service.id,
        mechanicId: slot.mechanicId,
        day,
        time: slot.time,
        customer,
      })
      setBooking(created)
    } catch {
      setError("Rezervaci se nepodařilo uložit. Zkuste to prosím znovu.")
    }
  }

  function startOver() {
    setBooking(undefined)
    chooseDate(undefined)
    setCustomer(EMPTY_CUSTOMER)
  }

  const updateCustomer =
    (field: keyof Customer) => (event: { target: { value: string } }) =>
      setCustomer({ ...customer, [field]: event.target.value })

  if (booking) {
    return (
      <Confirmation
        booking={booking}
        service={services.find((s) => s.id === booking.serviceId)}
        mechanic={mechanics.find((m) => m.id === booking.mechanicId)}
        onStartOver={startOver}
      />
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <Step title="1. Služba">
        <div className="grid gap-2">
          {services.map((s) => (
            <Button
              key={s.id}
              type="button"
              variant={s.id === service?.id ? "default" : "outline"}
              className="justify-between"
              onClick={() => chooseService(s)}
            >
              {s.name}
              <span className="text-xs opacity-70">
                {s.durationMinutes} min
              </span>
            </Button>
          ))}
        </div>
      </Step>

      <Step title="2. Den">
        <Calendar
          mode="single"
          locale={cs}
          selected={date}
          onSelect={chooseDate}
          disabled={[{ before: tomorrow() }, { dayOfWeek: [0, 6] }]}
        />
      </Step>

      <Step title="3. Čas">
        <SlotPicker
          ready={Boolean(service && date)}
          slots={slots}
          selected={slot}
          onSelect={setSlot}
        />
      </Step>

      <Step title="4. Kontakt">
        <div className="grid gap-3">
          <Field
            label="Jméno a příjmení"
            value={customer.name}
            onChange={updateCustomer("name")}
          />
          <Field
            label="Telefon"
            type="tel"
            value={customer.phone}
            onChange={updateCustomer("phone")}
          />
          <Field
            label="SPZ"
            value={customer.licensePlate}
            onChange={updateCustomer("licensePlate")}
          />
          <Button type="submit" disabled={!slot}>
            {slot ? `Rezervovat na ${slot.time}` : "Rezervovat"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </Step>
    </form>
  )
}

function SlotPicker({
  ready,
  slots,
  selected,
  onSelect,
}: {
  ready: boolean
  slots: Slot[]
  selected?: Slot
  onSelect: (slot: Slot) => void
}) {
  if (!ready) return <Hint>Nejdřív vyberte službu a den.</Hint>
  if (slots.length === 0) return <Hint>Tento den už nemáme volno.</Hint>

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => (
        <Button
          key={slot.time}
          type="button"
          size="sm"
          variant={slot.time === selected?.time ? "default" : "outline"}
          onClick={() => onSelect(slot)}
        >
          {slot.time}
        </Button>
      ))}
    </div>
  )
}

function Confirmation({
  booking,
  service,
  mechanic,
  onStartOver,
}: {
  booking: Booking
  service?: Service
  mechanic?: Mechanic
  onStartOver: () => void
}) {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleCheckIcon className="size-5 text-green-600" />
          Rezervace potvrzena
        </CardTitle>
        <CardDescription>
          Těšíme se na vás, {booking.customer.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Služba</dt>
          <dd>{service?.name}</dd>
          <dt className="text-muted-foreground">Termín</dt>
          <dd>
            {formatDay(booking.start)}, {formatTime(booking.start)}–
            {formatTime(booking.end)}
          </dd>
          <dt className="text-muted-foreground">Mechanik</dt>
          <dd>{mechanic?.name}</dd>
          <dt className="text-muted-foreground">SPZ</dt>
          <dd>{booking.customer.licensePlate}</dd>
        </dl>
        <Button variant="outline" onClick={onStartOver}>
          Nová rezervace
        </Button>
      </CardContent>
    </Card>
  )
}

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Field({
  label,
  ...props
}: { label: string } & ComponentProps<typeof Input>) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} required {...props} />
    </div>
  )
}

function Hint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

function tomorrow(): Date {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}
