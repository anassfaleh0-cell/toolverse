export interface KeywordCluster {
  primary: string;
  secondary: string[];
  longTail: string[];
  questions: string[];
  comparisons: string[];
  troubleshooting: string[];
  beginner: string[];
}

export const TOOL_KEYWORDS: Record<string, KeywordCluster> = {
  // ── Network & Internet ────────────────────────────────────────
  "dns-lookup": {
    primary: "DNS lookup",
    secondary: ["DNS record lookup", "check DNS records", "DNS query tool", "domain name system lookup"],
    longTail: ["how to check DNS records online", "DNS A record lookup tool", "look up DNS records for domain", "check DNS TXT records online", "find MX records for domain"],
    questions: ["What is a DNS lookup?", "How do I check DNS records?", "What are the different DNS record types?", "How does DNS resolution work?", "What is the difference between A and CNAME records?"],
    comparisons: ["DNS lookup vs nslookup", "DNS lookup vs dig command", "DNS lookup vs WHOIS lookup", "DNS lookup vs ping"],
    troubleshooting: ["DNS not resolving", "DNS lookup failed", "DNS server not responding", "DNS_PROBE_FINISHED_NXDOMAIN error", "DNS cache flush"],
    beginner: ["how DNS works explained", "what is DNS for beginners", "DNS records explained for beginners", "types of DNS records guide"],
  },
  "reverse-dns-lookup": {
    primary: "reverse DNS lookup",
    secondary: ["reverse DNS", "PTR record lookup", "reverse IP lookup", "rDNS lookup"],
    longTail: ["how to do a reverse DNS lookup", "find hostname from IP address", "PTR record lookup online", "reverse DNS lookup IPv6", "reverse DNS lookup tool free"],
    questions: ["What is reverse DNS lookup?", "How do I find a hostname from an IP address?", "What are PTR records?", "Why is reverse DNS important for email?", "What is the difference between forward and reverse DNS?"],
    comparisons: ["reverse DNS vs forward DNS", "reverse DNS vs IP lookup", "reverse DNS vs WHOIS", "PTR record vs A record"],
    troubleshooting: ["reverse DNS lookup failed", "PTR record not found", "reverse DNS not working email", "no PTR record for IP", "reverse DNS timeout"],
    beginner: ["what is reverse DNS", "how reverse DNS works", "PTR records explained for beginners", "why email servers need reverse DNS"],
  },
  "dns-propagation-checker": {
    primary: "DNS propagation checker",
    secondary: ["check DNS propagation", "DNS propagation tool", "DNS propagation test", "global DNS checker"],
    longTail: ["how to check DNS propagation globally", "DNS propagation checker online free", "check if DNS has propagated", "how long does DNS propagation take", "DNS propagation checker multiple locations"],
    questions: ["What is DNS propagation?", "How long does DNS propagation take?", "How do I check if my DNS has propagated?", "Why is my DNS not propagating?", "What does TTL mean in DNS propagation?"],
    comparisons: ["DNS propagation checker vs DNS lookup", "DNS propagation vs DNS caching", "global DNS checker vs local DNS", "TTL vs propagation time"],
    troubleshooting: ["DNS not propagating after 24 hours", "DNS propagation stuck", "different DNS results by location", "DNS propagation checker shows old IP", "flush DNS after propagation"],
    beginner: ["what is DNS propagation explained", "how DNS propagation works for beginners", "what is TTL in DNS", "understanding DNS propagation times"],
  },
  "whois-lookup": {
    primary: "WHOIS lookup",
    secondary: ["WHOIS domain lookup", "domain WHOIS search", "check domain registration", "domain ownership lookup"],
    longTail: ["how to find domain owner", "WHOIS lookup domain registration", "check domain expiration date", "find domain registrar information", "WHOIS lookup tool free online"],
    questions: ["What is a WHOIS lookup?", "How do I find out who owns a domain?", "What information does WHOIS reveal?", "Why is WHOIS data redacted?", "How do I check when a domain expires?"],
    comparisons: ["WHOIS lookup vs DNS lookup", "WHOIS vs RDAP", "WHOIS lookup vs domain age checker", "WHOIS vs SSL checker"],
    troubleshooting: ["WHOIS lookup no results", "WHOIS data redacted GDPR", "WHOIS lookup failed", "domain WHOIS privacy protection", "WHOIS rate limit exceeded"],
    beginner: ["what is WHOIS information", "how to use WHOIS lookup", "domain registration explained for beginners", "understanding WHOIS privacy"],
  },
  "http-headers-checker": {
    primary: "HTTP headers checker",
    secondary: ["check HTTP headers", "HTTP header viewer", "response header checker", "HTTP security headers audit"],
    longTail: ["how to check HTTP headers of a website", "HTTP response header viewer online", "check security headers website", "HTTP header analysis tool", "inspect HTTP request headers"],
    questions: ["What are HTTP headers?", "How do I check HTTP headers of a website?", "What are the most important security headers?", "What is HSTS and why does it matter?", "How do I fix Content-Security-Policy violations?"],
    comparisons: ["HTTP headers vs HTTPS headers", "HTTP security headers vs SSL certificate", "HTTP headers checker vs curl", "CSP vs CORS headers"],
    troubleshooting: ["HTTP headers not showing", "CSP violation errors", "HSTS header missing", "X-Frame-Options denied", "CORS header missing"],
    beginner: ["what are HTTP headers explained", "HTTP security headers guide for beginners", "understanding HTTP response headers", "how to read HTTP headers"],
  },
  "ssl-certificate-checker": {
    primary: "SSL certificate checker",
    secondary: ["SSL check", "SSL certificate validator", "check SSL certificate", "TLS certificate checker", "certificate expiry checker"],
    longTail: ["how to check SSL certificate expiration", "SSL certificate checker online free", "verify SSL certificate details", "check if SSL certificate is valid", "SSL certificate chain checker"],
    questions: ["What is an SSL certificate checker?", "How do I check if my SSL certificate is valid?", "What happens when an SSL certificate expires?", "What is a certificate chain error?", "What TLS version should my server use?"],
    comparisons: ["SSL certificate checker vs HTTP headers checker", "SSL vs TLS", "SSL certificate vs HTTPS", "paid vs free SSL certificates"],
    troubleshooting: ["SSL certificate expired", "SSL certificate not trusted", "SSL certificate chain incomplete", "SSL handshake failed", "certificate name mismatch"],
    beginner: ["what is an SSL certificate", "how SSL certificates work explained", "SSL vs TLS for beginners", "types of SSL certificates explained"],
  },
  "ping-test": {
    primary: "ping test",
    secondary: ["online ping test", "TCP ping tool", "network latency test", "ping checker", "connectivity test"],
    longTail: ["how to ping a server online", "test ping from my location", "check network latency tool", "TCP ping test free online", "ping timeout and packet loss test"],
    questions: ["What is a ping test?", "What is a good ping time?", "What is jitter and why does it matter?", "What causes packet loss?", "How is TCP ping different from ICMP ping?"],
    comparisons: ["ping test vs traceroute", "TCP ping vs ICMP ping", "ping vs latency test", "ping test vs speed test"],
    troubleshooting: ["ping request timed out", "ping packet loss high", "ping unstable high jitter", "destination host unreachable", "ping general failure"],
    beginner: ["what is ping explained", "how to test network latency", "what is good ping speed", "understanding ping results"],
  },
  "port-checker": {
    primary: "port checker",
    secondary: ["open port checker", "port scanner online", "check if port is open", "network port test", "port connectivity tester"],
    longTail: ["how to check if a port is open online", "port checker tool free", "scan open ports on IP address", "check port 80 443 open", "port checker with service identification"],
    questions: ["What is a port checker?", "How do I check if a port is open?", "What's the difference between open closed and filtered?", "Why does my port show as filtered?", "Which ports are most commonly attacked?"],
    comparisons: ["port checker vs port scanner", "TCP port vs UDP port", "port checker vs ping test", "online port checker vs nmap"],
    troubleshooting: ["port shows filtered but should be open", "port closed firewall blocking", "port checker connection refused", "port scan detected by firewall", "common port conflicts"],
    beginner: ["what are network ports", "open vs closed vs filtered ports", "common port numbers guide", "how to open a port on firewall"],
  },
  "website-status-checker": {
    primary: "website status checker",
    secondary: ["website uptime checker", "is website down", "check if site is online", "website availability test", "HTTP status code checker"],
    longTail: ["how to check if a website is down for everyone", "website status checker online free", "check website response time", "monitor website uptime tool", "HTTP status code checker tool"],
    questions: ["How do I check if a website is down?", "What does HTTP status code 200 mean?", "What is the difference between 301 and 302 redirects?", "What does a 503 Service Unavailable mean?", "How can I monitor my website uptime?"],
    comparisons: ["website status checker vs ping test", "HTTP status codes vs server errors", "website uptime monitoring vs status check", "status checker vs SSL checker"],
    troubleshooting: ["website down but others can access", "502 bad gateway error fix", "503 service unavailable causes", "404 not found error", "website slow response time"],
    beginner: ["what are HTTP status codes", "how to check if website is working", "understanding website uptime", "common website errors explained"],
  },
  "user-agent-parser": {
    primary: "user agent parser",
    secondary: ["parse user agent string", "user agent detector", "browser user agent lookup", "UA string parser"],
    longTail: ["how to parse user agent string online", "identify browser from user agent", "user agent parser for developers", "parse user agent OS and device", "user agent string analysis tool"],
    questions: ["What is a user agent string?", "How do I parse a user agent?", "What information is in a user agent?", "How can I identify a browser from its user agent?", "Why do websites check user agents?"],
    comparisons: ["user agent parser vs browser detection", "user agent vs device fingerprinting", "UA string vs HTTP headers", "user agent parsing vs regex"],
    troubleshooting: ["user agent parsing incorrect", "user agent spoofing detection", "user agent blocked by website", "empty user agent string", "user agent format issues"],
    beginner: ["what is a user agent string", "how user agent detection works", "parts of a user agent string", "why user agents vary by browser"],
  },
  "subnet-calculator": {
    primary: "subnet calculator",
    secondary: ["IP subnet calculator", "CIDR calculator", "subnet mask calculator", "network address calculator", "subnet range calculator"],
    longTail: ["how to calculate subnet from CIDR", "subnet calculator with usable hosts", "find broadcast address from IP", "IPv4 subnet calculator online", "calculate subnet mask from CIDR notation"],
    questions: ["What is a subnet calculator?", "How do I calculate the subnet mask from CIDR?", "What is the difference between network and broadcast address?", "How many usable hosts are in a /24 subnet?", "What is CIDR notation and how does it work?"],
    comparisons: ["subnet calculator vs IP calculator", "IPv4 vs IPv6 subnetting", "CIDR vs subnet mask", "classful vs classless subnetting"],
    troubleshooting: ["subnet calculation wrong", "overlapping subnets", "subnet mask not matching", "CIDR notation invalid", "host range calculation error"],
    beginner: ["what is subnetting explained", "CIDR notation for beginners", "understanding subnet masks", "how to calculate usable hosts per subnet"],
  },

  // ── Productivity ──────────────────────────────────────────────
  "what-is-my-ip": {
    primary: "what is my IP",
    secondary: ["my IP address", "find my IP", "check my IP", "what is my public IP", "my IP location"],
    longTail: ["what is my IP address right now", "find my public IP address instantly", "what is my IPv4 and IPv6 address", "check my IP location and ISP", "what is my IP browser info"],
    questions: ["What is my IP address?", "Does my IP address change?", "How do I check if my VPN is working?", "What is a WebRTC leak?", "What information does my IP reveal about me?"],
    comparisons: ["what is my IP vs IP lookup", "IPv4 vs IPv6", "public IP vs private IP", "static vs dynamic IP address"],
    troubleshooting: ["VPN not hiding IP address", "WebRTC leak exposing real IP", "IPv6 leak when using VPN", "IP showing wrong location", "IP address blacklisted"],
    beginner: ["what is an IP address explained", "difference between IPv4 and IPv6", "public vs private IP addresses", "how to find your IP address"],
  },
  "ip-lookup": {
    primary: "IP lookup",
    secondary: ["IP address lookup", "IP geolocation lookup", "IP address details", "IP location finder", "trace IP address"],
    longTail: ["how to look up an IP address", "find location of IP address online", "IP geolocation lookup free", "get ISP and ASN from IP", "IP address information tool"],
    questions: ["What is an IP lookup?", "How accurate is IP geolocation?", "What is an ASN?", "Can IP lookup detect VPNs?", "What does the privacy score mean?"],
    comparisons: ["IP lookup vs WHOIS lookup", "IP geolocation vs GPS location", "IP lookup vs reverse DNS", "IPv4 vs IPv6 geolocation"],
    troubleshooting: ["IP lookup showing wrong location", "IP geolocation not accurate", "ASN information missing", "IP blacklist check", "VPN IP detected as datacenter"],
    beginner: ["how IP geolocation works", "what information does an IP reveal", "understanding ASN numbers", "IP address types explained"],
  },
  "password-generator": {
    primary: "password generator",
    secondary: ["random password generator", "strong password generator", "secure password creator", "password generator online", "create strong passwords"],
    longTail: ["how to generate strong secure passwords", "random password generator with special characters", "create memorable but secure passwords", "password generator 16 characters", "password strength checker tool"],
    questions: ["What makes a password strong?", "How long should a password be?", "Should I use special characters in passwords?", "What is entropy in password generation?", "How often should I change my passwords?"],
    comparisons: ["password generator vs password manager", "strong vs weak passwords", "random vs memorable passwords", "password generator vs passphrase"],
    troubleshooting: ["website rejecting generated password", "password too long error", "special characters not allowed", "password generator predictable", "password strength indicator inaccurate"],
    beginner: ["how to create a strong password", "password security tips for beginners", "what makes a password secure", "how password entropy works"],
  },

  // ── Text & Writing ────────────────────────────────────────────
  "lorem-ipsum-generator": {
    primary: "Lorem Ipsum generator",
    secondary: ["placeholder text generator", "Lorem Ipsum dummy text", "random text generator", "Lorem Ipsum creator", "mock text generator"],
    longTail: ["how to generate Lorem Ipsum text", "Lorem Ipsum generator with word count", "placeholder text for mockups", "Lorem Ipsum paragraph generator", "generate dummy text for designs"],
    questions: ["What is Lorem Ipsum?", "Why is Lorem Ipsum used in design?", "How do I generate Lorem Ipsum text?", "What is the origin of Lorem Ipsum?", "How many paragraphs of Lorem Ipsum should I use?"],
    comparisons: ["Lorem Ipsum vs dummy text", "Lorem Ipsum vs Cicero text", "placeholder text vs real content", "Lorem Ipsum vs random words"],
    troubleshooting: ["Lorem Ipsum not displaying correctly", "placeholder text too long", "Lorem Ipsum formatting issues", "text generation slow", "special characters in Lorem Ipsum"],
    beginner: ["what is Lorem Ipsum text", "why designers use placeholder text", "how to use Lorem Ipsum in mockups", "Lorem Ipsum alternatives"],
  },
  "word-counter": {
    primary: "word counter",
    secondary: ["word count tool", "count words online", "character counter", "text analyzer", "word counter free"],
    longTail: ["how to count words in text online", "word and character counter tool", "check reading time of text", "count sentences and paragraphs", "word counter with keyword density"],
    questions: ["How do I count words in a text?", "What is reading time and how is it calculated?", "What is keyword density?", "How many words are in an average sentence?", "What characters count as words?"],
    comparisons: ["word counter vs character counter", "word count vs reading time", "keyword density vs word frequency", "online word counter vs Microsoft Word"],
    troubleshooting: ["word count not matching Microsoft Word", "hyphenated words counted incorrectly", "character count includes spaces issue", "copy paste losing formatting", "word counter slow for large text"],
    beginner: ["how to count words correctly", "what is reading time", "understanding character count", "why word count matters for SEO"],
  },
  "text-diff-checker": {
    primary: "text diff checker",
    secondary: ["diff checker", "compare text online", "text comparison tool", "find differences between text", "diff tool online"],
    longTail: ["how to compare two text files online", "find differences between text strings", "text diff checker side by side", "compare text for changes", "diff checker with highlighted changes"],
    questions: ["How do I compare two blocks of text?", "What is a diff check?", "How does a text diff checker work?", "What is a side-by-side diff view?", "Can diff checkers compare code?"],
    comparisons: ["text diff vs code diff", "diff checker vs merge tool", "side by side vs inline diff", "text comparison vs file comparison"],
    troubleshooting: ["diff showing no differences when there are", "whitespace differences ignored", "diff too large to display", "encoding mismatch in comparison", "line ending differences"],
    beginner: ["what is a diff", "how to compare text files", "understanding diff output", "why diff checking matters"],
  },
  "list-randomizer": {
    primary: "list randomizer",
    secondary: ["randomize list online", "shuffle list generator", "random list sorter", "item randomizer", "raffle picker tool"],
    longTail: ["how to randomly shuffle a list online", "random name picker from list", "raffle winner generator tool", "shuffle comma separated list", "randomize order of items tool"],
    questions: ["How do I randomize a list?", "What is a list randomizer used for?", "Is the randomization truly random?", "How do I pick a random winner from a list?", "Can I randomize a list without duplicates?"],
    comparisons: ["list randomizer vs random number generator", "shuffle vs sort", "raffle picker vs random selector", "pseudo-random vs true random"],
    troubleshooting: ["randomization not evenly distributed", "same items grouped after shuffle", "list order not changing enough", "copy paste issues with list", "special characters in items"],
    beginner: ["how to shuffle a list", "what is list randomization", "using randomizer for giveaways", "fair random selection methods"],
  },

  // ── Image & Design ────────────────────────────────────────────
  "qr-code-generator": {
    primary: "QR code generator",
    secondary: ["create QR code online", "free QR code generator", "QR code maker", "generate QR code from URL", "QR code creator tool"],
    longTail: ["how to generate a QR code for free", "create QR code from link online", "QR code generator download PNG", "custom QR code with colors", "QR code generator no sign up"],
    questions: ["How do I create a QR code?", "Are QR codes free to generate?", "What is the difference between static and dynamic QR codes?", "What information can a QR code store?", "Can I customize the look of a QR code?"],
    comparisons: ["QR code vs barcode", "static vs dynamic QR codes", "QR code generator vs NFC tag", "QR code vs data matrix"],
    troubleshooting: ["QR code not scanning", "QR code too small to scan", "QR code error correction too low", "QR code generator scamming", "QR code expires after time"],
    beginner: ["what is a QR code", "how QR codes work", "how to create a QR code step by step", "QR code best practices"],
  },
  "image-resizer": {
    primary: "image resizer",
    secondary: ["resize image online", "photo resizer tool", "resize image dimensions", "image scaling tool", "free image resizer"],
    longTail: ["how to resize an image online free", "resize image to specific dimensions", "image resizer with aspect ratio", "resize JPEG PNG WebP images", "batch resize images tool"],
    questions: ["How do I resize an image online?", "What image format should I use?", "How does aspect ratio work in image resizing?", "What is the best resolution for web images?", "Does resizing reduce image quality?"],
    comparisons: ["resize vs crop image", "JPEG vs PNG vs WebP", "image resizer vs image compressor", "lossy vs lossless image resizing"],
    troubleshooting: ["image quality loss after resize", "aspect ratio distorted", "resized image too large file size", "image format not supported", "transparent background lost"],
    beginner: ["how to resize images for web", "understanding image dimensions", "best image format for websites", "image resolution explained"],
  },
  "css-gradient-generator": {
    primary: "CSS gradient generator",
    secondary: ["gradient generator", "CSS gradient maker", "linear gradient generator", "radial gradient creator", "color gradient tool"],
    longTail: ["how to create CSS gradients online", "linear gradient generator with code", "CSS gradient color picker tool", "create beautiful gradient backgrounds", "radial gradient generator CSS"],
    questions: ["How do I create a CSS gradient?", "What is the difference between linear and radial gradients?", "How do I add multiple color stops?", "What is the CSS syntax for gradients?", "Can I animate CSS gradients?"],
    comparisons: ["linear vs radial gradient", "CSS gradient vs background image", "gradient vs solid color", "CSS gradient vs SVG gradient"],
    troubleshooting: ["gradient not rendering in browser", "CSS gradient syntax error", "gradient looks banded", "cross-browser gradient issues", "gradient color transitions harsh"],
    beginner: ["how to use CSS gradients", "linear gradient tutorial", "radial gradient explained", "color stop basics"],
  },
  "barcode-generator": {
    primary: "barcode generator",
    secondary: ["generate barcode online", "barcode creator tool", "barcode maker free", "create barcode for product", "barcode generator Code 128"],
    longTail: ["how to generate barcodes online free", "create barcode for product label", "barcode generator EAN-13 UPC-A", "generate Code 128 barcode", "download barcode as PNG image"],
    questions: ["How do I generate a barcode?", "What are the different barcode types?", "What is the difference between Code 128 and EAN-13?", "How do I create a barcode for my product?", "Can I download barcodes as images?"],
    comparisons: ["barcode vs QR code", "Code 128 vs EAN-13 vs UPC-A", "1D vs 2D barcodes", "barcode generator vs label printer"],
    troubleshooting: ["barcode not scanning at register", "barcode too small resolution", "barcode type not supported", "barcode number checksum invalid", "barcode printing issues"],
    beginner: ["what is a barcode", "types of barcodes explained", "how barcodes work for products", "barcode standards guide"],
  },

  // ── Code & Development ────────────────────────────────────────
  "json-formatter": {
    primary: "JSON formatter",
    secondary: ["JSON prettier", "JSON beautifier", "JSON validator", "format JSON online", "JSON lint tool"],
    longTail: ["how to format JSON data online", "JSON validator and formatter free", "beautify JSON response from API", "JSON formatter with syntax highlighting", "minify JSON to single line"],
    questions: ["How do I format JSON online?", "What is valid JSON syntax?", "How do I validate JSON data?", "What is the difference between JSON and JavaScript object?", "How do I fix JSON parsing errors?"],
    comparisons: ["JSON formatter vs JSON validator", "JSON vs XML", "JSON vs YAML", "prettified vs minified JSON"],
    troubleshooting: ["JSON parse error unexpected token", "trailing comma in JSON", "JSON string not quoted properly", "nested JSON too deep", "JSON key without quotes"],
    beginner: ["what is JSON format", "JSON syntax explained", "how to validate JSON", "JSON vs XML for beginners"],
  },
  "base64-encoder": {
    primary: "Base64 encoder",
    secondary: ["Base64 decode", "Base64 converter", "Base64 encode online", "Base64 decoder tool", "Base64 string converter"],
    longTail: ["how to encode text to Base64 online", "Base64 decoder free tool", "convert string to Base64 format", "Base64 encode with URL-safe mode", "decode Base64 to plain text"],
    questions: ["What is Base64 encoding?", "How do I encode text to Base64?", "When should I use Base64 encoding?", "Is Base64 encryption?", "What is URL-safe Base64?"],
    comparisons: ["Base64 vs Base62", "Base64 vs Hex encoding", "Base64 vs UTF-8", "Base64 encode vs decode"],
    troubleshooting: ["Base64 string invalid character", "Base64 decoding padding error", "Base64 encoded string too long", "Base64 vs base64url confusion", "Base64 decode returns garbled text"],
    beginner: ["what is Base64 encoding", "how Base64 encoding works", "when to use Base64", "Base64 vs encryption explained"],
  },
  "url-encoder": {
    primary: "URL encoder",
    secondary: ["URL decode online", "URL encoding tool", "percent encode URL", "URL encoder decoder", "encode URL query string"],
    longTail: ["how to URL encode special characters", "URL decoder free online tool", "percent encoding converter", "encode query string parameters", "decode URL to readable text"],
    questions: ["What is URL encoding?", "Why are special characters encoded in URLs?", "How do I decode a URL?", "What is percent encoding?", "Which characters must be encoded in a URL?"],
    comparisons: ["URL encoder vs HTML entity encoder", "percent encoding vs base64", "URL encoding vs form encoding", "encodeURI vs encodeURIComponent"],
    troubleshooting: ["URL with spaces not working", "special characters breaking URL", "double encoding issue", "URL decode not converting correctly", "query string parameters not parsing"],
    beginner: ["what is URL encoding", "how to encode URLs correctly", "why spaces become percent 20", "URL encoding characters guide"],
  },
  "html-entity-encoder": {
    primary: "HTML entity encoder",
    secondary: ["HTML entity decoder", "escape HTML characters", "HTML encoder online", "HTML entity converter", "special character encoder"],
    longTail: ["how to encode HTML special characters online", "HTML entity decoder free tool", "escape HTML angle brackets", "convert HTML reserved characters to entities", "HTML entity encoding for XSS prevention"],
    questions: ["What are HTML entities?", "How do I encode HTML special characters?", "Why should I escape HTML characters?", "What is the difference between &amp; and &?", "How do HTML entities prevent XSS?"],
    comparisons: ["HTML entity encoder vs URL encoder", "HTML entities vs Unicode", "named vs numeric HTML entities", "HTML escape vs sanitize"],
    troubleshooting: ["HTML entity not rendering in browser", "double encoded HTML entities", "special characters showing as gibberish", "HTML entity charset mismatch", "XSS bypass through unescaped attributes"],
    beginner: ["what are HTML entities", "how to use HTML entities", "why HTML escaping matters for security", "common HTML entities list"],
  },
  "jwt-decoder": {
    primary: "JWT decoder",
    secondary: ["decode JWT token", "JWT inspector", "JWT token parser", "JSON Web Token decoder", "JWT debugger"],
    longTail: ["how to decode a JWT token online", "JWT decoder inspect header payload", "verify JWT token expiration", "JWT token debugger free tool", "decode JWT without secret key"],
    questions: ["What is a JWT token?", "How do I decode a JWT token?", "What is in a JWT payload?", "How does JWT authentication work?", "Can I decode a JWT without the secret?"],
    comparisons: ["JWT vs OAuth", "JWT vs session cookies", "signed vs encrypted JWT", "JWT vs PASETO"],
    troubleshooting: ["JWT token expired", "JWT signature invalid", "JWT malformed format", "JWT alg none attack", "JWT iat nbf claims"],
    beginner: ["what is JSON Web Token", "JWT structure explained", "how JWT authentication works", "JWT header payload signature"],
  },
  "uuid-generator": {
    primary: "UUID generator",
    secondary: ["generate UUID", "UUID v4 generator", "create unique ID", "GUID generator online", "random UUID tool"],
    longTail: ["how to generate UUID v4 online", "UUID generator for database keys", "generate bulk UUIDs free", "create unique correlation IDs", "UUID vs GUID generator"],
    questions: ["What is a UUID?", "How are UUIDs generated?", "What is the difference between UUID v4 and v5?", "Are UUIDs truly unique?", "What are UUIDs used for in programming?"],
    comparisons: ["UUID v4 vs v5 vs v7", "UUID vs GUID", "UUID vs auto-increment ID", "random vs time-based UUID"],
    troubleshooting: ["generated duplicate UUID", "UUID format invalid", "UUID version detection", "UUID string vs binary storage", "UUID namespace not consistent"],
    beginner: ["what is a UUID", "UUID versions explained", "how UUIDs ensure uniqueness", "when to use UUIDs in databases"],
  },
  "regex-tester": {
    primary: "regex tester",
    secondary: ["regular expression tester", "regex checker online", "regex pattern tester", "test regular expressions", "regex debugger"],
    longTail: ["how to test regular expressions online", "regex tester with match highlighting", "debug regex patterns tool", "regex tester with capture groups", "test regex against sample text"],
    questions: ["How do I test a regular expression?", "What are regex capture groups?", "What is the difference between greedy and lazy matching?", "How do I use regex flags?", "What is a lookahead in regex?"],
    comparisons: ["regex tester vs regex debugger", "regex vs string methods", "PCRE vs ECMAScript regex", "regex vs glob patterns"],
    troubleshooting: ["regex pattern too complex", "regex catastrophic backtracking", "regex not matching expected text", "special characters not escaped", "regex performance optimization"],
    beginner: ["what is regex", "regex patterns explained", "how to use regular expressions", "regex cheat sheet for beginners"],
  },
  "md5-hash-generator": {
    primary: "MD5 hash generator",
    secondary: ["MD5 hash online", "generate MD5 checksum", "MD5 hash calculator", "MD5 message digest", "create MD5 hash"],
    longTail: ["how to generate MD5 hash online", "MD5 hash calculator for strings", "create MD5 checksum for files", "MD5 hash generator tool free", "MD5 hash of text online"],
    questions: ["What is MD5 hash?", "Is MD5 still secure?", "How is MD5 hash calculated?", "What is the difference between MD5 and SHA?", "What is MD5 used for?"],
    comparisons: ["MD5 vs SHA-1 vs SHA-256", "MD5 vs SHA hash", "cryptographic hash vs checksum", "MD5 vs bcrypt"],
    troubleshooting: ["MD5 hash collision explained", "MD5 not matching expected value", "MD5 with salt implementation", "MD5 hash length fixed", "MD5 rainbow table attacks"],
    beginner: ["what is MD5 hashing", "how hash functions work", "MD5 vs SHA for beginners", "why MD5 is no longer secure"],
  },
  "sha-hash-generator": {
    primary: "SHA hash generator",
    secondary: ["SHA256 generator", "SHA hash calculator", "SHA512 hash online", "generate SHA hash", "secure hash algorithm tool"],
    longTail: ["how to generate SHA-256 hash online", "SHA-512 hash generator free", "compare SHA-1 SHA-256 SHA-512", "generate hash with Web Crypto API", "SHA hash string converter"],
    questions: ["What is the SHA hash algorithm?", "What is the difference between SHA-1 SHA-256 and SHA-512?", "Which SHA variant should I use?", "How is SHA-256 calculated?", "What is the output length of SHA-256?"],
    comparisons: ["SHA-1 vs SHA-256 vs SHA-512", "SHA vs MD5", "SHA vs HMAC", "SHA-2 vs SHA-3"],
    troubleshooting: ["SHA hash length not matching", "SHA-1 deprecated warning", "SHA hash output format", "Web Crypto API unsupported browser", "SHA hash performance by variant"],
    beginner: ["what is SHA hashing", "SHA-1 vs SHA-2 explained", "why SHA-256 is secure", "how to choose the right SHA variant"],
  },
  "html-minifier": {
    primary: "HTML minifier",
    secondary: ["minify HTML online", "HTML compressor tool", "HTML code minifier", "compress HTML code", "HTML minifier free"],
    longTail: ["how to minify HTML code online", "HTML minifier reduce file size", "compress HTML for WordPress", "HTML minifier with optional tag removal", "HTML beautifier and formatter"],
    questions: ["What is HTML minification?", "How does HTML minification improve performance?", "What is removed during HTML minification?", "Is it safe to minify HTML?", "What is the difference between minify and beautify?"],
    comparisons: ["HTML minifier vs CSS minifier", "minify vs compress", "HTML minification vs gzip", "HTML minifier vs HTML optimizer"],
    troubleshooting: ["minified HTML broken layout", "HTML comments removed incorrectly", "conditional comments broken after minify", "whitespace sensitive elements collapse", "HTML minification removing required tags"],
    beginner: ["what is HTML minification", "why minify HTML for speed", "HTML minification best practices", "minify vs beautify explained"],
  },
  "css-minifier": {
    primary: "CSS minifier",
    secondary: ["minify CSS online", "CSS compressor tool", "CSS code minifier", "compress CSS stylesheet", "CSS minify free"],
    longTail: ["how to minify CSS code online", "CSS minifier for WordPress", "compress CSS stylesheet size", "CSS minifier with vendor prefixes", "CSS beautifier formatter tool"],
    questions: ["What is CSS minification?", "How does CSS minification improve page speed?", "What is removed during CSS minification?", "Can minified CSS cause layout issues?", "What is CSSO and CSSNano?"],
    comparisons: ["CSS minifier vs HTML minifier", "CSSO vs CSSNano vs clean-css", "CSS minification vs compression", "minified vs unminified CSS"],
    troubleshooting: ["minified CSS breaks styles", "CSS custom properties renamed", "@import statements broken after minify", "CSS minifier removing fallbacks", "source maps not working with minified CSS"],
    beginner: ["how CSS minification works", "why minify CSS for performance", "CSS optimization basics", "minified CSS for production"],
  },
  "js-minifier": {
    primary: "JS minifier",
    secondary: ["minify JavaScript online", "JavaScript compressor", "JS code minifier", "compress JavaScript file", "JS beautifier tool"],
    longTail: ["how to minify JavaScript code online", "JavaScript minifier for production", "JS compressor with variable renaming", "minify JS with source maps", "JavaScript code beautifier"],
    questions: ["What is JS minification?", "How does JavaScript minification work?", "What is the difference between minify and uglify?", "Does minification affect JavaScript functionality?", "What is tree shaking in JS minification?"],
    comparisons: ["JS minifier vs bundler", "Terser vs UglifyJS vs esbuild", "minification vs obfuscation", "JS minifier vs CSS minifier"],
    troubleshooting: ["minified JS throws syntax error", "variable renaming breaks references", "source maps not aligning with minified code", "dead code elimination removing needed functions", "minified JS larger than original"],
    beginner: ["what is JavaScript minification", "why minify JS for web performance", "JS minification vs obfuscation", "how to minify JavaScript"],
  },
  "case-converter": {
    primary: "case converter",
    secondary: ["text case converter", "convert text case online", "camelCase converter", "snake_case converter", "uppercase lowercase converter"],
    longTail: ["how to convert text to camelCase online", "snake case converter free tool", "title case converter for headlines", "convert between naming conventions", "PascalCase vs camelCase converter"],
    questions: ["How do I convert text between different cases?", "What is the difference between camelCase and PascalCase?", "What is snake_case used for?", "What is kebab-case?", "How do I convert a string to title case?"],
    comparisons: ["camelCase vs PascalCase vs snake_case", "case converter vs find replace", "title case vs sentence case", "UPPER CASE vs lower case"],
    troubleshooting: ["conversion loses word boundaries", "abbreviations not handled correctly", "acronyms lowercased incorrectly", "numbers in identifiers breaking conversion", "unicode characters not preserved"],
    beginner: ["naming conventions explained", "camelCase vs snake_case guide", "when to use each case style", "programming naming conventions"],
  },
  "number-base-converter": {
    primary: "number base converter",
    secondary: ["binary converter", "hex converter online", "decimal to binary", "octal to hexadecimal", "base conversion tool"],
    longTail: ["how to convert decimal to binary online", "hex to decimal converter free", "binary octal decimal hexadecimal converter", "convert numbers between bases", "fractional number base conversion"],
    questions: ["How do I convert between number bases?", "What is the binary number system?", "What is hexadecimal used for in computing?", "How do I convert decimal to hex?", "What is the octal number system?"],
    comparisons: ["binary vs decimal vs hexadecimal", "base-2 vs base-10 vs base-16", "number base converter vs calculator", "integer vs fractional base conversion"],
    troubleshooting: ["fractional conversion floating point error", "negative number representation", "leading zeros lost in conversion", "large number overflow", "base prefix confusion"],
    beginner: ["number bases explained", "how binary works", "understanding hexadecimal", "decimal to binary conversion guide"],
  },
  "color-converter": {
    primary: "color converter",
    secondary: ["HEX to RGB converter", "RGB to HSL converter", "color code converter", "color format converter", "HEX color converter"],
    longTail: ["how to convert HEX to RGB online", "RGB to HSL color converter free", "color converter with live preview", "convert between color formats", "HEX color code to RGB tool"],
    questions: ["How do I convert between HEX and RGB?", "What is the difference between RGB and HSL?", "How do I read a HEX color code?", "What is the HSL color model?", "How do I find complementary colors?"],
    comparisons: ["HEX vs RGB vs HSL", "color spaces SRGB vs Adobe RGB", "HEX vs color names", "additive vs subtractive color"],
    troubleshooting: ["HEX code invalid format", "RGB values out of range", "color conversion not matching preview", "HSL values calculated incorrectly", "monitor color calibration issues"],
    beginner: ["how HEX color codes work", "RGB color model explained", "HSL color model basics", "color conversion guide for designers"],
  },
  "markdown-preview": {
    primary: "markdown preview",
    secondary: ["markdown editor online", "markdown viewer", "markdown renderer", "live markdown preview", "markdown to HTML converter"],
    longTail: ["how to preview markdown online", "live markdown editor with preview", "markdown to HTML converter free", "markdown editor with syntax highlighting", "write and preview markdown in real time"],
    questions: ["What is Markdown?", "How do I preview Markdown?", "What Markdown elements are supported?", "How do I create a table in Markdown?", "Can I export Markdown as HTML?"],
    comparisons: ["markdown vs HTML", "markdown vs rich text", "markdown vs WYSIWYG editor", "markdown preview vs markdown editor"],
    troubleshooting: ["markdown not rendering correctly", "code blocks not formatted", "tables not aligning in preview", "image relative paths broken", "markdown flavor differences"],
    beginner: ["what is markdown", "markdown syntax guide", "how to write markdown", "markdown formatting basics"],
  },
  "sql-formatter": {
    primary: "SQL formatter",
    secondary: ["format SQL online", "SQL beautifier", "SQL pretty printer", "SQL query formatter", "SQL indentation tool"],
    longTail: ["how to format SQL queries online", "SQL beautifier for complex queries", "format SQL with proper indentation", "SQL formatter for SELECT JOIN", "SQL query prettifier free"],
    questions: ["How do I format SQL queries?", "What is the standard SQL formatting style?", "How should I indent SQL queries?", "How do I format complex JOIN statements?", "What is the best SQL formatting style?"],
    comparisons: ["SQL formatter vs linter", "SQL formatting styles comparison", "SQL formatter vs query optimizer", "uppercase vs lowercase SQL keywords"],
    troubleshooting: ["SQL formatting breaks subqueries", "CTE not aligned correctly", "long IN clause formatting", "string literals with SQL keywords", "nested queries indentation"],
    beginner: ["how to write readable SQL", "SQL formatting conventions", "SQL query structure guide", "SQL best practices for readability"],
  },
  "html-preview": {
    primary: "HTML preview",
    secondary: ["HTML viewer online", "live HTML editor", "HTML preview tool", "HTML renderer online", "HTML sandbox editor"],
    longTail: ["how to preview HTML code online", "live HTML editor with instant preview", "HTML CSS JavaScript preview tool", "test HTML snippets before deploying", "HTML preview with live rendering"],
    questions: ["How do I preview HTML code?", "What is a live HTML editor?", "How do I test HTML CSS and JavaScript online?", "Can I preview HTML with JavaScript enabled?", "How do I debug HTML in a sandbox?"],
    comparisons: ["HTML preview vs browser dev tools", "HTML preview vs code editor", "live preview vs manual refresh", "HTML preview vs sandbox environment"],
    troubleshooting: ["JavaScript not executing in preview", "CSS not applying to HTML", "relative paths broken in preview", "iframe security restrictions", "HTML preview not updating"],
    beginner: ["how to preview HTML", "HTML CSS JS basics", "testing web pages before publishing", "HTML preview tools explained"],
  },
  "text-to-slug": {
    primary: "text to slug converter",
    secondary: ["URL slug generator", "SEO slug converter", "create URL-friendly slug", "slug maker tool", "text to URL converter"],
    longTail: ["how to convert text to URL slug online", "create SEO-friendly URL slugs", "slug generator for blog posts", "text to slug with special characters", "generate clean permalinks tool"],
    questions: ["What is a URL slug?", "How do I create an SEO-friendly slug?", "What characters are allowed in a slug?", "Why are slugs important for SEO?", "How do I convert text to a slug?"],
    comparisons: ["text to slug vs URL encoder", "slug vs permalink", "SEO slug vs random URL", "slug generation vs manual URL creation"],
    troubleshooting: ["slug contains special characters", "slug too long for URL", "duplicate slug conflict", "unicode characters in slug", "slug stop words removal"],
    beginner: ["what is a URL slug", "how to create good slugs", "SEO slug best practices", "slug vs URL explained"],
  },
  "url-parser": {
    primary: "URL parser",
    secondary: ["parse URL online", "URL analyzer tool", "URL components viewer", "split URL into parts", "query string parser"],
    longTail: ["how to parse a URL into components", "URL parser extract hostname path", "query string parameter parser online", "analyze URL structure tool", "parse and build URLs interactively"],
    questions: ["How do I parse a URL into its components?", "What are the parts of a URL?", "What is the difference between path and query string?", "How do I extract query parameters from a URL?", "What is a URL fragment?"],
    comparisons: ["URL parser vs URL encoder", "URL parsing vs regex", "URL object vs string manipulation", "URL parser vs URI parser"],
    troubleshooting: ["URL with malformed query string", "encoded characters in URL not decoded", "URL without protocol fails parsing", "port number extraction", "IPv6 URL parsing issue"],
    beginner: ["parts of a URL explained", "how URLs work", "URL structure guide", "query string parameters explained"],
  },
  "json-path-search": {
    primary: "JSON path search",
    secondary: ["JSONPath query tool", "search JSON data", "JSONPath expression tester", "JSONPath evaluator", "JSONPath online"],
    longTail: ["how to use JSONPath to search JSON", "JSONPath expression tester online", "query JSON data with JSONPath", "JSONPath vs jq tool", "filter JSON array by condition"],
    questions: ["What is JSONPath?", "How do I search JSON data with JSONPath?", "What is the difference between JSONPath and jq?", "How do I filter JSON array elements?", "What are wildcards in JSONPath?"],
    comparisons: ["JSONPath vs jq", "JSONPath vs XPath", "JSONPath vs JavaScript bracket notation", "JSONPath vs JSON pointer"],
    troubleshooting: ["JSONPath expression not matching", "array index out of bounds", "deeply nested JSON traversal", "JSONPath syntax error", "wildcard not selecting all nodes"],
    beginner: ["what is JSONPath", "JSONPath syntax explained", "how to query JSON documents", "JSONPath expressions for beginners"],
  },

  // ── Data & Analytics ──────────────────────────────────────────
  "json-to-csv": {
    primary: "JSON to CSV converter",
    secondary: ["convert JSON to CSV", "CSV to JSON converter", "JSON CSV transformation", "JSON to Excel converter", "data format converter"],
    longTail: ["how to convert JSON to CSV online", "JSON to CSV with nested objects", "convert CSV file to JSON free", "JSON array to CSV converter tool", "data transformation JSON to Excel"],
    questions: ["How do I convert JSON to CSV?", "How do I handle nested JSON in CSV conversion?", "What is the difference between JSON and CSV?", "How do I convert CSV back to JSON?", "What delimiter does CSV use?"],
    comparisons: ["JSON vs CSV", "JSON to CSV vs XML to CSV", "CSV vs TSV vs JSON", "JSON to CSV vs manual data entry"],
    troubleshooting: ["nested JSON not flattening correctly", "arrays in JSON to CSV conversion", "CSV encoding issues after conversion", "comma in value breaking CSV", "header row not generated"],
    beginner: ["what is CSV format", "JSON vs CSV explained", "when to use JSON vs CSV", "data format conversion basics"],
  },
  "yaml-to-json": {
    primary: "YAML to JSON converter",
    secondary: ["convert YAML to JSON", "JSON to YAML converter", "YAML parser online", "YAML to JSON tool", "YAML viewer converter"],
    longTail: ["how to convert YAML to JSON online", "YAML to JSON with nested structures", "convert JSON to YAML format free", "YAML parser for configuration files", "YAML to JSON editor tool"],
    questions: ["How do I convert YAML to JSON?", "What is the difference between YAML and JSON?", "Which is better YAML or JSON for configs?", "How do I convert JSON to YAML?", "What are YAML anchors and aliases?"],
    comparisons: ["YAML vs JSON", "YAML vs TOML", "YAML vs XML", "YAML to JSON vs YAML to TOML"],
    troubleshooting: ["YAML indentation error", "YAML tabs vs spaces conflict", "YAML anchor resolution in conversion", "YAML multiline string handling", "YAML type inference issues"],
    beginner: ["what is YAML", "YAML vs JSON differences", "YAML syntax guide for beginners", "when to use YAML for configs"],
  },
  "xml-to-json": {
    primary: "XML to JSON converter",
    secondary: ["convert XML to JSON", "JSON to XML converter", "XML parser online", "XML to JSON tool", "transform XML to JSON"],
    longTail: ["how to convert XML to JSON online", "XML to JSON with attributes", "convert XML file to JSON format free", "XML to JSON for API integration", "handle XML namespaces in conversion"],
    questions: ["How do I convert XML to JSON?", "How are XML attributes handled in JSON?", "What happens to XML namespaces in conversion?", "What is the difference between XML and JSON?", "How do I convert JSON back to XML?"],
    comparisons: ["XML vs JSON", "XML to JSON vs XML to YAML", "XML attributes vs elements", "XML schema vs JSON schema"],
    troubleshooting: ["XML attributes lost in conversion", "XML namespace handling incorrect", "XML CDATA sections not preserved", "XML self-closing tags conversion", "XML array detection heuristics"],
    beginner: ["what is XML", "XML vs JSON explained", "XML structure for beginners", "why convert XML to JSON"],
  },
  "remove-duplicate-lines": {
    primary: "remove duplicate lines",
    secondary: ["duplicate line remover", "remove repeated lines", "deduplicate lines online", "unique lines extractor", "line dedup tool"],
    longTail: ["how to remove duplicate lines from text", "remove repeated lines online free", "deduplicate lines in text file", "remove duplicate lines case sensitive", "find and remove duplicate lines tool"],
    questions: ["How do I remove duplicate lines from text?", "What is the fastest way to deduplicate lines?", "Does the duplicate remover preserve line order?", "How does case-sensitive deduplication work?", "Can I sort results after removing duplicates?"],
    comparisons: ["remove duplicate lines vs sort lines", "dedup vs unique filter", "case-sensitive vs case-insensitive dedup", "line dedup vs line sort"],
    troubleshooting: ["duplicate lines not being removed", "case sensitivity ignoring duplicates", "whitespace causing false unique lines", "line order changing after dedup", "large file dedup performance"],
    beginner: ["how to deduplicate text lines", "remove duplicates from list", "cleaning up repeated lines in text", "why remove duplicate lines"],
  },
  "sort-lines": {
    primary: "sort lines",
    secondary: ["alphabetical sorter", "sort text lines online", "line sorter tool", "arrange lines alphabetically", "sort list A to Z"],
    longTail: ["how to sort lines alphabetically online", "sort lines A-Z and Z-A tool", "sort text lines with numbers", "sort lines ignore case", "sort and deduplicate lines free"],
    questions: ["How do I sort lines alphabetically?", "What is the difference between A-Z and Z-A sorting?", "How does numeric sort work?", "Can I sort lines while removing duplicates?", "What does reverse order do in line sorting?"],
    comparisons: ["sort lines vs remove duplicate lines", "A-Z vs Z-A sorting", "alphabetical vs numeric sort", "case-sensitive vs case-insensitive sort"],
    troubleshooting: ["numbers not sorting numerically", "case differences affecting sort order", "leading whitespace breaking sort", "special characters sorting incorrectly", "sort order unexpected results"],
    beginner: ["how to sort a list alphabetically", "sorting text lines explained", "alphabetical order basics", "ascending vs descending sort"],
  },
  "reverse-text": {
    primary: "reverse text",
    secondary: ["text reverser online", "reverse string tool", "flip text characters", "reverse word order", "reverse lines tool"],
    longTail: ["how to reverse text online free", "reverse characters in a string", "reverse word order in sentence", "reverse line order in text", "flip text backwards tool"],
    questions: ["How do I reverse text characters?", "What does reversing word order do?", "How is line reversal different from character reversal?", "Can I reverse text by multiple modes?", "What is reverse text used for?"],
    comparisons: ["reverse text vs reverse words", "reverse lines vs reverse characters", "text reverser vs text flipper", "reverse vs palindrome checker"],
    troubleshooting: ["reverse text not working with Unicode", "multi-byte characters breaking reversal", "whitespace not preserved in reversal", "line breaks lost in character reverse", "reverse result unexpected"],
    beginner: ["how to reverse text", "what is text reversal", "reverse string explained", "fun text reversal tricks"],
  },
  "remove-empty-lines": {
    primary: "remove empty lines",
    secondary: ["delete blank lines", "remove blank lines online", "strip empty lines", "clean blank lines tool", "remove whitespace lines"],
    longTail: ["how to remove empty lines from text online", "delete blank lines from text file", "remove empty lines including whitespace", "strip blank lines tool free", "clean up text by removing empty lines"],
    questions: ["How do I remove empty lines from text?", "What is the difference between empty and whitespace-only lines?", "How many lines were removed?", "Can I preserve line numbers after removal?", "Does removing empty lines affect formatting?"],
    comparisons: ["remove empty lines vs remove duplicate lines", "empty lines vs blank lines", "remove empty lines vs text cleaner", "line removal vs line trimming"],
    troubleshooting: ["lines with spaces not being removed", "empty lines at start of file not removed", "line count not updating correctly", "trailing whitespace lines issue", "removing too many lines"],
    beginner: ["why remove empty lines from text", "how to clean up text formatting", "blank lines in text files explained", "text cleanup basics"],
  },
  "text-cleaner": {
    primary: "text cleaner",
    secondary: ["clean text online", "text sanitizer tool", "remove extra spaces", "strip special characters", "text normalization tool"],
    longTail: ["how to clean text online free", "remove extra spaces from text", "strip special characters from string", "remove HTML tags from text", "clean and normalize text data"],
    questions: ["How do I clean text with multiple options?", "What does collapsing extra spaces do?", "How do I remove special characters?", "Can I remove HTML tags from text?", "What are smart quotes and why replace them?"],
    comparisons: ["text cleaner vs remove empty lines", "text sanitizer vs HTML stripper", "smart quotes vs straight quotes", "text normalization vs case conversion"],
    troubleshooting: ["special characters not all removed", "HTML tags partially removed", "URLs in text not detected", "smart quotes not replaced", "text cleaner too aggressive"],
    beginner: ["how to clean up text data", "text sanitization basics", "removing unwanted characters from text", "text preprocessing for analysis"],
  },
  "line-counter": {
    primary: "line counter",
    secondary: ["count lines online", "line count tool", "text line counter", "line statistics counter", "count lines in text"],
    longTail: ["how to count lines in text online", "line counter with statistics", "count total empty and non-empty lines", "measure average line length", "line counting tool free"],
    questions: ["How do I count lines in a text?", "What is the difference between total and non-empty lines?", "How is average line length calculated?", "What does unique lines mean?", "Can I see character count per line?"],
    comparisons: ["line counter vs word counter", "total lines vs non-empty lines", "line count vs character count", "line counter vs paragraph counter"],
    troubleshooting: ["line count not matching expectations", "empty lines not counted correctly", "very long lines breaking display", "line count real-time update lag", "large file line count performance"],
    beginner: ["what is line counting", "how to count lines in a document", "line statistics explained", "text analysis basics"],
  },
  "find-and-replace": {
    primary: "find and replace",
    secondary: ["find replace online", "search and replace text", "text replacer tool", "find replace words", "replace text in string"],
    longTail: ["how to find and replace text online", "search and replace with regex", "find replace case sensitive whole word", "replace all occurrences in text", "count replacements made tool"],
    questions: ["How do I find and replace text?", "What is the difference between normal and regex mode?", "How does whole word matching work?", "How many replacements were made?", "Can I undo a find and replace operation?"],
    comparisons: ["find replace vs text cleaner", "regex replace vs plain text replace", "case-sensitive vs case-insensitive find", "replace all vs replace one"],
    troubleshooting: ["find not matching expected text", "regex pattern not working", "replace removing wrong text", "special characters in find not escaping", "too many replacements made"],
    beginner: ["how to use find and replace", "search and replace basics", "text replacement guide", "find replace for editing"],
  },
  "text-splitter": {
    primary: "text splitter",
    secondary: ["split text online", "text delimiter splitter", "split string by delimiter", "text separator tool", "split text into items"],
    longTail: ["how to split text by delimiter online", "split comma separated text into lines", "split text by newline comma space", "preview split items tool", "output split text as JSON array"],
    questions: ["How do I split text by a delimiter?", "What delimiters can I use?", "What does trimming items do?", "Can I output as JSON array?", "How do I remove empty items after splitting?"],
    comparisons: ["text splitter vs text joiner", "split by comma vs newline", "delimiter split vs regex split", "text splitter vs CSV parser"],
    troubleshooting: ["delimiter not splitting correctly", "empty items in split result", "custom delimiter not working", "whitespace in split items", "special characters in delimiter"],
    beginner: ["how to split text into parts", "text splitting explained", "delimiters in text processing", "splitting strings basics"],
  },
  "text-joiner": {
    primary: "text joiner",
    secondary: ["join text online", "merge lines tool", "join with separator", "combine text lines", "text concatenation tool"],
    longTail: ["how to join lines of text with separator", "join text with comma space pipe", "add quotes around joined items", "prefix suffix join tool", "merge multiple lines into one"],
    questions: ["How do I join lines with a separator?", "What separators are available?", "Can I add quotes around each item?", "What are prefix and suffix options?", "How do I join text as a CSV line?"],
    comparisons: ["text joiner vs text splitter", "join with comma vs pipe", "text joiner vs CSV generator", "merge lines vs concatenate"],
    troubleshooting: ["joiner not adding separator correctly", "quotes not wrapping items properly", "prefix suffix not applied", "extra whitespace in joined result", "newlines preserved in output"],
    beginner: ["how to join text lines", "text joining explained", "concatenating strings with separators", "combining text for CSV"],
  },
  "excerpt-generator": {
    primary: "excerpt generator",
    secondary: ["text truncator", "generate excerpt online", "text excerpt tool", "summary excerpt generator", "truncate text to length"],
    longTail: ["how to generate text excerpt online", "truncate text by word count", "create excerpt with ellipsis", "break excerpt at sentence boundary", "excerpt generator with character limit"],
    questions: ["How do I generate an excerpt from text?", "What is the difference between word and character limits?", "How does sentence boundary detection work?", "Should I add an ellipsis to excerpts?", "How long should an excerpt be for SEO?"],
    comparisons: ["excerpt generator vs text summarizer", "word limit vs character limit", "ellipsis vs no ellipsis", "excerpt vs abstract"],
    troubleshooting: ["excerpt cutting off mid-sentence", "ellipsis not appearing correctly", "character count vs word count mismatch", "HTML tags in excerpt breaking display", "excerpt too short or too long"],
    beginner: ["what is a text excerpt", "how to write good excerpts", "excerpt length best practices", "using excerpts for SEO meta descriptions"],
  },
  "timestamp-converter": {
    primary: "timestamp converter",
    secondary: ["Unix timestamp converter", "epoch time converter", "date to timestamp", "timestamp to date online", "convert Unix time"],
    longTail: ["how to convert Unix timestamp to date online", "epoch converter milliseconds", "timestamp converter with timezone", "convert date to Unix timestamp free", "Unix time to human readable date"],
    questions: ["What is a Unix timestamp?", "How do I convert a timestamp to a date?", "What is the difference between seconds and milliseconds timestamps?", "How does the Unix epoch work?", "How do timestamps handle timezones?"],
    comparisons: ["Unix timestamp vs ISO 8601", "timestamp vs date string", "milliseconds vs seconds epoch", "Unix time vs UTC"],
    troubleshooting: ["timestamp decade off by factor 1000", "timezone conversion incorrect", "timestamp to date wrong year 1970", "leap second handling", "timestamp overflow for 2038 year"],
    beginner: ["what is Unix time", "how timestamps work", "epoch time explained", "understanding Unix timestamp format"],
  },

  // ── SEO Suite ─────────────────────────────────────────────────
  "robots-txt-generator": {
    primary: "robots.txt generator",
    secondary: ["generate robots.txt", "robots.txt file creator", "SEO crawler access tool", "robots.txt rules generator", "search engine crawler manager"],
    longTail: ["how to create a robots.txt file online", "generate robots.txt with disallow rules", "robots.txt allow and disallow paths", "set crawl delay in robots.txt", "add sitemap URL to robots.txt"],
    questions: ["What is a robots.txt file?", "How do I create a robots.txt file?", "What is the difference between Disallow and Allow?", "How do I set Crawl-delay in robots.txt?", "Where should I place my robots.txt file?"],
    comparisons: ["robots.txt vs meta robots tag", "Disallow vs Allow directives", "robots.txt vs sitemap.xml", "robots.txt vs X-Robots-Tag header"],
    troubleshooting: ["robots.txt not blocking crawlers", "robots.txt sitemap not found", "robots.txt syntax error", "robots.txt file ignored by Google", "Crawl-delay not being respected"],
    beginner: ["what is robots.txt", "how robots.txt works for SEO", "robots.txt best practices", "search engine crawlers explained"],
  },
  "sitemap-generator": {
    primary: "sitemap generator",
    secondary: ["XML sitemap generator", "create sitemap online", "sitemap.xml creator", "SEO sitemap tool", "generate sitemap for website"],
    longTail: ["how to generate an XML sitemap online", "create sitemap with priorities and changefreq", "sitemap generator for SEO indexing", "add lastmod dates to sitemap URLs", "generate sitemap with multiple URLs"],
    questions: ["What is an XML sitemap?", "How do I create a sitemap for my website?", "What are priority and changefreq in sitemaps?", "How many URLs can a sitemap contain?", "How do I submit my sitemap to Google?"],
    comparisons: ["XML sitemap vs HTML sitemap", "sitemap vs robots.txt", "priority vs changefreq", "sitemap vs RSS feed"],
    troubleshooting: ["sitemap not being indexed by Google", "sitemap URLs returning 404", "sitemap too large to process", "sitemap priority values ignored", "sitemap changefreq not working"],
    beginner: ["what is a sitemap", "why sitemaps matter for SEO", "how to create sitemap for Google", "XML sitemap best practices"],
  },
  "meta-tag-generator": {
    primary: "meta tag generator",
    secondary: ["HTML meta tags generator", "SEO meta tags creator", "meta description generator", "meta keywords tool", "OG meta tags generator"],
    longTail: ["how to generate SEO meta tags online", "create meta description and title tags", "generate OG tags for social sharing", "meta tag generator with Twitter cards", "HTML meta tags for SEO optimization"],
    questions: ["What are meta tags in HTML?", "How do I create SEO meta tags?", "What is the difference between meta description and OG description?", "What meta tags are important for SEO?", "How do I add Twitter card meta tags?"],
    comparisons: ["meta tags vs OG tags", "meta description vs meta keywords", "meta tags vs HTML headers", "meta robots vs X-Robots-Tag"],
    troubleshooting: ["meta tags not showing in search results", "OG tags not working on Facebook", "Twitter cards not rendering", "meta description too long", "meta viewport not working on mobile"],
    beginner: ["what are HTML meta tags", "SEO meta tags explained", "how to write good meta descriptions", "meta tags for social media sharing"],
  },
  "open-graph-generator": {
    primary: "Open Graph generator",
    secondary: ["OG tags generator", "social media meta tags", "Facebook OG tags", "Twitter card generator", "social share preview tool"],
    longTail: ["how to generate Open Graph tags online", "create OG tags for social media sharing", "preview how link looks on Facebook", "generate Twitter card meta tags", "Open Graph meta tags generator free"],
    questions: ["What is Open Graph protocol?", "How do I add OG tags to my website?", "What OG tags are required for social sharing?", "How do I preview my link on social media?", "What is the difference between og:image and twitter:image?"],
    comparisons: ["OG tags vs Twitter cards", "Open Graph vs JSON-LD", "og:image vs twitter:image", "Facebook OG vs LinkedIn OG"],
    troubleshooting: ["OG image not showing on Facebook", "Twitter card not rendering", "OG tags not being detected", "wrong title showing on social share", "OG description fallback issues"],
    beginner: ["what is Open Graph", "how social media meta tags work", "OG tags explained for beginners", "how to control link previews on social media"],
  },
  "schema-generator": {
    primary: "schema generator",
    secondary: ["JSON-LD generator", "structured data generator", "schema markup creator", "schema.org generator", "rich snippet markup tool"],
    longTail: ["how to generate JSON-LD schema markup online", "create schema for Article Product LocalBusiness", "generate FAQ schema markup", "schema generator for SEO rich snippets", "structured data markup tool free"],
    questions: ["What is JSON-LD schema markup?", "How do I add structured data to my website?", "What schema types should I use for SEO?", "How does schema markup affect search results?", "What is the difference between JSON-LD and microdata?"],
    comparisons: ["JSON-LD vs microdata", "schema.org vs RDFa", "Article schema vs BlogPosting schema", "Product schema vs Offer schema"],
    troubleshooting: ["schema markup not showing in search results", "JSON-LD syntax error", "rich snippet not appearing on Google", "schema validation failed", "multiple schemas on one page conflict"],
    beginner: ["what is schema markup", "JSON-LD explained for beginners", "how structured data helps SEO", "schema types for websites guide"],
  },
  "hreflang-generator": {
    primary: "hreflang generator",
    secondary: ["hreflang tags generator", "international SEO tags", "hreflang attribute generator", "multi-language SEO tool", "hreflang link tags creator"],
    longTail: ["how to generate hreflang tags online", "create hreflang for multiple languages", "add x-default hreflang tag", "hreflang generator for international SEO", "multi-region URL language tags"],
    questions: ["What are hreflang tags?", "How do I implement hreflang for multiple languages?", "What is the x-default hreflang tag?", "How many hreflang tags can I have per page?", "How do hreflang tags affect international SEO?"],
    comparisons: ["hreflang vs canonical tags", "hreflang vs content-language header", "hreflang vs redirect based on language", "x-default vs no hreflang tag"],
    troubleshooting: ["hreflang tags not being used by Google", "hreflang conflicting with canonical", "hreflang bidirectional link issues", "hreflang language code errors", "hreflang return tag verification failure"],
    beginner: ["what are hreflang tags", "international SEO explained", "multi-language website SEO guide", "hreflang implementation best practices"],
  },
  "canonical-generator": {
    primary: "canonical URL generator",
    secondary: ["canonical tag generator", "canonical URL creator", "rel canonical generator", "duplicate content canonical tool", "canonical link tag generator"],
    longTail: ["how to generate canonical URL tags online", "create self-referencing canonical URLs", "canonical URL with www vs non-www", "prevent duplicate content with canonical tags", "canonical URL trailing slash handling"],
    questions: ["What is a canonical URL?", "How do I use canonical tags to prevent duplicate content?", "What is a self-referencing canonical?", "Should I use www or non-www in canonical URLs?", "How does trailing slash affect canonical URLs?"],
    comparisons: ["canonical vs 301 redirect", "canonical vs noindex", "self-referencing vs cross-domain canonical", "canonical URL vs hreflang"],
    troubleshooting: ["canonical tag ignored by Google", "canonical URL pointing to 404", "multiple canonical tags on one page", "cross-domain canonical not working", "canonical vs pagination conflict"],
    beginner: ["what is a canonical URL", "duplicate content SEO explained", "how canonical tags prevent duplicate content", "canonical URL best practices"],
  },
  "redirect-checker": {
    primary: "redirect checker",
    secondary: ["URL redirect checker", "HTTP redirect tracer", "redirect chain checker", "301 redirect test", "redirect path analyzer"],
    longTail: ["how to check URL redirect chain online", "trace HTTP redirect path tool", "check if URL has redirects", "find final destination after redirects", "redirect chain status code checker"],
    questions: ["What is a URL redirect?", "How do I check if a URL has redirects?", "What is the difference between 301 and 302 redirects?", "How does a redirect chain affect SEO?", "What is a redirect loop and how do I detect it?"],
    comparisons: ["301 vs 302 redirect", "redirect vs canonical", "redirect chain vs direct URL", "HTTP redirect vs meta refresh redirect"],
    troubleshooting: ["redirect chain too long", "redirect loop detected", "301 redirect not working", "redirect not passing link equity", "mixed HTTP HTTPS redirect issues"],
    beginner: ["what is a redirect", "HTTP status codes for redirects", "301 vs 302 explained", "redirect chains and SEO impact"],
  },
  "broken-link-checker": {
    primary: "broken link checker",
    secondary: ["check broken links", "dead link finder", "broken URL checker", "link validator tool", "website link checker"],
    longTail: ["how to check multiple URLs for broken links", "find broken links on website tool", "check HTTP status codes for URLs", "test links for 404 errors", "broken link checker free online"],
    questions: ["What is a broken link?", "How do I check for broken links on my website?", "What causes broken links?", "How do broken links affect SEO?", "How often should I check for broken links?"],
    comparisons: ["broken link vs redirect", "404 vs 410 status code", "broken link checker vs redirect checker", "internal vs external broken links"],
    troubleshooting: ["false positive broken links", "URLs timing out vs actually broken", "CORS blocking link checking", "rate limiting when checking many URLs", "server-side vs client-side link checking"],
    beginner: ["what are broken links", "how broken links hurt SEO", "how to find dead links on website", "fixing broken links best practices"],
  },
  "serp-preview": {
    primary: "SERP preview",
    secondary: ["Google search preview", "meta description preview", "title tag preview", "search result preview tool", "Google snippet preview"],
    longTail: ["how to preview Google search results online", "preview how title appears in Google SERP", "test meta description length for SEO", "mobile vs desktop SERP preview", "Google search result snippet checker"],
    questions: ["How does Google display search results?", "What is the ideal title tag length for SEO?", "What is the ideal meta description length?", "How does mobile SERP differ from desktop?", "How can I optimize my search snippet?"],
    comparisons: ["desktop vs mobile SERP", "title tag vs H1 tag", "meta description vs page content snippet", "SERP preview vs Google Search Console"],
    troubleshooting: ["title tag truncated in SERP", "meta description not showing", "wrong snippet showing in Google", "title too long for mobile display", "SERP preview different from actual Google display"],
    beginner: ["what is SERP", "how Google search results work", "title tag optimization guide", "meta description best practices"],
  },

  // ── Image & Design Suite ──────────────────────────────────────
  "image-compressor": {
    primary: "image compressor",
    secondary: ["compress image online", "image compression tool", "reduce image file size", "JPEG PNG WebP compressor", "photo compressor free"],
    longTail: ["how to compress an image online free", "reduce JPEG file size without losing quality", "compress PNG image for website", "WebP image compressor tool", "image size reducer online"],
    questions: ["How much can I compress an image?", "Does image compression reduce quality?", "What is the best format for compressed images?", "How does image compression work?", "What is the difference between lossy and lossless compression?"],
    comparisons: ["image compressor vs image resizer", "JPEG vs PNG vs WebP compression", "lossy vs lossless compression", "image compression vs optimization"],
    troubleshooting: ["compressed image quality too low", "PNG compression not reducing size", "WebP format not supported", "image compression artifacts", "compressed file still too large"],
    beginner: ["what is image compression", "how to compress images for web", "best image format for compression", "image compression explained for beginners"],
  },
  "image-converter": {
    primary: "image converter",
    secondary: ["convert image to PNG", "convert image to JPEG", "convert image to WebP", "image format converter", "picture converter online"],
    longTail: ["how to convert image to PNG online free", "convert JPEG to WebP for better compression", "image converter between all formats", "convert PNG to ICO for favicon", "convert GIF to animated WebP"],
    questions: ["What image format should I use?", "How do I convert an image to WebP?", "What is the difference between PNG and JPEG?", "Can I convert a GIF to other formats?", "What is BMP format used for?"],
    comparisons: ["PNG vs JPEG vs WebP", "GIF vs animated WebP", "BMP vs PNG", "lossy vs lossless image formats"],
    troubleshooting: ["converted image has wrong colors", "transparent background lost in JPEG", "image conversion reduces quality", "converted file size too large", "format not supported after conversion"],
    beginner: ["image formats explained", "when to use PNG vs JPEG", "what is WebP format", "how to choose image format for web"],
  },
  "crop-image": {
    primary: "crop image online",
    secondary: ["image cropper", "crop picture tool", "crop photo to aspect ratio", "square crop image", "free image cropper"],
    longTail: ["how to crop an image to a specific aspect ratio", "crop image to 1:1 square for Instagram", "crop photo 16:9 widescreen", "crop image freeform dimensions", "online image cropping tool no upload"],
    questions: ["How do I crop an image online?", "What aspect ratio should I use?", "What is the rule of thirds in cropping?", "How do I crop an image to a specific size?", "What is the difference between cropping and resizing?"],
    comparisons: ["crop vs resize image", "1:1 vs 4:3 vs 16:9 aspect ratios", "freeform vs fixed ratio cropping", "crop vs rotate vs straighten"],
    troubleshooting: ["cropped image resolution too low", "aspect ratio not matching social media", "crop area not draggable", "cropped image quality loss", "selection handles not visible"],
    beginner: ["how to crop images for social media", "understanding aspect ratios", "crop vs resize explained", "best cropping practices for photos"],
  },
  "blur-image": {
    primary: "blur image online",
    secondary: ["image blur tool", "blur photo online", "Gaussian blur image", "blur part of image", "photo blur effect free"],
    longTail: ["how to blur an image online free", "blur image background online", "Gaussian blur effect for photos", "blur sensitive information in image", "adjustable blur radius tool"],
    questions: ["How do I blur an image online?", "What is Gaussian blur?", "How does blur radius affect the image?", "Can I blur only part of an image?", "What is the difference between blur and pixelate?"],
    comparisons: ["Gaussian blur vs box blur", "blur vs pixelate", "blur vs sharpen", "blur effect vs lens blur"],
    troubleshooting: ["blur effect too strong", "blur radius not enough", "blurred image quality poor", "blur not applying evenly", "download blurred image wrong format"],
    beginner: ["what is image blurring", "how to blur text in images", "Gaussian blur explained", "when to use blur effects"],
  },
  "watermark-image": {
    primary: "watermark image online",
    secondary: ["add watermark to image", "text watermark tool", "image copyright protection", "watermark photo online", "protect image with watermark"],
    longTail: ["how to add text watermark to image online free", "watermark images for copyright protection", "add transparent watermark to photo", "custom watermark text position opacity", "batch watermark images free tool"],
    questions: ["How do I add a watermark to an image?", "What is the best watermark position?", "What opacity should my watermark be?", "How do I protect my images from theft?", "What font should I use for watermarks?"],
    comparisons: ["text vs image watermark", "visible vs invisible watermark", "watermark vs copyright notice", "opaque vs transparent watermark"],
    troubleshooting: ["watermark too distracting", "watermark text not readable", "watermark position not visible", "watermark removed from image", "font not rendering correctly"],
    beginner: ["how to watermark photos", "best watermark practices", "watermark opacity tips", "protecting images with watermarks"],
  },
  "background-remover": {
    primary: "background remover",
    secondary: ["remove background from image", "chroma key removal", "green screen removal tool", "image background eraser", "remove photo background free"],
    longTail: ["how to remove background from image online free", "chroma key green screen removal tool", "remove image background without API key", "AI background removal alternative", "transparent background maker online"],
    questions: ["How do I remove a background from an image?", "What is chroma key?", "How does green screen removal work?", "Can I remove background without a green screen?", "What is the best tool for background removal?"],
    comparisons: ["chroma key vs AI background removal", "green screen vs blue screen", "background removal vs masking", "free vs paid background removal tools"],
    troubleshooting: ["background removal not clean", "green screen spill on subject", "hair fine details lost in removal", "background removal leaves halo", "transparent background not saving"],
    beginner: ["what is chroma key", "how green screen removal works", "background removal explained", "best practices for clean background removal"],
  },
  "image-metadata-viewer": {
    primary: "image metadata viewer",
    secondary: ["EXIF viewer online", "image metadata extractor", "photo metadata reader", "EXIF data viewer", "image information tool"],
    longTail: ["how to view EXIF data of an image online", "extract image metadata free tool", "view photo dimensions file size type", "check camera information from photo", "read EXIF metadata without uploading"],
    questions: ["What is EXIF data?", "What information is stored in image metadata?", "Can I view EXIF data online?", "What is the difference between EXIF and metadata?", "Does every image have metadata?"],
    comparisons: ["EXIF vs IPTC vs XMP", "image metadata vs file properties", "EXIF viewer vs photo editor", "JPEG vs PNG metadata support"],
    troubleshooting: ["EXIF data not found in image", "metadata stripped from image", "location data not showing", "camera information missing", "uploaded image loses EXIF"],
    beginner: ["what is EXIF metadata", "how to view photo information", "image file properties explained", "what data does your photo reveal"],
  },
  "image-to-base64": {
    primary: "image to Base64 converter",
    secondary: ["convert image to Base64", "image to Base64 online", "image to data URI", "encode image to Base64", "Base64 image encoder"],
    longTail: ["how to convert an image to Base64 string online", "image to Base64 data URI generator", "encode image for inline HTML CSS", "convert image to Base64 without uploading", "Base64 image encoder free tool"],
    questions: ["What is Base64 encoding for images?", "How do I convert an image to Base64?", "When should I use Base64 images?", "What is a data URI?", "Is Base64 encoding efficient for images?"],
    comparisons: ["Base64 image vs image URL", "inline Base64 vs external image", "Base64 vs binary image data", "Base64 vs WebP base64"],
    troubleshooting: ["Base64 string too long", "data URI not rendering in browser", "Base64 encoded size larger than original", "special characters in Base64 string", "image format lost after encoding"],
    beginner: ["what is Base64 encoding", "how data URIs work", "when to use inline images", "Base64 image pros and cons"],
  },
  "base64-to-image": {
    primary: "Base64 to image converter",
    secondary: ["decode Base64 to image", "Base64 image decoder", "Base64 string to image online", "data URI to image", "Base64 image viewer"],
    longTail: ["how to convert Base64 string to image online", "decode data URI to downloadable image", "Base64 to image converter free tool", "extract image from Base64 encoded string", "view Base64 image in browser"],
    questions: ["How do I convert Base64 to an image?", "What is a Base64 data URI?", "How do I know the image format from Base64?", "Can I download a Base64 image?", "What is the difference between Base64 with and without data URI prefix?"],
    comparisons: ["Base64 decode vs image download", "Base64 to image vs image to Base64", "data URI vs file URL", "Base64 with prefix vs raw Base64"],
    troubleshooting: ["invalid Base64 string error", "image not displaying after decode", "Base64 padding incorrect", "unknown image format from Base64", "decoded image corrupted"],
    beginner: ["how to decode Base64 images", "Base64 to image explained", "data URI format guide", "understanding Base64 image strings"],
  },
  "image-grayscale": {
    primary: "image grayscale converter",
    secondary: ["convert image to black and white", "grayscale image online", "photo to sepia converter", "black and white image tool", "image desaturate tool"],
    longTail: ["how to convert image to grayscale online free", "turn photo black and white effect", "apply sepia tone to image online", "grayscale image converter pixel manipulation", "before and after grayscale comparison"],
    questions: ["How do I convert an image to grayscale?", "What is the difference between grayscale and black and white?", "What is sepia effect?", "How does pixel manipulation work for grayscale?", "Can I compare original and grayscale side by side?"],
    comparisons: ["grayscale vs black and white", "grayscale vs sepia", "luminosity vs average grayscale", "desaturate vs grayscale conversion"],
    troubleshooting: ["grayscale conversion looks too dark", "sepia tone too warm", "image colors not fully removed", "grayscale banding artifacts", "download quality lower than original"],
    beginner: ["what is grayscale", "how to make photos black and white", "sepia effect explained", "grayscale vs color images"],
  },

  // ── PDF Suite ──────────────────────────────────────────────────
  "merge-pdf": {
    primary: "merge PDF",
    secondary: ["combine PDF files", "join PDF documents", "merge PDFs online", "PDF merger tool", "concatenate PDF files"],
    longTail: ["how to merge PDF files online free", "combine multiple PDFs into one", "merge PDF without uploading to server", "join PDF pages in any order", "free PDF merger tool no limits"],
    questions: ["How do I merge PDF files?", "Can I merge more than two PDFs at once?", "Does merging PDFs reduce quality?", "Can I reorder pages before merging?", "Is there a limit on PDF file size for merging?"],
    comparisons: ["merge PDF vs combine PDF", "merge PDF vs split PDF", "merge PDF vs concatenate PDF", "PDF merger vs PDF joiner"],
    troubleshooting: ["merged PDF pages out of order", "merged PDF file size too large", "PDF merge failed format error", "some pages missing after merge", "merged PDF corrupted or unreadable"],
    beginner: ["how to combine PDFs", "what is PDF merging", "merging PDF files explained", "PDF file management basics"],
  },
  "split-pdf": {
    primary: "split PDF",
    secondary: ["separate PDF pages", "extract PDF pages", "PDF page extractor", "split PDF by page range", "divide PDF into parts"],
    longTail: ["how to split a PDF into separate pages", "extract specific pages from PDF", "split PDF by page ranges online", "separate PDF pages into individual files", "free PDF splitter tool no limits"],
    questions: ["How do I split a PDF into separate pages?", "Can I split a PDF by custom page ranges?", "What is every N pages splitting?", "Does splitting a PDF affect quality?", "Can I split a password-protected PDF?"],
    comparisons: ["split PDF vs extract PDF pages", "split PDF vs merge PDF", "split by pages vs split by ranges", "PDF splitter vs PDF extractor"],
    troubleshooting: ["split PDF pages missing content", "split PDF file too large", "PDF split failed corrupted file", "page range splitting not working", "split PDF loses formatting"],
    beginner: ["how to separate PDF pages", "splitting PDF files explained", "PDF page extraction guide", "PDF document management basics"],
  },
  "compress-pdf": {
    primary: "compress PDF",
    secondary: ["reduce PDF size", "PDF file compressor", "shrink PDF file", "PDF optimizer online", "minimize PDF file size"],
    longTail: ["how to compress PDF file size online", "reduce PDF size without losing quality", "free PDF compressor tool no limits", "compress PDF for email attachment", "PDF optimization remove metadata"],
    questions: ["How do I compress a PDF?", "Does PDF compression reduce quality?", "How much can I compress a PDF?", "What is removed during PDF compression?", "Can I control the compression level?"],
    comparisons: ["compress PDF vs optimize PDF", "PDF compression vs image compression", "lossy vs lossless PDF compression", "compress PDF vs reduce PDF size"],
    troubleshooting: ["compressed PDF quality too low", "PDF compression not reducing size", "compressed PDF corrupted", "PDF compression very slow", "compressed file still too large"],
    beginner: ["what is PDF compression", "how to make PDF files smaller", "PDF optimization explained", "why PDF files are large"],
  },
  "pdf-to-jpg": {
    primary: "PDF to JPG converter",
    secondary: ["convert PDF to image", "PDF to JPEG converter", "extract images from PDF", "PDF page to JPG", "PDF to picture converter"],
    longTail: ["how to convert PDF to JPG online free", "convert PDF pages to high quality images", "extract PDF pages as JPG files", "PDF to image converter no upload", "convert specific PDF pages to JPG"],
    questions: ["How do I convert a PDF to JPG?", "Can I select which pages to convert?", "What resolution are the JPG images?", "Does PDF to JPG conversion lose quality?", "Can I convert scanned PDF to JPG?"],
    comparisons: ["PDF to JPG vs PDF to PNG", "PDF to image vs PDF extraction", "PDF to JPG vs screenshot", "PDF render vs image conversion"],
    troubleshooting: ["converted JPG quality too low", "PDF to JPG images blurred", "some pages not converting", "converted images too large", "PDF rendering incomplete in JPG"],
    beginner: ["how to extract images from PDF", "converting PDF pages to pictures", "PDF to image conversion explained", "when to convert PDF to JPG"],
  },
  "jpg-to-pdf": {
    primary: "JPG to PDF converter",
    secondary: ["convert image to PDF", "PNG to PDF converter", "image to PDF maker", "create PDF from images", "photo to PDF converter"],
    longTail: ["how to convert JPG to PDF online free", "create PDF from multiple images", "convert PNG images to PDF document", "arrange images before PDF conversion", "free image to PDF converter tool"],
    questions: ["How do I convert JPG to PDF?", "Can I convert multiple images to one PDF?", "What image formats are supported?", "Can I reorder images before conversion?", "Does image to PDF conversion reduce quality?"],
    comparisons: ["JPG to PDF vs PNG to PDF", "image to PDF vs document scanner", "multiple images to one PDF vs separate PDFs", "image to PDF vs photo to PDF"],
    troubleshooting: ["converted PDF image quality low", "images not fitting PDF page size", "PDF too large from many images", "image orientation wrong in PDF", "PNG transparency lost in PDF"],
    beginner: ["how to turn images into PDF", "creating PDF from photos", "image to PDF conversion guide", "when to convert images to PDF"],
  },
  "rotate-pdf": {
    primary: "rotate PDF",
    secondary: ["rotate PDF pages", "PDF page orientation", "rotate PDF document", "change PDF page rotation", "flip PDF pages"],
    longTail: ["how to rotate PDF pages online free", "rotate all pages in PDF at once", "rotate individual PDF pages 90 degrees", "fix PDF page orientation", "permanent PDF rotation tool"],
    questions: ["How do I rotate a PDF?", "Can I rotate individual pages?", "What rotation angles are available?", "Can I rotate all pages at once?", "Does rotating PDF affect quality?"],
    comparisons: ["rotate PDF vs rotate single page", "rotate 90 vs 180 vs 270 degrees", "rotate PDF vs flip PDF", "PDF rotation vs PDF reordering"],
    troubleshooting: ["rotated PDF pages not saving", "rotation angle not applying correctly", "rotated PDF text blurry", "all pages rotating instead of selected", "rotated PDF still shows wrong orientation"],
    beginner: ["how to fix PDF orientation", "rotating pages in a PDF", "PDF page orientation explained", "landscape vs portrait in PDF"],
  },
  "reorder-pdf": {
    primary: "reorder PDF pages",
    secondary: ["rearrange PDF pages", "PDF page organizer", "move PDF pages", "change page order in PDF", "sort PDF pages"],
    longTail: ["how to reorder pages in PDF online free", "rearrange PDF page order", "move pages up and down in PDF", "change page sequence in PDF document", "free PDF page reorder tool"],
    questions: ["How do I reorder pages in a PDF?", "Can I move multiple pages at once?", "Does reordering affect PDF content?", "Can I see thumbnails while reordering?", "How many pages can I reorder?"],
    comparisons: ["reorder PDF vs extract PDF pages", "reorder PDF vs rotate PDF", "page reordering vs drag and drop", "PDF page management tools"],
    troubleshooting: ["page order not updating correctly", "pages duplicate after reorder", "some pages missing after reorder", "reorder not saving changes", "PDF corrupted after page reorder"],
    beginner: ["how to change PDF page order", "rearranging PDF document pages", "PDF page management basics", "organizing PDF files"],
  },
  "extract-pdf-pages": {
    primary: "extract PDF pages",
    secondary: ["extract pages from PDF", "PDF page extractor", "select pages from PDF", "extract specific PDF pages", "PDF page picker tool"],
    longTail: ["how to extract specific pages from PDF online", "extract selected pages into new PDF", "choose which PDF pages to extract", "extract multiple non-consecutive PDF pages", "free PDF page extraction tool"],
    questions: ["How do I extract pages from a PDF?", "Can I select non-consecutive pages?", "Does extraction modify the original PDF?", "What format is the extracted PDF?", "Can I extract pages without uploading?"],
    comparisons: ["extract PDF pages vs split PDF", "extract pages vs copy pages", "extract PDF vs delete PDF pages", "page extraction vs document splitting"],
    troubleshooting: ["extracted PDF has wrong pages", "page selection not working", "extracted PDF corrupted", "extraction skips selected pages", "extracted file size too large"],
    beginner: ["how to extract pages from a PDF", "selecting specific PDF pages", "PDF page extraction guide", "working with PDF documents"],
  },
  "unlock-pdf": {
    primary: "unlock PDF",
    secondary: ["remove PDF password", "PDF password remover", "decrypt PDF file", "PDF unlocker tool", "remove PDF security"],
    longTail: ["how to unlock a password protected PDF", "remove PDF password protection online", "decrypt secured PDF file free", "unlock PDF with known password", "free PDF unlocker tool"],
    questions: ["How do I unlock a PDF?", "Do I need the original password?", "Does unlocking affect PDF content?", "Is it legal to unlock a PDF?", "Can I unlock any password protected PDF?"],
    comparisons: ["unlock PDF vs remove PDF password", "unlock PDF vs protect PDF", "decrypt PDF vs remove encryption", "PDF password removal vs recovery"],
    troubleshooting: ["PDF unlock failed wrong password", "unlocked PDF corrupted", "PDF still asking for password after unlock", "unlock not working for some PDFs", "PDF encryption method not supported"],
    beginner: ["how to unlock PDF files", "removing PDF password protection", "PDF security explained", "when you can unlock a PDF"],
  },
  "protect-pdf": {
    primary: "protect PDF",
    secondary: ["add password to PDF", "PDF encryption tool", "password protect PDF", "secure PDF document", "lock PDF with password"],
    longTail: ["how to password protect a PDF online", "add password to PDF file free", "encrypt PDF with user password", "secure PDF document with encryption", "free PDF protection tool no server upload"],
    questions: ["How do I password protect a PDF?", "What is the difference between user and owner password?", "Can I remove password protection later?", "Is PDF encryption secure?", "Can I set different passwords for viewing and editing?"],
    comparisons: ["protect PDF vs encrypt PDF", "user password vs owner password", "PDF encryption vs document security", "password protect vs digital signature"],
    troubleshooting: ["protected PDF not opening with password", "password protection not saving", "PDF encryption error", "password strength requirements", "protected PDF corrupted"],
    beginner: ["how to secure PDF files", "password protecting documents", "PDF encryption explained", "why protect PDF with password"],
  },
};

