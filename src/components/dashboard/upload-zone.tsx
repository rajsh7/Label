"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileImage, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setFiles(["shipping-label-001.pdf", "fba-label-batch.pdf"])
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Upload Labels</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/50",
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Drop your labels here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF, PNG, JPG up to 50MB</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Browse Files
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileImage className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{file}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground">Process Labels</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
