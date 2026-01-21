import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LabelBrowser } from '../LabelBrowser'

// Mock the hooks and components
jest.mock('@/lib/hooks/useLabels', () => ({
  useLabels: () => ({
    filteredLabels: [
      {
        id: 'label-1',
        name: 'Amazon FBA 4x6',
        category: 'Amazon FBA',
        width_mm: 101.6,
        height_mm: 152.4,
      },
      {
        id: 'label-2',
        name: 'Walmart FWA 4x6',
        category: 'Walmart FWA',
        width_mm: 101.6,
        height_mm: 152.4,
      },
    ],
    loading: false,
    error: null,
    totalCount: 2,
    hasMore: false,
    loadMore: jest.fn(),
    filters: {},
    setFilters: jest.fn(),
    clearFilters: jest.fn(),
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
    },
  },
}))

describe('LabelBrowser', () => {
  it('renders label browser with labels', () => {
    render(<LabelBrowser />)

    expect(screen.getByText('Amazon FBA 4x6')).toBeInTheDocument()
    expect(screen.getByText('Walmart FWA 4x6')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<LabelBrowser />)

    const searchInput = screen.getByPlaceholderText(/search labels/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('displays filter sidebar', () => {
    render(<LabelBrowser />)

    // Check if search input is rendered (indicates filter sidebar is present)
    const searchInput = screen.getByPlaceholderText(/search labels/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('renders label cards with label names', () => {
    render(<LabelBrowser />)

    // Check if label names are rendered
    expect(screen.getByText('Amazon FBA 4x6')).toBeInTheDocument()
    expect(screen.getByText('Walmart FWA 4x6')).toBeInTheDocument()
  })
})
