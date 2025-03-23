import { CreateEventForm } from "@/components/events/create-event-form"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function CreateEventPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details below to create your event.</p>
          </div>
          <CreateEventForm />
        </div>
      </div>
    </AuthGuard>
  )
}

