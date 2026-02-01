"use client"

import { useState } from "react"
import { Search, Sparkles, Utensils, Printer, Wine, FileWarning, Book, ShoppingBag } from "lucide-react"

interface DashboardHeroProps {
  onSearch?: (query: string) => void
  title?: string
  description?: string
  searchPlaceholder?: string
  showPills?: boolean
  showBottomPills?: boolean
}

const suggestionPills = [
  { label: "Generate Free Label", icon: Sparkles, color: "text-blue-600" },
  { label: "Food Label", icon: Utensils },
  { label: "Printable Label", icon: Printer },
  { label: "Bottle Label", icon: Wine },
  { label: "Warning Label", icon: FileWarning },
  { label: "Packaging Label", icon: ShoppingBag },
  { label: "Book Label", icon: Book },
]

export function DashboardHero({ 
  onSearch, 
  title = "Label Templates", 
  description = "Editable free label templates you can customize online. Enjoy professional-quality, printable designs for free. Start creating today!",
  searchPlaceholder = "Search for Templates...",
  showPills = true,
  showBottomPills = true,
  showSearch = true
}: DashboardHeroProps & { showSearch?: boolean }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <div className="bg-white pt-12 pb-8 px-6 border-b border-gray-100">
      <div className="max-w-[1920px] mx-auto text-center space-y-8">
        {/* Main Heading & Subtext */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-[42px] font-bold tracking-tight text-[#111827]">
            {title}
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-normal">
            {description}
          </p>
        </div>

        {/* Suggestion Pills - Horizontal Scroll */}
        {showPills && (
          <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2">
            {suggestionPills.map((pill) => (
              <button
                key={pill.label}
                className="group whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all"
              >
                <pill.icon className={`w-4 h-4 ${pill.color || "text-gray-400 group-hover:text-blue-500"}`} />
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar - Wide with File Format Pills below */}
        {showSearch && (
          <div className="max-w-4xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base shadow-sm hover:shadow-md transition-shadow"
              />
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Format Pills */}
          {showBottomPills && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                Edit Online
              </button>
              <span className="w-px h-4 bg-gray-300 mx-1"></span>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-600 hover:border-blue-400 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019-present%29.svg" className="w-4 h-4" alt="Word" />
                Word
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-600 hover:border-blue-400 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg" className="w-4 h-4" alt="Docs" />
                Google Docs
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-600 hover:border-blue-400 transition-colors">
                <span className="bg-red-500 text-[10px] font-bold text-white px-1 rounded-sm">PDF</span>
                PDF
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}
