import {describe, it, expect, vi} from "vitest"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Button} from "./button"

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies default variant classes", () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-primary")
  })

  it("applies destructive variant classes", () => {
    render(<Button variant='destructive'>Delete</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-destructive")
  })

  it("applies outline variant classes", () => {
    render(<Button variant='outline'>Outline</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("border-input")
  })

  it("applies ghost variant classes", () => {
    render(<Button variant='ghost'>Ghost</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("hover:bg-accent")
  })

  it("applies link variant classes", () => {
    render(<Button variant='link'>Link</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("underline-offset-4")
  })

  it("applies size variants correctly", () => {
    const {rerender} = render(<Button size='sm'>Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-9")

    rerender(<Button size='lg'>Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-11")

    rerender(<Button size='icon'>Icon</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10", "w-10")
  })

  it("handles click events", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByText("Click me"))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("merges custom className with variant classes", () => {
    render(<Button className='custom-class'>Custom</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-class", "bg-primary")
  })

  it("accepts and passes through HTML button attributes", () => {
    render(
      <Button type='submit' data-testid='submit-button'>
        Submit
      </Button>
    )
    const button = screen.getByTestId("submit-button")
    expect(button).toHaveAttribute("type", "submit")
  })
})
