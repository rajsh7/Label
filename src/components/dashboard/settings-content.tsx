"use client"

import { useState } from "react"
import { User, Bell, Link2, Shield, Palette, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings"
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings"
import { IntegrationSettings } from "@/components/dashboard/settings/integration-settings"
import { SecuritySettings } from "@/components/dashboard/settings/security-settings"
import { AppearanceSettings } from "@/components/dashboard/settings/appearance-settings"
import { ExportSettings } from "@/components/dashboard/settings/export-settings"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "export", label: "Export Data", icon: Download },
]

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="lg:w-48 flex-shrink-0">
          <div className="lg:space-y-3 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 lg:py-4 rounded-lg text-sm font-medium transition-colors text-left",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "integrations" && <IntegrationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "export" && <ExportSettings />}
        </div>
      </div>
    </div>
  )
}
