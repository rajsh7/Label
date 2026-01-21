import { Layers, Zap, Printer, Grid, Upload, Shield } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "255+ Label Formats",
    description: "Support for Amazon FBA, Walmart, eBay, Shopify, Etsy, and all major shipping carriers.",
  },
  {
    icon: Zap,
    title: "Instant Resizing",
    description: "Automatically resize and optimize labels for any printer or marketplace requirement.",
  },
  {
    icon: Printer,
    title: "Printer Integration",
    description: "Native support for DYMO, Zebra, Rollo, Brother and all popular label printers.",
  },
  {
    icon: Grid,
    title: "Drag & Drop Editor",
    description: "Intuitive visual editor to customize labels with your branding and requirements.",
  },
  {
    icon: Upload,
    title: "Batch Processing",
    description: "Upload CSV files and generate hundreds of labels in seconds with batch mode.",
  },
  {
    icon: Shield,
    title: "Barcode Generation",
    description: "Create compliant barcodes for any marketplace with automatic format detection.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-accent font-medium mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Faster iteration.
            <br />
            More sales.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            The platform for rapid label creation. Let your team focus on shipping products instead of managing label
            formats.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-on-scroll group p-6 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
