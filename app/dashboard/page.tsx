"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/app/components/TransactionTable"
import { CategoryForm } from "@/app/components/CategoryForm"
import { AnalyticsCharts } from "@/app/components/Charts"
import { useFinance } from "@/app/contexts/FinanceContext"
import { AnalyticsData } from "@/types"
import { Download } from "lucide-react"

export default function DashboardPage() {
  const { transactions, categories, loading } = useFinance()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics?months=6")
        const data = await res.json()
        if (data.success) {
          setAnalytics(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      }
    }
    fetchAnalytics()
  }, [transactions])

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/export/csv")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to export CSV:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setCategoryFormOpen(true)}>
            Manage Categories
          </Button>
        </div>
      </div>

      {analytics && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${analytics.totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${analytics.totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Net Amount</CardTitle>
              <CardDescription>Income - Expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  analytics.netAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${analytics.netAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AnalyticsCharts />

      <div>
        <h2 className="mb-4 text-2xl font-bold">Transactions</h2>
        <TransactionTable />
      </div>

      <CategoryForm
        open={categoryFormOpen}
        onOpenChange={setCategoryFormOpen}
      />
    </div>
  )
}
