"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface RevealUpProps {
  children: ReactNode
  delay?: number
  duration?: number
}

export function RevealUp({ children, delay = 0, duration = 0.6 }: RevealUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
