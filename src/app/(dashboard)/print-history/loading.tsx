export default function PrintHistoryLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Loading print history...</p>
      </div>
    </div>
  )
}