export function getKeywords(slug: string): KeywordCluster | null {
  return TOOL_KEYWORDS[slug] ?? null;
}

export function getAllPrimaryKeywords(): string[] {
  return Object.values(TOOL_KEYWORDS).map((k) => k.primary);
}

export function getAllQuestionKeywords(): string[] {
  const questions = new Set<string>();
  for (const cluster of Object.values(TOOL_KEYWORDS)) {
    for (const q of cluster.questions) {
      questions.add(q);
    }
  }
  return Array.from(questions);
}

export function getSecondaryKeywords(slug: string): string[] {
  return TOOL_KEYWORDS[slug]?.secondary ?? [];
}

export function getAllLongTailKeywords(): string[] {
  const keywords = new Set<string>();
  for (const cluster of Object.values(TOOL_KEYWORDS)) {
    for (const lt of cluster.longTail) {
      keywords.add(lt);
    }
  }
  return Array.from(keywords);
}

export function getKeywordDensity(slug: string): Record<string, number> {
  const cluster = TOOL_KEYWORDS[slug];
  if (!cluster) return {};
  const all = [cluster.primary, ...cluster.secondary, ...cluster.longTail, ...cluster.questions, ...cluster.comparisons, ...cluster.troubleshooting, ...cluster.beginner].join(" ").toLowerCase();
  const words = all.split(/\s+/);
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (w.length < 3) continue;
    freq[w] = (freq[w] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20));
}

export function findToolsByKeyword(query: string): string[] {
  const lower = query.toLowerCase();
  const results: string[] = [];
  for (const [slug, cluster] of Object.entries(TOOL_KEYWORDS)) {
    const all = [cluster.primary, ...cluster.secondary, ...cluster.longTail, ...cluster.questions, ...cluster.comparisons, ...cluster.troubleshooting, ...cluster.beginner].join(" ").toLowerCase();
    if (all.includes(lower)) {
      results.push(slug);
    }
  }
  return results;
}

export function getComparisonPairs(slug: string): Array<{ label: string; competitorSlug?: string }> {
  const cluster = TOOL_KEYWORDS[slug];
  if (!cluster) return [];
  return cluster.comparisons.map((c) => {
    const match = c.match(/vs\s+(.+)/i);
    return {
      label: c,
      competitorSlug: match ? match[1].toLowerCase().replace(/\s+/g, "-") : undefined,
    };
  });
}

export function getTroubleshootingQueries(slug: string): string[] {
  return TOOL_KEYWORDS[slug]?.troubleshooting ?? [];
}

export function getBeginnerQueries(slug: string): string[] {
  return TOOL_KEYWORDS[slug]?.beginner ?? [];
}
