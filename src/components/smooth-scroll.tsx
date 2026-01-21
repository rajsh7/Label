"use client"

import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    let currentScroll = 0
    let targetScroll = 0
    let ease = 0.1 * 1.5 // 1.5 smoothness factor

    const updateScroll = () => {
      targetScroll = window.scrollY
      currentScroll += (targetScroll - currentScroll) * ease
      
      if (Math.abs(targetScroll - currentScroll) > 0.1) {
        window.scrollTo(0, currentScroll)
        requestAnimationFrame(updateScroll)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetScroll += e.deltaY
      targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight))
      requestAnimationFrame(updateScroll)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return null
}