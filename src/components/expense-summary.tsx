"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/components/expense-tracker"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Show top 5 categories

  if (sortedCategories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No expenses this month</p>
        </CardContent>
      </Card>
    )
  }

  const maxAmount = Math.max(...sortedCategories.map(([, amount]) => amount))

  return (
    <Card >
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedCategories.map(([category, amount]) => (
          <div key={category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate">{category}</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
