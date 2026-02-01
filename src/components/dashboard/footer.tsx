import { Tags, Twitter, Linkedin, Github } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <div className="px-6 pb-6 bg-gray-50/50">
      <footer className="bg-gray-900 text-gray-300 rounded-2xl shadow-xl overflow-hidden">
        <div className="max-w-[1920px] mx-auto py-12 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Tags className="w-5 h-5" />
                </div>
                <span>LabelPro</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs text-gray-400">
                The complete platform for e-commerce label management.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="/dashboard/labels" className="hover:text-blue-400 transition-colors">Labels</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-blue-400 transition-colors">Integrations</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/documentation" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><Link href="/help-center" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link href="/legal" className="hover:text-blue-400 transition-colors">Legal</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 LabelPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
