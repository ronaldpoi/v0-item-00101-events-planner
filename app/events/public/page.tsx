import { PublicEventsHeader } from "@/components/events/public-events-header"
import { PublicEventsList } from "@/components/events/public-events-list"

export default function PublicEventsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PublicEventsHeader />
      <PublicEventsList />
    </div>
  )
}

