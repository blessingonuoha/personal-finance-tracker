import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import { Category } from "@/lib/models/Category"

async function seedDefaultExpenseCategories() {
  const defaultExpenseCategories = [
    { name: "Food and Dining", type: "expense" as const },
    { name: "Housing", type: "expense" as const },
    { name: "Transportation", type: "expense" as const },
  ]

  for (const category of defaultExpenseCategories) {
    await Category.findOneAndUpdate(
      { name: category.name, type: category.type },
      category,
      { upsert: true, new: true }
    )
  }
}

async function seedDefaultIncomeCategories() {
  const defaultIncomeCategories = [
    { name: "Salary", type: "income" as const },
    { name: "Freelance", type: "income" as const },
    { name: "Dividends", type: "income" as const },
  ]

  for (const category of defaultIncomeCategories) {
    await Category.findOneAndUpdate(
      { name: category.name, type: category.type },
      category,
      { upsert: true, new: true }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Seed default categories if they don't exist
    const expenseCategoryCount = await Category.countDocuments({ type: "expense" })
    const incomeCategoryCount = await Category.countDocuments({ type: "income" })
    
    if (expenseCategoryCount === 0) {
      await seedDefaultExpenseCategories()
    }
    
    if (incomeCategoryCount === 0) {
      await seedDefaultIncomeCategories()
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")

    const query: any = {}
    if (type) {
      query.type = type
    }

    const categories = await Category.find(query).sort({ name: 1 }).lean()

    return NextResponse.json({ success: true, data: categories })
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
    const { name, type, color } = body

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { success: false, error: "Invalid category type" },
        { status: 400 }
      )
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      color,
    })

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Category already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

