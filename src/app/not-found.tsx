import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-6">
          <h1 className="text-6xl font-bold text-[var(--color-text-primary)] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Page Not Found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/dashboard">
            <Button variant="primary">
              <Home size={18} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

