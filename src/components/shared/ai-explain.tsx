"use client";

import { useState } from "react";
export { AIExplanationCard } from "./ai-explanation-card";

interface AiExplainProps {
  toolName: string;
  analysis?: {
    issues?: { severity: "error" | "warning" | "info"; message: string }[];
    recommendations?: string[];
    nextSteps?: string[];
  };
  beginnerMode?: boolean;
}

const FALLBACKS: Record<string, { explanation: string; whyBad: string; howToFix: string; nextStep: string }> = {
  "spf-lookup": {
    explanation: "SPF (Sender Policy Framework) is a DNS TXT record that lists which mail servers are allowed to send email for your domain. When a receiving server gets an email, it checks the SPF record of the sending domain. If the sending IP is not in the list, the server follows the policy (usually reject or quarantine).",
    whyBad: "A missing or misconfigured SPF record means anyone can send email pretending to be from your domain. This enables phishing attacks, damages your domain reputation, and causes legitimate emails to land in spam folders.",
    howToFix: "Create an SPF record that includes all legitimate sending sources: your web server, email provider (Google, Microsoft, etc.), marketing platforms, and transactional email services. End with -all (hard fail) for maximum protection. Stay under the 10 DNS lookup limit.",
    nextStep: "After fixing SPF, set up DKIM signing for your email, then create a DMARC record with p=quarantine to start monitoring. Gradually move to p=reject as you verify all legitimate email is authenticated.",
  },
  "dmarc-lookup": {
    explanation: "DMARC (Domain-based Message Authentication, Reporting & Conformance) builds on SPF and DKIM. It tells receivers what to do when an email claims to be from your domain but fails authentication. DMARC also provides reports so you can see who is sending email on your behalf.",
    whyBad: "Without a DMARC policy, receivers make their own decisions about unauthenticated email. Most will deliver it, including phishing emails that spoof your domain. You also miss out on visibility into which services send email for your domain.",
    howToFix: "Start with p=none to collect data without disrupting email flow. Set rua= with your email address to receive aggregate reports. Review reports for 2-4 weeks, identify all legitimate email sources, then move to p=quarantine, then p=reject.",
    nextStep: "Configure your reports email address to accept DMARC reports. Services like Postmark, EasyDMARC, or dmarcian can parse the XML reports and show you actionable data.",
  },
  "dkim-lookup": {
    explanation: "DKIM (DomainKeys Identified Mail) adds a cryptographic signature to every outgoing email. The signature is created with a private key on your mail server, and verified by receivers using your public key published in DNS. If the signature is valid, the email was not tampered with in transit.",
    whyBad: "Missing DKIM means email authentication is incomplete. Even with SPF, an attacker can spoof the From header while using their own Return-Path. DKIM prevents this by cryptographically signing the email content.",
    howToFix: "Enable DKIM signing in your email provider's settings. Each provider has a specific selector (Google uses 'google', Microsoft uses 'selector1'/'selector2'). Publish the public key at {selector}._domainkey.yourdomain.com.",
    nextStep: "Verify your DKIM selector name with your email provider, publish the correct TXT record, and test with our DKIM validator. Then configure DMARC with p=quarantine to enforce authentication.",
  },
  "dns-lookup": {
    explanation: "A DNS lookup queries the global Domain Name System hierarchy to retrieve records for a domain. Each record type serves a specific purpose: A records map hostnames to IPv4 addresses, MX records route email, and TXT records carry verification and policy data.",
    whyBad: "DNS misconfigurations can cause website outages, email delivery failures, and security vulnerabilities. A missing A record takes your site offline. A wrong MX record breaks email. An incorrect CNAME can create resolution loops.",
    howToFix: "Verify each record type matches your expected configuration. Check A records point to correct IPs, MX records point to valid mail servers with correct priorities, and TXT records contain valid SPF, DKIM, and DMARC policies.",
    nextStep: "Use our DNSSEC Checker to verify cryptographic signing, Nameserver Analyzer to check redundancy, and Email Deliverability Checker for a comprehensive email health audit.",
  },
};

export function AiExplain({ toolName, analysis, beginnerMode }: AiExplainProps) {
  const [activeTab, setActiveTab] = useState<"explain" | "fix" | "next" | null>(null);
  const fallback = FALLBACKS[toolName];

  if (!analysis && !fallback) return null;

  const explain = fallback?.explanation || "Analysis not available for this tool.";
  const fix = analysis?.recommendations?.join(". ") || fallback?.howToFix || "";
  const next = analysis?.nextSteps?.join(". ") || fallback?.nextStep || "";

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {([
          { key: "explain" as const, label: "Explain Result", icon: "?" },
          { key: "fix" as const, label: "How to Fix", icon: "!" },
          { key: "next" as const, label: "Next Step", icon: "→" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)}
            className={`flex-1 border-r border-zinc-200 px-3 py-2.5 text-xs font-medium transition-colors last:border-r-0 dark:border-zinc-800 ${
              activeTab === tab.key
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
            aria-expanded={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && (
        <div className="p-4 text-sm">
          {activeTab === "explain" && (
            <div className="space-y-4">
              <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{explain}</p>
              {beginnerMode && (
                <details className="group">
                  <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    What does this mean in simple terms?
                  </summary>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Think of this as a health check for your internet services. Every record type is checking a specific part of your configuration. Green means it works, red means it needs attention. Start with the red items — they are the most likely cause of problems.
                  </p>
                </details>
              )}
              {fix && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">How to Fix</h4>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{fix}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "fix" && (
            <div className="space-y-3">
              {fix ? (
                <>
                  <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{fix}</p>
                  {beginnerMode && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      If you are unsure how to make these changes, contact your IT team or hosting provider. Many DNS changes can be made through your domain registrar&apos;s control panel.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-zinc-500">No fix recommendation available. Review the analysis above for more details.</p>
              )}
            </div>
          )}

          {activeTab === "next" && (
            <div className="space-y-3">
              {next ? (
                <>
                  <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{next}</p>
                  {beginnerMode && (
                    <ol className="ml-4 list-decimal space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <li>Review all warnings and errors first</li>
                      <li>Make the recommended changes one at a time</li>
                      <li>Re-run the tool to verify each fix</li>
                      <li>Keep a record of what you changed for future reference</li>
                    </ol>
                  )}
                </>
              ) : (
                <p className="text-zinc-500">No next step recommendation available. Consider exploring related tools for deeper analysis.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}