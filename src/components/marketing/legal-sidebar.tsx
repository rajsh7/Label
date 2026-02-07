"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const legalLinks = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Cookie Policy", href: "/cookie-policy" }, // Check if folder exists or create it
  { name: "Security", href: "/security" },
]

export function LegalSidebar() {
  const pathname = usePathname()

  return (
    <div className="lg:col-span-3 lg:sticky lg:top-32 h-fit">
      <h3 className="font-bold text-slate-900 mb-8 text-lg">Legal Center</h3>
      <nav className="space-y-4">
        {legalLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block pl-4 border-l-2 transition-colors",
                isActive
                  ? "text-primary font-bold border-primary"
                  : "text-slate-500 hover:text-slate-900 border-transparent hover:border-slate-200"
              )}
            >
              {link.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
