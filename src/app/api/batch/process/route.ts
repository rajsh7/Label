import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit'
import { PassThrough } from 'stream'




    // ... (imports remain)

export async function POST(req: Request) {
  console.log('API: Batch process request received')
  try {
    const body = await req.json()
    const { batchId } = body
    console.log(`API: Processing batch ${batchId}`)

    if (!batchId) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 })
    }

    // Initialize Supabase Client with Service Role (Admin) for backend processing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    // We still verify the user's token for security
    const authHeader = req.headers.get('Authorization')
    const userClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader || '' } }
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log(`API: Processing as admin for user ${user.id}`)

    // 1. Fetch Batch & Items
    const { data: batch, error: batchError } = await supabase.from('batch_jobs').select('*').eq('id', batchId).eq('user_id', user.id).single()
    if (batchError || !batch) {
      throw new Error('Batch not found or unauthorized')
    }

    const { data: items, error: itemsError } = await supabase
      .from('batch_job_items')
      .select('*')
      .eq('batch_job_id', batchId)
      .eq('status', 'pending')

    if (itemsError) throw itemsError
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'No pending items' })
    }

    // 2. Initialize PDF Document
    const doc = new PDFDocument({ size: [288, 432], margin: 0 })
    const stream = new PassThrough()
    const pdfChunks: Buffer[] = []
    stream.on('data', (chunk) => pdfChunks.push(Buffer.from(chunk)))
    doc.pipe(stream)
    const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
      stream.on('end', () => resolve(Buffer.concat(pdfChunks)))
      stream.on('error', reject)
    })

    let successCount = 0

    // 3. Process Items
    for (const [index, item] of items.entries()) {
      if (index > 0) doc.addPage({ size: [288, 432], margin: 0 })
      
      // Draw Label content (simplified for brevity)
      doc.rect(0, 0, 288, 432).fill('#ffffff')
      doc.fontSize(24).fillColor('black').text('P', 20, 20)
      doc.fontSize(10).text('PRIORITY MAIL 2-DAY', 50, 28)
      doc.moveTo(20, 60).lineTo(268, 60).lineWidth(2).stroke()
      
      const { row_data } = item
      doc.fontSize(8).text('SHIP TO:', 20, 80)
      doc.fontSize(10).font('Helvetica-Bold').text((row_data['Customer Name'] || 'Customer').toUpperCase(), 20, 95)
      doc.font('Helvetica').text((row_data['Address Line 1'] || 'Main St').toUpperCase(), 20, 110)
      
      await supabase.from('batch_job_items').update({ status: 'processed' }).eq('id', item.id)
      successCount++
    }

    doc.end()
    const pdfBuffer = await pdfBufferPromise

    // 4. Upload to Storage (Using Service Role)
    const fileName = `batches/${user.id}/${batch.id}-${Date.now()}.pdf`
    const { data: _uploadData, error: uploadError } = await supabase.storage
      .from('labels')
      .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true })
    
    if (uploadError) {
      console.error('API: Upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage.from('labels').getPublicUrl(fileName)

    // 5. Finalize Batch
    await supabase.from('batch_jobs').update({ 
      status: 'completed', 
      processed_count: batch.processed_count + successCount,
      updated_at: new Date().toISOString()
    }).eq('id', batchId)

    if (publicUrl) {
      await supabase.from('batch_job_items').update({ generated_pdf_url: publicUrl }).eq('batch_job_id', batchId)
    }

    return NextResponse.json({ success: true, url: publicUrl })

    // 5. Finalize Batch & Link PDF
    const { data: currentBatch } = await supabase.from('batch_jobs').select('processed_count').eq('id', batchId).single()
    const newCount = (currentBatch?.processed_count || 0) + successCount

    console.log(`API: Finalizing batch with count ${newCount}`)

    await supabase
      .from('batch_jobs')
      .update({ 
        status: 'completed', 
        processed_count: newCount,
        name: `${batch.name} (Ready)`,
        updated_at: new Date().toISOString()
      })
      .eq('id', batchId)

    // Update all items with the shared PDF URL
    if (publicUrl) {
      await supabase
        .from('batch_job_items')
        .update({ generated_pdf_url: publicUrl })
        .eq('batch_job_id', batchId)
    }

    return NextResponse.json({ success: true, processed: successCount, url: publicUrl })

  } catch (error: any) {
    console.error('API: Batch processing CRITICAL ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
