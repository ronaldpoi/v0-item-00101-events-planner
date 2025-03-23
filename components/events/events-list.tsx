"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { type Event, getUserEvents, deleteEvent } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface EventsListProps {
  filter: string
}

export function EventsList({ filter }: EventsListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    if (!user) return

    // Get user events from local storage
    const userEvents = getUserEvents(user.id)
    setEvents(userEvents)
  }, [user])

  const handleDeleteEvent = (eventId: string) => {
    const success = deleteEvent(eventId)

    if (success) {
      setEvents(events.filter((event) => event.id !== eventId))

      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
      })
    }
  }

  // Filter events based on selected filter
  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true
    if (filter === "upcoming") return event.status === "Upcoming"
    if (filter === "past") return event.status === "Past"
    if (filter === "draft") return event.status === "Draft"
    return true
  })

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please log in to view your events.</p>
        <Button className="mt-4" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You haven't created any events yet.</p>
        <Button className="mt-4" asChild>
          <Link href="/events/create/new">Create Your First Event</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/events/edit/${event.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Event
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <span>
                    {event.guests.filter((g) => g.status === "Confirmed").length} / {event.guests.length} guests
                    confirmed
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-3">
              <div className="flex gap-2">
                <Badge
                  variant={event.status === "Upcoming" ? "default" : event.status === "Past" ? "secondary" : "outline"}
                >
                  {event.status}
                </Badge>
                <Badge variant="outline">{event.isPublic ? "Public" : "Private"}</Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No events found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}

