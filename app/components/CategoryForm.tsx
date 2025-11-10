"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useFinance } from "@/app/contexts/FinanceContext"
import { Category } from "@/types"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
}: CategoryFormProps) {
  const { addCategory, updateCategory } = useFinance()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "expense",
      color: "",
    },
  })

  useEffect(() => {
    if (category) {
      setValue("name", category.name)
      setValue("type", category.type)
      setValue("color", category.color || "")
    } else {
      reset()
    }
  }, [category, setValue, reset])

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitting(true)
    try {
      if (category?._id) {
        await updateCategory(category._id, data)
      } else {
        await addCategory(data)
      }
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error("Failed to save category:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category details below."
              : "Enter the category details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) => setValue("type", value as "income" | "expense")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color (Optional)</Label>
            <Input id="color" type="color" {...register("color")} />
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : category ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

