'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/Spinner'
import { Copy, Plus, Gift, TrendingUp, Users } from 'lucide-react'
import { formatReferralCode } from '@/lib/referrals/utils'

interface Referral {
  id: string
  referral_code: string
  current_uses: number
  max_uses: number | null
  reward_type: string
  reward_value: number
  expires_at: string | null
  status: string
  created_at: string
}

interface ReferralStats {
  totalCodes: number
  totalUses: number
  totalRewardGiven: number
  referralCredits: number
  codes: Array<{
    code: string
    uses: number
    maxUses: number | null
    createdAt: string
  }>
}

export function ReferralSettings() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    loadReferrals()
    loadStats()
  }, [])

  const loadReferrals = async () => {
    try {
      const response = await fetch('/api/referrals')
      const data = await response.json()
      if (data.success) {
        setReferrals(data.referrals || [])
      }
    } catch (error) {
      console.error('Failed to load referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/referrals/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load referral stats:', error)
    }
  }

  const createReferral = async () => {
    if (creating) return

    setCreating(true)
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_code: newCode || undefined,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewCode('')
        await loadReferrals()
        await loadStats()
      } else {
        alert(data.error || 'Failed to create referral code')
      }
    } catch (error) {
      console.error('Failed to create referral:', error)
      alert('Failed to create referral code')
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = async (code: string) => {
    const url = `${window.location.origin}/signup?ref=${code}`
    await navigator.clipboard.writeText(url)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getReferralUrl = (code: string) => {
    return `${window.location.origin}/signup?ref=${code}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Total Codes</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.totalCodes}
                  </p>
                </div>
                <Gift className="w-8 h-8 text-[var(--color-primary-500)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Total Referrals</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.totalUses}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[var(--color-primary-500)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Rewards Given</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    ${stats.totalRewardGiven.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[var(--color-primary-500)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Your Credits</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    ${stats.referralCredits.toFixed(2)}
                  </p>
                </div>
                <Gift className="w-8 h-8 text-[var(--color-success-500)]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create New Referral */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Create Referral Code
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Leave empty to auto-generate"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={createReferral}
              disabled={creating}
            >
              {creating ? <Spinner size="sm" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Codes List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Your Referral Codes
          </h2>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-[var(--color-text-secondary)] text-center py-8">
              No referral codes yet. Create one to start referring friends!
            </p>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => {
                const url = getReferralUrl(referral.referral_code)
                const isCopied = copiedCode === referral.referral_code

                return (
                  <div
                    key={referral.id}
                    className="border border-[var(--color-border)] rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-lg font-mono font-bold text-[var(--color-primary-600)]">
                            {formatReferralCode(referral.referral_code)}
                          </code>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              referral.status === 'active'
                                ? 'bg-[var(--color-success-100)] text-[var(--color-success-700)]'
                                : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]'
                            }`}
                          >
                            {referral.status}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                          {referral.current_uses}{' '}
                          {referral.max_uses ? `/ ${referral.max_uses}` : ''} uses
                          {' • '}
                          Reward: {referral.reward_value}{' '}
                          {referral.reward_type === 'credit' ? 'credits' : referral.reward_type}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(referral.referral_code)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {isCopied ? 'Copied!' : 'Copy Link'}
                      </Button>
                    </div>

                    <div className="bg-[var(--color-bg-secondary)] rounded p-3">
                      <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                        Referral Link:
                      </p>
                      <code className="text-xs text-[var(--color-text-primary)] break-all">
                        {url}
                      </code>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

