"use client"

import { useEffect, useState } from "react"
import { Calendar, Users, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { type Event, getUserEvents } from "@/lib/local-storage"

export function DashboardStats() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    if (!user) return

    // Get user events from local storage
    const userEvents = getUserEvents(user.id)
    setEvents(userEvents)
  }, [user])

  // Calculate stats
  const totalEvents = events.length
  const upcomingEvents = events.filter((event) => event.status === "Upcoming").length

  const totalGuests = events.reduce((sum, event) => sum + event.guests.length, 0)

  const confirmedGuests = events.reduce(
    (sum, event) => sum + event.guests.filter((g) => g.status === "Confirmed").length,
    0,
  )

  const rsvpRate = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0

  // Find the next upcoming event
  const upcomingEventsList = events
    .filter((event) => event.status === "Upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const nextEvent = upcomingEventsList.length > 0 ? upcomingEventsList[0] : null

  // Calculate time until next event
  let timeUntilNext = "None"
  if (nextEvent) {
    const eventDate = new Date(nextEvent.date)
    const now = new Date()
    const diffTime = Math.abs(eventDate.getTime() - now.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      timeUntilNext = "Today"
    } else if (diffDays === 1) {
      timeUntilNext = "Tomorrow"
    } else {
      timeUntilNext = `${diffDays}d`
    }
  }

  const stats = [
    {
      title: "Total Events",
      value: totalEvents.toString(),
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: `${upcomingEvents} upcoming`,
    },
    {
      title: "Total Guests",
      value: totalGuests.toString(),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Across all events",
    },
    {
      title: "RSVP Rate",
      value: `${rsvpRate}%`,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      description: "Average response rate",
    },
    {
      title: "Next Event",
      value: timeUntilNext,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      description: nextEvent ? nextEvent.title : "No upcoming events",
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

