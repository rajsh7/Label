export default function AboutPage() {
  return (
    <div className="bg-white pt-32 pb-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">About Us</span>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter text-slate-900 mb-8">
              Printing,<br/>Perfected.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-lg">
              We&apos;re a team of designers, engineers, and supply chain experts obsessed with bridging the gap between digital design and physical logistics.
            </p>
          </div>
          <div className="flex items-end justify-end">
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="col-span-1 space-y-2">
                <div className="text-4xl font-bold text-slate-900">10k+</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Active Brands</div>
              </div>
              <div className="col-span-1 space-y-2">
                <div className="text-4xl font-bold text-slate-900">50M+</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Labels Printed</div>
              </div>
              <div className="col-span-1 space-y-2">
                <div className="text-4xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Uptime</div>
              </div>
              <div className="col-span-1 space-y-2">
                <div className="text-4xl font-bold text-slate-900">24/7</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Expert Support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
          <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-[2rem]">
            <img alt="LabelPro Team Workspace" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiet19wbDayBDaalhPKHcoGTOI6zaeEzB-U-5cIFOD6_JORQDOIC2JD3U3nutgHHTCXHKWngeImF0T4TcYF6hBYnOjgdlT44V7jRoc3hix3b2jaEKjSwgDDJaWNS5RI28_9ENUJ0XDyhMcHiS2P3J4EofVkfavMlhHZdgxKtJlPJpsO6FrUoxfDYWS2ODiQRXr3xSk3JJ9JsSBbFpktx7j_SW0mLBWYzXLhLF6d5C6kTGVhJHEOdyt8O39dwPqx_C65nFuu0Wkd7A"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="font-bold text-lg mb-1">San Francisco HQ</p>
              <p className="text-white/70 text-sm">Where the magic happens.</p>
            </div>
          </div>
          <div className="md:col-span-4 relative group overflow-hidden rounded-[2rem] bg-slate-100">
            <img alt="Founder Portrait" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL8JmOj-5UohKI8oOv8yMTy0SGB8aUtY93VMas764p_EzDu7043QI5Lf36BymLAikmugRy1-K0E7rqiwTIasRmrygFXjVlkCQXCuUfqC-4X6xZBMUZbeJKsGVTh-FThv_q5PwuauxnoBTFf9IjZ3lxhhz27RsUjT2tHWQf1M4QxI4MBAnEzaEA0rEE43sAdc1K_C4N_KdoP5tvvXgJ7HvCHsK0iRAD4gnbdPa5RAFxUHgb3onZpa-NeR7v71ZGqnbXpQNvVeUb02E"/>
            <div className="absolute bottom-6 left-6">
              <h3 className="font-bold text-slate-900 text-xl">Elena Chen</h3>
              <p className="text-slate-500 text-sm">Co-Founder &amp; CEO</p>
            </div>
          </div>
          <div className="md:col-span-4 relative group overflow-hidden rounded-[2rem] bg-slate-100">
            <img alt="CTO Portrait" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVeSPlgl84B6AnV-1I7q0krPfXDMyTX5Co3Vr7zbFu9x9l9WqAncFDpswMew6_tJTn6HOiaqhyvQ4tvn1tP5Et3ye5zeKPCkB1ItDIUyYz808kRCDxqb89G9NVlXGDukotPuKlxaxmqP4DM0IVLNS3V5qsZ84yzDjmLmMFfj_9aPoaJr1T2Parbp37t3ohMnmw5s08SVZ-OevD2-FgxdZBeIKii8_-KkNypfwCb9HCJZxqUp7nkfvZbZWChlT69Zjz9lW9QRuLt3g"/>
            <div className="absolute bottom-6 left-6">
              <h3 className="font-bold text-slate-900 text-xl">Marcus Thorne</h3>
              <p className="text-slate-500 text-sm">Co-Founder &amp; CTO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
