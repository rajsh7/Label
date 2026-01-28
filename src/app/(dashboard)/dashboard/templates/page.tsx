"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { TemplatesContent } from "@/components/dashboard/templates/templates-content"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader onSearch={setSearchQuery} />
      <main className="flex-1 overflow-auto p-6">
        <TemplatesContent searchQuery={searchQuery} />
      </main>
    </div>
  )
}
