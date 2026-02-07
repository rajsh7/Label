'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import templatesData from '@/data/templates.json'

export default function NewBatchWizard() {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [printers, setPrinters] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedPrinter, setSelectedPrinter] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Process Static Templates (Flatten the JSON structure)
      // templatesData is { category: [templates] }, we need a flat array
      const staticTemplates = Object.values(templatesData).flat()
      
      // 2. Fetch User Designs (Custom templates)
      const { data: userDesigns } = await supabase
        .from('label_designs')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })

      // 3. Combine
      const allTemplates = [
        ...(userDesigns || []), 
        ...staticTemplates
      ]
      
      console.log('Total templates loaded:', allTemplates.length)
      setTemplates(allTemplates)
      
      if (allTemplates.length > 0) {
        setSelectedTemplate(allTemplates[0].id)
      }

      // Fetch printers
      const { data: printersData } = await supabase
        .from('printers')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'online')

      setPrinters(printersData || [])
      if (printersData?.[0]) setSelectedPrinter(printersData[0].id)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleSubmit = async () => {
    if (!file || !selectedTemplate) {
      alert('Please upload a file and select a template')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // 1. Create Batch Job
      const { data: batchJob, error: jobError } = await supabase.from('batch_jobs').insert({
        user_id: user.id,
        name: file.name.replace(/\.[^/.]+$/, ''),
        template_id: selectedTemplate,
        printer_id: selectedPrinter || null,
        status: 'pending',
        total_count: 0,
        processed_count: 0
      }).select().single()

      if (jobError) throw jobError

      // 2. Read and Parse CSV
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const items = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        const values = lines[i].split(',').map(v => v.trim())
        const rowData: any = {}
        headers.forEach((h, index) => {
          rowData[h] = values[index] || ''
        })
        
        items.push({
          batch_job_id: batchJob.id,
          user_id: user.id,
          row_data: rowData,
          status: 'pending'
        })
      }

      // 3. Insert Items
      const { error: itemsError } = await supabase.from('batch_job_items').insert(items)
      if (itemsError) throw itemsError

      // 4. Update Batch Count
      await supabase.from('batch_jobs').update({ total_count: items.length }).eq('id', batchJob.id)

      router.push('/dashboard/batch')

    } catch (error: any) {
      console.error("Error creating batch:", error)
      alert(`Failed to create batch: ${error.message} (${error.details || ''})`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen font-display">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/batch" className="hover:text-primary">Batches</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">New</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Create New Batch</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Upload */}
            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="size-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm">1</span>
                Upload Data
              </h2>
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 block cursor-pointer hover:border-primary transition-colors">
                <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" />
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-400 mb-2">cloud_upload</span>
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    {file ? file.name : 'Click to upload CSV or Excel'}
                  </p>
                  <p className="text-sm text-slate-500">Drag and drop or browse files</p>
                </div>
              </label>
            </div>

            {/* Step 2: Template */}
            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="size-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm">2</span>
                Select Template
              </h2>
              {loading ? (
                <div className="flex gap-4">
                  {[1,2,3].map(n => <div key={n} className="w-40 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-2">No templates found</p>
                  <Link href="/dashboard/templates" className="text-primary font-semibold hover:underline">Create a template</Link>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scroll snap-x">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => {
                        console.log('Selected template:', template.id, template.name)
                        setSelectedTemplate(template.id)
                      }}
                      className={`min-w-[160px] max-w-[160px] flex-shrink-0 rounded-xl p-3 cursor-pointer border-2 transition-all snap-start ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-slate-100">
                        {template.preview_url || template.thumbnail_url ? (
                          <img 
                            src={template.preview_url || template.thumbnail_url} 
                            alt={template.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-slate-400">label</span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm truncate text-slate-900 dark:text-white" title={template.name}>{template.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{template.category || 'Custom Design'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Printer */}
            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="size-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm">3</span>
                Select Printer
              </h2>
              {loading ? (
                <div className="space-y-3">
                  {[1,2].map(n => <div key={n} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
                </div>
              ) : printers.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-2">No printers connected</p>
                  <Link href="/dashboard/printers" className="text-primary font-semibold hover:underline">Add a printer</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {printers.map((printer) => (
                    <div
                      key={printer.id}
                      onClick={() => setSelectedPrinter(printer.id)}
                      className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                        selectedPrinter === printer.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-slate-400">print</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white">{printer.name}</h4>
                          <p className="text-sm text-slate-500">{printer.model || 'Printer'} • {printer.status}</p>
                        </div>
                        {selectedPrinter === printer.id && (
                          <span className="material-symbols-outlined text-primary">check_circle</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white sticky top-6">
              <h3 className="font-bold text-lg mb-4">Batch Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">File:</span>
                  <span className="font-medium">{file ? file.name : 'Not uploaded'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Template:</span>
                  <span className="font-medium">{templates.find(t => t.id === selectedTemplate)?.name || 'None'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Printer:</span>
                  <span className="font-medium">{Array.isArray(printers) && printers.find(p => p.id === selectedPrinter)?.name || 'None'}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!file || !selectedTemplate || loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Creating...' : 'Create Batch'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
