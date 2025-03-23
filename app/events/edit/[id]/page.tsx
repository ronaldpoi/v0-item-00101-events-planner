"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EditEventForm } from "@/components/events/edit-event-form"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { getEventById } from "@/lib/local-storage"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const event = getEventById(params.id)
      if (event) {
        setIsOwner(event.createdBy === user.id)
      } else {
        // Event not found
        router.push("/events")
      }
    }
    setIsLoading(false)
  }, [user, params.id, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Unauthorized</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to edit this event.</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
            <p className="text-muted-foreground">Update your event details below.</p>
          </div>
          <EditEventForm id={params.id} />
        </div>
      </div>
    </AuthGuard>
  )
}

