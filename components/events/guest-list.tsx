"use client"

import { useState, useEffect } from "react"
import { Check, X, UserPlus, MoreHorizontal, Edit, CheckCircle, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { type Event, type Guest, getEventById, updateEvent } from "@/lib/local-storage"

interface GuestListProps {
  id: string
}

export function GuestList({ id }: GuestListProps) {
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false)
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null)
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  useEffect(() => {
    const fetchedEvent = getEventById(id)
    setEvent(fetchedEvent)
  }, [id])

  const handleAddGuest = () => {
    if (!event) return

    // Validate form
    if (!newGuest.name || !newGuest.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }

    // Add new guest
    const guest: Guest = {
      id: Date.now().toString(),
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      status: "Pending",
      notes: newGuest.notes,
    }

    const updatedEvent = { ...event, guests: [...event.guests, guest] }
    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    toast({
      title: "Guest Added",
      description: `${newGuest.name} has been added to the guest list.`,
    })

    // Reset form and close dialog
    setNewGuest({
      name: "",
      email: "",
      phone: "",
      notes: "",
    })
    setIsAddGuestOpen(false)
  }

  const handleEditGuest = () => {
    if (!event || !currentGuest) return

    // Validate form
    if (!currentGuest.name || !currentGuest.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }

    // Update guest
    const updatedGuests = event.guests.map((g) => (g.id === currentGuest.id ? currentGuest : g))

    const updatedEvent = { ...event, guests: updatedGuests }
    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    toast({
      title: "Guest Updated",
      description: `${currentGuest.name}'s information has been updated.`,
    })

    setIsEditGuestOpen(false)
  }

  const handleDeleteGuest = (guestId: string) => {
    if (!event) return

    const guestToDelete = event.guests.find((g) => g.id === guestId)
    if (!guestToDelete) return

    const updatedGuests = event.guests.filter((g) => g.id !== guestId)
    const updatedEvent = { ...event, guests: updatedGuests }

    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    toast({
      title: "Guest Removed",
      description: `${guestToDelete.name} has been removed from the guest list.`,
    })
  }

  const handleUpdateGuestStatus = (guestId: string, status: "Confirmed" | "Pending" | "Declined") => {
    if (!event) return

    const updatedGuests = event.guests.map((g) => (g.id === guestId ? { ...g, status } : g))

    const updatedEvent = { ...event, guests: updatedGuests }
    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    const guest = event.guests.find((g) => g.id === guestId)

    toast({
      title: "Status Updated",
      description: `${guest?.name}'s status has been updated to ${status}.`,
    })
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guest List</h2>
          <p className="text-muted-foreground">Manage your event guests</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
                <DialogDescription>Add a new guest to your event.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newGuest.notes}
                    onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddGuestOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGuest}>Add Guest</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Guest</DialogTitle>
                <DialogDescription>Update guest information.</DialogDescription>
              </DialogHeader>
              {currentGuest && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={currentGuest.name}
                      onChange={(e) => setCurrentGuest({ ...currentGuest, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={currentGuest.email}
                      onChange={(e) => setCurrentGuest({ ...currentGuest, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      value={currentGuest.phone}
                      onChange={(e) => setCurrentGuest({ ...currentGuest, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="edit-notes"
                      value={currentGuest.notes}
                      onChange={(e) => setCurrentGuest({ ...currentGuest, notes: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditGuestOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditGuest}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Guests</CardTitle>
              <CardDescription>
                {event.guests.length} guests total • {event.guests.filter((g) => g.status === "Confirmed").length}{" "}
                confirmed • {event.guests.filter((g) => g.status === "Pending").length} pending •{" "}
                {event.guests.filter((g) => g.status === "Declined").length} declined
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.guests.length > 0 ? (
                event.guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>{guest.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          guest.status === "Confirmed"
                            ? "default"
                            : guest.status === "Pending"
                              ? "outline"
                              : "secondary"
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        {guest.status === "Confirmed" && <CheckCircle className="h-3 w-3" />}
                        {guest.status === "Pending" && <Clock className="h-3 w-3" />}
                        {guest.status === "Declined" && <XCircle className="h-3 w-3" />}
                        {guest.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={guest.notes}>
                      {guest.notes || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentGuest(guest)
                              setIsEditGuestOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Guest
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateGuestStatus(guest.id, "Confirmed")}>
                            <Check className="mr-2 h-4 w-4" />
                            Set to Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateGuestStatus(guest.id, "Pending")}>
                            <Clock className="mr-2 h-4 w-4" />
                            Set to Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateGuestStatus(guest.id, "Declined")}>
                            <X className="mr-2 h-4 w-4" />
                            Set to Declined
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteGuest(guest.id)}>
                            Remove Guest
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No guests added yet. Add your first guest using the button above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

