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
import { DashboardHero } from "@/components/dashboard/hero"

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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <DashboardHero 
        title="Billing & Subscription" 
        description="Manage your subscription plan, payment methods, and view invoice history."
        searchPlaceholder="Search invoices..."
        showPills={false}
        showBottomPills={false}
        showSearch={false}
      />

      <div className="max-w-[1920px] mx-auto px-6 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-b border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-blue-100">
                      {currentPlanData && <currentPlanData.icon className="w-7 h-7 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">{currentPlanData?.name} Plan</h2>
                        <Badge className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">Active</Badge>
                      </div>
                      <p className="text-gray-500 mt-1 text-lg">{currentPlanData?.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900 tracking-tight">
                      ${currentPlanData?.price}
                      <span className="text-base font-medium text-gray-500 ml-1">/mo</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center justify-end gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Renews Feb 1, 2026
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Labels processed</span>
                      <span className="font-semibold text-gray-900">{usage.labels.toLocaleString()} / Unlimited</span>
                    </div>
                    <Progress value={45} className="h-2.5 bg-gray-100" />
                    <p className="text-xs text-gray-500">No limit on Pro plan</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Batch jobs this month</span>
                      <span className="font-semibold text-gray-900">
                        {usage.batches} / {currentPlanData?.limits.batches}
                      </span>
                    </div>
                    <Progress 
                      value={(usage.batches / (currentPlanData?.limits.batches || 1)) * 100} 
                      className="h-2.5 bg-gray-100"
                      />
                    <p className="text-xs text-gray-500">
                      {(currentPlanData?.limits.batches || 0) - usage.batches} batch jobs remaining
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-8 border-t border-gray-100">
                  <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm h-11 px-6">
                        <Sparkles className="w-4 h-4" />
                        Upgrade Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Choose the perfect plan</DialogTitle>
                        <DialogDescription className="text-center text-lg">Scale your label printing as your business grows</DialogDescription>
                      </DialogHeader>
                      <div className="grid md:grid-cols-3 gap-6 py-6">
                        {plans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={cn(
                              "relative p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg",
                              selectedPlan === plan.id
                                ? "border-blue-600 bg-blue-50/30"
                                : "border-transparent bg-gray-50 hover:bg-white hover:border-gray-200",
                              plan.id === currentPlan && "opacity-75 cursor-default",
                            )}
                            disabled={plan.id === currentPlan}
                          >
                            {plan.popular && (
                              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white border-0">
                                Most Popular
                              </Badge>
                            )}
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                              <plan.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                            <div className="mt-2 mb-4">
                              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                              <span className="text-sm font-medium text-gray-500">/{plan.period}</span>
                            </div>
                            <ul className="space-y-3">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            {plan.id === currentPlan && (
                              <div className="mt-6 text-center">
                                <Badge variant="secondary" className="w-full justify-center py-1.5">
                                  Current Plan
                                </Badge>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                          disabled={!selectedPlan || selectedPlan === currentPlan}
                        >
                          {selectedPlan === "free" ? "Downgrade" : "Upgrade"} Now
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 h-11">
                    Cancel subscription
                  </Button>
                </div>
              </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Invoice History</h3>
                  <p className="text-gray-500 text-sm">Download your past invoices</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
              </div>
              <div className="p-2">
                {invoices.length > 0 ? (
                  <div className="space-y-1">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invoice.invoice_number || invoice.id}</p>
                            <p className="text-sm text-gray-500">{new Date(invoice.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${invoice.amount?.toFixed(2) || '0.00'}</p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs capitalize",
                                invoice.status === "paid" && "bg-green-50 text-green-700",
                              )}
                            >
                              {invoice.status || 'pending'}
                            </Badge>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">No invoices yet</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                      Your invoices will appear here after your first payment
                    </p>
                  </div>
                )}
              </div>
              {invoices.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
                    View all invoices
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Payment Method</h3>
                  <p className="text-gray-500 text-xs">Manage your cards</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full">
                  <Plus className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
              <div className="p-4">
                {paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden relative">
                             {/* Simple Card Icon Representation */}
                            <div className="absolute top-1 left-0 w-full h-1 bg-gray-800 opacity-10"></div>
                            {method.card_type === "visa" ? (
                              <span className="text-[10px] font-bold text-blue-800 z-10">VISA</span>
                            ) : (
                              <span className="text-[10px] font-bold text-gray-600 z-10">CARD</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              •••• {method.last4}
                            </p>
                            <p className="text-xs text-gray-500">
                              Expires {method.expiry_month}/{method.expiry_year}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit card</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 mb-4">No payment method added</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Add Card
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Billing Details</h3>
                  <p className="text-gray-500 text-xs">For your invoices</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2">
                  Edit
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Billing Name</p>
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.email?.split('@')[0] || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">{user?.email || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Company Address</p>
                  <p className="text-sm font-medium text-gray-900">{profile?.company || 'No address set'}</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 rounded-xl border border-red-100 overflow-hidden">
               <div className="p-4 border-b border-red-100">
                  <h3 className="font-bold text-red-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Danger Zone
                  </h3>
              </div>
              <div className="p-4 space-y-4">
                 <Button variant="ghost" className="w-full justify-start text-red-700 hover:text-red-800 hover:bg-red-100/50 h-auto py-2 px-2 text-sm">
                   Delete billing history
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
