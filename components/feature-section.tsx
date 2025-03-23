import { Calendar, Users, Mail, CheckSquare, MapPin, DollarSign, Clock, MessageSquare } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Event Creation",
      description: "Create and customize events with all the details including date, time, location, and description.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Guest Management",
      description: "Easily add, edit, and organize your guest list with custom categories and groups.",
    },
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: "Invitations",
      description: "Send personalized invitations via email with beautiful templates and track delivery status.",
    },
    {
      icon: <CheckSquare className="h-10 w-10 text-primary" />,
      title: "RSVP Tracking",
      description: "Monitor guest responses in real-time and get insights on attendance statistics.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Venue Selection",
      description: "Browse and compare venues, check availability, and book directly through our platform.",
    },
    {
      icon: <DollarSign className="h-10 w-10 text-primary" />,
      title: "Budget Management",
      description: "Set budgets, track expenses, and get alerts when you're approaching your limit.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Timeline Planning",
      description: "Create detailed timelines for your event with reminders and notifications.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Guest Communication",
      description: "Send updates, reminders, and important information to all or selected guests.",
    },
  ]

  return (
    <section className="py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need for Successful Events
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our comprehensive platform provides all the tools you need to plan and manage your events from start to
              finish.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="p-2 rounded-full bg-primary/10">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

