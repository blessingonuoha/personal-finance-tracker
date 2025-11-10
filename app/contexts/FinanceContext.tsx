"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Transaction, Category } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface FinanceContextType {
  transactions: Transaction[]
  categories: Category[]
  loading: boolean
  refreshTransactions: () => Promise<void>
  refreshCategories: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, "_id">) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, "_id">) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const refreshTransactions = async () => {
    try {
      const res = await fetch("/api/transactions")
      const data = await res.json()
      if (data.success) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    }
  }

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([refreshTransactions(), refreshCategories()])
      setLoading(false)
    }
    loadData()
  }, [])

  const addTransaction = async (transaction: Omit<Transaction, "_id">) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
      const data = await res.json()
      if (data.success) {
        await refreshTransactions()
        toast({
          title: "Success",
          description: "Transaction added successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateTransaction = async (
    id: string,
    transaction: Partial<Transaction>
  ) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
      const data = await res.json()
      if (data.success) {
        await refreshTransactions()
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        await refreshTransactions()
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  const addCategory = async (category: Omit<Category, "_id">) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })
      const data = await res.json()
      if (data.success) {
        await refreshCategories()
        toast({
          title: "Success",
          description: "Category added successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })
      const data = await res.json()
      if (data.success) {
        await refreshCategories()
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        await refreshCategories()
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        loading,
        refreshTransactions,
        refreshCategories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

