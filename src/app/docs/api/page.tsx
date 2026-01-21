import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          LabelPro API Documentation
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Integrate label generation into your applications
        </p>
      </div>

      <div className="space-y-6">
        {/* Authentication */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Authentication
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              All API requests require an API key. Include it in the request headers:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`X-API-Key: your_api_key_here
# Or
Authorization: Bearer your_api_key_here`}
            </pre>
            <p className="text-sm text-[var(--color-text-secondary)] mt-4">
              API access is available for Enterprise users only. Generate your API keys in Settings → API.
            </p>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Rate Limiting
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text-secondary)]">
              API requests are limited to <strong>2,000 requests per day</strong> per API key. 
              Rate limits reset at midnight UTC. When exceeded, you'll receive a 429 status code 
              with a <code>Retry-After</code> header.
            </p>
          </CardContent>
        </Card>

        {/* List Labels */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              List Labels
            </h2>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
{`GET /api/v1/labels
Headers:
  X-API-Key: your_api_key

Query Parameters:
  category (optional): Filter by category
  marketplace (optional): Filter by marketplace
  limit (optional): Number of results (default: 100)
  offset (optional): Pagination offset (default: 0)

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 255
  }
}`}
            </pre>
          </CardContent>
        </Card>

        {/* List Templates */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              List Templates
            </h2>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
{`GET /api/v1/templates
Headers:
  X-API-Key: your_api_key

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Template Name",
      "elements": [...],
      ...
    }
  ]
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Generate Labels */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Generate Labels
            </h2>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
{`POST /api/v1/generate
Headers:
  X-API-Key: your_api_key
  Content-Type: application/json

Body:
{
  "template_id": "uuid",
  "data_rows": [
    { "Product Name": "Widget", "SKU": "WID-001" },
    { "Product Name": "Gadget", "SKU": "GAD-002" }
  ],
  "column_mapping": {
    "Product Name": "product_name",
    "SKU": "sku"
  }
}

Response:
{
  "success": true,
  "data": {
    "download_url": "https://...",
    "expires_at": "2024-01-15T10:30:00Z",
    "total_labels": 2
  }
}`}
            </pre>
            <p className="text-sm text-[var(--color-text-secondary)]">
              The download URL is valid for 1 hour. Download the PDF immediately after generation.
            </p>
          </CardContent>
        </Card>

        {/* Get Stats */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Get Statistics
            </h2>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
{`GET /api/v1/stats
Headers:
  X-API-Key: your_api_key

Response:
{
  "success": true,
  "data": {
    "labels_used_this_month": 150,
    "batches_used_this_month": 10,
    "templates_count": 5,
    "designs_count": 20,
    "api_requests_today": 450,
    "api_requests_limit": 2000,
    "subscription_tier": "enterprise"
  }
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Error Responses */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Error Responses
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong className="text-red-600">401 Unauthorized</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1">{`{ "error": "Invalid API key" }`}</pre>
              </div>
              <div>
                <strong className="text-red-600">429 Too Many Requests</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1">{`{ "error": "Rate limit exceeded", "retryAfter": 3600 }`}</pre>
              </div>
              <div>
                <strong className="text-red-600">400 Bad Request</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1">{`{ "error": "Missing required fields" }`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

