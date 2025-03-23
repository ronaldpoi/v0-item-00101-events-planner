"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreateEventRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/events/create/new")
  }, [router])

  return (
    <div className="container mx-auto px-4 py-6 text-center">
      <p>Redirecting to event creation page...</p>
    </div>
  )
}

