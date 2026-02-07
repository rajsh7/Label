"use client"

import { useState, useEffect } from "react"
import { getPrinters, deletePrinter, getPrintQueue, deletePrintJob } from "@/server/actions/printers"
import {
  Printer,
  Plus,
  Wifi,
  Usb,
  Settings2,
  Trash2,
  RefreshCw,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const getPrinterImage = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('rollo')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuCmVYlehD-Hz6esALuEye78rN62bzW59dqE7ie6GGAAPnnNyScsCSjwVKf_Hrkv2Me67ppkuL5yGMyE-fTka8pLJ4FGk0ygnC6rRKc7UkmorJ1d26N8PNQzxYdetMdV2FyFgT32C8ePAvXUc7M-4x7ITQrSoTwDwQ4XHG9Y-DOJVN9_x8V0lhaocSF7-P0hwENY6J2rT4OGyabLpKsbovNF9e4j85q7TXL_gFamR1KQSSIYNs79gQKDmmgRKsRJHTHIlIgbCztIqoU"
    if (n.includes('zebra')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuA2s4wv-fSMSEMFEUDzuOJjHpDq0JCagEk4SOZILODUZ3cdClGgah3LH3O36IeFgsQ0psSR6jjCRHSas9LV-v2pawD4IMJFGM-vpa5DShKKByQ02Yn2vtGOZN_frbTdl05ONH6tLqS76KJML_kFo2WU5kyyiYH9fD3W0NvieqkpD_eZk8JQ9lndYJu8zUlB_bER49TWV8scgdep_UxJp4hZyvVT348uJs9FjhEQg2NUia34Zat_y3u1ZYYKq-2rlm2tTejoKMZGJVk"
    if (n.includes('brother')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuCHK3AbBdluLqrfE2AR2gISB2qzffGCElsGyXI_eZH6uX7Z8I2HeARQDKVs9gdExLSGDkAR4q6t0tbKlHav5xzJI7W7vAHZQmqbFoQoV2T6jJvPjCqYeCqoL8NiXguwD_YRs7D9FrFghD72ic8bqiYZ8Yv6dqdwzfURDFh47L6mXZQ2lhQMp5bYTR4lr7_vfZ9WaiMb7RF_83LscCoOOIfdL4gnsj9oVyemgmH11z6e40YwUrMi5zVIqjUwGVQItK7E69dB7riupWc"
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuCmVYlehD-Hz6esALuEye78rN62bzW59dqE7ie6GGAAPnnNyScsCSjwVKf_Hrkv2Me67ppkuL5yGMyE-fTka8pLJ4FGk0ygnC6rRKc7UkmorJ1d26N8PNQzxYdetMdV2FyFgT32C8ePAvXUc7M-4x7ITQrSoTwDwQ4XHG9Y-DOJVN9_x8V0lhaocSF7-P0hwENY6J2rT4OGyabLpKsbovNF9e4j85q7TXL_gFamR1KQSSIYNs79gQKDmmgRKsRJHTHIlIgbCztIqoU" // Fallback
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
    )
  }

  return (
    <div className="pb-12 px-6 md:px-12 max-w-[1600px] mx-auto w-full flex flex-col gap-10">
      
        <section className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 py-6 relative">
          <div className="flex flex-col gap-3 max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-black leading-[0.9]">
              Printers &amp; <br className="hidden md:block"/>Hardware
            </h1>
            <p className="text-slate-500 text-xl max-w-2xl mt-4 font-medium">
              Monitor device health, manage consumables, and configure your print network.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3">
                    <span className="material-symbols-outlined">add_circle</span>
                    Connect New Device
                </button>
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
                      className="flex-1 gap-2 h-auto py-4 bg-transparent border-dashed"
                      onClick={handleScan}
                      disabled={isScanning}
                    >
                      {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      {isScanning ? "Scanning..." : "Scan for printers"}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Available printers</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {availablePrinters.map((printer) => (
                      <button
                        key={printer.id}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-blue-50/50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Printer className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{printer.name}</p>
                            <p className="text-sm text-gray-500">
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
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or add manually</span>
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
        </section>

        {printers.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Printer className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No printers connected</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">Connect a printer to start printing your shipping labels.</p>
                <Button onClick={() => setShowAddDialog(true)} size="lg" className="rounded-full">Connect Printer</Button>
            </div>
        ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {printers.map(printer => (
                <div key={printer.id} className="glass-card rounded-[2rem] border border-white p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 group flex flex-col h-auto min-h-[480px]">
                    <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-black">{printer.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1 uppercase">{printer.location || 'Office'} • {printer.type || 'Thermal'}</p>
                    </div>
                    {getStatusBadge(printer.status)}
                    </div>
                    
                    <div className="h-48 relative flex items-center justify-center -mx-4 group-hover:scale-105 transition-transform duration-500 my-4">
                        <img 
                            alt={`${printer.name} Render`} 
                            className={`w-full h-full object-contain mix-blend-multiply drop-shadow-2xl opacity-90 ${printer.status === 'offline' ? 'grayscale opacity-60' : ''}`} 
                            src={getPrinterImage(printer.name)} 
                        />
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                            <div className="relative size-12 shrink-0">
                                <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-blue-500 text-lg">thermometer</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                                <p className="text-lg font-bold text-slate-700 capitalize">{printer.status}</p>
                            </div>
                        </div>
                         <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                            <div className="relative size-12 shrink-0">
                                <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-purple-500 text-lg">imagesearch_roller</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lifetime</p>
                                <p className="text-lg font-bold text-slate-700">{printer.total_printed || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                        <div className="flex gap-2">
                             <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500" onClick={() => handleDeletePrinter(printer.id)}>
                                <Trash2 className="w-5 h-5" />
                             </Button>
                             <Button variant="ghost" size="icon" className="rounded-full" onClick={() => {
                                setSelectedPrinter(printer)
                                setShowSettingsDialog(true)
                             }}>
                                <Settings2 className="w-5 h-5" />
                             </Button>
                        </div>
                    </div>
                </div>
            ))}
            </section>
        )}

        <section className="mt-8 mb-12">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-black">Print History</h3>
            <button className="text-slate-500 hover:text-primary font-bold text-sm flex items-center gap-2 transition-colors">
              View Full Logs <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
          <div className="glass-card rounded-[2rem] border border-white shadow-lg overflow-hidden">
             {printQueue.length === 0 ? (
                 <div className="p-12 text-center text-slate-500">No recent print jobs.</div>
             ) : (
                 <div className="divide-y divide-slate-100">
                    {printQueue.map(job => (
                         <div key={job.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center gap-6 group">
                            <div className="size-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                               <FileText className="w-6 h-6 text-slate-400" />
                            </div>
                             <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <div className="md:col-span-5">
                                    <h4 className="font-bold text-lg text-black truncate">{job.file_name}</h4>
                                    <p className="text-sm text-slate-500">{job.printer?.name || 'Unknown Printer'} • {new Date(job.created_at).toLocaleTimeString()}</p>
                                </div>
                                <div className="md:col-span-3">
                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                    <span className="material-symbols-outlined text-sm">description</span> {job.copies} Copies
                                    </span>
                                </div>
                                <div className="md:col-span-2">
                                     <span className={`font-bold text-sm flex items-center gap-1 ${job.status === 'completed' ? 'text-green-600' : 'text-slate-500'}`}>
                                      <span className="material-symbols-outlined text-lg">check</span> {job.status}
                                    </span>
                                </div>
                                <div className="md:col-span-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500" onClick={() => handleDeleteJob(job.id)}>
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                             </div>
                         </div>
                    ))}
                 </div>
             )}
          </div>
        </section>

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
              <Select defaultValue={selectedPrinter?.paper_size || "4x6 Shipping"}>
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
