import type { Metadata } from "next";
import { PasswordGenerator } from "@/components/password-generator/password-generator";
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

const slug = "password-generator";
const pageTitle = "Password Generator - Create Strong Random Passwords Online";
const pageDescription =
  "Generate strong, secure passwords with custom length and character types. Free online password generator using cryptographically secure random number generation. Protect your accounts with unbreakable passwords.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Productivity", href: `${SITE_URL}/category/productivity` },
  { label: "Password Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What makes a password strong and secure?",
    answer:
      "A strong password combines sufficient length (at least 12-16 characters), a mix of character types (uppercase, lowercase, numbers, symbols), and complete unpredictability. The most important factor is length: each additional character exponentially increases the number of possible combinations an attacker must try. A 16-character password using all four character types has 94^16 possible combinations, which is computationally infeasible to brute-force with current technology. Avoid dictionary words, personal information, keyboard patterns (qwerty), and common substitutions (p@ssw0rd) because attackers incorporate these patterns into their cracking strategies.",
  },
  {
    question: "Should I use a password manager or memorize my passwords?",
    answer:
      "Password managers are strongly recommended for everyone. They generate, store, and auto-fill unique high-entropy passwords for every account, eliminating the need to reuse or memorize complex strings. Modern password managers like 1Password, Bitwarden, and iCloud Keychain encrypt your vault with a single strong master password and sync securely across devices. Memorizing passwords is only practical for the master password of your password manager and a few critical accounts. Reusing passwords across sites is dangerous: if one site is breached, attackers will try those credentials on other popular services (credential stuffing).",
  },
  {
    question: "What is the ideal password length for maximum security?",
    answer:
      "Security experts recommend a minimum of 12 characters, with 16-20 characters being ideal for most purposes. NIST SP 800-63B guidelines recommend at least 8 characters for user-chosen passwords, but machine-generated passwords benefit from greater length. For high-value accounts like email, banking, and password managers, use 20+ character randomly generated passwords. Each additional character multiplies the search space by the character set size, so going from 12 to 16 characters using all 94 printable ASCII characters multiplies the combinations by 94^4 (approximately 78 million times more possibilities).",
  },
  {
    question: "How does the password strength indicator work?",
    answer:
      "The password strength indicator evaluates multiple factors including total length, use of mixed case letters, inclusion of numbers and symbols, and overall character diversity. Longer passwords score higher, especially at key thresholds (8, 12, 16, 20+ characters). Passwords using all four character types and exceeding 16 characters receive the highest rating. The score is a heuristic estimate of how resistant the password is to brute-force and intelligent guessing attacks. Note that a high strength score does not guarantee security if the password was generated with weak randomness or contains predictable patterns.",
  },
  {
    question: "What character types should I include in my passwords?",
    answer:
      "Include all available character types for maximum entropy: uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols (!@#$%^&* etc.). Each additional character type expands the search space that an attacker must cover. Using all four types provides a character set of 94 possible characters per position. Some systems restrict which symbols are allowed, so a password using only uppercase, lowercase, and numbers is still significantly stronger than one using only lowercase letters. Avoid character substitutions that follow predictable patterns, such as replacing 'a' with '@' or 's' with '$'.",
  },
  {
    question: "Are randomly generated passwords really random?",
    answer:
      "ToolVerse uses the Web Crypto API's crypto.getRandomValues() method, which is cryptographically secure and backed by the operating system's entropy sources. This is the same randomness used for TLS encryption and digital signatures. Unlike Math.random(), which uses a pseudo-random number generator seeded with the current time, crypto.getRandomValues() provides unpredictable output that cannot be reproduced even if an attacker knows the algorithm and all previous outputs. This makes the passwords suitable for securing sensitive accounts where predictability would have serious consequences.",
  },
  {
    question: "How often should I change my passwords?",
    answer:
      "Current security best practices (NIST SP 800-63B) no longer recommend mandatory periodic password changes unless there is evidence of compromise. Frequent forced changes often lead users to choose weaker passwords or follow predictable patterns. Instead, change a password immediately if: you suspect the account has been compromised, the service reports a data breach, you shared the password with someone, or you used the password on another site that was breached. Enable multi-factor authentication (MFA) on all important accounts as an additional layer of protection beyond strong passwords.",
  },
  {
    question: "What is the difference between a password and a passphrase?",
    answer:
      "A password is a string of random characters, while a passphrase is a sequence of random words (e.g., 'correct-horse-battery-staple'). Passphrases are easier to memorize and type, especially on mobile devices, while providing comparable entropy when the word list is sufficiently large. A 4-word passphrase from a 7776-word Diceware list provides about 51 bits of entropy, equivalent to a random 8-character password with all character types. Passphrases are particularly good for master passwords on password managers, where you must memorize the credential and type it frequently.",
  },
  {
    question: "Can I use special characters that are not on this list?",
    answer:
      "The symbols included in this generator (!@#$%^&*()_+-=[]{}|;':\",./<>?`~) cover the most commonly allowed special characters across websites and applications. Some services restrict which special characters are permitted in passwords, typically allowing only a subset of these. If a service rejects your generated password, try generating a new one and check which characters are allowed. Most modern services accept the full printable ASCII range, but some legacy systems may restrict certain characters. In that case, simply regenerate until you get a password that meets the service's requirements.",
  },
  {
    question: "Why does every account need a unique password?",
    answer:
      "Unique passwords prevent credential stuffing attacks, where attackers use credentials leaked from one breach to access accounts on other services. When you reuse passwords, a breach at any service compromises all accounts sharing that password. Data breaches are increasingly common and often go undetected for months. Using unique passwords for every account ensures that a breach at one service does not cascade into a full identity compromise. A password manager makes managing dozens or hundreds of unique passwords practical by handling generation, storage, and auto-fill across all your devices.",
  },
];

