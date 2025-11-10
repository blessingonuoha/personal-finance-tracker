"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useFinance } from "@/app/contexts/FinanceContext"
import { Transaction } from "@/types"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
}: TransactionFormProps) {
  const { addTransaction, updateTransaction, categories } = useFinance()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      category: "",
      notes: "",
    },
  })

  const type = watch("type")
  const dateValue = watch("date")
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    if (transaction) {
      setValue("type", transaction.type)
      setValue("amount", transaction.amount)
      setValue("date", format(new Date(transaction.date), "yyyy-MM-dd"))
      setValue("category", transaction.category)
      setValue("notes", transaction.notes || "")
    } else {
      reset()
    }
  }, [transaction, setValue, reset])

  const filteredCategories = categories.filter((cat) => cat.type === type)

  const onSubmit = async (data: TransactionFormData) => {
    setSubmitting(true)
    try {
      if (transaction?._id) {
        await updateTransaction(transaction._id, data)
      } else {
        await addTransaction(data)
      }
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error("Failed to save transaction:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Update the transaction details below."
              : "Enter the transaction details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value) =>
                setValue("type", value as "income" | "expense")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue ? (
                    format(new Date(dateValue), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue ? new Date(dateValue) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setValue("date", format(date, "yyyy-MM-dd"))
                      setCalendarOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" {...register("notes")} />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : transaction ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
