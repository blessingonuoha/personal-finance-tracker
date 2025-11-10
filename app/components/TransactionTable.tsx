"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useFinance } from "@/app/contexts/FinanceContext"
import { Transaction } from "@/types"
import { TransactionForm } from "./TransactionForm"
import { Edit, Trash2 } from "lucide-react"

export function TransactionTable() {
  const { transactions, deleteTransaction, categories } = useFinance()
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >()
  const [formOpen, setFormOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    search: "",
  })
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((t) => t.category === filters.category)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase().includes(searchLower) ||
          t.notes?.toLowerCase().includes(searchLower)
      )
    }

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category)
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [transactions, filters, sortBy, sortOrder])

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id)
    }
  }

  const handleSort = (field: "date" | "amount" | "category") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 md:flex-row">
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-sm"
          />
          <div className="flex flex-col gap-2 md:flex-row">
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingTransaction(undefined)
            setFormOpen(true)
          }}
        >
          Add Transaction
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th
                  className="h-12 cursor-pointer px-4 text-left align-middle font-medium hover:bg-muted"
                  onClick={() => handleSort("date")}
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="h-12 cursor-pointer px-4 text-left align-middle font-medium hover:bg-muted"
                  onClick={() => handleSort("amount")}
                >
                  Amount{" "}
                  {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="h-12 cursor-pointer px-4 text-left align-middle font-medium hover:bg-muted"
                  onClick={() => handleSort("category")}
                >
                  Category{" "}
                  {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Notes
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="p-4">{transaction.category}</td>
                    <td className="p-4 capitalize">{transaction.type}</td>
                    <td className="p-4">{transaction.notes || "-"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction._id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingTransaction(undefined)
        }}
        transaction={editingTransaction}
      />
    </div>
  )
}
