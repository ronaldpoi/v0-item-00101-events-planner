"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, AlertCircle } from "lucide-react"

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
import { createEvent } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

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

export function CreateEventForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("details")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "My Event",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      maxGuests: "",
      isPublic: false,
    },
    mode: "onChange", // Enable real-time validation
  })

  // Get form errors by tab
  const getTabErrors = (tab: string) => {
    const errors = form.formState.errors
    switch (tab) {
      case "details":
        return Object.keys(errors).filter(key => ["title", "date", "startTime"].includes(key))
      case "venue":
        return Object.keys(errors).filter(key => ["location"].includes(key))
      default:
        return []
    }
  }

  // Handle tab change with validation
  const handleTabChange = (value: string) => {
    const currentTabErrors = getTabErrors(activeTab)
    if (currentTabErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the current tab before switching.",
        variant: "destructive",
      })
      return
    }
    setActiveTab(value)
  }

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Format the date and time
    const formattedDate = format(values.date, "MMM dd, yyyy")
    const formattedTime = values.endTime ? `${values.startTime} - ${values.endTime}` : values.startTime

    // Create the event
    const newEvent = createEvent({
      title: values.title,
      description: values.description || "",
      date: formattedDate,
      time: formattedTime,
      location: values.location,
      isPublic: values.isPublic,
      guests: [],
      expenses: [],
      totalBudget: 5000, // Default budget
      createdBy: user.id,
      status: "Upcoming",
      eventType: "other", // Default value since we're removing the field
    })

    toast({
      title: "Event Created",
      description: "Your event has been created successfully.",
    })

    // Navigate to the event page
    router.push(`/events/${newEvent.id}`)
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="details" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="relative">
                Event Details
                {getTabErrors("details").length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {getTabErrors("details").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="venue" className="relative">
                Venue & Budget
                {getTabErrors("venue").length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {getTabErrors("venue").length}
                  </Badge>
                )}
              </TabsTrigger>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
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
                              Budget planning will be available after creating the event.
                            </p>
                            <Button variant="outline" type="button" disabled>
                              Set Up Budget Later
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
                              You'll be able to add guests and send invitations after creating the event.
                            </p>
                            <Button variant="outline" type="button" disabled>
                              Manage Guests Later
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

          <div className="flex flex-col gap-4">
            {/* Validation Summary */}
            {Object.keys(form.formState.errors).length > 0 && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <h3 className="font-medium">Required Fields Missing</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    {Object.entries(form.formState.errors).map(([field, error]) => (
                      <li key={field} className="flex items-center gap-2">
                        <span className="font-medium">{field}:</span>
                        <span>{error.message}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/events")}>
                Cancel
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        type="submit" 
                        disabled={Object.keys(form.formState.errors).length > 0}
                      >
                        Create Event
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {Object.keys(form.formState.errors).length > 0 && (
                    <TooltipContent>
                      <p>Please fix all required fields before creating the event</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

