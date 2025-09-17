"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/calendar"
import { ExpenseModal } from "@/components/expense-modal"
import { ExpenseSummary } from "@/components/expense-summary"
import { BudgetModal } from "@/components/budget-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, Target, Edit } from "lucide-react"

export interface Expense {
  id: string
  date: string
  name: string
  amount: number
  category: string
}

export default function ExpenseTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [budgets, setBudgets] = useState<Record<string, number>>({})

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
    const savedBudgets = localStorage.getItem("budgets")
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets))
  }, [budgets])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [...prev, newExpense])
    setIsModalOpen(false)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const handleBudgetSave = (budgetAmount: number) => {
    const budgetKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`
    setBudgets((prev) => ({
      ...prev,
      [budgetKey]: budgetAmount,
    }))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleMonthChange = (monthIndex: string) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(Number.parseInt(monthIndex))
      return newDate
    })
  }

  const handleYearChange = (year: string) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(Number.parseInt(year))
      return newDate
    })
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentDate.getMonth() && expenseDate.getFullYear() === currentDate.getFullYear()
  })

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const budgetKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`
  const currentBudget = budgets[budgetKey] || 0
  const budgetRemaining = currentBudget - totalExpenses
  const budgetProgress = currentBudget > 0 ? (totalExpenses / currentBudget) * 100 : 0

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-foreground">Expense Tracker</h1>
        </div>
        <p className="text-muted-foreground">Track your daily expenses with an intuitive calendar interface</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar currentDate={currentDate} expenses={expenses} onDateClick={handleDateClick} />
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>

            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">₱{currentBudget.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{monthNames[currentDate.getMonth()]} budget</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsBudgetModalOpen(true)} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {currentBudget > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={budgetRemaining >= 0 ? "text-green-600" : "text-red-600"}>
                      ₱{Math.abs(budgetRemaining).toFixed(2)} {budgetRemaining < 0 ? "over" : "left"}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${budgetProgress > 100 ? "bg-red-500" : budgetProgress > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{budgetProgress.toFixed(1)}% used</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₱{totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{currentMonthExpenses.length} expenses recorded</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ${currentMonthExpenses.length > 0 ? (totalExpenses / currentMonthExpenses.length).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Per expense entry</p>
            </CardContent>
          </Card> */}

          <ExpenseSummary expenses={currentMonthExpenses} />
        </div>
      </div>

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={currentBudget}
        monthName={monthNames[currentDate.getMonth()]}
        onSaveBudget={handleBudgetSave}
      />

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
        selectedDate={selectedDate}
        expenses={expenses.filter(
          (expense) => selectedDate && expense.date === selectedDate.toISOString().split("T")[0],
        )}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  )
}
