"use client"

import { useState } from "react"
import { UserPlus, CheckCircle, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

// Mock activity data - in a real app, this would come from an API
const mockActivities = [
  {
    id: "1",
    type: "rsvp",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    event: "Birthday Party",
    time: "2 hours ago",
    icon: <CheckCircle className="h-4 w-4" />,
    description: "RSVP'd Yes to your event",
  },
  {
    id: "2",
    type: "guest",
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    event: "Team Building",
    time: "5 hours ago",
    icon: <UserPlus className="h-4 w-4" />,
    description: "Added to guest list",
  },
  {
    id: "3",
    type: "edit",
    user: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    event: "Birthday Party",
    time: "Yesterday",
    icon: <Edit className="h-4 w-4" />,
    description: "Updated event details",
  },
]

export function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState(mockActivities)

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Please log in to view your recent activity.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your events.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description} on <span className="font-medium">{activity.event}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-muted p-1">{activity.icon}</div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

