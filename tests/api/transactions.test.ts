import { GET, POST } from "@/app/api/transactions/route"
import { NextRequest } from "next/server"
import connectDB from "@/lib/db/connect"
import { Transaction } from "@/lib/models/Transaction"

jest.mock("@/lib/db/connect")
jest.mock("@/lib/models/Transaction")

describe("/api/transactions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("returns transactions", async () => {
      const mockTransactions = [
        {
          _id: "1",
          type: "income",
          amount: 1000,
          date: new Date(),
          category: "Salary",
        },
      ]

      ;(Transaction.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTransactions),
        }),
      })

      const request = new NextRequest("http://localhost:3000/api/transactions")
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockTransactions)
    })
  })

  describe("POST", () => {
    it("creates a transaction", async () => {
      const mockTransaction = {
        _id: "1",
        type: "income",
        amount: 1000,
        date: new Date(),
        category: "Salary",
      }

      ;(Transaction.create as jest.Mock).mockResolvedValue(mockTransaction)

      const request = new NextRequest("http://localhost:3000/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          type: "income",
          amount: 1000,
          date: new Date().toISOString(),
          category: "Salary",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockTransaction)
    })

    it("validates required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          type: "income",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toContain("Missing required fields")
    })
  })
})

