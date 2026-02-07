import { LegalSidebar } from "@/components/marketing/legal-sidebar"

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <LegalSidebar />
          
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="mb-24">
              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-6 block">Last Updated: November 1, 2023</span>
              <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-12">Privacy<br/>Policy</h1>
              <div className="prose prose-lg prose-slate max-w-none text-slate-500 text-lg md:text-xl leading-relaxed">
                <p className="mb-8">
                  At LabelPro, we take your privacy seriously. This Privacy Policy describes how we collect, use, and disclose your information when you use our Services.
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">1. Information We Collect</h3>
                <p className="mb-6">
                  We collect information you provide directly to us, such as when you create or modify your account, request support, or communicate with us. This information may include:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-primary">
                  <li>Name, email address, and contact details</li>
                  <li>Billing information and payment history</li>
                  <li>Label data and shipping addresses (processed securely)</li>
                  <li>Usage data and device information</li>
                </ul>
                <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">2. How We Use Your Information</h3>
                <p className="mb-8">
                  We use the information we collect to operate, maintain, and improve our Services, to process your transactions, and to communicate with you. We do not sell your personal data to third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}