import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TransactionForm } from "@/app/components/TransactionForm"
import { FinanceProvider } from "@/app/contexts/FinanceContext"

const mockCategories = [
  { _id: "1", name: "Salary", type: "income" as const },
  { _id: "2", name: "Food", type: "expense" as const },
]

jest.mock("@/app/contexts/FinanceContext", () => ({
  useFinance: () => ({
    categories: mockCategories,
    addTransaction: jest.fn().mockResolvedValue({}),
    updateTransaction: jest.fn().mockResolvedValue({}),
  }),
  FinanceProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe("TransactionForm", () => {
  it("renders form fields", () => {
    render(
      <TransactionForm open={true} onOpenChange={jest.fn()} />
    )

    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    const user = userEvent.setup()
    render(
      <TransactionForm open={true} onOpenChange={jest.fn()} />
    )

    const submitButton = screen.getByRole("button", { name: /add/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument()
    })
  })
})

