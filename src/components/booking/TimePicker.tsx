import type { ReactNode } from "react"
import { cs } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { formatDay } from "@/lib/format"

type Props = {
  hasService: boolean
  date?: Date
  onDateChange: (date?: Date) => void
  times: string[]
  selected?: string
  onSelect: (time: string) => void
}

export function TimePicker({
  hasService,
  date,
  onDateChange,
  times,
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
          <TimeList times={times} selected={selected} onSelect={onSelect} />
        )}
      </div>
    </div>
  )
}

function TimeList({
  times,
  selected,
  onSelect,
}: Pick<Props, "times" | "selected" | "onSelect">) {
  if (times.length === 0) {
    return <Hint>Tento den už nemáme volno, zkuste prosím jiný.</Hint>
  }

  const morning = times.filter((time) => time < "12:00")
  const afternoon = times.filter((time) => time >= "12:00")

  return (
    <>
      <TimeGroup
        label="Dopoledne"
        times={morning}
        selected={selected}
        onSelect={onSelect}
      />
      <TimeGroup
        label="Odpoledne"
        times={afternoon}
        selected={selected}
        onSelect={onSelect}
      />
    </>
  )
}

function TimeGroup({
  label,
  times,
  selected,
  onSelect,
}: { label: string } & Pick<Props, "times" | "selected" | "onSelect">) {
  if (times.length === 0) return null

  return (
    <div className="grid gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {times.map((time) => (
          <Button
            key={time}
            type="button"
            variant={time === selected ? "default" : "outline"}
            className="h-9 tabular-nums"
            onClick={() => onSelect(time)}
          >
            {time}
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
