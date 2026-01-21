import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Amazon FBA Seller",
    avatar: "https://i.pravatar.cc/150?img=1",
    content:
      "LabelPro cut our labeling time by 80%. We process 500+ orders daily and couldn't imagine going back to manual label creation.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Shopify Store Owner",
    avatar: "https://i.pravatar.cc/150?img=2",
    content:
      "The batch processing feature is a game-changer. I uploaded 1,000 SKUs and had all labels ready in under 5 minutes.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "eBay Power Seller",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Finally, a tool that understands e-commerce sellers. The printer integration with my Zebra works flawlessly.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Walmart Marketplace Seller",
    avatar: "https://i.pravatar.cc/150?img=4",
    content:
      "Walmart compliance labels used to be a nightmare. LabelPro makes it effortless with built-in format validation.",
    rating: 5,
  },
  {
    name: "Jessica Thompson",
    role: "Multi-Channel Seller",
    avatar: "https://i.pravatar.cc/150?img=5",
    content:
      "Managing labels across Amazon, eBay, and Etsy was chaos. Now it's all in one place with consistent quality.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "Fulfillment Center Manager",
    avatar: "https://i.pravatar.cc/150?img=6",
    content:
      "We switched our entire fulfillment operation to LabelPro. The ROI was immediate with zero training needed.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-accent font-medium mb-4">Testimonials</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Loved by sellers worldwide</h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of e-commerce sellers who trust LabelPro for their labeling needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="animate-on-scroll p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" strokeWidth={0} />
                ))}
              </div>
              <p className="text-foreground mb-6">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
