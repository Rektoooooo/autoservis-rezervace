import {
  CircleDotIcon,
  ClipboardCheckIcon,
  ClockIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react"

import type { Service } from "@/lib/api"
import { cn } from "@/lib/utils"

const ICONS: Record<string, LucideIcon> = {
  tyres: CircleDotIcon,
  inspection: ClipboardCheckIcon,
  service: WrenchIcon,
}

type Props = {
  services: Service[]
  selected?: Service
  onSelect: (service: Service) => void
}

export function ServicePicker({ services, selected, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {services.map((service) => {
        const Icon = ICONS[service.id] ?? WrenchIcon
        const isSelected = service.id === selected?.id

        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(service)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary/50",
              isSelected && "border-primary bg-primary/5 ring-1 ring-primary"
            )}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-md bg-muted transition-colors",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="mt-1 font-medium">{service.name}</span>
            <span className="text-sm text-muted-foreground">
              {service.description}
            </span>
            <span className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-muted-foreground">
              <ClockIcon className="size-3.5" />
              {service.durationMinutes} min
            </span>
          </button>
        )
      })}
    </div>
  )
}
