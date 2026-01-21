"use client"

import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return

    let rafId: number
    let currentScroll = window.scrollY
    let targetScroll = window.scrollY
    const smoothness = 1.8

    const smoothScrollHandler = () => {
      currentScroll += (targetScroll - currentScroll) / (smoothness * 10)
      
      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        window.scrollTo(0, currentScroll)
        rafId = requestAnimationFrame(smoothScrollHandler)
      } else {
        window.scrollTo(0, targetScroll)
      }
    }

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      targetScroll += e.deltaY
      targetScroll = Math.max(0, Math.min(targetScroll, document.documentElement.scrollHeight - window.innerHeight))
      
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(smoothScrollHandler)
    }

    window.addEventListener("wheel", handleScroll, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
