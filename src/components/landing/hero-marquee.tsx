"use client"

export function HeroMarquee() {
  return (
    <div className="w-full overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap hover-pause">
        <div className="flex items-center space-x-24 px-12 mr-24">
          <img src="/amazon-logo.png" alt="Amazon" className="h-12 w-auto opacity-60" />
          <img src="/walmart-logo.png" alt="Walmart" className="h-12 w-auto opacity-60" />
          <img src="/ebay-logo-display.png" alt="eBay" className="h-12 w-auto opacity-60" />
          <img src="/shopify-logo.png" alt="Shopify" className="h-12 w-auto opacity-60" />
          <img src="/shipstation-logo.png" alt="ShipStation" className="h-12 w-auto opacity-60" />
          <img src="/zapier-logo.png" alt="Zapier" className="h-12 w-auto opacity-60" />
        </div>
        <div className="flex items-center space-x-24 px-12 mr-24">
          <img src="/amazon-logo.png" alt="Amazon" className="h-12 w-auto opacity-60" />
          <img src="/walmart-logo.png" alt="Walmart" className="h-12 w-auto opacity-60" />
          <img src="/ebay-logo-display.png" alt="eBay" className="h-12 w-auto opacity-60" />
          <img src="/shopify-logo.png" alt="Shopify" className="h-12 w-auto opacity-60" />
          <img src="/shipstation-logo.png" alt="ShipStation" className="h-12 w-auto opacity-60" />
          <img src="/zapier-logo.png" alt="Zapier" className="h-12 w-auto opacity-60" />
        </div>
        <div className="flex items-center space-x-24 px-12 mr-24">
          <img src="/amazon-logo.png" alt="Amazon" className="h-12 w-auto opacity-60" />
          <img src="/walmart-logo.png" alt="Walmart" className="h-12 w-auto opacity-60" />
          <img src="/ebay-logo-display.png" alt="eBay" className="h-12 w-auto opacity-60" />
          <img src="/shopify-logo.png" alt="Shopify" className="h-12 w-auto opacity-60" />
          <img src="/shipstation-logo.png" alt="ShipStation" className="h-12 w-auto opacity-60" />
          <img src="/zapier-logo.png" alt="Zapier" className="h-12 w-auto opacity-60" />
        </div>
        <div className="flex items-center space-x-24 px-12">
          <img src="/amazon-logo.png" alt="Amazon" className="h-12 w-auto opacity-60" />
          <img src="/walmart-logo.png" alt="Walmart" className="h-12 w-auto opacity-60" />
          <img src="/ebay-logo-display.png" alt="eBay" className="h-12 w-auto opacity-60" />
          <img src="/shopify-logo.png" alt="Shopify" className="h-12 w-auto opacity-60" />
          <img src="/shipstation-logo.png" alt="ShipStation" className="h-12 w-auto opacity-60" />
          <img src="/zapier-logo.png" alt="Zapier" className="h-12 w-auto opacity-60" />
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .hover-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}