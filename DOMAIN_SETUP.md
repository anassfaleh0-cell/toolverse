# Domain Setup — ToolVerse

## Buying a Domain

1. Choose a registrar: Namecheap, Cloudflare Registrar, Google Domains, Porkbun
2. Search for available domain: `toolverse.dev`
3. Alternatives if taken: `toolverse.io`, `toolverse.app`, `toolverse.net`
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
2. Enter your domain: `toolverse.dev`
3. Vercel will verify DNS configuration
4. Wait for SSL certificate provisioning (typically 1-5 minutes)

## WWW Redirect

Vercel handles this automatically when you add both `toolverse.dev` and `www.toolverse.dev` as domains and configure which is primary.

In **Vercel Dashboard → Project → Settings → Domains**:
- Add both `toolverse.dev` and `www.toolverse.dev`
- Set `toolverse.dev` as the **default** domain
- Vercel will auto-redirect `www.toolverse.dev` → `toolverse.dev`

## Verification

```bash
# Test apex domain
curl -I https://toolverse.dev

# Test www redirect
curl -I https://www.toolverse.dev

# Test HTTPS
curl -I https://toolverse.dev/robots.txt

# Expected: 200 OK with proper security headers
```
