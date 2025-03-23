"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { EventDetails } from "@/components/events/event-details"
import { GuestList } from "@/components/events/guest-list"
import { BudgetOverview } from "@/components/events/budget-overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getEventById } from "@/lib/local-storage"
import { toast } from "@/components/ui/use-toast"

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    // Immediately redirect if the ID is "create"
    if (resolvedParams.id === "create") {
      router.push("/events/create/new")
      return
    }

    if (user) {
      const event = getEventById(resolvedParams.id)
      if (event) {
        setIsOwner(event.createdBy === user.id)
      } else {
        // Event not found
        toast({
          title: "Event Not Found",
          description: "The event you're looking for doesn't exist.",
          variant: "destructive",
        })
        router.push("/events")
      }
    }
  }, [user, resolvedParams.id, router])

  // For logged out users or non-owners viewing public events, only show event details
  if (!user || !isOwner) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EventDetails id={resolvedParams.id} isOwner={isOwner} />
      </div>
    )
  }

  // For event owners, show all tabs
  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <EventDetails id={resolvedParams.id} isOwner={isOwner} />
        </TabsContent>
        <TabsContent value="guests">
          <GuestList id={resolvedParams.id} />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetOverview id={resolvedParams.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

