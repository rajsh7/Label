"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Monitor, Sun, Moon } from "lucide-react"

export function AppearanceSettings() {
  const [theme, setTheme] = useState("system")
  const [accentColor, setAccentColor] = useState("#3b82f6")
  const [defaultView, setDefaultView] = useState("grid")
  const [labelsPerPage, setLabelsPerPage] = useState(24)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    applyTheme(theme)
    applyAccentColor(accentColor)
  }, [theme, accentColor])

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement
    
    if (selectedTheme === "dark") {
      root.classList.add("dark")
    } else if (selectedTheme === "light") {
      root.classList.remove("dark")
    } else {
      // System theme
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const applyAccentColor = (color: string) => {
    const root = document.documentElement
    root.style.setProperty("--accent-color", color)
  }

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("profiles")
      .select("appearance_settings")
      .eq("id", user.id)
      .single()

    if (data?.appearance_settings) {
      const settings = data.appearance_settings
      setTheme(settings.theme || "system")
      setAccentColor(settings.accentColor || "#3b82f6")
      setDefaultView(settings.defaultView || "grid")
      setLabelsPerPage(settings.labelsPerPage || 24)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("profiles")
      .update({
        appearance_settings: {
          theme,
          accentColor,
          defaultView,
          labelsPerPage
        }
      })
      .eq("id", user.id)

    applyTheme(theme)
    applyAccentColor(accentColor)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>
        <p className="text-sm text-muted-foreground mb-6">Customize how LabelPro looks and feels</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">Theme</label>
          <p className="text-sm text-muted-foreground mb-3">Select your preferred color scheme</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  theme === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <option.icon className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-3">Accent Color</label>
          <p className="text-sm text-muted-foreground mb-3">Choose your accent color for buttons and highlights</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"].map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  accentColor === color ? "border-foreground scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-3">Label Display</label>
          <p className="text-sm text-muted-foreground mb-4">Configure how labels are displayed in your dashboard</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Default view</label>
              <div className="flex flex-wrap gap-2">
                {["grid", "list"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setDefaultView(view)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      defaultView === view
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Labels per page</label>
              <div className="flex flex-wrap gap-2">
                {[12, 24, 48].map((count) => (
                  <button
                    key={count}
                    onClick={() => setLabelsPerPage(count)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      labelsPerPage === count
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
