"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Share2, Pencil, Copy, Check, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { type Event, getEventById } from "@/lib/local-storage"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/lib/auth-context"

interface EventDetailsProps {
  id: string
  isOwner: boolean
}

export function EventDetails({ id, isOwner }: EventDetailsProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Skip if id is "create"
    if (id === "create") {
      router.push("/events/create/new")
      return
    }

    const fetchedEvent = getEventById(id)
    if (fetchedEvent) {
      setEvent(fetchedEvent)
    } else {
      toast({
        title: "Event Not Found",
        description: "The event you're looking for doesn't exist.",
        variant: "destructive",
      })
    }
  }, [id, router, toast])

  const handleCopyLink = () => {
    const url = `${window.location.origin}/events/${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)

    toast({
      title: "Link Copied",
      description: "Event link has been copied to clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found.</p>
        <Button className="mt-4" asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
          <p className="text-muted-foreground">Created on {new Date(event.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isOwner && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/edit/${id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Event
              </Link>
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Share Event</h4>
                <p className="text-sm text-muted-foreground">Copy the link below to share this event with others.</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/events/${id}`}
                    className="flex-1 px-3 py-2 text-sm border rounded-md"
                  />
                  <Button size="sm" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>Details about the event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="whitespace-pre-line">{event.location}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Guests</h3>
                  <p>
                    {event.guests.filter((g) => g.status === "Confirmed").length} confirmed of {event.guests.length}{" "}
                    invited
                  </p>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {event.guests.length > 0
                        ? Math.round(
                            (event.guests.filter((g) => g.status === "Confirmed").length / event.guests.length) * 100,
                          )
                        : 0}
                      % response rate
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Status</h3>
                  <div className="mt-1">
                    <Badge>{event.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Event Type</h3>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="secondary">{event.isPublic ? "Public" : "Private"}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

