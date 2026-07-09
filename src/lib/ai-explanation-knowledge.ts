export interface KnowledgeEntry {
  explanation: string;
  whyBad?: string;
  howToFix?: string;
  nextStep?: string;
  beginnerExplanation?: string;
  expertCommands?: string[];
  rfcReferences?: { name: string; url: string }[];
  copySummary?: string;
}

const KNOWLEDGE: Record<string, KnowledgeEntry> = {
  "dns-lookup": {
    explanation:
      "A DNS lookup queries the global Domain Name System hierarchy to retrieve records for a domain. Each record type serves a specific purpose: A records map hostnames to IPv4 addresses, MX records route email, and TXT records carry verification and policy data.",
    whyBad:
      "DNS misconfigurations can cause website outages, email delivery failures, and security vulnerabilities. A missing A record takes your site offline, a wrong MX record breaks email, and an incorrect CNAME can create resolution loops.",
    howToFix:
      "Verify each record type matches your expected configuration. Check A records point to correct IPs, MX records point to valid mail servers with correct priorities, and TXT records contain valid SPF, DKIM, and DMARC policies.",
    nextStep:
      "Use our DNSSEC Checker to verify cryptographic signing, Nameserver Analyzer to check redundancy, and Email Deliverability Checker for a comprehensive email health audit.",
    beginnerExplanation:
      "Think of DNS as the phonebook of the internet. When you type a domain name, DNS looks up the number (IP address) so your browser can connect. A DNS lookup shows you all the different types of records a domain has.",
    expertCommands: [
      "dig example.com ANY",
      "dig example.com A +short",
      "nslookup -type=MX example.com",
      "dig example.com TXT",
    ],
    rfcReferences: [
      { name: "RFC 1035 — Domain Names", url: "https://datatracker.ietf.org/doc/html/rfc1035" },
      { name: "RFC 2181 — DNS Specifications", url: "https://datatracker.ietf.org/doc/html/rfc2181" },
    ],
    copySummary:
      "DNS Lookup retrieved all configured records for the queried domain. Each record type serves a distinct purpose — A/AAAA for connectivity, MX for mail routing, TXT for verification. Review any missing or unexpected records and correct them at your DNS provider.",
  },

  "ssl-certificate-checker": {
    explanation:
      "An SSL Certificate Checker examines the TLS certificate presented by a server. It validates the certificate chain, checks expiration dates, issuer details, subject alternative names, and cryptographic parameters to confirm the connection is secure.",
    whyBad:
      "An expired, misconfigured, or invalid SSL certificate causes browsers to show security warnings, scaring away visitors. It also means data in transit is not properly encrypted, exposing sensitive information to interception.",
    howToFix:
      "Renew expired certificates before they expire. Ensure the certificate covers all domain variants (www and non-www) in the SANs field. Use a trusted Certificate Authority and install the full certificate chain including intermediate certificates.",
    nextStep:
      "Set up automated certificate renewal with Let's Encrypt or your CA's auto-renewal. Run our SSL Test for a deep inspection of cipher suites, protocol support, and security vulnerabilities.",
    beginnerExplanation:
      "SSL certificates are like digital ID cards for websites. They prove your site is really yours and encrypt the connection so hackers can't steal data. This tool checks if that ID card is valid and up to date.",
    expertCommands: [
      "openssl s_client -connect example.com:443 -servername example.com",
      "echo | openssl s_client -showcerts -connect example.com:443 2>/dev/null | openssl x509 -text",
      "curl -vI https://example.com 2>&1 | grep -i 'ssl\\|tls\\|certificate'",
    ],
    rfcReferences: [
      { name: "RFC 5246 — TLS 1.2", url: "https://datatracker.ietf.org/doc/html/rfc5246" },
      { name: "RFC 8446 — TLS 1.3", url: "https://datatracker.ietf.org/doc/html/rfc8446" },
      { name: "RFC 5280 — PKIX Certificate", url: "https://datatracker.ietf.org/doc/html/rfc5280" },
    ],
    copySummary:
      "SSL Certificate Checker validated the TLS certificate for the domain. Checks included expiration date, issuer chain, subject alternative names, and cryptographic strength. Ensure certificates are renewed before expiry and cover all subdomains.",
  },

  "whois-lookup": {
    explanation:
      "A WHOIS lookup queries domain registration databases to retrieve information about a domain's owner, registrar, registration and expiration dates, name servers, and administrative contacts. This data is maintained by ICANN-accredited registrars.",
    whyBad:
      "Expired or incorrectly registered domains can be hijacked by squatters or malicious actors. Incorrect WHOIS data may also result in domain suspension under ICANN rules, disrupting your online presence.",
    howToFix:
      "Keep your contact information up to date with your registrar. Enable auto-renewal to prevent accidental expiration. Use WHOIS privacy protection to shield personal details from public databases.",
    nextStep:
      "Check your domain's DNS health with our DNS Lookup, verify DNSSEC signing, and use our Domain Report Card for a comprehensive audit of your domain configuration.",
    beginnerExplanation:
      "WHOIS is like a public record of who owns a domain name. It shows when it was registered, when it expires, and who to contact about it. This tool looks up that information so you can verify domain ownership and expiration dates.",
    expertCommands: [
      "whois example.com",
      "jwhois example.com",
    ],
    rfcReferences: [
      { name: "RFC 3912 — WHOIS Protocol", url: "https://datatracker.ietf.org/doc/html/rfc3912" },
      { name: "RFC 7480 — RDAP", url: "https://datatracker.ietf.org/doc/html/rfc7480" },
    ],
    copySummary:
      "WHOIS Lookup retrieved domain registration details including registrar, creation and expiration dates, name servers, and contact information. Verify these details are accurate and enable auto-renewal to prevent domain lapse.",
  },

  "http-headers-checker": {
    explanation:
      "An HTTP Headers Checker fetches the response headers from a URL to reveal the server software, content type, caching policy, security headers (like HSTS and CSP), redirect chain, and response timing information.",
    whyBad:
      "Missing security headers like Content-Security-Policy and X-Frame-Options leave your site vulnerable to XSS and clickjacking attacks. Poor caching headers hurt performance, and missing CORS headers break API integrations.",
    howToFix:
      "Add security headers: Strict-Transport-Security (HSTS), Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy. Set proper Cache-Control headers for static assets. Configure CORS headers for API endpoints.",
    nextStep:
      "Use our Security Headers tool for a detailed security header analysis. Run our SSL Test to ensure HTTPS is properly configured, and use our Redirect Checker to audit redirect chains.",
    beginnerExplanation:
      "HTTP headers are like the envelope of a web request — they contain instructions for your browser about how to handle the content. This tool checks those instructions to make sure your website is secure, fast, and configured correctly.",
    expertCommands: [
      "curl -I https://example.com",
      "curl -v https://example.com 2>&1 | grep '^<' ",
      "curl -sI https://example.com | grep -i 'security\\|cache\\|cors'",
    ],
    rfcReferences: [
      { name: "RFC 7230 — HTTP/1.1 Message", url: "https://datatracker.ietf.org/doc/html/rfc7230" },
      { name: "RFC 6797 — HSTS", url: "https://datatracker.ietf.org/doc/html/rfc6797" },
      { name: "RFC 6454 — CSP", url: "https://datatracker.ietf.org/doc/html/rfc6454" },
    ],
    copySummary:
      "HTTP Headers Checker analyzed the response headers from the target URL. The check covered security headers, caching directives, CORS policies, and server information. Add missing security headers and optimize caching for better performance and protection.",
  },

  "port-checker": {
    explanation:
      "A Port Checker tests whether a specific network port is open on a target host. It attempts a TCP connection to the specified port and reports whether the port is open, closed, or filtered by a firewall, along with service identification.",
    whyBad:
      "An open port that should be closed is a security risk — attackers can use it to gain unauthorized access. A closed port that should be open means a critical service (like web server or email) is unreachable.",
    howToFix:
      "Close unnecessary open ports via your firewall or cloud security group settings. For ports that should be open, verify the service is running and listening, the firewall allows inbound traffic, and there are no network ACLs blocking access.",
    nextStep:
      "Run a full port scan (1-1024) to inventory all exposed services. Use our Blacklist Check to see if your IP is flagged, and our SSL Certificate Checker for any open web ports.",
    beginnerExplanation:
      "Think of ports like doors into a computer. Some doors should be open (like the front door for a website), but others should stay locked. This tool tests which doors are open and whether they should be.",
    expertCommands: [
      "nc -zv example.com 80",
      "nmap -p 80,443 example.com",
      "telnet example.com 22",
      "curl -v telnet://example.com:22",
    ],
    rfcReferences: [
      { name: "RFC 793 — TCP", url: "https://datatracker.ietf.org/doc/html/rfc793" },
      { name: "IANA Service Name Registry", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml" },
    ],
    copySummary:
      "Port Checker tested whether the specified TCP ports are open on the target host. Open ports were identified with their associated services. Close any unnecessary ports and ensure required services are reachable through firewall rules.",
  },

  "spf-lookup": {
    explanation:
      "SPF (Sender Policy Framework) is a DNS TXT record that lists which mail servers are allowed to send email for your domain. When a receiving server gets an email, it checks the SPF record of the sending domain to verify authorization.",
    whyBad:
      "A missing or misconfigured SPF record means anyone can send email pretending to be from your domain. This enables phishing attacks, damages your domain reputation, and causes legitimate emails to land in spam folders.",
    howToFix:
      "Create an SPF record that includes all legitimate sending sources: your web server, email provider (Google, Microsoft), marketing platforms, and transactional email services. End with -all (hard fail) for maximum protection. Stay under the 10 DNS lookup limit.",
    nextStep:
      "After fixing SPF, set up DKIM signing for your email, then create a DMARC record with p=quarantine to start monitoring. Gradually move to p=reject as you verify all legitimate email is authenticated.",
    beginnerExplanation:
      "SPF is like a guest list for your domain's email. It tells the internet which servers are allowed to send email from your domain. Without it, anyone can send fake emails that look like they're from you.",
    expertCommands: [
      "nslookup -type=TXT example.com",
      "dig example.com TXT +short",
      "dig spf.example.com SPF +short (legacy)",
    ],
    rfcReferences: [
      { name: "RFC 7208 — SPF", url: "https://datatracker.ietf.org/doc/html/rfc7208" },
      { name: "RFC 4408 — SPF Record", url: "https://datatracker.ietf.org/doc/html/rfc4408" },
    ],
    copySummary:
      "SPF Lookup checked the Sender Policy Framework record for the domain. The record authorizes specific mail servers to send email on behalf of the domain. Ensure all legitimate sending sources are included and end with -all for strong protection.",
  },

  "dkim-lookup": {
    explanation:
      "DKIM (DomainKeys Identified Mail) adds a cryptographic signature to every outgoing email. The signature is created with a private key on your mail server, and verified by receivers using your public key published in DNS.",
    whyBad:
      "Missing DKIM means email authentication is incomplete. Even with SPF, an attacker can spoof the From header while using their own Return-Path. DKIM prevents this by cryptographically signing the email content.",
    howToFix:
      "Enable DKIM signing in your email provider's settings. Each provider has a specific selector (Google uses 'google', Microsoft uses 'selector1'/'selector2'). Publish the public key at {selector}._domainkey.yourdomain.com.",
    nextStep:
      "Verify your DKIM selector name with your email provider, publish the correct TXT record, and test with our DKIM Validator. Then configure DMARC with p=quarantine to enforce authentication.",
    beginnerExplanation:
      "DKIM is like a wax seal on an email. It proves the email was really sent by you and wasn't tampered with along the way. This tool checks if your domain has that seal properly set up.",
    expertCommands: [
      "nslookup -type=TXT default._domainkey.example.com",
      "dig default._domainkey.example.com TXT +short",
      "openssl rsa -pubin -in dkim.pub -text -noout",
    ],
    rfcReferences: [
      { name: "RFC 6376 — DKIM", url: "https://datatracker.ietf.org/doc/html/rfc6376" },
      { name: "RFC 5863 — DKIM Deployment", url: "https://datatracker.ietf.org/doc/html/rfc5863" },
    ],
    copySummary:
      "DKIM Lookup checked the DKIM public key record for the specified selector. DKIM cryptographically signs outgoing email so receivers can verify authenticity. Enable DKIM signing in your email provider and publish the correct DNS record.",
  },

  "dmarc-lookup": {
    explanation:
      "DMARC (Domain-based Message Authentication, Reporting & Conformance) builds on SPF and DKIM. It tells receivers what to do when an email claims to be from your domain but fails authentication, and provides reports on email sources.",
    whyBad:
      "Without a DMARC policy, receivers make their own decisions about unauthenticated email. Most will deliver it, including phishing emails that spoof your domain. You also miss visibility into which services send email for your domain.",
    howToFix:
      "Start with p=none to collect data without disrupting email flow. Set rua= with your email address to receive aggregate reports. Review reports for 2-4 weeks, identify all legitimate email sources, then move to p=quarantine, then p=reject.",
    nextStep:
      "Configure your reports email address to accept DMARC reports. Services like Postmark, EasyDMARC, or dmarcian can parse the XML reports and show you actionable data.",
    beginnerExplanation:
      "DMARC is like a security guard for your email. It tells other email servers what to do with emails that claim to be from you but don't have the right ID. It also sends you reports about who's trying to send email as you.",
    expertCommands: [
      "nslookup -type=TXT _dmarc.example.com",
      "dig _dmarc.example.com TXT +short",
      "curl -s https://dmarcian.com/dmarc-parser/ | grep -i rua",
    ],
    rfcReferences: [
      { name: "RFC 7489 — DMARC", url: "https://datatracker.ietf.org/doc/html/rfc7489" },
      { name: "RFC 7960 — DMARC Reporting", url: "https://datatracker.ietf.org/doc/html/rfc7960" },
    ],
    copySummary:
      "DMARC Lookup checked the DMARC policy record for the domain. The record defines how receivers should handle email that fails SPF or DKIM checks. Start with p=none for monitoring, then progress to p=reject for full protection.",
  },

  "bimi-lookup": {
    explanation:
      "BIMI (Brand Indicators for Message Identification) lets you display your brand logo next to authenticated emails in supporting email clients. It requires valid DMARC enforcement (p=quarantine or p=reject) and a SVG logo hosted at a specific DNS location.",
    whyBad:
      "Without BIMI, you miss a branding opportunity in the inbox. Authenticated emails show only a generic icon or initial, reducing brand recognition and trust with your recipients.",
    howToFix:
      "First ensure DMARC is set to p=quarantine or p=reject. Create an SVG logo file and host it at a publicly accessible URL. Publish a BIMI TXT record at default._bimi.yourdomain.com pointing to your logo URL and optional VMC certificate.",
    nextStep:
      "Verify your BIMI record with our lookup tool. Check that your logo meets the SVG requirements (small file size, no external resources). Consider getting a Verified Mark Certificate (VMC) for the blue checkmark in Gmail.",
    beginnerExplanation:
      "BIMI puts your brand logo next to your emails in Gmail and other email clients. It's like having a verified badge that shows recipients your email is authentic and trustworthy.",
    expertCommands: [
      "dig default._bimi.example.com TXT +short",
      "nslookup -type=TXT default._bimi.example.com",
    ],
    rfcReferences: [
      { name: "BIMI Working Group", url: "https://bimigroup.org/" },
    ],
    copySummary:
      "BIMI Lookup checked the BIMI record for the domain. BIMI displays your brand logo next to authenticated emails. Ensure DMARC enforcement is active and your SVG logo is hosted correctly per BIMI specifications.",
  },

  "mx-lookup": {
    explanation:
      "An MX (Mail Exchange) lookup retrieves the mail server records for a domain. Each MX record has a priority value — lower numbers are tried first. These records determine where email sent to your domain is delivered.",
    whyBad:
      "Missing or incorrect MX records mean your domain cannot receive email. A single MX record provides no redundancy — if that server goes down, email bounces. Misconfigured priorities can route mail to wrong servers.",
    howToFix:
      "Add at least two MX records with different priority values for redundancy. Point to your email provider's mail servers (Google Workspace, Microsoft 365, etc.). Verify the hostnames resolve to valid IPs.",
    nextStep:
      "After fixing MX records, set up SPF, DKIM, and DMARC to protect outgoing email. Use our Email Deliverability Checker for a complete email health assessment.",
    beginnerExplanation:
      "MX records tell the internet where to deliver email sent to your domain. They're like the mailing address for your email. If they're wrong, people can't send you email.",
    expertCommands: [
      "nslookup -type=MX example.com",
      "dig example.com MX +short",
      "host -t MX example.com",
    ],
    rfcReferences: [
      { name: "RFC 5321 — SMTP", url: "https://datatracker.ietf.org/doc/html/rfc5321" },
      { name: "RFC 974 — Mail Routing", url: "https://datatracker.ietf.org/doc/html/rfc974" },
    ],
    copySummary:
      "MX Lookup queried the Mail Exchange records for the domain. These records route incoming email to the correct mail servers. Ensure at least two MX records with different priorities exist for redundancy.",
  },

  "ping-test": {
    explanation:
      "A Ping Test sends ICMP echo requests to a target host and measures the round-trip time. It provides min, max, average latency, packet loss percentage, and jitter statistics to assess network connectivity and performance.",
    whyBad:
      "High latency causes slow application performance and poor user experience. Packet loss leads to retransmissions, timeouts, and unreliable connections. Jitter disrupts real-time applications like VoIP and video conferencing.",
    howToFix:
      "Investigate network congestion, upgrade your internet plan, or switch to a wired connection. For server-side issues, check bandwidth usage, optimize routing, and contact your hosting provider. Use a CDN to reduce latency for global users.",
    nextStep:
      "Run our Traceroute tool to identify where latency or packet loss occurs along the network path. Use our Bandwidth Calculator to ensure your connection meets your needs.",
    beginnerExplanation:
      "Ping is like sending a message and timing how long it takes to come back. It shows how fast your connection is to a server and whether any messages get lost along the way.",
    expertCommands: [
      "ping -n 10 example.com",
      "ping -c 10 example.com",
      "fping -c 5 example.com",
    ],
    rfcReferences: [
      { name: "RFC 792 — ICMP", url: "https://datatracker.ietf.org/doc/html/rfc792" },
    ],
    copySummary:
      "Ping Test measured latency and packet loss to the target host. Results include minimum, average, and maximum round-trip times. High latency or packet loss indicates network issues that may require ISP or hosting provider intervention.",
  },

  "traceroute": {
    explanation:
      "A Traceroute maps the network path from your location to a target host by sending packets with increasing TTL (Time To Live) values. Each hop reveals the intermediate routers, their IP addresses, and response times.",
    whyBad:
      "High latency at specific hops indicates congestion or routing problems. Routing loops or timeouts suggest misconfigured routers. Unexpected geographical routing indicates BGP issues that slow down connections.",
    howToFix:
      "Contact your ISP if the problem is in their network (first 2-3 hops). For issues at your hosting provider's network, submit a support ticket with traceroute output. Consider using a CDN or different hosting region.",
    nextStep:
      "Use our Ping Test to monitor latency over time. Check our DNS Lookup to ensure proper DNS resolution, and run our Website Status Checker to verify overall availability.",
    beginnerExplanation:
      "Traceroute shows the path your data takes across the internet to reach a destination, like a map of every stop along the way. It helps find where slowdowns happen.",
    expertCommands: [
      "tracert example.com",
      "traceroute example.com",
      "mtr example.com",
    ],
    rfcReferences: [
      { name: "RFC 792 — ICMP", url: "https://datatracker.ietf.org/doc/html/rfc792" },
      { name: "RFC 1393 — Traceroute", url: "https://datatracker.ietf.org/doc/html/rfc1393" },
    ],
    copySummary:
      "Traceroute mapped the network path to the target host showing each intermediate router hop with response times. High latency at specific hops helps identify where network congestion or routing problems occur.",
  },

  "website-status-checker": {
    explanation:
      "A Website Status Checker tests if a website is online and responding correctly. It checks the HTTP status code, measures response time, identifies the server software, content type, and performs a basic connectivity test.",
    whyBad:
      "A website that is down loses visitors, revenue, and search engine rankings. Slow response times frustrate users and hurt conversion rates. Non-200 status codes (like 404 or 500) indicate broken pages or server errors.",
    howToFix:
      "Check your hosting dashboard for resource usage or downtime alerts. Restart your web server if needed. For 5xx errors, check server logs. For 404 errors, implement proper redirects. Use a CDN and caching to improve response times.",
    nextStep:
      "Set up uptime monitoring to get alerted when your site goes down. Use our SSL Certificate Checker to validate your certificate, and our HTTP Headers Checker to audit security headers.",
    beginnerExplanation:
      "This tool tells you if a website is working properly. It checks if the site is online, how fast it loads, and whether it returns any errors. Think of it as a quick health check for any website.",
    expertCommands: [
      "curl -o /dev/null -s -w '%{http_code} %{time_total}\\n' https://example.com",
      "curl -sI https://example.com | head -n 20",
      "curl -w '@curl-format.txt' -o /dev/null -s https://example.com",
    ],
    rfcReferences: [
      { name: "RFC 7231 — HTTP Semantics", url: "https://datatracker.ietf.org/doc/html/rfc7231" },
      { name: "RFC 2616 — HTTP/1.1", url: "https://datatracker.ietf.org/doc/html/rfc2616" },
    ],
    copySummary:
      "Website Status Checker tested the target URL for availability, HTTP status code, and response time. A healthy site returns a 2xx or 3xx status code within an acceptable time. Investigate non-2xx codes and optimize slow responses.",
  },

  "domain-report": {
    explanation:
      "The Domain Report Card provides a comprehensive A–F graded assessment of a domain's DNS health, SSL certificate, HTTP security headers, WHOIS registration, website status, and response time in a single unified report.",
    whyBad:
      "A poor domain report grade means multiple issues across DNS, SSL, and HTTP configuration combine to hurt your website's security, performance, and reliability. Each failing grade represents a specific problem that needs attention.",
    howToFix:
      "Address each failing component in order of severity: fix DNS records first, then SSL certificate, then HTTP security headers. Use the individual tool links in the report for detailed guidance on each section.",
    nextStep:
      "Run individual tools (DNS Lookup, SSL Certificate Checker, HTTP Headers Checker) for deeper analysis of each graded area. Re-run the Domain Report Card after fixes to see your improved grade.",
    beginnerExplanation:
      "This is like a report card for your website. It checks all the important things — DNS, SSL, security, performance — and gives each one a letter grade from A to F. It shows you exactly what's working and what needs fixing.",
    expertCommands: [
      "dig example.com ANY +short",
      "curl -sI https://example.com",
      "openssl s_client -connect example.com:443 -servername example.com",
    ],
    rfcReferences: [
      { name: "RFC 1035 — DNS", url: "https://datatracker.ietf.org/doc/html/rfc1035" },
      { name: "RFC 8446 — TLS 1.3", url: "https://datatracker.ietf.org/doc/html/rfc8446" },
      { name: "RFC 6797 — HSTS", url: "https://datatracker.ietf.org/doc/html/rfc6797" },
    ],
    copySummary:
      "Domain Report Card graded the domain across DNS health, SSL certificate validity, HTTP security headers, WHOIS status, website availability, and response time. Address failing grades starting with DNS, then SSL, then HTTP headers, then re-run the report to track improvement.",
  },
};

export function getKnowledgeForTool(toolSlug: string): KnowledgeEntry | undefined {
  return KNOWLEDGE[toolSlug];
}
