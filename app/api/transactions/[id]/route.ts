import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import { Transaction } from "@/lib/models/Transaction"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const transaction = await Transaction.findById(params.id).lean()

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await request.json()
    const { type, amount, date, category, notes } = body

    if (type && type !== "income" && type !== "expense") {
      return NextResponse.json(
        { success: false, error: "Invalid transaction type" },
        { status: 400 }
      )
    }

    if (amount !== undefined && amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (type) updateData.type = type
    if (amount !== undefined) updateData.amount = amount
    if (date) updateData.date = new Date(date)
    if (category) updateData.category = category
    if (notes !== undefined) updateData.notes = notes

    const transaction = await Transaction.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean()

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const transaction = await Transaction.findByIdAndDelete(params.id).lean()

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

