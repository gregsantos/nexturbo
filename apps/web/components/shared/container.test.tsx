import {describe, it, expect} from "vitest"
import {render, screen} from "@testing-library/react"
import {Container} from "./container"

describe("Container", () => {
  it("renders children correctly", () => {
    render(
      <Container>
        <div data-testid='content'>Test Content</div>
      </Container>
    )

    expect(screen.getByTestId("content")).toBeInTheDocument()
    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("applies default size classes", () => {
    render(<Container>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container).toHaveClass("max-w-7xl")
    expect(container).toHaveClass("mx-auto")
    expect(container).toHaveClass("px-4", "sm:px-6", "lg:px-8")
  })

  it("applies narrow size classes", () => {
    render(<Container size='narrow'>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container).toHaveClass("max-w-3xl")
  })

  it("applies wide size classes", () => {
    render(<Container size='wide'>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container).toHaveClass("max-w-[1400px]")
  })

  it("applies full size classes", () => {
    render(<Container size='full'>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container).toHaveClass("max-w-none")
  })

  it("merges custom className with default classes", () => {
    render(<Container className='custom-class'>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container).toHaveClass("custom-class")
    expect(container).toHaveClass("max-w-7xl") // Default size
    expect(container).toHaveClass("mx-auto")
  })

  it("applies responsive padding classes", () => {
    render(<Container>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container).toHaveClass("px-4")
    expect(container).toHaveClass("sm:px-6")
    expect(container).toHaveClass("lg:px-8")
  })

  it("renders as a div element", () => {
    render(<Container>Content</Container>)
    const container = screen.getByText("Content").parentElement

    expect(container?.tagName).toBe("DIV")
  })
})
