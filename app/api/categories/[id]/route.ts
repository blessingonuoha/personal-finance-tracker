import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import { Category } from "@/lib/models/Category"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const category = await Category.findById(params.id).lean()

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: category })
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
    const { name, type, color } = body

    if (type && type !== "income" && type !== "expense") {
      return NextResponse.json(
        { success: false, error: "Invalid category type" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name) updateData.name = name.trim()
    if (type) updateData.type = type
    if (color !== undefined) updateData.color = color

    const category = await Category.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean()

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: category })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const category = await Category.findByIdAndDelete(params.id).lean()

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

