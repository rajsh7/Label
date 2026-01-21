import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BatchProcessor } from '../BatchProcessor'

// Mock child components
jest.mock('../Step1TemplateSelection', () => ({
  Step1TemplateSelection: ({ onNext }: any) => (
    <div>
      <h2>Step 1: Select Template</h2>
      <button onClick={() => onNext({ templateId: 'template-1' })}>Next</button>
    </div>
  ),
}))

jest.mock('../Step2UploadData', () => ({
  Step2UploadData: ({ onNext }: any) => (
    <div>
      <h2>Step 2: Upload Data</h2>
      <button onClick={() => onNext({ file: new File(['test'], 'test.csv') })}>Next</button>
    </div>
  ),
}))

jest.mock('../Step3ColumnMapping', () => ({
  Step3ColumnMapping: ({ onNext }: any) => (
    <div>
      <h2>Step 3: Map Columns</h2>
      <button onClick={() => onNext({ mappings: {} })}>Next</button>
    </div>
  ),
}))

jest.mock('../Step4Generate', () => ({
  Step4Generate: () => (
    <div>
      <h2>Step 4: Generate</h2>
    </div>
  ),
}))

describe('BatchProcessor', () => {
  it('renders batch processor component', () => {
    render(<BatchProcessor />)

    // Check for step indicator or heading
    const stepText = screen.getAllByText(/step 1/i)
    expect(stepText.length).toBeGreaterThan(0)
  })

  it('shows step 1 initially', () => {
    render(<BatchProcessor />)

    // Check for step heading which is more specific
    expect(screen.getByText(/step 1: select template/i)).toBeInTheDocument()
  })

  it('navigates to next step', async () => {
    render(<BatchProcessor />)

    // Get all Next buttons and click the main navigation one (last one)
    const nextButtons = screen.getAllByText(/next/i)
    const mainNextButton = nextButtons[nextButtons.length - 1]
    fireEvent.click(mainNextButton)

    // After clicking next, should move to step 2
    await waitFor(() => {
      expect(screen.getByText(/upload data/i)).toBeInTheDocument()
    })
  })
})
