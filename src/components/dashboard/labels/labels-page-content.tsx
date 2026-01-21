"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Download,
  Eye,
  Trash2,
  Printer,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Upload,
  Calendar,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

const labels = [
  {
    id: "LBL-001",
    name: "Amazon FBA Shipment #1247",
    format: "Amazon FBA 4x6",
    status: "Completed",
    date: "Jan 12, 2026",
    count: 24,
    size: "2.4 MB",
    thumbnail: "/shipping-label.jpg",
  },
  {
    id: "LBL-002",
    name: "USPS Priority Batch",
    format: "USPS 4x6",
    status: "Completed",
    date: "Jan 12, 2026",
    count: 12,
    size: "1.2 MB",
    thumbnail: "/usps-label.jpg",
  },
  {
    id: "LBL-003",
    name: "FedEx Ground Labels",
    format: "FedEx 4x6.75",
    status: "Processing",
    date: "Jan 11, 2026",
    count: 8,
    size: "0.8 MB",
    thumbnail: "/fedex-label.jpg",
  },
  {
    id: "LBL-004",
    name: "Walmart WFS Orders",
    format: "Walmart 4x6",
    status: "Completed",
    date: "Jan 10, 2026",
    count: 36,
    size: "3.6 MB",
    thumbnail: "/walmart-label.jpg",
  },
  {
    id: "LBL-005",
    name: "eBay Shipping Labels",
    format: "eBay Standard",
    status: "Completed",
    date: "Jan 9, 2026",
    count: 15,
    size: "1.5 MB",
    thumbnail: "/ebay-label.jpg",
  },
  {
    id: "LBL-006",
    name: "Shopify Orders Batch",
    format: "Shopify 4x6",
    status: "Completed",
    date: "Jan 8, 2026",
    count: 42,
    size: "4.2 MB",
    thumbnail: "/shopify-label.jpg",
  },
  {
    id: "LBL-007",
    name: "UPS Worldwide Express",
    format: "UPS 4x6",
    status: "Failed",
    date: "Jan 8, 2026",
    count: 5,
    size: "0.5 MB",
    thumbnail: "/ups-label.jpg",
  },
  {
    id: "LBL-008",
    name: "DHL Express International",
    format: "DHL 4x6",
    status: "Completed",
    date: "Jan 7, 2026",
    count: 18,
    size: "1.8 MB",
    thumbnail: "/dhl-label.jpg",
  },
]

const statusColors: Record<string, string> = {
  Completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  Processing: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
}

export function LabelsContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")

  const filteredLabels = labels.filter((label) => {
    const matchesSearch =
      label.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      label.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || label.status === statusFilter
    const matchesFormat = formatFilter === "all" || label.format.includes(formatFilter)
    return matchesSearch && matchesStatus && matchesFormat
  })

  const toggleSelectAll = () => {
    if (selectedLabels.length === filteredLabels.length) {
      setSelectedLabels([])
    } else {
      setSelectedLabels(filteredLabels.map((l) => l.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedLabels((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Labels</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and organize all your shipping labels</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Upload className="w-4 h-4 mr-2" />
          Upload Labels
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search labels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted border-border"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-muted border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="w-[160px] bg-muted border-border">
                  <Tag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="Amazon">Amazon FBA</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="Walmart">Walmart</SelectItem>
                  <SelectItem value="eBay">eBay</SelectItem>
                  <SelectItem value="Shopify">Shopify</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {selectedLabels.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{selectedLabels.length} selected</span>
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredLabels.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No labels found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery || statusFilter !== "all" || formatFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "Upload your first label to get started"}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "list" ? (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">
                      <Checkbox
                        checked={selectedLabels.length === filteredLabels.length && filteredLabels.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Format</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Labels</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Size</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Date</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabels.map((label) => (
                    <tr
                      key={label.id}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                        selectedLabels.includes(label.id) && "bg-muted/30",
                      )}
                    >
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedLabels.includes(label.id)}
                          onCheckedChange={() => toggleSelect(label.id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                            <img
                              src={label.thumbnail || "/placeholder.svg"}
                              alt={label.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{label.name}</p>
                            <p className="text-xs text-muted-foreground">{label.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{label.format}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[label.status]}>{label.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{label.count}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{label.size}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{label.date}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="w-4 h-4 mr-2" />
                              Print
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLabels.map((label) => (
            <Card
              key={label.id}
              className={cn(
                "bg-card border-border hover:border-accent/50 transition-colors cursor-pointer group",
                selectedLabels.includes(label.id) && "border-accent",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Checkbox
                    checked={selectedLabels.includes(label.id)}
                    onCheckedChange={() => toggleSelect(label.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={label.thumbnail || "/placeholder.svg"}
                    alt={label.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground truncate">{label.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label.format}</span>
                    <Badge className={cn("text-xs", statusColors[label.status])}>{label.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {label.count} labels
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {label.date}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredLabels.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">1-{filteredLabels.length}</span> of{" "}
            <span className="font-medium text-foreground">{filteredLabels.length}</span> labels
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border bg-transparent" disabled>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-border bg-accent text-accent-foreground">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              2
            </Button>
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              3
            </Button>
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
