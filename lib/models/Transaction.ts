import mongoose, { Schema, model, models } from "mongoose"

const TransactionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema)

