"use client"

import dynamic from "next/dynamic"

const SmoothScrollComponent = dynamic(() => import("./smooth-scroll").then(mod => ({ default: mod.SmoothScroll })), { ssr: false })

export function SmoothScrollWrapper() {
  return <SmoothScrollComponent />
}
