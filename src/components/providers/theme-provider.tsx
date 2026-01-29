"use client"

import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadTheme = async () => {
      // Always force light theme
      const root = document.documentElement
      root.classList.remove("dark")
      
      // Set default accent color without querying database
      root.style.setProperty("--accent-color", "#3b82f6")
    }

    loadTheme()
  }, [])

  return <>{children}</>
}
