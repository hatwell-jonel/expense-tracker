"use client"

import { cn } from "@/lib/utils"
import type { Expense } from "@/components/expense-tracker"

interface CalendarProps {
  currentDate: Date
  expenses: Expense[]
  onDateClick: (date: Date) => void
}

export function Calendar({ currentDate, expenses, onDateClick }: CalendarProps) {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getExpensesForDate = (day: number) => {
    const dateString = new Date(year, month, day).toISOString().split("T")[0]
    return expenses.filter((expense) => expense.date === dateString)
  }

  const getTotalForDate = (day: number) => {
    const dayExpenses = getExpensesForDate(day)
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full">

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {

          if (day === null) {
            return <div key={index} className="aspect-square" />
          }

          const dayExpenses = getExpensesForDate(day)
          const totalAmount = getTotalForDate(day)
          const hasExpenses = dayExpenses.length > 0

          return (
            <button
              key={index}
              onClick={() => onDateClick(new Date(year, month, day))}
              className={cn(
                "cursor-pointer aspect-square p-1 text-sm border transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "flex flex-col items-start justify-start overflow-hidden",
                isToday(day) && "bg-primary text-primary-foreground font-semibold",
                hasExpenses && !isToday(day) && "bg-secondary/20 border-secondary text-foreground",
                !hasExpenses && !isToday(day) && "bg-card text-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className={cn("text-sm mb-1", isToday(day) && "font-bold")}>{day}</span>
              
              {hasExpenses && (
                <div className="w-full text-left">
                  {dayExpenses.slice(0, 3).map((expense, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "text-md leading-tight mb-0.5 flex items-start",
                        isToday(day) ? "text-primary-foreground/90" : "text-muted-foreground",
                      )}
                    >
                      <span className="mr-1">•</span>
                      <span className="truncate">{expense.name}</span>
                    </div>
                  ))}

                  {dayExpenses.length > 3 && (
                    <div
                      className={cn(
                        "text-xs",
                        isToday(day) ? "text-primary-foreground/70" : "text-muted-foreground/70",
                      )}
                    >
                      +{dayExpenses.length - 3} more
                    </div>
                  )}

                </div>
              )}

            </button>
          )
        })}
      </div>
    </div>
  )
}
