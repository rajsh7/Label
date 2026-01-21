"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.config({
      nullTargetWarn: false,
    })

    const smoother = ScrollSmoother.create({
      smooth: 1.8,
      effects: true,
      smoothTouch: 0.1,
    })

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".animate-on-scroll").forEach((element) => {
        gsap.from(element, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
      })
    })

    return () => {
      ctx.revert()
      smoother.kill()
    }
  }, [])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  )
}
