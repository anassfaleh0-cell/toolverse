import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: `HTTP Status Codes — Complete Reference | ${SITE_NAME}`,
  description: `Complete reference of all HTTP status codes organized by category. Includes 1xx informational, 2xx success, 3xx redirection, 4xx client error, and 5xx server error codes.`,
  alternates: { canonical: `${SITE_URL}/http-status-codes` },
  openGraph: {
    title: `HTTP Status Codes Reference — ${SITE_NAME}`,
    description: `Every HTTP status code explained with descriptions, when they occur, and practical examples.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "HTTP Status Codes" },
];

interface StatusCode {
  code: number;
  name: string;
  category: string;
  description: string;
  whenOccurs: string;
}

const HTTP_STATUS_CODES: StatusCode[] = [
  { code: 100, name: "Continue", category: "1xx", description: "The server has received the request headers and the client should proceed to send the request body.", whenOccurs: "Used when the client sends an Expect: 100-continue header to check if the server is willing to accept the request before sending the full body." },
  { code: 101, name: "Switching Protocols", category: "1xx", description: "The server is switching protocols as requested by the client via the Upgrade header.", whenOccurs: "WebSocket upgrade requests, HTTP/2 upgrade negotiation." },
  { code: 102, name: "Processing", category: "1xx", description: "The server has received and is processing the request, but no response is available yet.", whenOccurs: "WebDAV requests where the server needs time to process." },
  { code: 103, name: "Early Hints", category: "1xx", description: "The server is sending some response headers before the final response, allowing the browser to preload resources.", whenOccurs: "Used to send Link headers for critical resources (CSS, JS, images) while the server prepares the full response." },
  { code: 200, name: "OK", category: "2xx", description: "The request has succeeded. The meaning depends on the HTTP method used.", whenOccurs: "GET: resource fetched. POST: action performed. PUT/PATCH: resource updated. DELETE: resource deleted." },
  { code: 201, name: "Created", category: "2xx", description: "The request has been fulfilled and a new resource has been created.", whenOccurs: "After a successful POST request that creates a new resource in REST APIs." },
  { code: 202, name: "Accepted", category: "2xx", description: "The request has been accepted for processing, but the processing has not been completed.", whenOccurs: "Batch processing, asynchronous operations where the server queues the request." },
  { code: 203, name: "Non-Authoritative Information", category: "2xx", description: "The returned metadata is from a third-party source, not the origin server.", whenOccurs: "Proxies or intermediaries that modify response content, caching layers." },
  { code: 204, name: "No Content", category: "2xx", description: "The server successfully processed the request but is not returning any content.", whenOccurs: "DELETE operations, form submissions that don't need a response body, API PUT updates with no response data." },
  { code: 205, name: "Reset Content", category: "2xx", description: "The server successfully processed the request and asks the client to reset the document view.", whenOccurs: "After form submission in HTML applications to clear the form." },
  { code: 206, name: "Partial Content", category: "2xx", description: "The server is delivering only part of the resource due to a Range header sent by the client.", whenOccurs: "Video streaming seeking, resume download requests, large file chunking." },
  { code: 207, name: "Multi-Status", category: "2xx", description: "The response body contains multiple status codes for different operations.", whenOccurs: "WebDAV batch operations where each sub-request has its own status." },
  { code: 208, name: "Already Reported", category: "2xx", description: "The members of a DAV binding have already been enumerated in a previous part of the response.", whenOccurs: "WebDAV PROPFIND responses to avoid listing the same resource multiple times." },
  { code: 226, name: "IM Used", category: "2xx", description: "The server has fulfilled a request for the resource using instance manipulations.", whenOccurs: "Delta encoding where the server returns only the changes since the last request." },
  { code: 300, name: "Multiple Choices", category: "3xx", description: "The requested resource has multiple representations available, each with its own location.", whenOccurs: "Content negotiation where the server cannot determine the best variant, API versioning." },
  { code: 301, name: "Moved Permanently", category: "3xx", description: "The resource has been permanently moved to a new URL. All future requests should use the new URL.", whenOccurs: "Website migration to a new domain, HTTP to HTTPS redirects, URL structure changes." },
  { code: 302, name: "Found (Temporary Redirect)", category: "3xx", description: "The resource is temporarily located at a different URL. Clients should continue using the original URL.", whenOccurs: "Temporary maintenance pages, A/B testing redirects, post-login redirects." },
  { code: 303, name: "See Other", category: "3xx", description: "The response can be found at another URL using GET. Used after POST operations.", whenOccurs: "Post-redirect-get (PRG) pattern in web applications after form submission." },
  { code: 304, name: "Not Modified", category: "3xx", description: "The resource has not been modified since the last request. The client should use its cached version.", whenOccurs: "Conditional GET requests with If-Modified-Since or If-None-Match headers." },
  { code: 305, name: "Use Proxy", category: "3xx", description: "The requested resource must be accessed through the proxy specified in the Location header.", whenOccurs: "Deprecated. Modern clients ignore this status code due to security concerns." },
  { code: 307, name: "Temporary Redirect", category: "3xx", description: "The resource is temporarily located at a different URL. The HTTP method must not change.", whenOccurs: "Temporary URL changes where POST data must be preserved in the redirect." },
  { code: 308, name: "Permanent Redirect", category: "3xx", description: "The resource has been permanently moved. The HTTP method must not change.", whenOccurs: "API endpoint migrations where POST/PUT methods must be preserved after redirect." },
  { code: 400, name: "Bad Request", category: "4xx", description: "The server cannot process the request due to malformed syntax or invalid parameters.", whenOccurs: "Invalid JSON in API request, missing required fields, malformed query parameters." },
  { code: 401, name: "Unauthorized", category: "4xx", description: "Authentication is required and has failed or not been provided.", whenOccurs: "Missing or invalid API key, expired JWT token, unauthenticated access to protected resources." },
  { code: 402, name: "Payment Required", category: "4xx", description: "Reserved for future use. Originally intended for digital payment systems.", whenOccurs: "Rarely used. Some APIs use it for rate limiting or subscription requirements." },
  { code: 403, name: "Forbidden", category: "4xx", description: "The server understood the request but refuses to authorize it.", whenOccurs: "IP-blocked access, insufficient permissions, directory listing disabled." },
  { code: 404, name: "Not Found", category: "4xx", description: "The server cannot find the requested resource.", whenOccurs: "Deleted pages, broken links, mistyped URLs, missing API endpoints." },
  { code: 405, name: "Method Not Allowed", category: "4xx", description: "The HTTP method is not supported for the requested resource.", whenOccurs: "POST on a GET-only endpoint, PUT on a read-only resource." },
  { code: 406, name: "Not Acceptable", category: "4xx", description: "The server cannot produce a response matching the Accept headers sent by the client.", whenOccurs: "Client requests application/xml but the server only supports application/json." },
  { code: 407, name: "Proxy Authentication Required", category: "4xx", description: "The client must first authenticate with the proxy.", whenOccurs: "Corporate proxy servers that require authentication before internet access." },
  { code: 408, name: "Request Timeout", category: "4xx", description: "The server timed out waiting for the request from the client.", whenOccurs: "Slow client connections, long-running uploads without data transmission, idle connections." },
  { code: 409, name: "Conflict", category: "4xx", description: "The request conflicts with the current state of the server.", whenOccurs: "Concurrent edit conflicts in version control, resource state mismatch in APIs." },
  { code: 410, name: "Gone", category: "4xx", description: "The requested resource is no longer available and no forwarding address is known.", whenOccurs: "Removed content, expired promotional pages, discontinued API endpoints." },
  { code: 411, name: "Length Required", category: "4xx", description: "The server refuses to accept the request without a defined Content-Length header.", whenOccurs: "APIs that require explicit content length for request validation." },
  { code: 412, name: "Precondition Failed", category: "4xx", description: "One or more preconditions in the request headers evaluated to false.", whenOccurs: "If-Match or If-Unmodified-Since checks when the resource has been modified." },
  { code: 413, name: "Content Too Large", category: "4xx", description: "The request body is larger than the server is willing to process.", whenOccurs: "File uploads exceeding server size limits, large API request payloads." },
  { code: 414, name: "URI Too Long", category: "4xx", description: "The URI requested is longer than the server is willing to interpret.", whenOccurs: "Extremely long query strings, deeply nested API paths, buffer overflow attempts." },
  { code: 415, name: "Unsupported Media Type", category: "4xx", description: "The server refuses to accept the request because the media type is not supported.", whenOccurs: "Uploading a file format the server doesn't accept, wrong Content-Type header." },
  { code: 416, name: "Range Not Satisfiable", category: "4xx", description: "The Range header specified cannot be satisfied by the server.", whenOccurs: "Requesting a byte range beyond the file size, invalid range format." },
  { code: 417, name: "Expectation Failed", category: "4xx", description: "The server cannot meet the requirements of the Expect request header.", whenOccurs: "Server doesn't support the 100-continue expectation or the expected value is invalid." },
  { code: 418, name: "I'm a Teapot", category: "4xx", description: "The server refuses to brew coffee because it is a teapot.", whenOccurs: "April Fools' joke from RFC 2324. Used in some APIs for Easter eggs or testing." },
  { code: 421, name: "Misdirected Request", category: "4xx", description: "The request was directed at a server that cannot produce a response.", whenOccurs: "Requests sent to the wrong HTTP/2 server, SNI mismatch in shared hosting." },
  { code: 422, name: "Unprocessable Content", category: "4xx", description: "The request body contains semantic errors and cannot be processed.", whenOccurs: "Validation errors, semantically invalid XML/JSON, business rule violations." },
  { code: 423, name: "Locked", category: "4xx", description: "The resource that is being accessed is locked.", whenOccurs: "WebDAV operations on locked documents, concurrent editing prevention." },
  { code: 424, name: "Failed Dependency", category: "4xx", description: "The request failed because a previous request in the chain failed.", whenOccurs: "WebDAV transactional operations where one step fails and cascades." },
  { code: 425, name: "Too Early", category: "4xx", description: "The server is unwilling to risk processing a request that might be replayed.", whenOccurs: "Early data in TLS 1.3 where replay attacks are a concern." },
  { code: 426, name: "Upgrade Required", category: "4xx", description: "The server refuses to perform the request using the current protocol.", whenOccurs: "Servers that require HTTP/2 or TLS 1.2+, deprecated protocol version usage." },
  { code: 428, name: "Precondition Required", category: "4xx", description: "The origin server requires the request to be conditional.", whenOccurs: "APIs that require If-Match headers to prevent lost update problems." },
  { code: 429, name: "Too Many Requests", category: "4xx", description: "The user has sent too many requests in a given amount of time.", whenOccurs: "Rate limiting enforcement, API quota exceeded, DDoS mitigation." },
  { code: 431, name: "Request Header Fields Too Large", category: "4xx", description: "The server is unwilling to process the request because its header fields are too large.", whenOccurs: "Overly large cookies, excessive custom headers, header injection attempts." },
  { code: 451, name: "Unavailable For Legal Reasons", category: "4xx", description: "The server is denying access to the resource due to legal demands.", whenOccurs: "Content blocked due to DMCA takedown, country-specific censorship, court orders." },
  { code: 500, name: "Internal Server Error", category: "5xx", description: "The server encountered an unexpected condition that prevented it from fulfilling the request.", whenOccurs: "Unhandled exceptions, server misconfiguration, database connection failures." },
  { code: 501, name: "Not Implemented", category: "5xx", description: "The server does not support the functionality required to fulfill the request.", whenOccurs: "Unsupported HTTP methods, unimplemented API endpoints, feature not yet deployed." },
  { code: 502, name: "Bad Gateway", category: "5xx", description: "The server received an invalid response from an upstream server while acting as a gateway or proxy.", whenOccurs: "Reverse proxy unable to reach backend, upstream server crashing, load balancer failures." },
  { code: 503, name: "Service Unavailable", category: "5xx", description: "The server is not ready to handle the request, usually due to maintenance or overload.", whenOccurs: "Scheduled maintenance, server overload, auto-scaling delays, DDoS attacks." },
  { code: 504, name: "Gateway Timeout", category: "5xx", description: "The server acting as a gateway did not receive a timely response from the upstream server.", whenOccurs: "Slow backend responses beyond the proxy timeout, upstream server hangs." },
  { code: 505, name: "HTTP Version Not Supported", category: "5xx", description: "The server does not support the HTTP protocol version used in the request.", whenOccurs: "Outdated server software, custom protocols that don't support newer HTTP versions." },
  { code: 506, name: "Variant Also Negotiates", category: "5xx", description: "Transparent content negotiation for the request results in a circular reference.", whenOccurs: "Misconfigured content negotiation where the server creates an infinite loop." },
  { code: 507, name: "Insufficient Storage", category: "5xx", description: "The server cannot store the representation needed to complete the request.", whenOccurs: "WebDAV quota exceeded, disk full on server, database storage limits." },
  { code: 508, name: "Loop Detected", category: "5xx", description: "The server detected an infinite loop while processing the request.", whenOccurs: "WebDAV recursive directory traversal, infinite redirect loops." },
  { code: 510, name: "Not Extended", category: "5xx", description: "Further extensions to the request are required for the server to fulfill it.", whenOccurs: "RFC 2774 extensions where the server requires specific policy extensions." },
  { code: 511, name: "Network Authentication Required", category: "5xx", description: "The client needs to authenticate to gain network access.", whenOccurs: "Captive portal login pages on public Wi-Fi, enterprise network authentication." },
];

function getCategoryColor(category: string): string {
  switch (category) {
    case "1xx": return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    case "2xx": return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
    case "3xx": return "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20";
    case "4xx": return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20";
    case "5xx": return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
    default: return "border-l-zinc-500 bg-zinc-50 dark:bg-zinc-950/20";
  }
}

function getCategoryBadge(category: string) {
  const map: Record<string, { label: string; variant: "info" | "success" | "warning" | "error" | "neutral" }> = {
    "1xx": { label: "1xx Informational", variant: "info" },
    "2xx": { label: "2xx Success", variant: "success" },
    "3xx": { label: "3xx Redirection", variant: "warning" },
    "4xx": { label: "4xx Client Error", variant: "error" },
    "5xx": { label: "5xx Server Error", variant: "error" },
  };
  return map[category] || { label: category, variant: "neutral" };
}

export default function HttpStatusCodesPage() {
  const categories = ["1xx", "2xx", "3xx", "4xx", "5xx"];

  return (
    <>
      <JsonLd data={webPageSchema({ name: `HTTP Status Codes Reference — ${SITE_NAME}`, description: `Complete reference of all HTTP status codes organized by category.`, url: `${SITE_URL}/http-status-codes`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            HTTP Status Codes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Complete reference of all HTTP status codes organized by category. Each code includes its name, description, and when it typically occurs.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {categories.map((cat) => {
            const codes = HTTP_STATUS_CODES.filter((c) => c.category === cat);
            const badge = getCategoryBadge(cat);
            return (
              <div key={cat} className="mb-12 last:mb-0">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{badge.label}</h2>
                  <Badge variant={badge.variant}>{codes.length} codes</Badge>
                </div>
                <div className="space-y-2">
                  {codes.map((code) => (
                    <div
                      key={code.code}
                      className={`rounded-lg border-l-4 p-4 transition-colors hover:shadow-sm ${getCategoryColor(code.category)}`}
                    >
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-50">
                          {code.code}
                        </span>
                        <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                          {code.name}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{code.description}</p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                        <span className="font-medium">When it occurs:</span> {code.whenOccurs}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <Card variant="default" className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Need to check HTTP status codes in real time?</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Use our <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> to inspect HTTP status codes, response headers, and redirect chains for any URL. Or use <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> for detailed header inspection.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
