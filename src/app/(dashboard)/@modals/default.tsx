/**
 * Default modal slot
 * Returns null when no modal is active
 * Required by Next.js parallel routes syntax
 */
export default function Default() {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/default.tsx:8',message:'Default modal slot rendered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  }
  // #endregion
  return null
}
