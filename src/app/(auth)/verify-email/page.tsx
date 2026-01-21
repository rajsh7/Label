'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setStatus('error')
        setMessage('No user found. Please log in.')
        return
      }

      if (user.email_confirmed_at) {
        setStatus('success')
        setMessage('Email verified! Redirecting...')
        setTimeout(() => {
          const redirect = searchParams.get('redirect') || '/dashboard'
          router.push(redirect)
        }, 2000)
      } else {
        setStatus('error')
        setMessage('Please check your email and click the verification link.')
      }
    }

    checkVerification()
  }, [router, searchParams])

  const resendEmail = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email })
      setMessage('Verification email sent! Check your inbox.')
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 className="text-3xl font-bold">Email Verification</h2>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </div>

      {status === 'loading' && (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      )}

      {status === 'success' && (
        <div className="text-green-600 text-5xl">✓</div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <Button onClick={resendEmail} className="w-full">
            Resend Verification Email
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
