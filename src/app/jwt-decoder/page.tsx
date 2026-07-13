import type { Metadata } from "next";
import { JwtDecoder } from "@/components/jwt-decoder/jwt-decoder";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "jwt-decoder";
const pageTitle = "JWT Decoder - Decode and Inspect JSON Web Tokens Online";
const pageDescription =
  "Decode and inspect JSON Web Tokens online. View JWT headers, payloads, and claims without server-side validation. Safe client-side decoding for debugging authentication flows.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Code & Development", href: `${SITE_URL}/category/code-dev` },
  { label: "JWT Decoder" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a JSON Web Token and how is it structured?",
    answer:
      "A JWT is a compact, URL-safe token format defined by RFC 7519 for transmitting claims between parties. It consists of three Base64URL-encoded segments separated by dots: the header (containing the signing algorithm and token type), the payload (containing claims like user ID, expiration, and issuer), and the signature (a cryptographic hash that verifies the token has not been tampered with). A typical JWT looks like: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U.",
  },
  {
    question: "Can I decode a JWT without the secret key?",
    answer:
      "Yes. The header and payload of any JWT are only Base64URL-encoded, not encrypted. Anyone with access to the token can decode and read these segments using a Base64 decoder. This is why JWTs must never contain sensitive information like passwords or credit card numbers. The signature, however, requires the secret or private key to verify. Tokens can be encrypted (JWE) rather than just signed (JWS), but the common JWT format used for access tokens is signed, not encrypted.",
  },
  {
    question: "What is the difference between JWS and JWE?",
    answer:
      "JWS (JSON Web Signature) provides integrity and authenticity through digital signatures but the payload is readable by anyone who decodes it. JWE (JSON Web Encryption) encrypts the payload so only the intended recipient can decrypt and read it. Most JWTs in web applications are JWS tokens because they do not contain secrets. JWE is used when the payload itself is confidential. Nuvora decodes JWS tokens; encrypted JWE tokens cannot be decoded without the decryption key.",
  },
  {
    question: "What are standard JWT claims and what do they mean?",
    answer:
      "Registered claims defined in RFC 7519 include: iss (issuer, identifies the principal that issued the JWT), sub (subject, identifies the principal that is the subject of the JWT), aud (audience, identifies the recipients for which the JWT is intended), exp (expiration time, after which the JWT is invalid), nbf (not before, before which the JWT is invalid), iat (issued at, when the JWT was issued), and jti (JWT ID, a unique identifier for the token). Custom claims are also common, such as roles, permissions, and user metadata.",
  },
  {
    question: "Why does my JWT have a long string of characters in the payload?",
    answer:
      "The JWT payload may contain Base64-encoded binary data, such as user profile images, cryptographic keys, or serialized objects. The payload should be relatively compact because JWTs are often passed in HTTP headers with size limits. If your JWT is very large, consider whether all the claims are necessary, or if you can offload some data to a user info endpoint. Use Nuvora&apos;s <Link href=\"/base64-encoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">Base64 Encoder</Link> to inspect individual Base64-encoded values within the decoded payload.",
  },
  {
    question: "What signing algorithms can JWTs use?",
    answer:
      "JWTs support symmetric algorithms like HS256 (HMAC with SHA-256) and asymmetric algorithms like RS256 (RSA with SHA-256), ES256 (ECDSA with P-256), and EdDSA (Edwards-curve Digital Signature Algorithm). Symmetric algorithms use a shared secret for both signing and verification. Asymmetric algorithms use a private key for signing and a public key for verification. RS256 is the most common for OAuth 2.0 and OpenID Connect providers because the public key can be distributed via a JWKS endpoint.",
  },
  {
    question: "What is the &quot;alg=none&quot; attack and how is it prevented?",
    answer:
      "The alg=none attack exploits servers that accept JWTs with the algorithm field set to &quot;none&quot; and an empty signature. An attacker modifies the payload and sets alg to none, and vulnerable servers accept the token without verifying a signature. This attack is prevented by always configuring your JWT library to reject tokens with alg=none, validating the algorithm against a whitelist, and never implementing custom JWT parsing logic. Most modern JWT libraries reject none algorithms by default, but legacy configurations may leave this door open.",
  },
  {
    question: "How do refresh tokens differ from access tokens in JWT?",
    answer:
      "Access tokens are short-lived JWTs that authenticate API requests. They typically expire in 15 minutes to 1 hour. Refresh tokens are long-lived opaque tokens or JWTs that are used to obtain new access tokens without requiring the user to re-authenticate. Refresh tokens have longer expiration (days or months) and are stored more securely (often in HTTP-only cookies). The access token is sent with every request, while the refresh token is only sent to the authorization server&apos;s token endpoint.",
  },
  {
    question: "What is a JWKS and how is it used with JWTs?",
    answer:
      "JWKS (JSON Web Key Set) is a JSON structure that represents a set of cryptographic keys. Authorization servers publish their public keys in a JWKS endpoint so that resource servers and clients can verify JWT signatures. The JWKS URI is typically advertised in the OAuth 2.0 discovery document. The resource server fetches the JWKS, matches the key ID (kid) from the JWT header to a key in the set, and uses the corresponding public key to verify the signature.",
  },
  {
    question: "Can a JWT be revoked after it is issued?",
    answer:
      "JWT revocation is inherently difficult because tokens are stateless by design. Once issued, a JWT remains valid until it expires. Common revocation strategies include maintaining a token blacklist (which defeats the purpose of statelessness), using short expiration times with refresh token rotation, or checking a token status endpoint for each request. The most practical approach is to issue short-lived access tokens (5-15 minutes) so that the revocation window is minimal.",
  },
  {
    question: "What is the maximum size of a JWT?",
    answer:
      "JWTs are typically sent in HTTP Authorization headers, which have practical size limits. Most servers impose a maximum header size of 8 KB to 16 KB. A JWT that exceeds this limit cannot be transmitted in the header. If your token needs to carry more data, consider using a reference token (opaque token) that maps to a server-side session, or pass the JWT in a POST body. The decoded payload of a large JWT can be inspected with the <Link href=\"/json-formatter\" className=\"text-blue-600 hover:underline dark:text-blue-400\">JSON Formatter</Link> after extracting it from the token.",
  },
  {
    question: "How do I verify a JWT signature?",
    answer:
      "Verification requires the correct key or secret. For HS256, use the shared secret to recompute the HMAC and compare it to the signature. For RS256, fetch the public key from the issuer&apos;s JWKS endpoint, use it to verify the RSA signature against the header and payload segments. Most programming languages have JWT libraries that handle this automatically. Never manually implement signature verification, because subtle implementation differences can introduce security vulnerabilities. Nuvora decodes the payload but does not verify signatures, as that requires the signing key.",
  },
];

