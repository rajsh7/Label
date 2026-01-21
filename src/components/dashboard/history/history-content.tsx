"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  MoreHorizontal,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  FileStack,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const batchHistory = [
  {
    id: "BATCH-001",
    name: "Amazon FBA Q1 Shipment",
    labelsProcessed: 248,
    format: "Amazon FBA 4x6",
    status: "Completed",
    startTime: "Jan 12, 2026 10:24 AM",
    duration: "2m 14s",
    errorCount: 0,
    outputSize: "24.8 MB",
  },
  {
    id: "BATCH-002",
    name: "USPS Priority Mail Batch",
    labelsProcessed: 156,
    format: "USPS 4x6",
    status: "Completed",
    startTime: "Jan 12, 2026 09:15 AM",
    duration: "1m 32s",
    errorCount: 0,
    outputSize: "15.6 MB",
  },
  {
    id: "BATCH-003",
    name: "FedEx Ground Labels",
    labelsProcessed: 89,
    format: "FedEx 4x6.75",
    status: "Processing",
    startTime: "Jan 12, 2026 11:00 AM",
    duration: "In progress...",
    errorCount: 0,
    outputSize: "~8.9 MB",
  },
  {
    id: "BATCH-004",
    name: "Walmart WFS Orders",
    labelsProcessed: 312,
    format: "Walmart 4x6",
    status: "Completed",
    startTime: "Jan 11, 2026 03:45 PM",
    duration: "3m 58s",
    errorCount: 2,
    outputSize: "31.0 MB",
  },
  {
    id: "BATCH-005",
    name: "eBay International Shipping",
    labelsProcessed: 0,
    format: "eBay Standard",
    status: "Failed",
    startTime: "Jan 11, 2026 02:30 PM",
    duration: "0m 12s",
    errorCount: 45,
    outputSize: "0 MB",
  },
]

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Completed: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  Processing: { color: "bg-yellow-500/10 text-yellow-500", icon: Loader2 },
  Failed: { color: "bg-red-500/10 text-red-500", icon: XCircle },
}

export function HistoryContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBatches = batchHistory.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalBatches: batchHistory.length,
    totalLabels: batchHistory.reduce((sum, b) => sum + b.labelsProcessed, 0),
    successRate: Math.round((batchHistory.filter((b) => b.status === "Completed").length / batchHistory.length) * 100),
    totalErrors: batchHistory.reduce((sum, b) => sum + b.errorCount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Batch History</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your label processing history</p>
        </div>
        <Button variant="outline" className="border-border text-foreground">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stats.totalBatches}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileStack className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Labels Processed</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stats.totalLabels.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stats.successRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stats.totalErrors}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Batch</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Format</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Labels</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Duration</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Output Size</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Started</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const StatusIcon = statusConfig[batch.status].icon
                  return (
                    <tr
                      key={batch.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{batch.name}</p>
                          <p className="text-xs text-muted-foreground">{batch.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{batch.format}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{batch.labelsProcessed}</span>
                          {batch.errorCount > 0 && (
                            <Badge variant="outline" className="text-xs text-red-500 border-red-500/30">
                              {batch.errorCount} errors
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={cn("flex items-center gap-1 w-fit", statusConfig[batch.status].color)}>
                          <StatusIcon className={cn("w-3 h-3", batch.status === "Processing" && "animate-spin")} />
                          {batch.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {batch.duration}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{batch.outputSize}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{batch.startTime}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={batch.status !== "Completed"}>
                              <Download className="w-4 h-4 mr-2" />
                              Download Output
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Retry Batch
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
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">1-{filteredBatches.length}</span> of{" "}
          <span className="font-medium text-foreground">{filteredBatches.length}</span> batches
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-border text-foreground" disabled>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="border-border bg-accent text-accent-foreground">
            1
          </Button>
          <Button variant="outline" size="sm" className="border-border text-foreground">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
