'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto py-8 m-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/dashboard" className="flex items-center gap-2 mb-6">
              <div className="size-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold">label</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                Label<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              The ultimate label design and batch processing platform for modern e-commerce brands.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors">
                <Github className="size-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/dashboard/templates" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Templates</Link></li>
              <li><Link href="/dashboard/editor" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Editor</Link></li>
              <li><Link href="/dashboard/batch" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Batch Processing</Link></li>
              <li><Link href="/dashboard/labels" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">My Labels</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/docs" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Documentation</Link></li>
              <li><Link href="/docs/api" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">API Reference</Link></li>
              <li><Link href="/community" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Community</Link></li>
              <li><Link href="/help" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Need help?</p>
                <a href="mailto:support@labelpro.com" className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary">support@labelpro.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            © {currentYear} LabelPro Elite. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
