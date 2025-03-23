"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user ? `Welcome back, ${user.name}!` : "Welcome!"} Here's an overview of your events.
        </p>
      </div>
      <Button asChild>
        <Link href="/events/create/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Link>
      </Button>
    </div>
  )
}

