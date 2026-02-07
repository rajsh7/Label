import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="bg-slate-50 pt-32 pb-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">Editorial</h2>
          <span className="hidden md:flex items-center gap-2 text-slate-900 font-bold">
            Latest Updates from LabelPro
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Article 1 */}
          <Link href="/blog/minimalist-packaging" className="group cursor-pointer block">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-200">
              <img alt="Packaging Design Trends" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdrj9tvTS1tuhqr5-RDo-TRL-tlFHbRwuZKB_ZbeLKCtO9MJN61rywbBxD_wtzz9pEJ2HgQ59GzzBY4gGUPTwDSL7fs7rtrsqVffJjO8m7BVlr-zcGIruoCc_GDQbBp7o-gX4Wwb3WhGM3aBuCw5lu58_J8zhJHExij-0kfSGwXp_lMzTW5Ih8LTRPdA-6VEZ-iJppMRt6CCBeC9PIVm2bJbDlIwWLUyP1Rg3ShBIpgXjkGjcDWlIRGnqFkUvo9jTLqlEgMdSUPaI"/>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <span className="text-primary">Design</span>
              <span>•</span>
              <span>Oct 24, 2023</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">
              The Psychology of Minimalist Packaging in 2024
            </h3>
            <p className="text-slate-500 leading-relaxed line-clamp-2">
              Why top D2C brands are stripping back their labels to stand out on crowded shelves.
            </p>
          </Link>

          {/* Article 2 */}
          <Link href="/blog/thermal-transfer" className="group cursor-pointer block">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-200">
              <img alt="Supply Chain Tech" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9_QZclhi29rE3y-sixqxYyJYfWPKRnk_gpdWVbDhe6vfEcu8ox2dSpbFi_NUIm4KWxl9pqXHf958VGoRaZ12bhZHXqz2-UafkDlpl4xsTSrBNExQhQom9i4sY0LCdfaLnBku2gvLbsQ-PLHsHVdhlRYiBNOaeyz0167Lbq67ikV70vZ3U--MhytNr2Z0wtMZOuZ9W89ySfAFqMYdrp3OySgcFbb9r9KxnAMcZKNomNTpxXCmrAn8sLUDe9AYMPNMWWOc-eVnBLk"/>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <span className="text-primary">Logistics</span>
              <span>•</span>
              <span>Oct 18, 2023</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">
              Optimizing Thermal Transfer for High-Humidity Environments
            </h3>
            <p className="text-slate-500 leading-relaxed line-clamp-2">
              A technical deep-dive into material selection for cold-chain food and beverage logistics.
            </p>
          </Link>

          {/* Article 3 */}
          <Link href="/blog/zero-waste" className="group cursor-pointer block">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-200">
              <img alt="Sustainable Printing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKygPyaZDas4POM2STw4xmx8g52teDdaN5wtCkPRx4BR9erPhzYephA0V8RyCb15htQRHrI80C_c5-mhoN7e3l37CLJc-kFmGgw9G4B73UVKer5xKTXUCLGKE0mAszuCWxLoeclkLwc2EZMQ-FgzSfnkUpgvMoQYuHJYowpd0MiViINA8mGKuCCfIF2Nfbg6TC3THAlV1cn94OcMrB8GzMqa68P8wc7txecjE3iuUrjpgVoKySsiuMpgdCWJYj2CPP5VJFK1pIc6g"/>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <span className="text-primary">Sustainability</span>
              <span>•</span>
              <span>Oct 10, 2023</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">
              Zero-Waste Labeling: Is Direct Thermal the Answer?
            </h3>
            <p className="text-slate-500 leading-relaxed line-clamp-2">
              Analyzing the carbon footprint of ribbon vs. direct thermal printing technologies.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
