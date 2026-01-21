import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-on-scroll rounded-2xl bg-foreground text-background p-12 md:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Ready to streamline your labeling?</h2>
          <p className="text-lg opacity-70 mb-8 max-w-xl mx-auto">
            Join 10,000+ sellers who save hours every week with LabelPro. Start free, upgrade when you need more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8" asChild>
              <a href="/signup">Get started free</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-background/20 text-background hover:bg-background/10 group bg-transparent"
              asChild
            >
              <a href="/login">
                Schedule a demo
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 mx-8">
                <span className="text-muted-foreground">✨ Trusted by 10,000+ sellers</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">255+ label formats</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">98% faster labeling</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Free forever plan</span>
                <span className="text-muted-foreground">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
