import type { ReactNode } from "react"
import { cs } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { Slot } from "@/lib/api"
import { formatDay } from "@/lib/format"

type Props = {
  hasService: boolean
  date?: Date
  onDateChange: (date?: Date) => void
  slots: Slot[]
  selected?: Slot
  onSelect: (slot: Slot) => void
}

export function TimePicker({
  hasService,
  date,
  onDateChange,
  slots,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <Calendar
        mode="single"
        locale={cs}
        selected={date}
        onSelect={onDateChange}
        disabled={[{ before: tomorrow() }, { dayOfWeek: [0, 6] }]}
        className="rounded-lg border [--cell-size:--spacing(9)]"
      />

      <div className="grid content-start gap-4">
        <p className="font-medium first-letter:uppercase">
          {date ? formatDay(date) : "Vyberte den v kalendáři"}
        </p>
        {!hasService && <Hint>Nejdřív vyberte službu.</Hint>}
        {hasService && date && (
          <SlotList slots={slots} selected={selected} onSelect={onSelect} />
        )}
      </div>
    </div>
  )
}

function SlotList({
  slots,
  selected,
  onSelect,
}: Pick<Props, "slots" | "selected" | "onSelect">) {
  if (slots.length === 0) {
    return <Hint>Tento den už nemáme volno, zkuste prosím jiný.</Hint>
  }

  const morning = slots.filter((slot) => slot.time < "12:00")
  const afternoon = slots.filter((slot) => slot.time >= "12:00")

  return (
    <>
      <SlotGroup
        label="Dopoledne"
        slots={morning}
        selected={selected}
        onSelect={onSelect}
      />
      <SlotGroup
        label="Odpoledne"
        slots={afternoon}
        selected={selected}
        onSelect={onSelect}
      />
    </>
  )
}

function SlotGroup({
  label,
  slots,
  selected,
  onSelect,
}: { label: string } & Pick<Props, "slots" | "selected" | "onSelect">) {
  if (slots.length === 0) return null

  return (
    <div className="grid gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <Button
            key={slot.time}
            type="button"
            variant={slot.time === selected?.time ? "default" : "outline"}
            className="h-9 tabular-nums"
            onClick={() => onSelect(slot)}
          >
            {slot.time}
          </Button>
        ))}
      </div>
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
