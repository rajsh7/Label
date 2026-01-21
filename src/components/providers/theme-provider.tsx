"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        applySystemTheme()
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("appearance_settings")
        .eq("id", user.id)
        .single()

      const theme = data?.appearance_settings?.theme || "system"
      const accentColor = data?.appearance_settings?.accentColor || "#3b82f6"
      applyTheme(theme)
      applyAccentColor(accentColor)
    }

    const applyTheme = (theme: string) => {
      const root = document.documentElement
      
      if (theme === "dark") {
        root.classList.add("dark")
      } else if (theme === "light") {
        root.classList.remove("dark")
      } else {
        applySystemTheme()
      }
    }

    const applyAccentColor = (color: string) => {
      const root = document.documentElement
      root.style.setProperty("--accent-color", color)
    }

    const applySystemTheme = () => {
      const root = document.documentElement
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    loadTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("profiles")
            .select("appearance_settings")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              if (data?.appearance_settings?.theme === "system") {
                applySystemTheme()
              }
            })
        } else {
          applySystemTheme()
        }
      })
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return <>{children}</>
}
