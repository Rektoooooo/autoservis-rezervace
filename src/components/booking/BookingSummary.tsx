import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/api"
import { formatDay } from "@/lib/format"

type Props = {
  service?: Service
  date?: Date
  time?: string
  error: string
}

/** Sticky side panel with the current choices and the submit button. */
export function BookingSummary({ service, date, time, error }: Props) {
  return (
    <aside className="rounded-xl border bg-card p-5 lg:sticky lg:top-6">
      <h3 className="font-heading text-lg font-semibold">Vaše rezervace</h3>

      <dl className="mt-4 grid gap-3 text-sm">
        <SummaryRow label="Služba" value={service?.name} />
        <SummaryRow label="Den" value={date && formatDay(date)} />
        <SummaryRow label="Čas" value={time} />
        <SummaryRow
          label="Délka"
          value={service && `${service.durationMinutes} min`}
        />
      </dl>

      <Button
        type="submit"
        size="lg"
        className="mt-5 h-11 w-full text-base"
        disabled={!time}
      >
        Potvrdit rezervaci
      </Button>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </aside>
  )
}

export function SummaryRow({
  label,
  value,
}: {
  label: string
  value?: string
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed pb-3 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium first-letter:uppercase">
        {value ?? "—"}
      </dd>
    </div>
  )
}
