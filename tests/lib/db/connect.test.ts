import mongoose from "mongoose"
import connectDB from "@/lib/db/connect"

jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {
    readyState: 0,
  },
}))

describe("connectDB", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete (global as any).mongoose
  })

  it("connects to MongoDB", async () => {
    const mockMongoose = { connection: { readyState: 1 } }
    ;(mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose)

    await connectDB()

    expect(mongoose.connect).toHaveBeenCalled()
  })

  it("reuses existing connection", async () => {
    const mockMongoose = { connection: { readyState: 1 } }
    ;(mongoose.connect as jest.Mock).mockResolvedValue(mockMongoose)

    await connectDB()
    await connectDB()

    expect(mongoose.connect).toHaveBeenCalledTimes(1)
  })
})

