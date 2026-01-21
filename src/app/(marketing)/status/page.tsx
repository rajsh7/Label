export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">System Status</h1>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">All Systems Operational</h2>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-muted-foreground">All services are running normally.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span>API Services</span>
                  <span className="text-green-600">Operational</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span>Label Generation</span>
                  <span className="text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}