import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <Link href="/" className="text-2xl font-bold">
          LabelPro
        </Link>

        <div className="space-y-6">
          <blockquote className="text-2xl font-medium leading-relaxed">
            "LabelPro has completely transformed how we handle shipping labels. What used to take hours now takes
            minutes."
          </blockquote>
          <div>
            <p className="font-semibold">Sarah Chen</p>
            <p className="text-background/60">Operations Manager, FastShip Co.</p>
          </div>
        </div>

        <p className="text-sm text-background/40">Trusted by 10,000+ e-commerce sellers worldwide</p>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-xl space-y-8">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-2xl font-bold text-foreground">
              LabelPro
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-foreground hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
