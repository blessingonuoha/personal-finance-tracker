import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import { Transaction } from "@/lib/models/Transaction"
import { format } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const query: any = {}
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean()

    const csvHeaders = ["Type", "Amount", "Date", "Category", "Notes"]
    const csvRows = transactions.map((transaction) => {
      return [
        transaction.type,
        transaction.amount.toString(),
        format(new Date(transaction.date), "yyyy-MM-dd"),
        transaction.category,
        transaction.notes || "",
      ]
    })

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

