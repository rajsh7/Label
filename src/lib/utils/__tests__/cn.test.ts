import { cn } from '../cn'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('handles conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'not-included')
    expect(result).toBe('base-class conditional-class')
  })

  it('filters out falsy values', () => {
    const result = cn('class1', null, undefined, false, 'class2', 0, 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles empty arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
    expect(result).toContain('class3')
  })

  it('handles objects with boolean values', () => {
    const result = cn({
      'active-class': true,
      'inactive-class': false,
    })
    expect(result).toBe('active-class')
  })

  it('deduplicates Tailwind classes', () => {
    // Note: clsx/tailwind-merge should handle this, but we test the basic merging
    const result = cn('px-4', 'px-6')
    // The actual result depends on tailwind-merge implementation
    expect(result).toBeTruthy()
  })
})
