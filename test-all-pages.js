/**
 * Automated Page Testing Script
 * Tests all pages for basic functionality and errors
 * 
 * Usage: node test-all-pages.js
 * 
 * Note: This is a basic test script. For comprehensive testing,
 * use proper testing frameworks like Jest, Playwright, or Cypress.
 */

const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// List of all pages to test
const PAGES = [
  // Public pages
  '/',
  '/pricing',
  '/faq',
  '/labels',
  '/blog',
  '/blog/getting-started-with-labelpro',
  '/blog/tips-for-batch-label-processing',
  '/blog/label-format-requirements-by-marketplace',
  '/blog/optimizing-label-workflows',
  '/login',
  '/signup',
  '/reset-password',
  
  // Protected pages (should redirect to login if not authenticated)
  '/dashboard',
  '/editor',
  '/templates',
  '/batch',
  '/settings',
  
  // API endpoints
  '/api/labels',
  '/sitemap.xml',
  '/robots.txt',
];

const RESULTS = {
  passed: [],
  failed: [],
  errors: [],
};

/**
 * Test a single page
 */
function testPage(path) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const statusCode = res.statusCode;
        const isSuccess = statusCode >= 200 && statusCode < 400;
        const isRedirect = statusCode >= 300 && statusCode < 400;
        
        const result = {
          path,
          statusCode,
          success: isSuccess || isRedirect,
          contentType: res.headers['content-type'],
          contentLength: data.length,
        };

        // Check for common error patterns in HTML
        if (data.includes('Error:') || data.includes('error') || data.includes('Exception')) {
          result.hasErrorText = true;
        }

        resolve(result);
      });
    });

    req.on('error', (error) => {
      resolve({
        path,
        success: false,
        error: error.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        path,
        success: false,
        error: 'Request timeout',
      });
    });

    req.end();
  });
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting LabelPro Page Tests\n');
  console.log(`Testing base URL: ${BASE_URL}\n`);
  console.log(`Testing ${PAGES.length} pages...\n`);

  for (const page of PAGES) {
    process.stdout.write(`Testing ${page}... `);
    const result = await testPage(page);
    
    if (result.success) {
      RESULTS.passed.push(result);
      console.log(`✅ ${result.statusCode}`);
    } else {
      RESULTS.failed.push(result);
      console.log(`❌ ${result.statusCode || 'ERROR'} ${result.error || ''}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${RESULTS.passed.length}`);
  console.log(`❌ Failed: ${RESULTS.failed.length}`);
  console.log(`Total: ${RESULTS.passed.length + RESULTS.failed.length}`);

  if (RESULTS.failed.length > 0) {
    console.log('\n❌ FAILED PAGES:');
    RESULTS.failed.forEach((result) => {
      console.log(`  - ${result.path}: ${result.statusCode || result.error}`);
    });
  }

  // Exit with error code if any tests failed
  process.exit(RESULTS.failed.length > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

