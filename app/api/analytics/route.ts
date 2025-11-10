import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import { Transaction } from "@/lib/models/Transaction"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const months = parseInt(searchParams.get("months") || "6")

    const endDate = new Date()
    const startDate = subMonths(endDate, months - 1)

    const transactions = await Transaction.find({
      date: {
        $gte: startOfMonth(startDate),
        $lte: endOfMonth(endDate),
      },
    }).lean()

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const netAmount = totalIncome - totalExpenses

    const monthlyDataMap = new Map<string, { income: number; expenses: number }>()

    transactions.forEach((transaction) => {
      const monthKey = format(new Date(transaction.date), "yyyy-MM")
      if (!monthlyDataMap.has(monthKey)) {
        monthlyDataMap.set(monthKey, { income: 0, expenses: 0 })
      }
      const monthData = monthlyDataMap.get(monthKey)!
      if (transaction.type === "income") {
        monthData.income += transaction.amount
      } else {
        monthData.expenses += transaction.amount
      }
    })

    const monthlyData = Array.from(monthlyDataMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    const expenseTransactions = transactions.filter((t) => t.type === "expense")
    const categoryMap = new Map<string, number>()

    expenseTransactions.forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0
      categoryMap.set(transaction.category, current + transaction.amount)
    })

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netAmount,
        monthlyData,
        categoryBreakdown,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

