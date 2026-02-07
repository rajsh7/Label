export default function Loading() {
  return (
    <div className="bg-white h-screen w-full overflow-hidden flex flex-col items-center justify-center relative font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.3] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[100px] animate-float"></div>
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] animate-float" 
          style={{ animationDelay: '-2s' }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6">
        {/* Title Section */}
        <div className="relative mb-16 md:mb-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-200 relative z-0 select-none">
            LabelPro
          </h1>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-primary-dark absolute top-0 left-0 z-10 animate-text-fill select-none">
            LabelPro
          </h1>
        </div>

        {/* 3D Printer Animation */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 perspective-[1000px] mb-12">
          <div className="w-full h-full relative animate-float flex flex-col items-center justify-center">
            {/* Printer Image */}
            <div className="relative z-20 w-48 h-48 md:w-56 md:h-56 bg-white rounded-3xl shadow-2xl p-2 border border-slate-100">
              <img 
                alt="LabelPro Printer Render" 
                className="w-full h-full object-cover rounded-2xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiet19wbDayBDaalhPKHcoGTOI6zaeEzB-U-5cIFOD6_JORQDOIC2JD3U3nutgHHTCXHKWngeImF0T4TcYF6hBYnOjgdlT44V7jRoc3hix3b2jaEKjSwgDDJaWNS5RI28_9ENUJ0XDyhMcHiS2P3J4EofVkfavMlhHZdgxKtJlPJpsO6FrUoxfDYWS2ODiQRXr3xSk3JJ9JsSBbFpktx7j_SW0mLBWYzXLhLF6d5C6kTGVhJHEOdyt8O39dwPqx_C65nFuu0Wkd7A"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Unfurling Receipt */}
            <div className="absolute top-[60%] z-10 w-32 md:w-40 bg-white shadow-lg border-x border-slate-100 rounded-b-lg flex flex-col items-center justify-end overflow-hidden animate-unfurl origin-top">
              <div className="w-full h-full flex flex-col items-center justify-center opacity-40 gap-2 pb-4">
                <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-8 border border-slate-200 rounded mt-2"></div>
              </div>
            </div>

            {/* Shadow */}
            <div className="absolute -bottom-16 w-32 h-6 bg-purple-900/10 blur-xl rounded-[100%] animate-pulse-slow"></div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">Smart Sync</span>
          </div>
          <p className="text-slate-400 font-medium text-lg md:text-xl animate-pulse">
            Preparing your workspace...
          </p>
        </div>
      </div>
    </div>
  )
}
