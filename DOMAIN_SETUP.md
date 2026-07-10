# Domain Setup — Nuvora

## Buying a Domain

1. Choose a registrar: Namecheap, Cloudflare Registrar, Google Domains, Porkbun
2. Search for available domain: `Nuvora.dev`
3. Alternatives if taken: `Nuvora.io`, `Nuvora.app`, `Nuvora.net`
4. Enable auto-renew and privacy protection (WHOIS privacy)

## DNS Configuration for Vercel

### A Record (apex domain)
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   Auto / 300
```

### CNAME Record (www subdomain)
```
Type:   CNAME
Name:   www
Value:  cname.vercel-dns.com
TTL:    Auto / 300
```

### Alternative: Vercel Nameservers
Replace your registrar's nameservers with:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## Adding to Vercel

1. **Vercel Dashboard → Project → Settings → Domains**
2. Enter your domain: `Nuvora.dev`
3. Vercel will verify DNS configuration
4. Wait for SSL certificate provisioning (typically 1-5 minutes)

## WWW Redirect

Vercel handles this automatically when you add both `Nuvora.dev` and `www.Nuvora.dev` as domains and configure which is primary.

In **Vercel Dashboard → Project → Settings → Domains**:
- Add both `Nuvora.dev` and `www.Nuvora.dev`
- Set `Nuvora.dev` as the **default** domain
- Vercel will auto-redirect `www.Nuvora.dev` → `Nuvora.dev`

## Verification

```bash
# Test apex domain
curl -I https://Nuvora.dev

# Test www redirect
curl -I https://www.Nuvora.dev

# Test HTTPS
curl -I https://Nuvora.dev/robots.txt

# Expected: 200 OK with proper security headers
```
