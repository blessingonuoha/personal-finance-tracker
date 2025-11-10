"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnalyticsData } from "@/types"
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Inbox,
} from "lucide-react"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
]

export function MonthlyBarChart({ data }: { data: AnalyticsData }) {
  const hasData =
    data.monthlyData &&
    data.monthlyData.length > 0 &&
    data.monthlyData.some((month) => month.income > 0 || month.expenses > 0)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
          <CardDescription>Comparison over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground">
            <BarChart3 className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-sm font-medium">No data available</p>
            <p className="mt-1 text-xs">
              Add transactions to see monthly trends
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
        <CardDescription>Comparison over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ExpensePieChart({ data }: { data: AnalyticsData }) {
  const hasData =
    data.categoryBreakdown &&
    data.categoryBreakdown.length > 0 &&
    data.categoryBreakdown.some((cat) => cat.amount > 0)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>By category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground">
            <PieChartIcon className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-sm font-medium">No expense data available</p>
            <p className="mt-1 text-xs">
              Add expense transactions to see category breakdown
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.categoryBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) =>
                `${name}: ${percentage.toFixed(1)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.categoryBreakdown.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function AnalyticsCharts() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-muted-foreground">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Inbox className="mb-4 h-16 w-16 opacity-50" />
            <p className="mb-1 text-base font-medium">
              No analytics data available
            </p>
            <p className="text-sm">
              Start adding transactions to see your financial insights
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MonthlyBarChart data={analytics} />
      <ExpensePieChart data={analytics} />
    </div>
  )
}
