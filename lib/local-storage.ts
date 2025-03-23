// Type definitions for our data
export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  status: "Confirmed" | "Pending" | "Declined"
  notes: string
}

export interface Expense {
  id: string
  description: string
  category: string
  amount: number
  paid: boolean
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  eventType?: string // Make this optional
  isPublic: boolean
  guests: Guest[]
  expenses: Expense[]
  totalBudget: number
  createdBy: string // User ID
  createdAt: string
  status: "Upcoming" | "Past" | "Draft"
}

// Default user
const DEFAULT_USER: User = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  password: "testpass",
}

// Initialize local storage with default data
export function initializeLocalStorage() {
  if (typeof window === "undefined") return

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([DEFAULT_USER]))
  }

  // Initialize events if not exists
  if (!localStorage.getItem("events")) {
    localStorage.setItem("events", JSON.stringify([]))
  }

  // Initialize current user if not exists
  if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(null))
  }
}

// User related functions
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

export function login(email: string, password: string): User | null {
  if (typeof window === "undefined") return null

  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u: User) => u.email === email && u.password === password)

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }

  return null
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(null))
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Event related functions
export function getAllEvents(): Event[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("events") || "[]")
}

export function getPublicEvents(): Event[] {
  return getAllEvents().filter((event) => event.isPublic)
}

export function getUserEvents(userId: string): Event[] {
  return getAllEvents().filter((event) => event.createdBy === userId)
}

export function getEventById(id: string): Event | null {
  const events = getAllEvents()
  return events.find((event) => event.id === id) || null
}

export function createEvent(event: Omit<Event, "id" | "createdAt">): Event {
  const events = getAllEvents()
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  events.push(newEvent)
  localStorage.setItem("events", JSON.stringify(events))
  return newEvent
}

export function updateEvent(event: Event): Event {
  const events = getAllEvents()
  const index = events.findIndex((e) => e.id === event.id)

  if (index !== -1) {
    events[index] = event
    localStorage.setItem("events", JSON.stringify(events))
  }

  return event
}

export function deleteEvent(id: string): boolean {
  const events = getAllEvents()
  const filteredEvents = events.filter((event) => event.id !== id)

  if (filteredEvents.length !== events.length) {
    localStorage.setItem("events", JSON.stringify(filteredEvents))
    return true
  }

  return false
}

// Guest related functions
export function addGuest(eventId: string, guest: Omit<Guest, "id">): Guest | null {
  const event = getEventById(eventId)

  if (!event) return null

  const newGuest: Guest = {
    ...guest,
    id: Date.now().toString(),
  }

  event.guests.push(newGuest)
  updateEvent(event)

  return newGuest
}

export function updateGuest(eventId: string, guest: Guest): Guest | null {
  const event = getEventById(eventId)

  if (!event) return null

  const index = event.guests.findIndex((g) => g.id === guest.id)

  if (index !== -1) {
    event.guests[index] = guest
    updateEvent(event)
    return guest
  }

  return null
}

export function deleteGuest(eventId: string, guestId: string): boolean {
  const event = getEventById(eventId)

  if (!event) return false

  const initialLength = event.guests.length
  event.guests = event.guests.filter((g) => g.id !== guestId)

  if (event.guests.length !== initialLength) {
    updateEvent(event)
    return true
  }

  return false
}

// Expense related functions
export function addExpense(eventId: string, expense: Omit<Expense, "id">): Expense | null {
  const event = getEventById(eventId)

  if (!event) return null

  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString(),
  }

  event.expenses.push(newExpense)
  updateEvent(event)

  return newExpense
}

export function updateExpense(eventId: string, expense: Expense): Expense | null {
  const event = getEventById(eventId)

  if (!event) return null

  const index = event.expenses.findIndex((e) => e.id === expense.id)

  if (index !== -1) {
    event.expenses[index] = expense
    updateEvent(event)
    return expense
  }

  return null
}

export function deleteExpense(eventId: string, expenseId: string): boolean {
  const event = getEventById(eventId)

  if (!event) return false

  const initialLength = event.expenses.length
  event.expenses = event.expenses.filter((e) => e.id !== expenseId)

  if (event.expenses.length !== initialLength) {
    updateEvent(event)
    return true
  }

  return false
}

// Generate sample data for testing
export function generateSampleData() {
  if (typeof window === "undefined") return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Birthday Party",
      description: "Join us for John's 30th birthday celebration! There will be food, drinks, music, and lots of fun.",
      date: "2023-10-15",
      time: "6:00 PM - 10:00 PM",
      location: "123 Main Street, Apartment 4B, New York, NY 10001",
      eventType: "birthday",
      isPublic: true,
      guests: [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          status: "Confirmed",
          notes: "Allergic to nuts",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "555-987-6543",
          status: "Pending",
          notes: "",
        },
      ],
      expenses: [
        {
          id: "1",
          description: "Venue Rental",
          category: "Venue",
          amount: 1500,
          paid: true,
        },
        {
          id: "2",
          description: "Catering - Food",
          category: "Food & Drinks",
          amount: 1200,
          paid: true,
        },
      ],
      totalBudget: 5000,
      createdBy: currentUser.id,
      createdAt: "2023-09-15T12:00:00Z",
      status: "Upcoming",
    },
    {
      id: "2",
      title: "Team Building",
      description: "Annual company team building event",
      date: "2023-10-22",
      time: "9:00 AM - 5:00 PM",
      location: "Central Park, New York, NY",
      eventType: "corporate",
      isPublic: false,
      guests: [],
      expenses: [],
      totalBudget: 3000,
      createdBy: currentUser.id,
      createdAt: "2023-09-20T10:00:00Z",
      status: "Upcoming",
    },
    {
      id: "3",
      title: "Community Fundraiser",
      description: "Raising funds for the local community center",
      date: "2023-11-05",
      time: "10:00 AM - 4:00 PM",
      location: "Community Center, 456 Park Ave, New York, NY",
      eventType: "social",
      isPublic: true,
      guests: [],
      expenses: [],
      totalBudget: 2000,
      createdBy: "2", // Different user
      createdAt: "2023-09-25T14:00:00Z",
      status: "Upcoming",
    },
  ]

  localStorage.setItem("events", JSON.stringify(sampleEvents))
}

