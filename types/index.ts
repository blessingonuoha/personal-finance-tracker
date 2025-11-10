export interface Transaction {
  _id?: string
  type: "income" | "expense"
  amount: number
  date: Date | string
  category: string
  notes?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface Category {
  _id?: string
  name: string
  type: "income" | "expense"
  color?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface AnalyticsData {
  totalIncome: number
  totalExpenses: number
  netAmount: number
  monthlyData: {
    month: string
    income: number
    expenses: number
  }[]
  categoryBreakdown: {
    category: string
    amount: number
    percentage: number
  }[]
}

