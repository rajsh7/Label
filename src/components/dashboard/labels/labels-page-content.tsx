import { useState, useEffect } from "react"
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
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Barcode from 'react-barcode'
import { toast } from 'sonner'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  const [labels, setLabels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch labels from database
  useEffect(() => {
    async function fetchLabels() {
      try {
        const response = await fetch('/api/labels')
        const result = await response.json()
        
        if (result.success && result.data) {
          // Transform database records to match UI expectations
          const transformedLabels = result.data.map((label: any) => ({
            id: label.id,
            name: label.name,
            format: label.label_base_id || 'Custom',
            status: 'Completed',
            date: new Date(label.created_at).toLocaleDateString(),
            count: 1,
            size: '0.5 MB',
            thumbnail: '/placeholder.svg',
          }))
          setLabels(transformedLabels)
        }
      } catch (error) {
        console.error('Failed to fetch labels:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLabels()
  }, [])

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

  const [printLabel, setPrintLabel] = useState<any>(null)

  const handleDownload = async (label: any, action: 'download' | 'print' = 'download') => {
    try {
        const toastId = toast.loading("Preparing label...")

        // Fetch full label details including elements
        const { data: fullLabel, error } = await supabase
            .from('label_designs')
            .select('*')
            .eq('id', label.id)
            .single()
            
        if (error || !fullLabel) {
            toast.error("Failed to load label data")
            toast.dismiss(toastId)
            return
        }

        // Set label for rendering in hidden container
        setPrintLabel(fullLabel)
        
        // Wait for render (1.5s delay to ensure barcodes/images/fonts are fully loaded)
        await new Promise(resolve => setTimeout(resolve, 1500))

        const element = document.getElementById('label-print-generator')
        if (!element) {
            toast.error("Generator element not found")
            toast.dismiss(toastId)
            return
        }

        // Capture with identical settings for consistency
        const capturedCanvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 0,
            removeContainer: true,
            width: fullLabel.width_px,
            height: fullLabel.height_px,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById('label-print-generator')
                if (clonedElement) {
                    clonedElement.style.transform = 'none'
                    clonedElement.style.transformOrigin = 'top left'
                    clonedElement.style.borderRadius = '0'
                    clonedElement.style.boxShadow = 'none'
                    clonedElement.style.margin = '0'
                    clonedElement.style.position = 'absolute'
                    clonedElement.style.top = '0'
                    clonedElement.style.left = '0'
                }
            }
        })

        if (action === 'print') {
            const imgData = capturedCanvas.toDataURL('image/png', 1.0)
            
            // PDF Dimensions with precision matching Canvas
            const dpi = fullLabel.dpi || 203
            const widthMm = (fullLabel.width_px / dpi) * 25.4
            const heightMm = (fullLabel.height_px / dpi) * 25.4
            
            const pdf = new jsPDF({
                orientation: widthMm > heightMm ? 'l' : 'p',
                unit: 'mm',
                format: [widthMm, heightMm],
                compress: true,
                precision: 2
            })

            pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST')
            const blobUrl = pdf.output('bloburl')

            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src = blobUrl.toString()
            document.body.appendChild(iframe)
            
            iframe.onload = () => {
                try {
                    iframe.contentWindow?.print()
                } catch (e) {
                    console.error('Print failed', e)
                }
                // Cleanup after print
                setTimeout(() => {
                    document.body.removeChild(iframe)
                    URL.revokeObjectURL(blobUrl.toString())
                }, 1000)
            }
        } else {
            // PNG Download
            const imgData = capturedCanvas.toDataURL('image/png', 1.0)
            const link = document.createElement('a')
            link.href = imgData
            link.download = `${fullLabel.name.replace(/[^a-z0-9]/gi, '_')}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

        toast.dismiss(toastId)
        toast.success(action === 'print' ? "Opening print dialog..." : "Label downloaded as PNG!")
        
        // Cleanup
        setPrintLabel(null)

    } catch (error) {
        console.error("PDF Error:", error)
        toast.error("Failed to generate PDF")
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading labels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <style jsx global>{`
        /* Force font family override for the generator */
        .is-editor-page {
          font-family: 'Arial', sans-serif !important;
        }
        .is-editor-page * {
          font-family: inherit;
        }
      `}</style>

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
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border bg-transparent"
                onClick={() => {
                    const labelToProcess = labels.find(l => l.id === selectedLabels[0])
                    if (labelToProcess) handleDownload(labelToProcess, 'download')
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border bg-transparent"
                onClick={() => {
                    const labelToProcess = labels.find(l => l.id === selectedLabels[0])
                    if (labelToProcess) handleDownload(labelToProcess, 'print')
                }}
              >
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
                            <DropdownMenuItem onClick={() => handleDownload(label, 'download')}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(label, 'print')}>
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
                      <DropdownMenuItem onClick={() => handleDownload(label, 'download')}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(label, 'print')}>
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

      {/* Hidden Generator Container - Moved to end for isolation */}
      <div style={{ position: 'absolute', top: -10000, left: -10000, visibility: 'visible' }}>
        {printLabel && (
            <div 
                id="label-print-generator"
                className="is-editor-page"
                style={{
                    width: printLabel.width_px,
                    height: printLabel.height_px,
                    position: 'relative',
                    backgroundColor: 'white',
                    overflow: 'hidden'
                }}
            >
                {printLabel.elements?.map((el: any) => (
                    <div key={el.id} style={{
                        position: 'absolute',
                        left: el.x,
                        top: el.y,
                        width: el.width || 'auto',
                        height: el.height || 'auto',
                        zIndex: el.z_index,
                        ...el.style
                    }}>
                        {el.type === 'text' && (
                            <div style={{ 
                                width: '100%', 
                                height: '100%', 
                                whiteSpace: 'nowrap',
                                outline: 'none'
                            }}>
                                {el.content}
                            </div>
                        )}
                        {el.type === 'shape' && (
                            <div style={{ 
                                width: '100%', 
                                height: '100%',
                                backgroundColor: '#E2E8F0',
                                border: '1px solid #000000',
                                ...el.style 
                            }}></div>
                        )}
                        {el.type === 'image' && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={el.content} 
                                alt="" 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain',
                                    ...el.style 
                                }} 
                            />
                        )}
                        {el.type === 'barcode' && (
                            <div style={{ 
                                width: '100%', 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                background: 'white',
                                ...el.style
                            }}>
                                <Barcode 
                                    value={el.content}
                                    width={el.width ? Math.max(1, el.width / (el.content.length * 10)) : 2}
                                    height={el.height || 50}
                                    displayValue={el.displayValue !== undefined ? el.displayValue : false}
                                    margin={0}
                                    background="transparent"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
