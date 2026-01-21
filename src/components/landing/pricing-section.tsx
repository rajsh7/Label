import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["200 labels per month", "4 batch jobs per month", "Basic label formats", "Email support"],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$7.99",
    period: "per month",
    description: "For growing sellers",
    features: [
      "Unlimited labels",
      "50 batch jobs per month",
      "All 255+ label formats",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Pro trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$39.99",
    period: "per month",
    description: "For high-volume sellers",
    features: [
      "Unlimited everything",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Team collaboration",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-accent font-medium mb-4">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg opacity-70 max-w-2xl mx-auto">
            Choose the plan that fits your business. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-on-scroll relative p-8 rounded-2xl border ${
                plan.popular ? "bg-background text-foreground border-accent" : "bg-foreground/5 border-background/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className={`text-xl font-semibold ${plan.popular ? "text-foreground" : "text-background"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-1 ${plan.popular ? "text-muted-foreground" : "opacity-70"}`}>
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? "text-foreground" : "text-background"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? "text-muted-foreground" : "opacity-70"}`}>
                  /{plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? "text-accent" : "text-accent"}`} />
                    <span className={`text-sm ${plan.popular ? "text-foreground" : "text-background"}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-background text-foreground hover:bg-background/90"
                }`}
                asChild
              >
                <a href={plan.name === "Free" ? "/signup" : plan.name === "Enterprise" ? "/login" : "/signup"}>
                  {plan.cta}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
