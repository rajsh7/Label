import { LegalSidebar } from "@/components/marketing/legal-sidebar"

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <LegalSidebar />
          
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="mb-24">
              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-6 block">Last Updated: November 1, 2023</span>
              <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-12">Terms of<br/>Service</h1>
              <div className="prose prose-lg prose-slate max-w-none text-slate-500 text-lg md:text-xl leading-relaxed">
                <p className="mb-8">
                  Welcome to LabelPro. By accessing or using our website, mobile application, or any other related services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">1. Acceptable Use</h3>
                <p className="mb-6">
                  You agree not to misuse the LabelPro services. For example, you must not:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-primary">
                  <li>Probe, scan, or test the vulnerability of any system or network.</li>
                  <li>Breach or otherwise circumvent any security or authentication measures.</li>
                  <li>Access, tamper with, or use non-public areas or parts of the Services, or shared areas of the Services you haven&apos;t been invited to.</li>
                  <li>Interfere with or disrupt any user, host, or network, for example by sending a virus, overloading, flooding, spamming, or mail-bombing any part of the Services.</li>
                </ul>
                <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">2. Intellectual Property</h3>
                <p className="mb-8">
                  LabelPro and its licensors exclusively own all right, title, and interest in and to the Services, including all associated intellectual property rights. You acknowledge that the Services are protected by copyright, trademark, and other laws of the United States and foreign countries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}