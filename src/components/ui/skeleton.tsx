import { cn } from '@/lib/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangle' | 'circle'
  width?: string
  height?: string
}

export function Skeleton({
  className,
  variant = 'rectangle',
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted rounded',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded-md',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}
