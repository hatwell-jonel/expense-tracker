"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ChevronUp } from "lucide-react"
import type { Expense } from "@/components/expense-tracker"

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onAddExpense: (expense: Omit<Expense, "id">) => void
  selectedDate: Date | null
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other",
]

export function ExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
  selectedDate,
  expenses,
  onDeleteExpense,
}: ExpenseModalProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setName("")
      setAmount("")
      setCategory("")
      setShowForm(false)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !name || !amount || !category) return

    onAddExpense({
      date: selectedDate.toISOString().split("T")[0],
      name,
      amount: Number.parseFloat(amount),
      category,
    })

    setName("")
    setAmount("")
    setCategory("")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedDate ? formatDate(selectedDate) : "Expenses"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">

            {expenses.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{expense.name}</p>
                      <p className="text-xs text-muted-foreground">{expense.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">₱{expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No expenses recorded for this day</p>
                <p className="text-xs mt-1">Click "Add Expense" to get started</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Expenses for this day</h4>
            <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="h-8">
              {showForm ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Form
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Expense
                </>
              )}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="expense-name">Expense Name</Label>
                <Input
                  id="expense-name"
                  placeholder="e.g., Lunch at restaurant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
