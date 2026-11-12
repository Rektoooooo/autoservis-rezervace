import { useEffect, useState } from "react"
import { WrenchIcon } from "lucide-react"

import { BookingForm } from "@/components/BookingForm"
import { DayOverview } from "@/components/DayOverview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api, type Mechanic, type Service } from "@/lib/api"

export default function App() {
  const [services, setServices] = useState<Service[]>([])
  const [mechanics, setMechanics] = useState<Mechanic[]>([])

  useEffect(() => {
    api.services().then(setServices)
    api.mechanics().then(setMechanics)
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <WrenchIcon className="size-7" />
        <div>
          <h1 className="text-2xl font-semibold">Autoservis Novák</h1>
          <p className="text-sm text-muted-foreground">
            Online rezervace · Po–Pá 8:00–17:00
          </p>
        </div>
      </header>

      <Tabs defaultValue="booking">
        <TabsList>
          <TabsTrigger value="booking">Rezervace</TabsTrigger>
          <TabsTrigger value="overview">Přehled pro servis</TabsTrigger>
        </TabsList>
        <TabsContent value="booking">
          <BookingForm services={services} mechanics={mechanics} />
        </TabsContent>
        <TabsContent value="overview">
          <DayOverview services={services} mechanics={mechanics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
