"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  initializeLocalStorage,
  generateSampleData,
} from "@/lib/local-storage"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize local storage
    if (typeof window !== "undefined") {
      initializeLocalStorage()

      // Check if user is already logged in
      const currentUser = getCurrentUser()
      setUser(currentUser)

      // Generate sample data if needed
      if (currentUser) {
        generateSampleData()
      }

      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = loginUser(email, password)
    setUser(user)
    setIsLoading(false)

    if (user) {
      generateSampleData()
      return true
    }

    return false
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

