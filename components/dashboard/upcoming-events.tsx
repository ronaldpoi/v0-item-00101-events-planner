"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { type Event, getUserEvents } from "@/lib/local-storage"

export function UpcomingEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    if (!user) return

    // Get user events from local storage
    const userEvents = getUserEvents(user.id)
      .filter((event) => event.status === "Upcoming")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)

    setEvents(userEvents)
  }, [user])

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Please log in to view your upcoming events.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>You have {events.length} events coming up.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="flex items-start space-x-4 rounded-md border p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-semibold">{event.title}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-1 sm:gap-3">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="h-5 text-xs">
                      {event.guests.length} guests
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/events/${event.id}`}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View event details</span>
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming events.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

