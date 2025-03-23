"use client"

import { useState, useEffect } from "react"
import { DollarSign, PlusCircle, Trash2, Edit, Save, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { type Event, type Expense, getEventById, updateEvent } from "@/lib/local-storage"
import { Label } from "@/components/ui/label"

interface BudgetOverviewProps {
  id: string
}

export function BudgetOverview({ id }: BudgetOverviewProps) {
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [totalBudget, setTotalBudget] = useState("")
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "",
    amount: "",
  })

  useEffect(() => {
    const fetchedEvent = getEventById(id)
    if (fetchedEvent) {
      setEvent(fetchedEvent)
      setTotalBudget(fetchedEvent.totalBudget.toString())
    }
  }, [id])

  const handleSaveBudget = () => {
    if (!event) return

    const budget = Number.parseFloat(totalBudget)
    if (isNaN(budget) || budget <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid budget amount.",
        variant: "destructive",
      })
      return
    }

    const updatedEvent = { ...event, totalBudget: budget }
    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    setIsEditingBudget(false)
    toast({
      title: "Budget Updated",
      description: `Total budget has been updated to $${budget.toFixed(2)}.`,
    })
  }

  const handleAddExpense = () => {
    if (!event) return

    // Validate form
    if (!newExpense.description || !newExpense.category || !newExpense.amount) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(newExpense.amount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    // Add new expense
    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      category: newExpense.category,
      amount: amount,
      paid: false,
    }

    const updatedEvent = { ...event, expenses: [...event.expenses, expense] }
    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    // Reset form and close
    setNewExpense({
      description: "",
      category: "",
      amount: "",
    })
    setIsAddingExpense(false)

    toast({
      title: "Expense Added",
      description: `${expense.description} has been added to your budget.`,
    })
  }

  const handleDeleteExpense = (id: string) => {
    if (!event) return

    const updatedExpenses = event.expenses.filter((expense) => expense.id !== id)
    const updatedEvent = { ...event, expenses: updatedExpenses }

    updateEvent(updatedEvent)
    setEvent(updatedEvent)

    toast({
      title: "Expense Deleted",
      description: "The expense has been removed from your budget.",
    })
  }

  const handleTogglePaid = (id: string) => {
    if (!event) return

    const updatedExpenses = event.expenses.map((expense) =>
      expense.id === id ? { ...expense, paid: !expense.paid } : expense,
    )

    const updatedEvent = { ...event, expenses: updatedExpenses }
    updateEvent(updatedEvent)
    setEvent(updatedEvent)
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    )
  }

  const totalExpenses = event.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalPaid = event.expenses.filter((expense) => expense.paid).reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = event.totalBudget - totalExpenses
  const budgetProgress = (totalExpenses / event.totalBudget) * 100

  const categories = [
    "Venue",
    "Food & Drinks",
    "Entertainment",
    "Decor",
    "Photography",
    "Transportation",
    "Attire",
    "Gifts",
    "Other",
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Budget</h2>
          <p className="text-muted-foreground">Track and manage your event expenses</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Track your spending against your total budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Budget</span>
                {isEditingBudget ? (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="w-24 h-8"
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveBudget}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">${event.totalBudget.toFixed(2)}</span>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingBudget(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Expenses</span>
                <span className="text-xl font-bold">${totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remaining Budget</span>
                <span className={`text-xl font-bold ${remainingBudget < 0 ? "text-destructive" : ""}`}>
                  ${remainingBudget.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Budget Used</span>
                <span className="text-sm font-medium">{budgetProgress.toFixed(0)}%</span>
              </div>
              <Progress value={budgetProgress} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paid Expenses</span>
                <span className="text-sm font-medium">
                  ${totalPaid.toFixed(2)}({totalExpenses > 0 ? ((totalPaid / totalExpenses) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <Progress value={totalExpenses > 0 ? (totalPaid / totalExpenses) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>See where your money is being spent</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <PieChart className="h-24 w-24 mx-auto text-primary" />
              <div className="space-y-2">
                {Array.from(new Set(event.expenses.map((e) => e.category))).map((category, index) => {
                  const categoryTotal = event.expenses
                    .filter((e) => e.category === category)
                    .reduce((sum, e) => sum + e.amount, 0)
                  const percentage = totalExpenses > 0 ? ((categoryTotal / totalExpenses) * 100).toFixed(0) : 0

                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{category}</span>
                      <div className="flex items-center space-x-2">
                        <span>${categoryTotal.toFixed(2)}</span>
                        <span className="text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Manage your event expenses</CardDescription>
            </div>
            <Button onClick={() => setIsAddingExpense(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingExpense && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Add New Expense</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Amount ($)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <Button onClick={handleAddExpense} className="flex-1">
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingExpense(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.expenses.length > 0 ? (
                event.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={expense.paid ? "text-primary" : "text-muted-foreground"}
                        onClick={() => handleTogglePaid(expense.id)}
                      >
                        {expense.paid ? "Paid" : "Unpaid"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No expenses added yet. Add your first expense to start tracking.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">{event.expenses.length} expenses total</div>
          <div className="font-medium">Total: ${totalExpenses.toFixed(2)}</div>
        </CardFooter>
      </Card>
    </div>
  )
}

