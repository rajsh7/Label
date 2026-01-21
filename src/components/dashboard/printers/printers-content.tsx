"use client"

import { useState, useEffect } from "react"
import { getPrinters, deletePrinter, getPrintQueue, deletePrintJob } from "@/server/actions/printers"
import {
  Printer,
  Plus,
  MoreHorizontal,
  Wifi,
  Usb,
  AlertCircle,
  Settings2,
  Trash2,
  RefreshCw,
  Power,
  Pause,
  Play,
  X,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  Download,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const availablePrinters = [
  { id: 1, name: "HP LaserJet Pro", type: "Network", ip: "192.168.1.45" },
  { id: 2, name: "DYMO LabelWriter 550", type: "USB", ip: null },
  { id: 3, name: "Zebra GK420d", type: "USB", ip: null },
]

export function PrintersContent() {
  const [printers, setPrinters] = useState<any[]>([])
  const [printQueue, setPrintQueue] = useState<any[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [selectedPrinter, setSelectedPrinter] = useState<any | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [printersRes, queueRes] = await Promise.all([
      getPrinters(),
      getPrintQueue()
    ])
    if (printersRes.data) setPrinters(printersRes.data)
    if (queueRes.data) setPrintQueue(queueRes.data)
    setIsLoading(false)
  }

  const handleDeletePrinter = async (id: string) => {
    await deletePrinter(id)
    await loadData()
  }

  const handleDeleteJob = async (id: string) => {
    await deletePrintJob(id)
    await loadData()
  }

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Online</Badge>
      case "offline":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Offline</Badge>
      case "paused":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Paused</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getQueueStatusIcon = (status: string) => {
    switch (status) {
      case "printing":
        return <Loader2 className="w-4 h-4 text-accent animate-spin" />
      case "queued":
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  if (isLoading) {
    return <div className="p-6 max-w-6xl mx-auto">Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Printers</h1>
          <p className="text-muted-foreground mt-1">Manage your connected printers and print queue</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Printer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add a printer</DialogTitle>
              <DialogDescription>Connect a new printer to your LabelPro account</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-auto py-4 bg-transparent"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {isScanning ? "Scanning..." : "Scan for printers"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Available printers</span>
                </div>
              </div>

              <div className="space-y-2">
                {availablePrinters.map((printer) => (
                  <button
                    key={printer.id}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-muted/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Printer className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{printer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {printer.type === "USB" ? (
                            <span className="flex items-center gap-1">
                              <Usb className="w-3 h-3" /> USB Connection
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Wifi className="w-3 h-3" /> {printer.ip}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or add manually</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Printer name</Label>
                  <Input placeholder="My Label Printer" />
                </div>
                <div className="space-y-2">
                  <Label>IP Address (optional)</Label>
                  <Input placeholder="192.168.1.100" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button>Add Printer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="printers" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="printers">Printers</TabsTrigger>
          <TabsTrigger value="queue">Print Queue</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="printers" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Printer className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{printers.length}</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Power className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {printers.filter((p) => p.status === "online").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {printers.reduce((acc, p) => acc + (p.total_printed || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Printed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {printQueue.filter((p) => p.status === "queued" || p.status === "printing").length}
                    </p>
                    <p className="text-sm text-muted-foreground">In Queue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {printers.map((printer) => (
              <Card
                key={printer.id}
                className={cn(
                  "transition-all hover:border-accent/30",
                  printer.isDefault && "border-accent/50 bg-accent/5",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          printer.status === "online"
                            ? "bg-green-500/10"
                            : printer.status === "paused"
                              ? "bg-yellow-500/10"
                              : "bg-muted",
                        )}
                      >
                        <Printer
                          className={cn(
                            "w-6 h-6",
                            printer.status === "online"
                              ? "text-green-600"
                              : printer.status === "paused"
                                ? "text-yellow-600"
                                : "text-muted-foreground",
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{printer.name}</h3>
                          {getStatusBadge(printer.status)}
                          {printer.isDefault && (
                            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 gap-1">
                              <Star className="w-3 h-3" /> Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {printer.connection === "wifi" ? <Wifi className="w-3 h-3" /> : <Usb className="w-3 h-3" />}
                            {printer.connection === "wifi" ? "Wi-Fi" : "USB"}
                          </span>
                          <span>Paper: {printer.paper_size}</span>
                          <span>Last used: {printer.last_used ? new Date(printer.last_used).toLocaleString() : 'Never'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-foreground">
                          {printer.labels_remaining > 0 ? `${printer.labels_remaining} labels` : "Out of labels"}
                        </p>
                        <Progress
                          value={printer.labels_remaining > 0 ? (printer.labels_remaining / 500) * 100 : 0}
                          className="h-1.5 w-24 mt-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {printer.status === "online" ? (
                          <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : printer.status === "paused" ? (
                          <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!printer.isDefault && (
                              <DropdownMenuItem className="gap-2">
                                <Star className="w-4 h-4" />
                                Set as default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => {
                                setSelectedPrinter(printer)
                                setShowSettingsDialog(true)
                              }}
                            >
                              <Settings2 className="w-4 h-4" />
                              Printer settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <FileText className="w-4 h-4" />
                              Print test page
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="w-4 h-4" />
                              Update firmware
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeletePrinter(printer.id)}>
                              <Trash2 className="w-4 h-4" />
                              Remove printer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Print Queue</CardTitle>
                <CardDescription>Manage your active and pending print jobs</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Pause className="w-4 h-4" />
                  Pause All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Queue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {printQueue.map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border border-border transition-all",
                      job.status === "printing" && "border-accent/50 bg-accent/5",
                      job.status === "failed" && "border-destructive/50 bg-destructive/5",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        {getQueueStatusIcon(job.status)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{job.file_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.printer?.name || 'Unknown'} · {job.copies} {job.copies === 1 ? "copy" : "copies"}
                        </p>
                        {job.error_message && <p className="text-sm text-destructive mt-1">{job.error_message}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {job.status === "printing" && (
                        <div className="w-32 hidden sm:block">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Printing...</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-1.5" />
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground hidden sm:block">{job.created_at ? new Date(job.created_at).toLocaleString() : ''}</p>

                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize",
                          job.status === "printing" && "bg-accent/10 text-accent",
                          job.status === "completed" && "bg-green-500/10 text-green-600",
                          job.status === "failed" && "bg-destructive/10 text-destructive",
                        )}
                      >
                        {job.status}
                      </Badge>

                      {(job.status === "queued" || job.status === "printing") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}

                      {job.status === "failed" && (
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Print Settings</CardTitle>
              <CardDescription>Configure default settings for all print jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default printer</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {printers.map((printer) => (
                        <SelectItem key={printer.id} value={printer.id}>
                          {printer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Print quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Fast)</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default paper size</Label>
                  <Select defaultValue="4x6">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4x6">4&quot; x 6&quot; (Shipping)</SelectItem>
                      <SelectItem value="address">Address Label</SelectItem>
                      <SelectItem value="barcode">Barcode (2&quot; x 1&quot;)</SelectItem>
                      <SelectItem value="custom">Custom Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color mode</Label>
                  <Select defaultValue="mono">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mono">Monochrome</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Auto-print after resize</p>
                    <p className="text-sm text-muted-foreground">Automatically send labels to printer after resizing</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Print preview</p>
                    <p className="text-sm text-muted-foreground">Show preview before printing each label</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Duplex printing</p>
                    <p className="text-sm text-muted-foreground">Print on both sides when supported</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Low paper alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when label roll is running low</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Printer Drivers
              </CardTitle>
              <CardDescription>Download drivers for your label printers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {["DYMO", "Zebra", "Brother", "Rollo"].map((brand) => (
                  <Button key={brand} variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                    <Download className="w-5 h-5" />
                    <span>{brand} Driver</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Printer Settings</DialogTitle>
            <DialogDescription>{selectedPrinter?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Printer name</Label>
              <Input defaultValue={selectedPrinter?.name} />
            </div>
            <div className="space-y-2">
              <Label>Paper size</Label>
              <Select defaultValue={selectedPrinter?.paper_size}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30252 Address">30252 Address</SelectItem>
                  <SelectItem value="4x6 Shipping">4x6 Shipping</SelectItem>
                  <SelectItem value="DK-1201">DK-1201</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Printer Information</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span className="text-foreground">{selectedPrinter?.printer_type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Connection:</span>{" "}
                  <span className="text-foreground capitalize">{selectedPrinter?.connection_type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Firmware:</span>{" "}
                  <span className="text-foreground">{selectedPrinter?.firmware || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total printed:</span>{" "}
                  <span className="text-foreground">{selectedPrinter?.total_printed?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
