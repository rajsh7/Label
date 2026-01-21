import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { Check } from "lucide-react"

const features = [
  "255+ label formats supported",
  "Unlimited label processing",
  "Batch processing & automation",
  "Priority customer support",
]

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <Link href="/" className="text-2xl font-bold">
          LabelPro
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">Start resizing labels in minutes</h2>
            <p className="text-lg text-background/70">
              Join thousands of e-commerce sellers who trust LabelPro for their label management needs.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-background/20 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-background/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-background/40">Free plan available. No credit card required.</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
            <p className="text-muted-foreground">Get started with your free account today</p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