export default function PasswordGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Password Generator"
            description="Create strong, unpredictable passwords with customizable length and character types. Every password is generated using cryptographically secure randomness right in your browser."
            breadcrumbs={breadcrumbs}
          >
            <PasswordGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Password Strength Matters More Than Ever
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Password-based attacks remain the leading cause of account compromise in 2024. Attackers use increasingly sophisticated techniques: brute-force attacks that try every possible combination, dictionary attacks that incorporate leaked password lists, and credential stuffing that exploits password reuse across services. Modern GPU-based cracking hardware can test billions of password hashes per second, making short or predictable passwords trivially breakable. The average person manages over 100 online accounts, yet most users rely on passwords that can be cracked in minutes or seconds.
            </p>
            <p>
              The solution is not just longer passwords but truly random ones. Human-generated passwords follow predictable patterns: dictionary words, keyboard walks, dates, names, and common substitutions. Even seemingly random human choices are biased by cognitive patterns. Machine-generated passwords using cryptographically secure randomness eliminate these biases entirely. When combined with a <Link href="/sha-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">SHA Hash Generator</Link> for verifying password integrity during migration, you can ensure your credentials remain uncompromised across service transitions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Building a Comprehensive Password Security Strategy
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Strong passwords are just one layer of a defense-in-depth security strategy. Multi-factor authentication (MFA) adds a second factor — typically a time-based one-time password (TOTP), hardware security key, or biometric — so that a compromised password alone is insufficient to access the account. Security keys (FIDO2/WebAuthn) provide the strongest protection because they are phishing-resistant and cannot be intercepted by man-in-the-middle attacks. Even SMS-based MFA, while weaker than TOTP or hardware keys, dramatically improves security compared to password-only authentication.
            </p>
            <p>
              Regular security audits help identify weak or reused passwords before attackers exploit them. Services like Have I Been Pwned allow you to check if your email or passwords appear in known data breaches. If you use the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> to transmit credentials over APIs, ensure they are always sent over TLS and never hardcoded in source code. Use environment variables, secret management services (like AWS Secrets Manager or HashiCorp Vault), or encrypted configuration files to store credentials securely in production environments.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Cryptographic Randomness for Password Generation
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Not all random number generators are equal. The Web Crypto API&apos;s getRandomValues() method draws entropy from the operating system&apos;s CSPRNG (Cryptographically Secure Pseudo-Random Number Generator), which is fed by hardware entropy sources like CPU timing jitter, interrupt timing, and hardware random number generators. This is fundamentally different from Math.random(), which uses a predictable PRNG like XorShift128+ that can be reverse-engineered after observing a few dozen outputs. For password generation, the distinction matters: a predictable password generator defeats the entire purpose of strong passwords.
            </p>
            <p>
              ToolVerse generates all passwords client-side using getRandomValues(), so no password data ever leaves your browser. The generated passwords exist only in memory on your device until you copy them. There are no server-side logs, no transmission over networks, and no storage of generated passwords. For additional security, consider generating a hash of your passwords using the <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> to create a verification fingerprint that you can check later without storing the actual password — though remember MD5 is not suitable for security-critical hashing of passwords themselves.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Real-World Example: Meeting Enterprise Password Policy Compliance
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A mid-size law firm needed to enforce NIST SP 800-63B password guidelines across 200 employees. The firm&apos;s policy required: minimum 14 characters, at least one uppercase, one lowercase, one digit, and one special character, no repeats of the same character more than three times consecutively, and no dictionary words. Using the Password Generator with length set to 16 and all four character types enabled, the IT admin generated a batch of master passwords for shared document vaults. One generated password — <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">kX9!mP4#vR7@nB2*</code> — satisfied all policy rules with 95 bits of entropy. By the standard strength meter built into the tool, it registered as maximum strength across all five criteria. The firm saved each vault password in Bitwarden and distributed access via secure sharing rather than email, eliminating the prior practice of password reuse across internal systems.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Troubleshooting: What If Your Password Does Not Meet Requirements?
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A website rejecting your generated password usually means the service restricts certain special characters. The Password Generator uses the full printable ASCII set, but some legacy systems block characters like curly braces ({ }), pipes (|), or backticks (`). Regenerate a new password and check each rejected character individually. If the service requires a minimum number of digits or uppercase letters, increase the character diversity settings. For services that limit maximum length, reduce the slider to 12-14 characters. If a password contains a character that visually resembles another (0 vs O, 1 vs l vs I), regenerate — some systems confuse these in font rendering. Always generate passwords with at least 16 characters; if a service enforces a shorter maximum, ensure you have MFA enabled on that account as a compensating control.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            References
          </h2>
          <div className="mt-8 space-y-2 text-zinc-600 dark:text-zinc-400">
            <p>NIST SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management (<a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-blue-600 hover:underline dark:text-blue-400">pages.nist.gov/800-63-3/sp800-63b.html</a>)</p>
            <p>RFC 4086 — Randomness Requirements for Security (<a href="https://datatracker.ietf.org/doc/html/rfc4086" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc4086</a>)</p>
            <p>RFC 4949 — Internet Security Glossary (<a href="https://datatracker.ietf.org/doc/html/rfc4949" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc4949</a>)</p>
            <p>Web Crypto API — W3C Recommendation (<a href="https://www.w3.org/TR/WebCryptoAPI/" className="text-blue-600 hover:underline dark:text-blue-400">w3.org/TR/WebCryptoAPI</a>)</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Password Generation" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔐", title: "SHA Hash Generator", description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hash digests", href: "/sha-hash-generator" },
              { icon: "🔑", title: "MD5 Hash Generator", description: "Generate MD5 hash digests for checksums and deduplication", href: "/md5-hash-generator" },
              { icon: "🔡", title: "Base64 Encoder", description: "Encode and decode Base64 data for secure data transmission", href: "/base64-encoder" },
              { icon: "🔍", title: "JWT Decoder", description: "Decode and inspect JSON Web Token contents and claims", href: "/jwt-decoder" },
            ]}
            title="Related Security Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="password-generator" />
    </>
  );
}
