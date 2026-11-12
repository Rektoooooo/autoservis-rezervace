import {
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react"
import { CheckIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  api,
  type Booking,
  type Customer,
  type Mechanic,
  type Service,
} from "@/lib/api"
import { toDayString } from "@/lib/format"
import { cn } from "@/lib/utils"

import { BookingSummary } from "./BookingSummary"
import { Confirmation } from "./Confirmation"
import { ServicePicker } from "./ServicePicker"
import { TimePicker } from "./TimePicker"

type Props = {
  services: Service[]
  mechanics: Mechanic[]
}

const EMPTY_CUSTOMER: Customer = { name: "", phone: "", licensePlate: "" }

export function BookingForm({ services, mechanics }: Props) {
  const [service, setService] = useState<Service>()
  const [date, setDate] = useState<Date>()
  const [times, setTimes] = useState<string[]>([])
  const [time, setTime] = useState<string>()
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)
  const [booking, setBooking] = useState<Booking>()
  const [error, setError] = useState("")

  const day = date && toDayString(date)

  useEffect(() => {
    if (service && day) api.times(service.id, day).then(setTimes)
  }, [service, day])

  function chooseService(service: Service) {
    setService(service)
    setTime(undefined)
  }

  function chooseDate(date?: Date) {
    setDate(date)
    setTime(undefined)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!service || !day || !time) return

    setError("")
    try {
      const created = await api.createBooking({
        serviceId: service.id,
        day,
        time,
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
    <div className="grid gap-6">
      <div>
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Objednejte se do servisu
        </h2>
        <p className="mt-1 text-muted-foreground">
          Vyberte službu a volný termín. Zabere to minutu.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid items-start gap-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="grid gap-6">
          <Section step={1} title="Služba" done={Boolean(service)}>
            <ServicePicker
              services={services}
              selected={service}
              onSelect={chooseService}
            />
          </Section>

          <Section step={2} title="Termín" done={Boolean(time)}>
            <TimePicker
              hasService={Boolean(service)}
              date={date}
              onDateChange={chooseDate}
              times={times}
              selected={time}
              onSelect={setTime}
            />
          </Section>

          <Section
            step={3}
            title="Kontakt"
            done={Object.values(customer).every(Boolean)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Jméno a příjmení"
                placeholder="Jan Novák"
                className="sm:col-span-2"
                value={customer.name}
                onChange={updateCustomer("name")}
              />
              <Field
                label="Telefon"
                type="tel"
                placeholder="+420 777 123 456"
                value={customer.phone}
                onChange={updateCustomer("phone")}
              />
              <Field
                label="SPZ"
                placeholder="1AB 2345"
                value={customer.licensePlate}
                onChange={updateCustomer("licensePlate")}
              />
            </div>
          </Section>
        </div>

        <BookingSummary
          service={service}
          date={date}
          time={time}
          error={error}
        />
      </form>
    </div>
  )
}

function Section({
  step,
  title,
  done,
  children,
}: {
  step: number
  title: string
  done: boolean
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6">
      <h3 className="mb-5 flex items-center gap-3 font-heading text-lg font-semibold">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-sm transition-colors",
            done
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {done ? <CheckIcon className="size-4" /> : step}
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({
  label,
  className,
  ...props
}: { label: string } & ComponentProps<typeof Input>) {
  const id = useId()
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        required
        className="h-10 bg-background placeholder:text-muted-foreground/50"
        {...props}
      />
    </div>
  )
}
