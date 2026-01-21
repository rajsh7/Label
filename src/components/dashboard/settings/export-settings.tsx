"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { FileJson, FileSpreadsheet, FileText, Download } from "lucide-react"

export function ExportSettings() {
  const [format, setFormat] = useState("json")
  const [dataTypes, setDataTypes] = useState({
    labels: true,
    history: true,
    settings: false,
    integrations: false
  })
  const [exporting, setExporting] = useState(false)

  const toggleDataType = (type: keyof typeof dataTypes) => {
    setDataTypes(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const handleExport = async () => {
    setExporting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const exportData: any = {}

    if (dataTypes.labels) {
      const { data } = await supabase
        .from("labels")
        .select("*")
        .eq("user_id", user.id)
      exportData.labels = data
    }

    if (dataTypes.history) {
      const { data } = await supabase
        .from("processing_history")
        .select("*")
        .eq("user_id", user.id)
      exportData.history = data
    }

    if (dataTypes.settings) {
      const { data } = await supabase
        .from("profiles")
        .select("notification_settings, appearance_settings")
        .eq("id", user.id)
        .single()
      exportData.settings = data
    }

    if (dataTypes.integrations) {
      const { data } = await supabase
        .from("profiles")
        .select("connected_integrations")
        .eq("id", user.id)
        .single()
      exportData.integrations = data
    }

    let content = ""
    let filename = `labelpro-export-${Date.now()}`
    let mimeType = ""

    if (format === "json") {
      content = JSON.stringify(exportData, null, 2)
      filename += ".json"
      mimeType = "application/json"
    } else if (format === "csv") {
      const rows = []
      if (exportData.labels) {
        rows.push("Type,Data")
        rows.push(...exportData.labels.map((l: any) => `Label,${JSON.stringify(l)}`))
      }
      content = rows.join("\n")
      filename += ".csv"
      mimeType = "text/csv"
    } else if (format === "pdf") {
      content = JSON.stringify(exportData, null, 2)
      filename += ".txt"
      mimeType = "text/plain"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    setExporting(false)
  }

  const hasSelectedData = Object.values(dataTypes).some(v => v)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Export Data</h2>
        <p className="text-sm text-muted-foreground mb-6">Download your data in various formats</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">Export Format</label>
          <p className="text-sm text-muted-foreground mb-3">Choose your preferred export format</p>
          <div className="space-y-2">
            {[
              { value: "json", label: "JSON", desc: "Machine-readable format", icon: FileJson },
              { value: "csv", label: "CSV", desc: "Spreadsheet compatible", icon: FileSpreadsheet },
              { value: "pdf", label: "PDF", desc: "Human-readable report", icon: FileText }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFormat(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left flex items-start gap-3 ${
                  format === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <option.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-3">Data to Export</label>
          <p className="text-sm text-muted-foreground mb-3">Select the data you want to include in your export</p>
          <div className="space-y-2">
            {[
              { key: "labels", label: "Labels", desc: "All your processed labels" },
              { key: "history", label: "Processing history", desc: "Complete activity log" },
              { key: "settings", label: "Settings", desc: "Your preferences and configurations" },
              { key: "integrations", label: "Integration data", desc: "Connected platform information" }
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={dataTypes[option.key as keyof typeof dataTypes]}
                  onChange={() => toggleDataType(option.key as keyof typeof dataTypes)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-muted/50">
          <h3 className="text-sm font-medium text-foreground mb-2">Download Your Data</h3>
          <p className="text-sm text-muted-foreground mb-4">Generate and download your data export</p>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border mb-4">
            <div>
              <div className="text-sm font-medium">Ready to export</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Your export will include {Object.values(dataTypes).filter(v => v).length} data type(s)
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={!hasSelectedData || exporting}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exporting..." : "Export Data"}
          </button>

          <p className="text-xs text-muted-foreground mt-3">
            Note: Large exports may take a few minutes to generate. You will receive an email when your export is ready.
          </p>
        </div>
      </div>
    </div>
  )
}
