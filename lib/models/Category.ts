import mongoose, { Schema, model, models } from "mongoose"

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

CategorySchema.index({ name: 1, type: 1 }, { unique: true })

export const Category = models.Category || model("Category", CategorySchema)

