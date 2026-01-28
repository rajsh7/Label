"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadTheme = async () => {
      // Always force light theme
      const root = document.documentElement
      root.classList.remove("dark")
      
      // Load accent color only
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("appearance_settings")
          .eq("id", user.id)
          .single()

        const accentColor = data?.appearance_settings?.accentColor || "#3b82f6"
        root.style.setProperty("--accent-color", accentColor)
      }
    }

    loadTheme()
  }, [])

  return <>{children}</>
}
