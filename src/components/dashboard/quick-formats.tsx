"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formats = [
  { name: "Amazon FBA", size: "4x6", popular: true },
  { name: "USPS Priority", size: "4x6", popular: true },
  { name: "FedEx Ground", size: "4x6.75", popular: false },
  { name: "UPS Standard", size: "4x6", popular: false },
  { name: "Walmart WFS", size: "4x6", popular: true },
]

export function QuickFormats() {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Quick Formats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {formats.map((format) => (
            <button
              key={format.name}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{format.name}</p>
                <p className="text-xs text-muted-foreground">{format.size} inches</p>
              </div>
              {format.popular && (
                <Badge variant="secondary" className="text-xs">
                  Popular
                </Badge>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
