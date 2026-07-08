export interface HttpHeader {
  name: string;
  category: string;
  description: string;
  example: string;
  specification: string;
}

export const HTTP_HEADERS: HttpHeader[] = [
  // General headers
  { name: "Cache-Control", category: "general", description: "Directives for caching mechanisms in both requests and responses", example: "Cache-Control: no-cache, must-revalidate", specification: "RFC 7234" },
  { name: "Connection", category: "general", description: "Controls whether the network connection stays open after the current transaction", example: "Connection: keep-alive", specification: "RFC 7230" },
  { name: "Date", category: "general", description: "The date and time at which the message was originated", example: "Date: Tue, 07 Jul 2026 12:00:00 GMT", specification: "RFC 7231" },
  { name: "Pragma", category: "general", description: "Implementation-specific headers that may have various effects along the request-response chain", example: "Pragma: no-cache", specification: "RFC 7234" },
  { name: "Trailer", category: "general", description: "Allows the sender to include additional fields at the end of chunked messages", example: "Trailer: Expires", specification: "RFC 7230" },
  { name: "Transfer-Encoding", category: "general", description: "Specifies the form of encoding used to safely transfer the payload body to the user", example: "Transfer-Encoding: chunked", specification: "RFC 7230" },
  { name: "Upgrade", category: "general", description: "Ask the server to upgrade to another protocol", example: "Upgrade: h2c", specification: "RFC 7230" },
  { name: "Via", category: "general", description: "Added by proxies to track the forwarding path", example: "Via: 1.0 fred, 1.1 example.com", specification: "RFC 7230" },
  { name: "Warning", category: "general", description: "General warning information about possible problems", example: "Warning: 199 - \"Miscellaneous warning\"", specification: "RFC 7234" },
  // Request headers
  { name: "Accept", category: "request", description: "Media types that are acceptable for the response", example: "Accept: text/html, application/json", specification: "RFC 7231" },
  { name: "Accept-Charset", category: "request", description: "Character sets that are acceptable", example: "Accept-Charset: utf-8, iso-8859-1", specification: "RFC 7231" },
  { name: "Accept-Encoding", category: "request", description: "Encoding algorithms acceptable for the response", example: "Accept-Encoding: gzip, deflate, br", specification: "RFC 7231" },
  { name: "Accept-Language", category: "request", description: "Languages acceptable for the response", example: "Accept-Language: en-US, en;q=0.9", specification: "RFC 7231" },
  { name: "Authorization", category: "request", description: "Authentication credentials for HTTP authentication", example: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs...", specification: "RFC 7235" },
  { name: "Cookie", category: "request", description: "HTTP cookies previously sent by the server", example: "Cookie: sessionId=abc123; theme=dark", specification: "RFC 6265" },
  { name: "Expect", category: "request", description: "Indicates expectations that need to be fulfilled by the server", example: "Expect: 100-continue", specification: "RFC 7231" },
  { name: "From", category: "request", description: "Email address of the user making the request", example: "From: user@example.com", specification: "RFC 7231" },
  { name: "Host", category: "request", description: "Domain name of the server and TCP port number", example: "Host: example.com:8080", specification: "RFC 7230" },
  { name: "If-Match", category: "request", description: "Makes the request conditional on the ETag matching", example: "If-Match: \"xyzzy\"", specification: "RFC 7232" },
  { name: "If-Modified-Since", category: "request", description: "Makes the request conditional on modification date", example: "If-Modified-Since: Sat, 01 Jan 2026 00:00:00 GMT", specification: "RFC 7232" },
  { name: "If-None-Match", category: "request", description: "Makes the request conditional on the ETag not matching", example: "If-None-Match: \"xyzzy\"", specification: "RFC 7232" },
  { name: "If-Range", category: "request", description: "Makes a range request conditional on the ETag or date matching", example: "If-Range: \"xyzzy\"", specification: "RFC 7233" },
  { name: "If-Unmodified-Since", category: "request", description: "Makes the request conditional on NOT being modified after a date", example: "If-Unmodified-Since: Sat, 01 Jan 2026 00:00:00 GMT", specification: "RFC 7232" },
  { name: "Max-Forwards", category: "request", description: "Limits the number of times the message can be forwarded through proxies", example: "Max-Forwards: 10", specification: "RFC 7231" },
  { name: "Origin", category: "request", description: "Initiates a request for cross-origin resource sharing", example: "Origin: https://example.com", specification: "RFC 6454" },
  { name: "Proxy-Authorization", category: "request", description: "Authorization credentials for connecting to a proxy", example: "Proxy-Authorization: Basic dXNlcjpwYXNz", specification: "RFC 7235" },
  { name: "Range", category: "request", description: "Requests only part of an entity", example: "Range: bytes=500-999", specification: "RFC 7233" },
  { name: "Referer", category: "request", description: "Address of the previous web page from which a link to the currently requested page was followed", example: "Referer: https://example.com/page2", specification: "RFC 7231" },
  { name: "TE", category: "request", description: "Transfer encodings the user agent is willing to accept", example: "TE: trailers, deflate", specification: "RFC 7230" },
  { name: "User-Agent", category: "request", description: "String identifying the application making the request", example: "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", specification: "RFC 7231" },
  // Response headers
  { name: "Age", category: "response", description: "Time in seconds the object has been in a proxy cache", example: "Age: 3600", specification: "RFC 7234" },
  { name: "Allow", category: "response", description: "HTTP methods supported by the resource", example: "Allow: GET, HEAD, OPTIONS", specification: "RFC 7231" },
  { name: "ETag", category: "response", description: "Unique identifier for a specific version of a resource", example: "ETag: \"33a64df551425fcc55e4d42a148795d9f25f89d4\"", specification: "RFC 7232" },
  { name: "Location", category: "response", description: "URL to redirect a client to", example: "Location: https://example.com/new-page", specification: "RFC 7231" },
  { name: "Proxy-Authenticate", category: "response", description: "Authentication method required to access a proxy", example: "Proxy-Authenticate: Basic realm=\"Access to proxy\"", specification: "RFC 7235" },
  { name: "Retry-After", category: "response", description: "How long to wait before making a follow-up request", example: "Retry-After: 120", specification: "RFC 7231" },
  { name: "Server", category: "response", description: "Information about the software used by the origin server", example: "Server: nginx/1.24.0", specification: "RFC 7231" },
  { name: "Set-Cookie", category: "response", description: "Send cookies from the server to the user agent", example: "Set-Cookie: sessionId=abc123; Path=/; HttpOnly", specification: "RFC 6265" },
  { name: "Vary", category: "response", description: "Determines how to match future request headers to decide whether a cached response can be used", example: "Vary: Accept-Encoding", specification: "RFC 7234" },
  { name: "WWW-Authenticate", category: "response", description: "Authentication method required to access the resource", example: "WWW-Authenticate: Basic realm=\"Access to site\"", specification: "RFC 7235" },
  // Security headers
  { name: "Content-Security-Policy", category: "security", description: "Controls resources the user agent is allowed to load", example: "Content-Security-Policy: default-src 'self'", specification: "CSP Level 3" },
  { name: "Strict-Transport-Security", category: "security", description: "Enforces HTTPS connections to the server", example: "Strict-Transport-Security: max-age=31536000; includeSubDomains", specification: "RFC 6797" },
  { name: "X-Content-Type-Options", category: "security", description: "Prevents MIME type sniffing", example: "X-Content-Type-Options: nosniff", specification: "WHATWG Fetch" },
  { name: "X-Frame-Options", category: "security", description: "Controls whether the page can be displayed in a frame", example: "X-Frame-Options: DENY", specification: "RFC 7034" },
  { name: "X-XSS-Protection", category: "security", description: "Enables cross-site scripting filtering", example: "X-XSS-Protection: 1; mode=block", specification: "Deprecated" },
  { name: "Referrer-Policy", category: "security", description: "Controls how much referrer information is sent", example: "Referrer-Policy: strict-origin-when-cross-origin", specification: "Referrer Policy" },
  { name: "Permissions-Policy", category: "security", description: "Controls which browser features can be used", example: "Permissions-Policy: geolocation=()", specification: "Permissions Policy" },
  { name: "Cross-Origin-Embedder-Policy", category: "security", description: "Controls cross-origin resource loading", example: "Cross-Origin-Embedder-Policy: require-corp", specification: "COEP" },
  { name: "Cross-Origin-Opener-Policy", category: "security", description: "Controls cross-origin window interaction", example: "Cross-Origin-Opener-Policy: same-origin", specification: "COOP" },
  { name: "Cross-Origin-Resource-Policy", category: "security", description: "Controls cross-origin resource reading", example: "Cross-Origin-Resource-Policy: same-origin", specification: "CORP" },
  // Entity headers
  { name: "Content-Encoding", category: "entity", description: "Encoding transformations applied to the entity-body", example: "Content-Encoding: gzip", specification: "RFC 7231" },
  { name: "Content-Language", category: "entity", description: "Natural language of the intended audience", example: "Content-Language: en-US", specification: "RFC 7231" },
  { name: "Content-Length", category: "entity", description: "Size of the entity-body in bytes", example: "Content-Length: 348", specification: "RFC 7230" },
  { name: "Content-Location", category: "entity", description: "Alternate location for the returned data", example: "Content-Location: /index.html", specification: "RFC 7231" },
  { name: "Content-Range", category: "entity", description: "Where in a full body the partial message belongs", example: "Content-Range: bytes 200-1000/67589", specification: "RFC 7233" },
  { name: "Content-Type", category: "entity", description: "Media type of the resource", example: "Content-Type: text/html; charset=utf-8", specification: "RFC 7231" },
  { name: "Expires", category: "entity", description: "Date/time after which the response is considered stale", example: "Expires: Thu, 01 Dec 2026 16:00:00 GMT", specification: "RFC 7234" },
  { name: "Last-Modified", category: "entity", description: "Date and time the resource was last modified", example: "Last-Modified: Tue, 07 Jul 2026 10:00:00 GMT", specification: "RFC 7232" },
  // CORS headers
  { name: "Access-Control-Allow-Origin", category: "cors", description: "Specifies which origins can access the resource", example: "Access-Control-Allow-Origin: https://example.com", specification: "Fetch Spec" },
  { name: "Access-Control-Allow-Methods", category: "cors", description: "Specifies HTTP methods allowed for cross-origin requests", example: "Access-Control-Allow-Methods: GET, POST, PUT", specification: "Fetch Spec" },
  { name: "Access-Control-Allow-Headers", category: "cors", description: "Specifies headers allowed in cross-origin requests", example: "Access-Control-Allow-Headers: Content-Type, Authorization", specification: "Fetch Spec" },
  { name: "Access-Control-Max-Age", category: "cors", description: "How long preflight results can be cached", example: "Access-Control-Max-Age: 86400", specification: "Fetch Spec" },
  { name: "Access-Control-Allow-Credentials", category: "cors", description: "Whether credentials are allowed in cross-origin requests", example: "Access-Control-Allow-Credentials: true", specification: "Fetch Spec" },
  { name: "Access-Control-Expose-Headers", category: "cors", description: "Which headers can be exposed in cross-origin responses", example: "Access-Control-Expose-Headers: Content-Length, X-Custom", specification: "Fetch Spec" },
  { name: "Access-Control-Request-Method", category: "cors", description: "Used in preflight requests to indicate the method", example: "Access-Control-Request-Method: POST", specification: "Fetch Spec" },
  { name: "Access-Control-Request-Headers", category: "cors", description: "Used in preflight requests to indicate headers", example: "Access-Control-Request-Headers: X-PINGOTHER", specification: "Fetch Spec" },
];
