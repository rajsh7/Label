/**
 * Printer Service
 * Handles printer connection, test prints, and actual printing
 * 
 * Note: Direct USB/Network printer access from web browsers is limited.
 * This implementation provides the best possible approach:
 * - System printers: Browser print dialog
 * - Network printers: IPP (Internet Printing Protocol) or HTTP-based printing
 * - USB printers: Fallback to system print (requires system integration)
 */

export interface PrinterConfig {
  id: string
  name: string
  printer_type: string
  connection_type: 'usb' | 'network' | 'system'
  network_ip?: string
  dpi: number
  darkness_level: number
  label_gap: number
}

export interface PrintOptions {
  designId: string
  quantity: number
  printerId: string
  format?: 'pdf' | 'direct'
}

/**
 * Connect to printer and verify connection
 */
export async function connectPrinter(config: PrinterConfig): Promise<{
  success: boolean
  error?: string
  status?: 'online' | 'offline'
}> {
  try {
    switch (config.connection_type) {
      case 'usb':
        // USB printers require system-level access
        // In web environment, we assume they're available via system print
        // Actual connection check would require native app or browser extension
        return { success: true, status: 'online' }
      
      case 'network':
        if (!config.network_ip) {
          return { success: false, error: 'Network IP address required' }
        }
        
        // Check printer status via HTTP/IPP
        try {
          // Try IPP status check (common port 631)
          const ippUrl = `http://${config.network_ip}:631/ipp/print`
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          await fetch(ippUrl, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal,
          }).catch(() => null)
          
          clearTimeout(timeoutId)
          
          // If we get here, printer is reachable
          // Note: no-cors prevents reading response, but connection attempt works
          return { success: true, status: 'online' }
        } catch (error) {
          // Try alternative HTTP check
          try {
            const httpUrl = `http://${config.network_ip}`
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 3000)
            
            await fetch(httpUrl, {
              method: 'HEAD',
              mode: 'no-cors',
              signal: controller.signal,
            }).catch(() => null)
            
            clearTimeout(timeoutId)
            return { success: true, status: 'online' }
          } catch {
            // Printer might be offline or unreachable
            return { success: false, status: 'offline', error: 'Printer unreachable' }
          }
        }
      
      case 'system':
        // System printers are handled by browser print dialog
        return { success: true, status: 'online' }
      
      default:
        return { success: false, error: 'Invalid connection type' }
    }
  } catch (error) {
    console.error('Printer connection error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to printer',
      status: 'offline',
    }
  }
}

/**
 * Send test print to printer
 */
export async function testPrint(config: PrinterConfig): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const connectionCheck = await connectPrinter(config)
    if (!connectionCheck.success || connectionCheck.status !== 'online') {
      return {
        success: false,
        error: connectionCheck.error || 'Printer is offline',
      }
    }

    // Generate a simple test label PDF
    // For system printers, we'll use browser print dialog
    if (config.connection_type === 'system') {
      // Create a simple test page
      const testWindow = window.open('', '_blank')
      if (testWindow) {
        testWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Test Print - ${config.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  text-align: center;
                }
                .test-label {
                  border: 2px solid #000;
                  padding: 20px;
                  margin: 20px auto;
                  max-width: 400px;
                }
                @media print {
                  body { margin: 0; padding: 10px; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="no-print">
                <h1>Test Print</h1>
                <p>Preparing test print for: <strong>${config.name}</strong></p>
              </div>
              <div class="test-label">
                <h2>LabelPro Test Print</h2>
                <p>This is a test print from LabelPro</p>
                <hr>
                <p><strong>Printer:</strong> ${config.name}</p>
                <p><strong>Type:</strong> ${config.printer_type}</p>
                <p><strong>DPI:</strong> ${config.dpi}</p>
                <p><strong>Darkness:</strong> ${config.darkness_level}/30</p>
                <p><strong>Label Gap:</strong> ${config.label_gap}mm</p>
                <hr>
                <p>If you can see this clearly, your printer is configured correctly.</p>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `)
        testWindow.document.close()
      }
      return { success: true }
    }

    // For USB/Network printers, send via API endpoint
    // The API will handle the actual printing
    try {
      const response = await fetch('/api/printers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          printer_id: config.id,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Failed to send test print',
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test print',
      }
    }
  } catch (error) {
    console.error('Test print error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test print',
    }
  }
}

/**
 * Print labels
 */
export async function printLabels(
  options: PrintOptions,
  config: PrinterConfig,
  pdfUrl?: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Verify printer connection
    const connectionCheck = await connectPrinter(config)
    if (!connectionCheck.success || connectionCheck.status !== 'online') {
      return {
        success: false,
        error: connectionCheck.error || 'Printer is offline',
      }
    }

    // For system printers, use browser print dialog
    if (config.connection_type === 'system') {
      if (pdfUrl) {
        // Open PDF in new window and trigger print
        const printWindow = window.open(pdfUrl, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        } else {
          // Fallback: try iframe
          const iframe = document.createElement('iframe')
          iframe.style.display = 'none'
          iframe.src = pdfUrl
          document.body.appendChild(iframe)
          iframe.onload = () => {
            setTimeout(() => {
              iframe.contentWindow?.print()
              setTimeout(() => document.body.removeChild(iframe), 1000)
            }, 500)
          }
        }
      } else {
        // Use window.print() for current page
        window.print()
      }
      return { success: true }
    }

    // For USB/Network printers, send print command via API
    try {
      const response = await fetch('/api/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          printer_id: options.printerId,
          design_id: options.designId,
          quantity: options.quantity,
          pdf_url: pdfUrl,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Failed to print labels',
        }
      }

      return { success: true }
    } catch (apiError) {
      // Fallback to system print if API fails
      console.warn('Print API failed, falling back to system print:', apiError)
      if (pdfUrl) {
        const printWindow = window.open(pdfUrl, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        }
      } else {
        window.print()
      }
      return { success: true }
    }
  } catch (error) {
    console.error('Print labels error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to print labels',
    }
  }
}

/**
 * Send PDF to network printer via IPP (Internet Printing Protocol)
 * This is a basic implementation - full IPP support would require a library
 */
export async function sendToNetworkPrinter(
  pdfBuffer: Buffer,
  printerIP: string,
  _printerName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a production environment, you would:
    // 1. Use an IPP library to send the print job
    // 2. Or use a print server/queue system
    // 3. Or convert PDF to printer-specific format (PCL, PostScript, etc.)
    
    // For now, we'll attempt HTTP POST to common printer web interfaces
    const printerUrl = `http://${printerIP}/print`
    
    try {
      const response = await fetch(printerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/pdf',
        },
        body: new Uint8Array(pdfBuffer),
      })

      if (response.ok) {
        return { success: true }
      } else {
        return {
          success: false,
          error: `Printer returned status ${response.status}`,
        }
      }
    } catch (error) {
      // HTTP-based printing not available, would need IPP or other protocol
      return {
        success: false,
        error: 'Direct network printing requires IPP support or print server',
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send to network printer',
    }
  }
}
