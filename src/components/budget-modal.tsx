"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  currentBudget: number
  monthName: string
  onSaveBudget: (budget: number) => void
}

export function BudgetModal({ isOpen, onClose, currentBudget, monthName, onSaveBudget }: BudgetModalProps) {
  const [budgetValue, setBudgetValue] = useState(currentBudget.toString())

  useEffect(() => {
    setBudgetValue(currentBudget.toString())
  }, [currentBudget])

  const handleSave = () => {
    const budget = Number.parseFloat(budgetValue) || 0
    onSaveBudget(budget)
    onClose()
  }

  const handleCancel = () => {
    setBudgetValue(currentBudget.toString())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Budget for {monthName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget-input">Monthly Budget</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
              <Input
                id="budget-input"
                type="number"
                placeholder="0.00"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                className="pl-7"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Budget</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
