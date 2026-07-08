interface MethodologySection {
  title: string;
  body: string;
}

export const METHODOLOGY: Record<string, MethodologySection[]> = {
  "dns-lookup": [
    { title: "How We Measure", body: "We send DNS queries to Google's public resolvers (8.8.8.8 and 8.8.4.4) using standard DNS protocol. We query A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, and CAA record types in parallel and aggregate the results." },
    { title: "Accuracy", body: "Results reflect the resolver's cached state at the time of query. TTL values determine caching duration, so records may differ from the authoritative source if recently changed. We display the resolver's response verbatim." },
    { title: "Limitations", body: "This tool performs recursive resolution only. It does not support direct authoritative queries, DNSSEC validation details, or zone transfers (AXFR). Some resolvers may rate-limit or block certain query types." },
    { title: "Privacy", body: "Queried domains are sent to our server which forwards them to Google DNS. We do not log domain names. No data is stored server-side." },
  ],
  "ping-test": [
    { title: "How We Measure", body: "We initiate TCP connections to the target host on port 80 (HTTP) or 443 (HTTPS) and measure the time to complete the three-way handshake. We send multiple probes (default 5) and report min, average, max, and jitter." },
    { title: "Accuracy", body: "TCP ping measures the same connection type used by web traffic, making it more representative of actual user experience than ICMP ping. Our servers are located in multiple regions, and results vary based on your geographic proximity to our infrastructure." },
    { title: "Limitations", body: "Browser limitations prevent raw ICMP packets. TCP ping requires the target to have the tested port open. Firewalls may block SYN probes or rate-limit connections, causing false packet loss. Some hosts deprioritize non-essential TCP handshakes." },
    { title: "Privacy", body: "Target hostnames are sent to our server for proxied TCP measurements. We do not store IP addresses or associate measurements with individual users." },
  ],
  "http-headers": [
    { title: "How We Measure", body: "We send an HTTP GET request to the target URL from our server and capture all response headers, status codes, redirect chain, TLS version, and response time. We follow redirects up to 10 hops." },
    { title: "Accuracy", body: "Headers are captured exactly as returned by the server, including duplicate headers. Response time includes network latency between our server and the target, plus server processing time." },
    { title: "Limitations", body: "This fetches headers from our server location, not from the user's browser. CDN-based sites may return different headers depending on the edge node. We do not execute JavaScript or render pages." },
    { title: "Privacy", body: "Target URLs are processed server-side. We do not store URLs or headers after the response is delivered to you." },
  ],
  whois: [
    { title: "How We Measure", body: "We query WHOIS servers using the domain's registry (e.g., Verisign for .com) and registrar WHOIS servers. Raw WHOIS text is parsed to extract structured fields like registrar, creation/expiry dates, and name servers." },
    { title: "Accuracy", body: "WHOIS data accuracy depends on the registrant's provided information. Many registrars offer WHOIS privacy/redaction services that mask personal data. Dates and status codes come directly from the registry." },
    { title: "Limitations", body: "Some TLDs (especially country codes) have restrictive WHOIS access or require CAPTCHA. Rate limiting may apply to repeated queries. Parsed fields may be incomplete for non-standard formats." },
    { title: "Privacy", body: "We query public WHOIS databases only. No personal data is stored on our servers. Queried domain names are transmitted to the respective WHOIS servers." },
  ],
  "ssl-certificate": [
    { title: "How We Measure", body: "We establish a TLS connection to the target host on port 443 (configurable) and retrieve the server's certificate chain. We validate the certificate against current system roots and check expiration dates, subject alternative names, and signature algorithms." },
    { title: "Accuracy", body: "Certificate data is read directly from the TLS handshake. Expiry dates use the server's certificate validity period. We report the raw certificate fields as presented by the server." },
    { title: "Limitations", body: "We do not perform full certificate revocation checks (CRL/OCSP). Some misconfigured servers may present incomplete certificate chains. We do not test cipher suite support or protocol vulnerabilities." },
    { title: "Privacy", body: "Target hostnames are processed server-side for the TLS handshake. Certificate data is ephemeral and not stored server-side." },
  ],
};
