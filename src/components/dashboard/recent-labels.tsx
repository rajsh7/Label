"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, Eye, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface RecentLabelsProps {
  designs: any[]
}

export function RecentLabels({ designs }: RecentLabelsProps) {
  if (!designs || designs.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No labels created yet</p>
            <Button asChild className="mt-4">
              <Link href="/editor">Create Your First Label</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Labels</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link href="/templates">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Format</th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Type</th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">Date</th>
                <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{design.name}</p>
                      {design.description && (
                        <p className="text-xs text-muted-foreground">{design.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{design.label_base_id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={design.is_template ? "default" : "secondary"}>
                      {design.is_template ? "Template" : "Design"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(design.created_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8" suppressHydrationWarning>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/editor?design=${design.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
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
  )
}
