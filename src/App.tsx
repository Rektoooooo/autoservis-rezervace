import { useEffect, useState } from "react"

import { BookingForm } from "@/components/booking/BookingForm"
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Tabs defaultValue="booking" className="gap-6">
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
    </main>
  )
}
