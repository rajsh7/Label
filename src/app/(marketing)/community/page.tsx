import Link from "next/link";


export default function CommunityPage() {
  return (
    <div className="bg-background-light text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary bg-dot-pattern min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
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
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors" href="/community">Community</Link>
            <Link className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors" href="/docs">Knowledge Base</Link>
            <Link className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors" href="/status">Status</Link>
          </div>
          <Link href="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/10">
            Sign In
          </Link>
        </div>
      </nav>

      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">help you</span> today?
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Find answers, watch tutorials, or connect with the LabelPro community.
          </p>
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/50 flex items-center">
              <span className="material-symbols-outlined text-slate-400 text-3xl ml-4">search</span>
              <input className="w-full bg-transparent border-none text-lg text-slate-900 placeholder:text-slate-400 focus:ring-0 p-4 outline-none" placeholder="Search for articles, errors, or topics..." type="text"/>
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                Search
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-slate-500 font-medium">
              <span>Popular:</span>
              <Link className="hover:text-primary underline decoration-slate-300 hover:decoration-primary transition-all" href="#">Printer Setup</Link>
              <Link className="hover:text-primary underline decoration-slate-300 hover:decoration-primary transition-all" href="#">ZPL Conversion</Link>
              <Link className="hover:text-primary underline decoration-slate-300 hover:decoration-primary transition-all" href="#">Shopify Sync</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-32 flex-grow">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Main Video Card */}
            <div className="lg:col-span-2 group relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 cursor-pointer min-h-[400px]">
              <div className="absolute inset-0">
                <img 
                  alt="Video tutorial preview showing a clean workspace with cosmetic labels" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdrj9tvTS1tuhqr5-RDo-TRL-tlFHbRwuZKB_ZbeLKCtO9MJN61rywbBxD_wtzz9pEJ2HgQ59GzzBY4gGUPTwDSL7fs7rtrsqVffJjO8m7BVlr-zcGIruoCc_GDQbBp7o-gX4Wwb3WhGM3aBuCw5lu58_J8zhJHExij-0kfSGwXp_lMzTW5Ih8LTRPdA-6VEZ-iJppMRt6CCBeC9PIVm2bJbDlIwWLUyP1Rg3ShBIpgXjkGjcDWlIRGnqFkUvo9jTLqlEgMdSUPaI"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              </div>
              <div className="absolute top-8 left-8">
                <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-fit">
                  <span className="material-symbols-outlined text-sm">play_circle</span> New Series
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-10 w-full max-w-xl">
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Master LabelPro with Video Tutorials</h2>
                <p className="text-slate-200 text-lg mb-8 line-clamp-2">Watch our new masterclass on designing premium cosmetic labels with foil effects and variable data.</p>
                <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  Watch Now <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="size-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                  <span className="material-symbols-outlined text-5xl">play_arrow</span>
                </div>
              </div>
            </div>

            {/* Troubleshooting Card */}
            <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <div className="size-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">build_circle</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Troubleshooting</h2>
                <p className="text-slate-500 mb-6">Printer acting up? Our interactive guide identifies 95% of common hardware issues.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-600 font-medium p-3 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group/item">
                    <span className="material-symbols-outlined text-slate-400 group-hover/item:text-red-500">print_disabled</span> Printer offline
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium p-3 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group/item">
                    <span className="material-symbols-outlined text-slate-400 group-hover/item:text-red-500">blur_on</span> Blurry prints
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium p-3 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group/item">
                    <span className="material-symbols-outlined text-slate-400 group-hover/item:text-red-500">link_off</span> Sync errors
                  </li>
                </ul>
                <Link className="text-red-500 font-bold flex items-center gap-2 hover:gap-4 transition-all" href="#">
                  Run Diagnostics <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">
                <img 
                  alt="Printer internals" 
                  className="w-full h-full object-contain rotate-12" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiet19wbDayBDaalhPKHcoGTOI6zaeEzB-U-5cIFOD6_JORQDOIC2JD3U3nutgHHTCXHKWngeImF0T4TcYF6hBYnOjgdlT44V7jRoc3hix3b2jaEKjSwgDDJaWNS5RI28_9ENUJ0XDyhMcHiS2P3J4EofVkfavMlhHZdgxKtJlPJpsO6FrUoxfDYWS2ODiQRXr3xSk3JJ9JsSBbFpktx7j_SW0mLBWYzXLhLF6d5C6kTGVhJHEOdyt8O39dwPqx_C65nFuu0Wkd7A"
                />
              </div>
            </div>

            {/* Community Forums Section */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-slate-900">Community Forums</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">124 Online</span>
                  </div>
                  <p className="text-slate-500 text-lg">Join the conversation with thousands of sellers and designers.</p>
                </div>
                <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">add_comment</span> Start a Topic
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {/* Forum Post 1 */}
                <div className="bg-surface rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">JS</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">Sarah J.</span>
                        <span className="text-[10px] text-slate-400">2 hours ago</span>
                      </div>
                    </div>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">DESIGN</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Best heat settings for glossy synthetic rolls?</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">I&apos;m trying to print on the new poly rolls but the black levels are coming out a bit grey...</p>
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">forum</span> 14 Replies</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">visibility</span> 342 Views</span>
                  </div>
                </div>
                {/* Forum Post 2 */}
                <div className="bg-surface rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">MK</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">Mike K.</span>
                        <span className="text-[10px] text-slate-400">45 mins ago</span>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md">TECH</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Shopify integration not pulling SKU weight</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">Has anyone else noticed the weight field not syncing after the latest API update? I have to manually...</p>
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">forum</span> 8 Replies</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">visibility</span> 120 Views</span>
                  </div>
                </div>
                {/* Forum Post 3 */}
                <div className="bg-surface rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">EL</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">Elena L.</span>
                        <span className="text-[10px] text-slate-400">Just now</span>
                      </div>
                    </div>
                    <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-1 rounded-md">SHOWCASE</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Showcase: My new holiday candle collection! 🕯️</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">Finally finished the gold foil labels for the winter collection. Used the &apos;Vintage&apos; template as a base.</p>
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">forum</span> 0 Replies</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">visibility</span> 12 Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-primary mb-6">
                <span className="material-symbols-outlined">print</span>
                <span className="text-slate-900 font-bold text-xl">LabelPro</span>
              </div>
              <p className="text-slate-500 mb-6 max-w-sm">The world&apos;s most advanced thermal printing platform for modern e-commerce brands.</p>
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
                <li><Link className="hover:text-primary transition-colors" href="/docs">Documentation</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/docs/api">API Reference</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/community">Community</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/help-center">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link className="hover:text-primary transition-colors" href="/about">About</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/blog">Blog</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/careers">Careers</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link className="hover:text-primary transition-colors" href="/privacy">Privacy</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/terms">Terms</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/security">Security</Link></li>
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
