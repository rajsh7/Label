"use client"

import Link from "next/link"
import { useState } from "react"

export default function DocumentationPage() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <div className="bg-background-light min-h-screen text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary cursor-pointer group">
            <div className="size-8 transition-transform duration-500 group-hover:rotate-90">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <span className="text-slate-900 font-bold text-xl tracking-tight">LabelPro</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider border border-slate-200">Docs v3.0</span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-semibold text-slate-900 hover:text-primary transition-colors" href="/docs">Documentation</Link>
            <Link className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors" href="/docs/api">API Reference</Link>
            <Link className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors" href="/community">Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 transition-all ${isSearchFocused ? 'ring-2 ring-primary/20 border-primary/50' : ''}`}>
              <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
              <input 
                className="bg-transparent border-none p-0 text-sm focus:ring-0 placeholder-slate-400 text-slate-700 w-32 lg:w-48 outline-none" 
                placeholder="Search docs..." 
                type="text"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <span className="text-xs text-slate-400 font-mono ml-2">⌘K</span>
            </div>
            <Link href="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/20">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto pt-20 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-slate-200 bg-white py-10 pl-6 md:pl-12 pr-6">
          <nav className="space-y-10">
            <div>
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Getting Started</h5>
              <ul className="space-y-3">
                <li><Link className="block text-sm font-medium text-primary border-l-2 border-primary pl-4 -ml-[18px]" href="#">Introduction</Link></li>
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-300 -ml-[18px]" href="#">Quick Start</Link></li>
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors pl-4 border-l-2 border-transparent hover:border-slate-300 -ml-[18px]" href="#">Architecture</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Core Concepts</h5>
              <ul className="space-y-3">
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Printers & Rolls</Link></li>
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Label Templates</Link></li>
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Smart Batching</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Authentication</h5>
              <ul className="space-y-3">
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">API Keys</Link></li>
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">OAuth 2.0</Link></li>
                <li><Link className="block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">Scopes</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Endpoint Reference</h5>
              <ul className="space-y-3">
                <li>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900">Print Jobs</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">POST</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900">Webhooks</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">GET</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900">Devices</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">LIST</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <Link className="flex items-center gap-3 group" href="#">
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">terminal</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">CLI Tool</p>
                  <p className="text-[10px] text-slate-400">v2.4.1 available</p>
                </div>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-6 py-12 md:px-16 lg:px-24">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
              <span>Docs</span>
              <span className="material-symbols-outlined text-sm text-slate-300">chevron_right</span>
              <span>Getting Started</span>
              <span className="material-symbols-outlined text-sm text-slate-300">chevron_right</span>
              <span className="text-primary font-bold">Introduction</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">Documentation</h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-3xl">
              Welcome to the LabelPro API reference. Our REST API enables you to programmatically manage print jobs, sync inventory data across marketplaces, and render high-fidelity labels in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-20">
            <Link className="group p-8 rounded-3xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-glow transition-all duration-300" href="#">
              <div className="size-12 rounded-xl bg-purple-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Quick Start Guide</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get up and running with your first print job in less than 5 minutes using our Node.js SDK.</p>
            </Link>
            <Link className="group p-8 rounded-3xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-glow transition-all duration-300" href="#">
              <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">key</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Authentication</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Learn how to generate API keys and handle OAuth flows for multi-tenant applications.</p>
            </Link>
          </div>

          <hr className="border-slate-100 mb-20"/>

          <section className="mb-20">
            <div className="flex flex-col xl:flex-row gap-12">
              <div className="xl:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-4xl">lock</span>
                  Authentication
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  The LabelPro API uses API keys to authenticate requests. You can view and manage your API keys in the <Link className="text-primary font-bold underline decoration-primary/30 hover:decoration-primary" href="/dashboard">Dashboard</Link>.
                </p>
                <p className="text-slate-500 leading-relaxed mb-8">
                  Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
                </p>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                  <span className="material-symbols-outlined text-amber-500 shrink-0">warning</span>
                  <div className="text-sm text-amber-800">
                    <strong>Production Safety:</strong> All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
                  </div>
                </div>
              </div>
              <div className="xl:w-1/2">
                <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-500/80"></div>
                      <div className="size-3 rounded-full bg-yellow-500/80"></div>
                      <div className="size-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-xs font-mono text-slate-400">curl request</div>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="font-mono text-sm leading-relaxed text-slate-300">
                      <span className="text-[#c084fc]">curl</span> https://api.labelpro.io/v1/print_jobs \<br/>
                      {'  '}-u <span className="text-[#4ade80]">#####</span>: \<br/>
                      {'  '}-d <span className="text-[#60a5fa]">template</span>=<span className="text-[#4ade80]">"tmpl_12345"</span> \<br/>
                      {'  '}-d <span className="text-[#60a5fa]">printer</span>=<span className="text-[#4ade80]">"prt_98765"</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Platform Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Integration 1 */}
              <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-glow-hover transition-all duration-500 overflow-hidden">
                <div className="absolute -right-4 -top-4 size-24 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className="size-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-[#FF9900] drop-shadow-[0_0_15px_rgba(255,153,0,0.5)]">shopping_cart</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wide">Active</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Amazon SP-API</h3>
                <p className="text-slate-500 text-sm mb-6">Bi-directional sync for FBA shipments and merchant fulfilled orders. Includes automatic ASIN label generation.</p>
                <Link className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-primary transition-colors" href="#">
                  View Integration <span className="material-symbols-outlined text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>

              {/* Integration 2 */}
              <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-[0_0_30px_rgba(149,191,71,0.3)] transition-all duration-500 overflow-hidden">
                <div className="absolute -right-4 -top-4 size-24 bg-gradient-to-br from-[#95BF47]/10 to-green-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className="size-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-[#95BF47] drop-shadow-[0_0_15px_rgba(149,191,71,0.5)]">shopping_bag</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide">Beta</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Shopify Plus</h3>
                <p className="text-slate-500 text-sm mb-6">Real-time webhook events for order creation. Supports meta-fields for custom label data mapping.</p>
                <Link className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-[#95BF47] transition-colors" href="#">
                  View Integration <span className="material-symbols-outlined text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>

              {/* Integration 3 */}
              <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-[0_0_30px_rgba(96,165,250,0.3)] transition-all duration-500 overflow-hidden">
                <div className="absolute -right-4 -top-4 size-24 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className="size-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">webhook</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">New</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Webhooks</h3>
                <p className="text-slate-500 text-sm mb-6">Subscribe to print job status updates. Receive JSON payloads when labels are rendered or printed.</p>
                <Link className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-blue-500 transition-colors" href="#">
                  View Integration <span className="material-symbols-outlined text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-32">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Endpoint Reference</h2>
              <div className="flex gap-2">
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 text-white">Node.js</button>
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200">Python</button>
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200">PHP</button>
              </div>
            </div>

            <div className="space-y-12">
              {/* Endpoint 1 */}
              <div className="grid xl:grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">POST</span>
                    <code className="text-sm font-mono text-slate-600 font-bold">/v1/print_jobs</code>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Create a print job</h3>
                  <p className="text-slate-500 mb-6">
                    Creates a new print job with the specified template and data. Returns a job object if the request is valid.
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Parameters</h4>
                  <ul className="space-y-4">
                    <li className="pb-4 border-b border-slate-50">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-mono text-sm text-primary font-bold">template_id</span>
                        <span className="text-xs text-slate-400">string</span>
                        <span className="text-xs text-red-500 font-bold uppercase">Required</span>
                      </div>
                      <p className="text-sm text-slate-500">The unique identifier of the label template to use.</p>
                    </li>
                    <li className="pb-4 border-b border-slate-50">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-mono text-sm text-primary font-bold">quantity</span>
                        <span className="text-xs text-slate-400">integer</span>
                      </div>
                      <p className="text-sm text-slate-500">Number of copies to print. Defaults to 1.</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="sticky top-28">
                    <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
                      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                        <span className="text-xs font-bold text-slate-500">index.js</span>
                        <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                        </button>
                      </div>
                      <div className="p-6 overflow-x-auto">
                        <pre className="font-mono text-sm leading-relaxed text-slate-300">
                          <span className="text-[#c084fc]">const</span> labelPro = <span className="text-[#c084fc]">require</span>(<span className="text-[#4ade80]">'labelpro-node'</span>)(<span className="text-[#4ade80]">'sk_test_...'</span>);<br/>
                          <span className="text-[#c084fc]">const</span> job = <span className="text-[#c084fc]">await</span> labelPro.printJobs.<span className="text-[#60a5fa]">create</span>({'{'}<br/>
                          {'  '}template: <span className="text-[#4ade80]">'tmpl_shipping_4x6'</span>,<br/>
                          {'  '}printer: <span className="text-[#4ade80]">'prt_office_main'</span>,<br/>
                          {'  '}quantity: <span className="text-orange-400">1</span>,<br/>
                          {'  '}data: {'{'}<br/>
                          {'    '}recipient: <span className="text-[#4ade80]">'Jane Doe'</span>,<br/>
                          {'    '}address: <span className="text-[#4ade80]">'123 Market St, SF'</span>,<br/>
                          {'    '}tracking: <span className="text-[#4ade80]">'1Z999AA10123456784'</span><br/>
                          {'  }'}<br/>
                          {'});'}<br/>
                          console.<span className="text-[#60a5fa]">log</span>(job.status); <span className="text-[#64748b]">// 'queued'</span>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="grid xl:grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">GET</span>
                    <code className="text-sm font-mono text-slate-600 font-bold">/v1/printers</code>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">List all printers</h3>
                  <p className="text-slate-500 mb-6">
                    Returns a list of all printers connected to your organization, including their current online/offline status and paper roll details.
                  </p>
                </div>
                <div>
                  <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-500">index.js</span>
                      <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                      </button>
                    </div>
                    <div className="p-6 overflow-x-auto">
                      <pre className="font-mono text-sm leading-relaxed text-slate-300">
                        <span className="text-[#c084fc]">const</span> printers = <span className="text-[#c084fc]">await</span> labelPro.printers.<span className="text-[#60a5fa]">list</span>({'{'}<br/>
                        {'  '}limit: <span className="text-orange-400">10</span>,<br/>
                        {'  '}status: <span className="text-[#4ade80]">'online'</span><br/>
                        {'});'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-primary mb-6">
                <span className="material-symbols-outlined">print</span>
                <span className="text-slate-900 font-bold text-xl">LabelPro</span>
              </div>
              <p className="text-slate-500 mb-6 max-w-sm">The world's most advanced thermal printing platform for modern e-commerce brands.</p>
              <div className="flex gap-4">
                <Link className="text-slate-400 hover:text-slate-900 transition-colors" href="#"><span className="material-symbols-outlined">public</span></Link>
                <Link className="text-slate-400 hover:text-slate-900 transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Product</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link className="hover:text-primary transition-colors" href="#">Features</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Integrations</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Pricing</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link className="hover:text-primary transition-colors" href="#">Documentation</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">API Reference</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Community</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link className="hover:text-primary transition-colors" href="#">About</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Blog</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Careers</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link className="hover:text-primary transition-colors" href="#">Privacy</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Terms</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2023 LabelPro Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500"></span>
              <span className="text-slate-500 text-sm font-bold">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
