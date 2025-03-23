"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Event, getPublicEvents } from "@/lib/local-storage"

interface PublicEventsListProps {
  limit?: number
}

export function PublicEventsList({ limit }: PublicEventsListProps) {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    // Get public events from local storage
    const publicEvents = getPublicEvents()
    setEvents(limit ? publicEvents.slice(0, limit) : publicEvents)
  }, [limit])

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No public events available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="space-y-1">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.guests.filter((g) => g.status === "Confirmed").length} confirmed guests</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-3">
            <Badge>Public</Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