export default function JwtDecoderPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="JWT Decoder"
            description="Decode and inspect the header and payload of any JSON Web Token. Paste your token to view its claims, algorithm, and expiration details."
            breadcrumbs={breadcrumbs}
          >
            <JwtDecoder />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding The Anatomy of a JWT
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A JSON Web Token is not a mysterious opaque string, despite its appearance. The three dot-separated segments each serve a distinct cryptographic purpose. The header typically contains just two fields: alg (the signing algorithm) and typ (set to JWT). The payload contains the claims, which are assertions about the user or entity being authenticated. The signature is the output of applying the algorithm specified in the header to the concatenation of the encoded header and payload.
            </p>
            <p>
              The most critical thing to understand is that the header and payload are not encrypted, only Base64URL-encoded. This encoding is reversible by anyone. If your application places sensitive information like passwords, credit card numbers, or personal health data in a JWT, that information is exposed to anyone who intercepts or receives the token. Always treat the JWT payload as public data. The signature prevents tampering but does not provide confidentiality. For confidentiality, use JWE (JSON Web Encryption), which encrypts the payload with a public key and is a fundamentally different construction from the common signed JWT format that Nuvora decodes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When and Why to Decode JWTs During Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Debugging authentication flows is the primary reason to decode JWTs. When your API returns a 401 Unauthorized or 403 Forbidden, the first question is usually: did the token expire? The exp claim tells you instantly. If the token claims your user has a specific role but your authorization middleware is rejecting the request, decoding the token reveals the actual role claim. When migrating between authentication providers, you can inspect tokens from both systems side-by-side to verify claim names and value formats match.
            </p>
            <p>
              JWTs are also common in OAuth 2.0 and OpenID Connect authorization code flows, where the identity token (id_token) contains user profile claims. Decoding the id_token during development confirms the authorization server is returning the expected claims. Similarly, access tokens from different providers use different naming conventions: some use &quot;roles&quot; while others use &quot;realm_access.roles&quot; or &quot;authorities.&quot; Decoding these tokens helps you write correct authorization middleware without guessing the claim structure. For hashing and comparing token signatures or other cryptographic data included in JWT payloads, the <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> and <Link href="/sha-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">SHA Hash Generator</Link> provide quick digest computations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Security Considerations for JWT Usage
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              JWT security extends far beyond choosing a strong signing key. One of the most common vulnerabilities is accepting the algorithm specified in the token header without validation. An attacker can change alg from RS256 to HS256 and then sign the token with the public key (which is often publicly available from the JWKS endpoint). The server then uses the public key as an HMAC secret, and because the public key is known, the attacker can forge tokens that the server accepts.
            </p>
            <p>
              Always pin the expected algorithm on the server side and reject tokens that specify a different algorithm. Validate all claims, especially exp and nbf, using clock skew tolerance. Use the jti claim for token uniqueness to enable revocation tracking. Store JWTs securely on the client side: use HTTP-only cookies for web applications and secure storage for mobile apps. Never store JWTs in localStorage where XSS attacks can steal them. For encoding and decoding the payload data for further analysis, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> reveals individual field values that may themselves be Base64-encoded sub-structures.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common JWT Implementation Mistakes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most frequent mistake is storing sensitive data in the JWT payload. Because the payload is only Base64URL-encoded, any data placed there is visible to anyone who possesses the token. Another common error is using excessively long token lifetimes without a rotation strategy. A JWT with a 30-day expiration window is a security incident waiting to happen if the token is leaked. Developers also commonly forget to validate the aud (audience) claim, accepting tokens intended for one service as valid for another service entirely.
            </p>
            <p>
              On the implementation side, many developers write custom JWT parsing code instead of using established libraries. Custom parsing often misses edge cases: invalid Base64URL padding, unexpected claims types, or algorithm confusion attacks. Always use a well-maintained JWT library for your platform and keep it updated. When switching between providers, verify your library supports the signing algorithms the new provider uses. Some providers have transitioned from RS256 to ES256 or EdDSA, and older library versions may not support these algorithms, causing authentication to fail silently in production.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About JWT Decoding" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "LockKeyhole", title: "Base64 Encoder", description: "Encode and decode Base64 strings used in JWT segments", href: "/base64-encoder" },
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data from JWT payloads", href: "/json-formatter" },
              { icon: "Key", title: "SHA Hash Generator", description: "Generate SHA-1, SHA-256, and SHA-512 hash digests", href: "/sha-hash-generator" },
              { icon: "LockKeyhole", title: "MD5 Hash Generator", description: "Generate MD5 hash digests for checksums and data integrity", href: "/md5-hash-generator" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="jwt-decoder" />
    </>
  );
}
