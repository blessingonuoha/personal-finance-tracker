import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import { Transaction } from "@/lib/models/Transaction"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const minAmount = searchParams.get("minAmount")
    const maxAmount = searchParams.get("maxAmount")

    const query: any = {}

    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    if (category) {
      query.category = category
    }

    if (type) {
      query.type = type
    }

    if (minAmount || maxAmount) {
      query.amount = {}
      if (minAmount) query.amount.$gte = parseFloat(minAmount)
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount)
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean()

    return NextResponse.json({ success: true, data: transactions })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { type, amount, date, category, notes } = body

    if (!type || !amount || !date || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { success: false, error: "Invalid transaction type" },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    const transaction = await Transaction.create({
      type,
      amount,
      date: new Date(date),
      category,
      notes,
    })

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

