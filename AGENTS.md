<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Session Summary — Emoji-to-Lucide Icon Unification (Complete)

### Objective
Replace every functional emoji-as-icon sitewide with lucide-react SVG icons. The only emoji that remain are:
- **Flag emoji** in IP lookup data (geolocation display)
- **Brand logos** in TrustBar (⚛🌊⚙⚡ for React/Tailwind/WASM/Workers)
- **Plain text markers** in table cells, close buttons, and config data
- **SVG diagram** (DNS visualization — inline SVG paths would be impractical)
- **Database reference data** (HTML entities, article content)

### What was done

**1. Infrastructure (commit pending)**
- Installed `lucide-react`
- Created `src/components/shared/icon.tsx` — `<Icon name={string}>` renderer with 80+ lucide mappings + 30+ semantic aliases
- Graceful fallback renders unknown names as text (safety net)

**2. Core data layer**
- `categories.ts` — 31 category icons emoji→lucide
- `page.tsx` — removed hardcoded CATEGORY_ICONS map, uses `cat.icon` from data; FEATURED_TOOLS (8 icons) replaced; TrustBar brand emoji preserved
- `HomeSearchBar.tsx` — CATEGORY_ICONS dynamically derived from CATEGORIES data

**3. Shared UI components**
- `related-tools.tsx` — already used `<Icon name={...} />` ✓
- `tool-result-card.tsx` — already used `<Icon name={...} />` ✓
- `hero.tsx` — trust badges already updated ✓
- `report-card.tsx` — WHOIS/Status/Ping icons + category icon render updated

**4. Tool pages (93 files, 385 emoji replaced)**
- All RelatedTools arrays in tool pages converted via batch script
- Toolkit pages (developer, network, seo, security) updated
- Troubleshooting pages (ssl-certificate, dns-propagation) updated
- Decision tree pages updated
- `500-tool-roadmap/page.tsx` — 21 unicode emoji→lucide
- `category/[slug]/page.tsx` — "⭐"→"Star"

**5. IP & status components**
- `ip-display.tsx` — 17 ToolResultCard icons replaced (flag emoji kept)
- `ip-lookup-results.tsx` — 16 icons replaced (flag emoji kept)
- `website-status.tsx`, `UptimeChecker.tsx` — status icons return lucide names
- `dkim-validator.tsx`, `dns-propagation.tsx` — status emoji→lucide
- `ai-explanation-card.tsx`, `spf-generator.tsx`, `email-auth-lookup.tsx` — severity badges use `<Icon>`

**6. Remaining emoji (preserved intentionally — 16 files, all non-icon)**
| File | Emoji | Reason |
|------|-------|--------|
| `app/page.tsx` | ⚛🌊⚙⚡ | TrustBar brand logos |
| `lib/tools-config.ts` | 😊😐😞⚠✅ | Tool config status values |
| `lib/databases/html-entities.ts` | ♠♣♥♦ | HTML entity reference data |
| `lib/ip-lookup-utils.ts`, `dns-propagation.tsx` | 🏳🇺🇸🇨🇭🇪🌍 | Flag emoji in geo data |
| `app/html-entity-encoder/page.tsx` | 😀😎 | HTML entity example text |
| `components/shared/newsletter-signup.tsx` | 🎉 | Decorative text in message |
| `components/dns-lookup/dns-lookup.tsx` | ✓ | Simple text checkmark badge |
| `components/shared/comparison-matrix.tsx` | ✓✗ | Table cell text markers |
| `components/network/blacklist-check.tsx` | ☒☐✓ | Plain-text export formatting |
| `components/pdf-suite/compress-pdf.tsx` | ✗ | File progress text marker |
| `components/url-parser/url-parser.tsx` | ✕ | Close button label |
| `lib/content/data/articles-cluster-13.ts` | 🚀 | Article content |

### Verification
- `tsc --noEmit` passes clean
- All 80+ lucide component names verified in iconMap
- Spot-checked sample converted tools: whois-lookup, barcode-generator, dns-lookup, ip-lookup — all RelatedTools use lucide names

### Design System Foundation (committed earlier)
- `nuvora-card`, `nuvora-button-primary`, `nuvora-shine`, `glow-pulse`, `nuvora-result-reveal`, `nuvora-copy-confirm` CSS classes
- Typographic scale (`text-display`, heading sizes), dark mode variants
- Hero: "Your browser can do more" tagline, grid texture, staggered entrances
- Micro-interactions: card hover, button press, result reveal, copy pulse, theme toggle
- 404 page with personality
