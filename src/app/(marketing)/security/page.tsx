import { LegalSidebar } from "@/components/marketing/legal-sidebar"

export default function SecurityPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <LegalSidebar />
          
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                  <span className="material-symbols-outlined text-3xl">shield_lock</span>
                </div>
                <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Enterprise Grade Security</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-10">Security First.</h1>
              <p className="text-xl text-slate-500 mb-12 leading-relaxed">
                We treat your data with the same level of security as a banking institution. LabelPro is SOC2 Type II compliant and encrypts all data at rest and in transit.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xl mb-3">Data Encryption</h4>
                  <p className="text-slate-500">AES-256 encryption for all stored data, with TLS 1.3 for all data in transit.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xl mb-3">Access Control</h4>
                  <p className="text-slate-500">Role-based access control (RBAC) and mandatory MFA for all administrative access.</p>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg prose-slate max-w-none text-slate-500 text-lg md:text-xl leading-relaxed">
               <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Compliance & Certifications</h3>
               <p className="mb-6">
                 We regularly undergo third-party security audits and penetration testing to ensure the safety of your data.
               </p>
               <ul className="list-disc pl-6 space-y-3 mb-8 marker:text-green-500">
                 <li>SOC 2 Type II Certified</li>
                 <li>GDPR Compliant</li>
                 <li>CCPA Compliant</li>
                 <li>Regular Penetration Testing</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}