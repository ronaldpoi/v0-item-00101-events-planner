import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Mail, CheckSquare } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Event Planning Made Simple</div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Plan Your Perfect Event with Ease</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create, manage, and host memorable events with our all-in-one platform. From guest lists to RSVPs, we've
              got you covered.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/events/create/new">Create Event</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto grid max-w-screen-sm gap-4 sm:grid-cols-2">
            <div className="grid gap-1 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <Calendar className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Event Creation</h3>
              <p className="text-sm text-muted-foreground">
                Create and customize events with all the details you need.
              </p>
            </div>
            <div className="grid gap-1 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Guest Management</h3>
              <p className="text-sm text-muted-foreground">
                Easily manage your guest list and track RSVPs in real-time.
              </p>
            </div>
            <div className="grid gap-1 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <Mail className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Invitations</h3>
              <p className="text-sm text-muted-foreground">Send beautiful, personalized invitations to your guests.</p>
            </div>
            <div className="grid gap-1 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <CheckSquare className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Budget Tracking</h3>
              <p className="text-sm text-muted-foreground">Keep track of your event budget and expenses.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

