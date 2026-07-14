"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";

interface SubnetResult {
  ip: string;
  cidr: number;
  subnetMask: string;
  subnetMaskBinary: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  wildcardMask: string;
}

function ipToBinary(ip: string): number[] | null {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;
  return parts;
}

function binaryToIp(octets: number[]): string {
  return octets.join(".");
}

function calculateSubnet(ip: string, cidr: number): SubnetResult | null {
  const octets = ipToBinary(ip);
  if (!octets || cidr < 0 || cidr > 32) return null;

  const mask = Array(32).fill(0).map((_, i) => (i < cidr ? 1 : 0));
  const maskOctets = [
    parseInt(mask.slice(0, 8).join(""), 2),
    parseInt(mask.slice(8, 16).join(""), 2),
    parseInt(mask.slice(16, 24).join(""), 2),
    parseInt(mask.slice(24, 32).join(""), 2),
  ];

  const ipBits = octets.flatMap((o) => o.toString(2).padStart(8, "0").split("").map(Number));
  const networkBits = ipBits.map((b, i) => b & mask[i]);
  const broadcastBits = ipBits.map((b, i) => b | (mask[i] === 0 ? 1 : 0));

  const networkOctets = [
    parseInt(networkBits.slice(0, 8).join(""), 2),
    parseInt(networkBits.slice(8, 16).join(""), 2),
    parseInt(networkBits.slice(16, 24).join(""), 2),
    parseInt(networkBits.slice(24, 32).join(""), 2),
  ];

  const broadcastOctets = [
    parseInt(broadcastBits.slice(0, 8).join(""), 2),
    parseInt(broadcastBits.slice(8, 16).join(""), 2),
    parseInt(broadcastBits.slice(16, 24).join(""), 2),
    parseInt(broadcastBits.slice(24, 32).join(""), 2),
  ];

  const firstHostOctets = [...networkOctets];
  firstHostOctets[3] += 1;
  const lastHostOctets = [...broadcastOctets];
  lastHostOctets[3] -= 1;

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 0) : totalHosts - 2;

  return {
    ip,
    cidr,
    subnetMask: binaryToIp(maskOctets),
    subnetMaskBinary: maskOctets.map((o) => o.toString(2).padStart(8, "0")).join("."),
    networkAddress: binaryToIp(networkOctets),
    broadcastAddress: binaryToIp(broadcastOctets),
    firstHost: binaryToIp(firstHostOctets),
    lastHost: binaryToIp(lastHostOctets),
    totalHosts,
    usableHosts,
    wildcardMask: binaryToIp(maskOctets.map((o) => ~o & 255)),
  };
}

export function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(() => calculateSubnet("192.168.1.0", 24));
  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipAddress)) {
      setError("Invalid IP address format (expected x.x.x.x)");
      setResult(null);
      return;
    }
    if (cidr < 0 || cidr > 32) {
      setError("CIDR prefix must be between 0 and 32");
      setResult(null);
      return;
    }
    const res = calculateSubnet(ipAddress, cidr);
    if (!res) {
      setError("Invalid IP address or CIDR value");
      setResult(null);
      return;
    }
    setResult(res);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label htmlFor="ip-address" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            IP Address
          </label>
          <Input
            id="ip-address"
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="192.168.1.0"
          />
        </div>
        <div className="w-32">
          <label htmlFor="cidr" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            CIDR Prefix
          </label>
          <Input
            id="cidr"
            type="number"
            min={0}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(Math.min(32, Math.max(0, parseInt(e.target.value) || 0)))}
          />
        </div>
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      {result && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Subnet Details â€” {result.ip}/{result.cidr}
            </p>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {[
              { label: "Subnet Mask", value: result.subnetMask },
              { label: "Subnet Mask (Binary)", value: result.subnetMaskBinary, mono: true },
              { label: "Wildcard Mask", value: result.wildcardMask },
              { label: "Network Address", value: result.networkAddress },
              { label: "Broadcast Address", value: result.broadcastAddress },
              { label: "First Usable Host", value: result.firstHost },
              { label: "Last Usable Host", value: result.lastHost },
              { label: "Total Hosts", value: result.totalHosts.toLocaleString() },
              { label: "Usable Hosts", value: result.usableHosts.toLocaleString() },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <span className={`text-sm text-zinc-900 dark:text-zinc-50 ${item.mono ? "font-mono text-xs" : ""}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
