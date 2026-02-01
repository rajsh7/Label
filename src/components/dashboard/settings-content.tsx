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
import { DashboardHero } from "@/components/dashboard/hero"

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
    <>
      <DashboardHero 
        title="Settings & Preferences" 
        description="Manage your account profile, notification preferences, integration settings, and security options."
        showPills={false}
        showBottomPills={false}
        showSearch={false}
      />


      <div className="max-w-[1920px] mx-auto px-6 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Settings Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-gray-400")} />
                    <span>{tab.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                )
              })}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
               <p className="text-xs text-center text-gray-500">
                 LabelPro v2.0.0
               </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] p-6 sm:p-8">
               <div className="mb-6">
                 <h2 className="text-xl font-bold text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
                 <p className="text-sm text-gray-500 mt-1">
                   Configure your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} settings
                 </p>
               </div>
               
               <div className="max-w-4xl">
                {activeTab === "profile" && <ProfileSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "integrations" && <IntegrationSettings />}
                {activeTab === "security" && <SecuritySettings />}
                {activeTab === "appearance" && <AppearanceSettings />}
                {activeTab === "export" && <ExportSettings />}
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
