"use client"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

export function ProfileSettings() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    phone: '',
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setProfile(profile)
        setFormData({
          full_name: profile.full_name || '',
          company: profile.company || '',
          phone: profile.phone || '',
        })
      }
    }
  }

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)
    
    if (!error) {
      alert('Profile updated successfully!')
      loadUserData()
    } else {
      console.error('Update error:', error)
      alert('Error updating profile: ' + error.message)
    }
    setLoading(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      alert('Error uploading photo: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (!updateError) {
      loadUserData()
      alert('Photo updated successfully!')
    } else {
      alert('Error updating profile')
    }
    setUploading(false)
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Profile Photo</CardTitle>
          <CardDescription>This will be displayed on your profile and in comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative mx-auto sm:mx-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl font-medium text-muted-foreground">{getUserInitials()}</span>
                </div>
              )}
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild disabled={uploading} className="w-full sm:w-auto">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {uploading ? 'Uploading...' : 'Upload new photo'}
                </label>
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>Update your personal details here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input 
              id="fullName" 
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="bg-muted border-border" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.email || ''} 
              disabled
              className="bg-muted border-border opacity-60" 
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company name</Label>
            <Input 
              id="company" 
              value={formData.company} 
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="bg-muted border-border" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="bg-muted border-border" 
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
