import { LegalSidebar } from "@/components/marketing/legal-sidebar"

export default function CookiePolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <LegalSidebar />
          
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="mb-24">
              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-6 block">Last Updated: November 1, 2023</span>
              <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-12">Cookie<br/>Policy</h1>
              <div className="prose prose-lg prose-slate max-w-none text-slate-500 text-lg md:text-xl leading-relaxed">
                <p className="mb-8">
                  This Cookie Policy explains how LabelPro uses cookies and similar technologies to recognize you when you visit our website.
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">1. What are Cookies?</h3>
                <p className="mb-6">
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or work more efficiently, as well as to provide reporting information.
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">2. Why We Use Cookies</h3>
                <p className="mb-8">
                  We use cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
