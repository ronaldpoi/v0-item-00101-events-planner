"use client"

import { useState } from "react"
import { EventsList } from "@/components/events/events-list"
import { EventsHeader } from "@/components/events/events-header"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-6">
        <EventsHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <EventsList filter={activeFilter} />
      </div>
    </AuthGuard>
  )
}

