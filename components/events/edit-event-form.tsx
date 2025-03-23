"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { getEventById, updateEvent } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

// Helper function to convert 12-hour format to 24-hour format
function convertTo24HourFormat(timeStr: string): string {
  try {
    timeStr = timeStr.trim()
    if (!timeStr) return ""

    // If already in 24-hour format (no AM/PM), return as is
    if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
      return timeStr
    }

    const isPM = timeStr.includes("PM")
    const timeOnly = timeStr.replace(/\s*[AP]M\s*/, "").trim()

    // Handle cases with no colon
    if (!timeOnly.includes(":")) {
      const hour = Number.parseInt(timeOnly)
      if (isNaN(hour)) return "12:00"

      const hour24 = isPM && hour < 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour
      return `${hour24.toString().padStart(2, "0")}:00`
    }

    const [hourStr, minuteStr] = timeOnly.split(":")
    const hour = Number.parseInt(hourStr)
    const minute = Number.parseInt(minuteStr)

    if (isNaN(hour) || isNaN(minute)) return "12:00"

    const hour24 = isPM && hour < 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour
    return `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  } catch (error) {
    console.error("Error converting time format:", error)
    return "12:00"
  }
}

// Helper function to format time for display
function formatTimeDisplay(time24: string): string {
  try {
    if (!time24 || !time24.includes(":")) return "12:00 PM"

    const [hourStr, minuteStr] = time24.split(":")
    const hour = Number.parseInt(hourStr)
    const minute = Number.parseInt(minuteStr)

    if (isNaN(hour) || isNaN(minute)) return "12:00 PM"

    const period = hour >= 12 ? "PM" : "AM"
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
  } catch (error) {
    console.error("Error formatting time for display:", error)
    return "12:00 PM"
  }
}

// Form schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Event title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  date: z.date({
    required_error: "Event date is required.",
  }),
  startTime: z.string({
    required_error: "Start time is required.",
  }),
  endTime: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  maxGuests: z.string().optional(),
  isPublic: z.boolean().default(false),
})

interface EditEventFormProps {
  id: string
}

export function EditEventForm({ id }: EditEventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      maxGuests: "",
      isPublic: false,
    },
  })

  useEffect(() => {
    if (!user) return

    const event = getEventById(id)
    if (event) {
      // Parse date from string to Date object with better error handling
      let eventDate: Date = new Date()
      try {
        // Try different date formats
        if (event.date) {
          const formats = ["MMM dd, yyyy", "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy"]
          let parsed = false

          for (const formatStr of formats) {
            try {
              eventDate = parse(event.date, formatStr, new Date())
              if (isValid(eventDate)) {
                parsed = true
                break
              }
            } catch (e) {
              // Continue trying other formats
            }
          }

          if (!parsed) {
            // If all parsing attempts fail, try to extract date parts manually
            const dateMatch = event.date.match(/(\d{1,4})[/\-\s,.]+(\d{1,2})[/\-\s,.]+(\d{1,4})/)
            if (dateMatch) {
              const [_, part1, part2, part3] = dateMatch
              // Try different arrangements of the parts
              const attempts = [
                new Date(`${part1}-${part2}-${part3}`),
                new Date(`${part3}-${part2}-${part1}`),
                new Date(`${part2}-${part1}-${part3}`),
                new Date(`${part2}-${part3}-${part1}`),
              ]

              for (const attempt of attempts) {
                if (isValid(attempt)) {
                  eventDate = attempt
                  parsed = true
                  break
                }
              }
            }
          }

          // If still not parsed, use current date
          if (!parsed) {
            eventDate = new Date()
          }
        }
      } catch (error) {
        console.error("Error parsing date:", error)
        eventDate = new Date()
      }

      // Parse time with better error handling
      let startTime = ""
      let endTime = ""

      try {
        if (event.time.includes("-")) {
          const [start, end] = event.time.split("-").map((t) => t.trim())

          // Convert to 24-hour format if needed
          startTime = start.includes("AM") || start.includes("PM") ? convertTo24HourFormat(start) : start

          endTime = end.includes("AM") || end.includes("PM") ? convertTo24HourFormat(end) : end
        } else {
          startTime =
            event.time.includes("AM") || event.time.includes("PM") ? convertTo24HourFormat(event.time) : event.time
        }
      } catch (error) {
        console.error("Error parsing time:", error)
        startTime = "12:00"
        endTime = ""
      }

      form.reset({
        title: event.title,
        description: event.description || "",
        date: eventDate,
        startTime,
        endTime: endTime || "",
        location: event.location,
        maxGuests: "",
        isPublic: event.isPublic,
      })
    }
    setIsLoading(false)
  }, [user, id, form])

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update an event.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const event = getEventById(id)
    if (!event) {
      toast({
        title: "Error",
        description: "Event not found.",
        variant: "destructive",
      })
      return
    }

    // Format the date and time with better error handling
    const formattedDate = format(values.date, "MMM dd, yyyy")
    let formattedTime = ""

    try {
      if (values.startTime) {
        if (values.endTime) {
          formattedTime = `${formatTimeDisplay(values.startTime)} - ${formatTimeDisplay(values.endTime)}`
        } else {
          formattedTime = formatTimeDisplay(values.startTime)
        }
      } else {
        formattedTime = "12:00 PM" // Default time if none provided
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      formattedTime = "12:00 PM" // Fallback
    }

    // Update the event
    const updatedEvent = {
      ...event,
      title: values.title,
      description: values.description || "",
      date: formattedDate,
      time: formattedTime,
      location: values.location,
      isPublic: values.isPublic,
    }

    updateEvent(updatedEvent)

    toast({
      title: "Event Updated",
      description: "Your event has been updated successfully.",
    })

    // Navigate to the event page
    router.push(`/events/${id}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="venue">Venue & Budget</TabsTrigger>
              <TabsTrigger value="guests">Guest List</TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter event title" {...field} />
                            </FormControl>
                            <FormDescription>This is the name of your event.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter event description" className="resize-none" {...field} />
                            </FormControl>
                            <FormDescription>Provide details about your event.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Event Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Public Event</FormLabel>
                              <FormDescription>Make this event visible to everyone on the platform.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="venue">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter venue or address" {...field} />
                            </FormControl>
                            <FormDescription>Where will the event take place?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxGuests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Guests</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter max number of guests" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Budget Planning</h3>
                        <Card className="border-dashed">
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                              Budget planning is available in the Budget tab after saving your event.
                            </p>
                            <Button variant="outline" type="button" asChild>
                              <Link href={`/events/${id}`}>Go to Event</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guests">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Guest Management</h3>
                        <Card className="border-dashed">
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                              Guest management is available in the Guest List tab after saving your event.
                            </p>
                            <Button variant="outline" type="button" asChild>
                              <Link href={`/events/${id}`}>Go to Event</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/events/${id}`)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

