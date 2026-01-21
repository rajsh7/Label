"use client"

import { useState, useEffect } from "react"
import { Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase/client"

export function SecuritySettings() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [currentDevice, setCurrentDevice] = useState({
    device: "Current Device",
    location: "Unknown",
    lastActive: "Now"
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    loadUser()
    detectDevice()
  }, [])

  const detectDevice = () => {
    const ua = navigator.userAgent
    let device = "Unknown Device"
    
    if (/Windows/i.test(ua)) device = "Windows PC"
    else if (/Macintosh/i.test(ua)) device = "MacBook"
    else if (/iPhone/i.test(ua)) device = "iPhone"
    else if (/iPad/i.test(ua)) device = "iPad"
    else if (/Android/i.test(ua)) device = "Android Device"
    else if (/Linux/i.test(ua)) device = "Linux PC"
    
    setCurrentDevice(prev => ({ ...prev, device }))
  }

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setTwoFactorEnabled(data.two_factor_enabled || false)
      }
    }
  }

  const handlePasswordChange = async () => {
    if (!passwords.new || !passwords.confirm) {
      alert('Please fill in all fields')
      return
    }

    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }

    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    })

    if (!error) {
      alert('Password updated successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    } else {
      alert('Error updating password: ' + error.message)
    }
    setLoading(false)
  }

  const handleToggle2FA = async (checked: boolean) => {
    if (!user) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ two_factor_enabled: checked })
      .eq('id', user.id)

    if (!error) {
      setTwoFactorEnabled(checked)
      alert(checked ? '2FA enabled!' : '2FA disabled!')
    } else {
      alert('Error updating 2FA')
    }
    setLoading(false)
  }

  const signOutAllDevices = async () => {
    if (!confirm('Sign out of all devices?')) return
    setLoading(true)
    
    await supabase.auth.signOut({ scope: 'global' })
    window.location.href = '/login'
  }
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="bg-muted border-border" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input 
              id="newPassword" 
              type="password" 
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="bg-muted border-border" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="bg-muted border-border" 
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
            <Button 
              onClick={handlePasswordChange}
              disabled={loading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
            >
              {loading ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">Use an authenticator app for additional security</p>
            </div>
            <Switch 
              id="2fa" 
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={loading}
              className="self-start sm:self-center"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Active Sessions</CardTitle>
          <CardDescription>Manage your active login sessions across devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{currentDevice.device}</p>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Current</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentDevice.location} · {currentDevice.lastActive}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={signOutAllDevices}
              disabled={loading}
              className="bg-transparent text-destructive border-destructive/50 hover:bg-destructive/10 w-full sm:w-auto"
            >
              Sign out of all devices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
