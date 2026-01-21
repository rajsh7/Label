import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary Button</Button>)

    const button = screen.getByRole('button', { name: /primary button/i })
    expect(button).toHaveClass(/bg-\[var\(--color-primary/)
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>)

    const button = screen.getByRole('button', { name: /secondary button/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>)

    const button = screen.getByRole('button', { name: /outline button/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  it('does not trigger click when disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    )

    const button = screen.getByRole('button', { name: /disabled button/i })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders loading state', () => {
    render(<Button loading>Loading Button</Button>)

    const button = screen.getByRole('button', { name: /loading button/i })
    expect(button).toBeDisabled()
  })
})
