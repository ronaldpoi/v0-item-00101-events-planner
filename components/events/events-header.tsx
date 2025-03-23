"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventsHeaderProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function EventsHeader({ activeFilter, onFilterChange }: EventsHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">Manage and track all your events in one place.</p>
        </div>
        <Button asChild>
          <Link href="/events/create/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

