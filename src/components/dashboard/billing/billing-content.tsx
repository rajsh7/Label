"use client"

import { useState, useEffect } from "react"
import {
  Download,
  Check,
  Crown,
  Zap,
  Building2,
  Calendar,
  AlertCircle,
  Plus,
  MoreHorizontal,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
    icon: Zap,
    features: ["200 labels per month", "4 batch jobs per month", "Basic label formats", "Email support"],
    limits: { labels: 200, batches: 4 },
  },
  {
    id: "pro",
    name: "Pro",
    price: 7.99,
    period: "per month",
    description: "For growing sellers",
    icon: Crown,
    popular: true,
    features: [
      "Unlimited labels",
      "50 batch jobs per month",
      "All 255+ label formats",
      "Priority support",
      "Custom branding",
    ],
    limits: { labels: -1, batches: 50 },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 39.99,
    period: "per month",
    description: "For high-volume sellers",
    icon: Building2,
    features: [
      "Unlimited everything",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Team collaboration",
    ],
    limits: { labels: -1, batches: -1 },
  },
]

export function BillingContent() {
  const [currentPlan, setCurrentPlan] = useState("free")
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [usage, setUsage] = useState({ labels: 0, batches: 0 })
  const [invoices, setInvoices] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUser(user)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setProfile(profile)
      setCurrentPlan(profile.plan || 'free')
    }

    // Get label count
    const { count: labelCount } = await supabase
      .from('labels')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get batch count for current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: batchCount } = await supabase
      .from('batch_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())

    setUsage({ labels: labelCount || 0, batches: batchCount || 0 })

    // Get invoices (if you have an invoices table)
    const { data: invoicesData } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    setInvoices(invoicesData || [])

    // Get payment methods (if you have a payment_methods table)
    const { data: paymentData } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    setPaymentMethods(paymentData || [])
  }

  const currentPlanData = plans.find((p) => p.id === currentPlan)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription, payment methods, and invoices</p>
      </div>

      <div className="space-y-6">
        <Card className="border-accent/50">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                {currentPlanData && <currentPlanData.icon className="w-6 h-6 text-accent" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">{currentPlanData?.name} Plan</CardTitle>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Active</Badge>
                </div>
                <CardDescription className="mt-1">{currentPlanData?.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">
                ${currentPlanData?.price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Renews Feb 1, 2026
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Labels processed</span>
                  <span className="font-medium text-foreground">{usage.labels.toLocaleString()} / Unlimited</span>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-muted-foreground">No limit on Pro plan</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Batch jobs this month</span>
                  <span className="font-medium text-foreground">
                    {usage.batches} / {currentPlanData?.limits.batches}
                  </span>
                </div>
                <Progress value={(usage.batches / (currentPlanData?.limits.batches || 1)) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {(currentPlanData?.limits.batches || 0) - usage.batches} batch jobs remaining
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 pt-6 border-t border-border">
              <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Enterprise
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Choose a plan</DialogTitle>
                    <DialogDescription>Select the plan that best fits your business needs</DialogDescription>
                  </DialogHeader>
                  <div className="grid sm:grid-cols-3 gap-4 py-4">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={cn(
                          "relative p-4 rounded-xl border text-left transition-all",
                          selectedPlan === plan.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50",
                          plan.id === currentPlan && "opacity-50",
                        )}
                        disabled={plan.id === currentPlan}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs">
                            Popular
                          </Badge>
                        )}
                        <plan.icon className="w-5 h-5 text-accent mb-2" />
                        <h3 className="font-semibold text-foreground">{plan.name}</h3>
                        <div className="mt-1">
                          <span className="text-xl font-bold text-foreground">${plan.price}</span>
                          <span className="text-xs text-muted-foreground">/{plan.period}</span>
                        </div>
                        <ul className="mt-3 space-y-1">
                          {plan.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-accent" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {plan.id === currentPlan && (
                          <Badge variant="secondary" className="mt-3">
                            Current plan
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                      Cancel
                    </Button>
                    <Button disabled={!selectedPlan || selectedPlan === currentPlan}>
                      {selectedPlan === "free" ? "Downgrade" : "Upgrade"} plan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline">Cancel subscription</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Payment methods</CardTitle>
              <CardDescription>Manage your payment methods for billing</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add card
            </Button>
          </CardHeader>
          <CardContent>
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded-md bg-muted flex items-center justify-center">
                        {method.card_type === "visa" ? (
                          <span className="text-xs font-bold text-blue-600">VISA</span>
                        ) : method.card_type === "mastercard" ? (
                          <span className="text-xs font-bold text-orange-600">MC</span>
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">CARD</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {method.card_type === "visa" ? "Visa" : method.card_type === "mastercard" ? "Mastercard" : "Card"} ending in {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry_month}/{method.expiry_year}</p>
                      </div>
                      {method.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!method.is_default && <DropdownMenuItem>Set as default</DropdownMenuItem>}
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No payment methods added</p>
                <p className="text-sm text-muted-foreground mt-1">Add a card to manage your subscription</p>
                <Button variant="outline" size="sm" className="gap-2 mt-4 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Add your first card
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Billing information</CardTitle>
              <CardDescription>Your billing address for invoices</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Billing name</p>
                <p className="font-medium text-foreground">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-foreground">{user?.email || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-medium text-foreground">{profile?.company || 'Not set'}</p>
                <p className="text-sm text-muted-foreground">{profile?.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tax ID</p>
                <p className="font-medium text-foreground">Not set</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Invoice history</CardTitle>
              <CardDescription>Download your past invoices for accounting</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download all
            </Button>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <>
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-muted/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invoice.invoice_number || invoice.id}</p>
                          <p className="text-sm text-muted-foreground">{new Date(invoice.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">${invoice.amount?.toFixed(2) || '0.00'}</p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs capitalize",
                              invoice.status === "paid" && "bg-green-500/10 text-green-600",
                            )}
                          >
                            {invoice.status || 'pending'}
                          </Badge>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-muted-foreground">
                  View all invoices
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No invoices yet</p>
                <p className="text-sm text-muted-foreground mt-1">Your invoices will appear here after your first payment</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">Account Settings</CardTitle>
            </div>
            <CardDescription>Irreversible actions that affect your account and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 gap-4">
              <div>
                <p className="font-medium text-foreground">Cancel subscription</p>
                <p className="text-sm text-muted-foreground">
                  Your plan will remain active until the end of the billing period
                </p>
              </div>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                Cancel plan
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 gap-4">
              <div>
                <p className="font-medium text-foreground">Delete all billing data</p>
                <p className="text-sm text-muted-foreground">
                  This will remove all payment methods and billing history
                </p>
              </div>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                Delete data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
