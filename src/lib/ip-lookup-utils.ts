export interface IpLookupData {
  ip: string;
  version: number;
  hostname: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  postalCode: string;
  continent: string;
  lat: number;
  lon: number;
  timezone: string;
  localTime: string;
  isp: string;
  org: string;
  asn: string;
  currency: string;
  callingCode: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
}

export const CONTINENT_MAP: Record<string, string> = {
  AF: "Africa", NA: "North America", SA: "South America",
  AN: "Antarctica", AS: "Asia", EU: "Europe", OC: "Oceania",
};

export const COUNTRY_CONTINENT: Record<string, string> = {
  US: "NA", CA: "NA", MX: "NA", GT: "NA", BZ: "NA", CU: "NA",
  DO: "NA", HT: "NA", HN: "NA", JM: "NA", NI: "NA", PA: "NA",
  SV: "NA", CR: "NA", BS: "NA", BB: "NA", TT: "NA",
  GB: "EU", DE: "EU", FR: "EU", IT: "EU", ES: "EU", PT: "EU",
  NL: "EU", BE: "EU", CH: "EU", AT: "EU", SE: "EU", NO: "EU",
  DK: "EU", FI: "EU", IE: "EU", PL: "EU", CZ: "EU", SK: "EU",
  HU: "EU", RO: "EU", BG: "EU", GR: "EU", HR: "EU", RS: "EU",
  UA: "EU", RU: "EU", LT: "EU", LV: "EU", EE: "EU", SI: "EU",
  IS: "EU", LU: "EU", MT: "EU", CY: "EU", AL: "EU", BA: "EU",
  MK: "EU", MD: "EU", ME: "EU", XK: "EU", BY: "EU", FO: "EU",
  LI: "EU", MC: "EU", SM: "EU", VA: "EU", AD: "EU", GI: "EU",
  JP: "AS", CN: "AS", IN: "AS", KR: "AS", SG: "AS", MY: "AS",
  TH: "AS", VN: "AS", PH: "AS", ID: "AS", PK: "AS", BD: "AS",
  TR: "AS", SA: "AS", AE: "AS", QA: "AS", KW: "AS", OM: "AS",
  BH: "AS", JO: "AS", LB: "AS", IL: "AS", IR: "AS", IQ: "AS",
  SY: "AS", YE: "AS", AM: "AS", GE: "AS", AZ: "AS", KZ: "AS",
  UZ: "AS", TM: "AS", KG: "AS", TJ: "AS", MN: "AS", NP: "AS",
  BT: "AS", LK: "AS", MV: "AS", BN: "AS", LA: "AS", KH: "AS",
  MM: "AS", TL: "AS", AF: "AS", TW: "AS", HK: "AS", MO: "AS",
  AU: "OC", NZ: "OC", FJ: "OC", PG: "OC", SB: "OC", VU: "OC",
  WS: "OC", TO: "OC", FM: "OC", MH: "OC", PW: "OC", KI: "OC",
  TV: "OC", NR: "OC",
  ZA: "AF", NG: "AF", EG: "AF", KE: "AF", GH: "AF", TZ: "AF",
  MA: "AF", DZ: "AF", TN: "AF", LY: "AF", SD: "SS", ET: "AF",
  UG: "AF", ZM: "AF", ZW: "AF", MZ: "AF", AO: "AF", CM: "AF",
  CI: "AF", SN: "AF", ML: "AF", BF: "AF", NE: "AF", TD: "AF",
  SO: "AF", MG: "AF", RW: "AF", BJ: "AF", TG: "AF", SL: "AF",
  LR: "AF", CF: "AF", CG: "AF", CD: "AF", GA: "AF", GQ: "AF",
  BW: "AF", NA: "AF", LS: "AF", SZ: "AF", KM: "AF", MU: "AF",
  SC: "AF", DJ: "AF", ER: "AF", MW: "AF", GM: "AF", CV: "AF",
  ST: "AF", GW: "AF", MR: "AF", BI: "AF",
  BR: "SA", AR: "SA", CL: "SA", CO: "SA", PE: "SA", VE: "SA",
  EC: "SA", BO: "SA", PY: "SA", UY: "SA", GY: "SA", SR: "SA",
  GF: "SA",
};

export const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", CA: "CAD", MX: "MXN", GB: "GBP", EU: "EUR",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", JP: "JPY",
  CN: "CNY", IN: "INR", KR: "KRW", SG: "SGD", AU: "AUD",
  NZ: "NZD", BR: "BRL", RU: "RUB", CH: "CHF", SE: "SEK",
  NO: "NOK", DK: "DKK", TR: "TRY", SA: "SAR", AE: "AED",
  ZA: "ZAR", NG: "NGN", EG: "EGP", IL: "ILS", PK: "PKR",
  BD: "BDT", TH: "THB", VN: "VND", ID: "IDR", PH: "PHP",
  MY: "MYR", HK: "HKD", TW: "TWD",
};

export const COUNTRY_CALLING: Record<string, string> = {
  US: "+1", CA: "+1", GB: "+44", DE: "+49", FR: "+33", IT: "+39",
  ES: "+34", JP: "+81", CN: "+86", IN: "+91", KR: "+82",
  AU: "+61", BR: "+55", RU: "+7", MX: "+52", NL: "+31",
  SE: "+46", CH: "+41", SG: "+65", HK: "+852", TW: "+886",
  AE: "+971", SA: "+966", TR: "+90", ZA: "+27", NG: "+234",
  EG: "+20", IL: "+972", PK: "+92", BD: "+880", TH: "+66",
  VN: "+84", ID: "+62", PH: "+63", MY: "+60", NZ: "+64",
  AR: "+54", CL: "+56", CO: "+57", PE: "+51", VE: "+58",
};

export function getContinent(countryCode: string): string {
  const code = COUNTRY_CONTINENT[countryCode];
  return code ? CONTINENT_MAP[code] || "Unknown" : "Unknown";
}

export function getCurrency(countryCode: string): string {
  return COUNTRY_CURRENCY[countryCode] || "—";
}

export function getCallingCode(countryCode: string): string {
  return COUNTRY_CALLING[countryCode] || "—";
}

export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const a = countryCode.codePointAt(0)! - 65 + 0x1f1e6;
  const b = countryCode.codePointAt(1)! - 65 + 0x1f1e6;
  return String.fromCodePoint(a, b);
}

export function validateIp(input: string): { valid: boolean; version?: number; error?: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, error: "Please enter an IP address" };
  }

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const v4Match = trimmed.match(ipv4Regex);

  if (v4Match) {
    const parts = v4Match.slice(1).map(Number);
    if (parts.every((p) => p >= 0 && p <= 255)) {
      return { valid: true, version: 4 };
    }
    return { valid: false, error: "Invalid IPv4 address. Each octet must be between 0 and 255." };
  }

  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$/;

  if (ipv6Regex.test(trimmed)) {
    return { valid: true, version: 6 };
  }

  if (trimmed.includes(".") || trimmed.includes(":")) {
    return { valid: false, error: "Invalid IP address format. Please enter a valid IPv4 or IPv6 address." };
  }

  return { valid: false, error: "Please enter a valid IP address (e.g., 8.8.8.8 or 2001:4860:4860::8888)." };
}

export function formatLocalTime(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return "—";
  }
}

export function getIpVersionLabel(v: number): string {
  return v === 6 ? "IPv6" : "IPv4";
}

export interface HistoryEntry {
  ip: string;
  timestamp: number;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
}

const HISTORY_KEY = "toolverse-ip-lookups";
const MAX_HISTORY = 10;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const filtered = history.filter((h) => h.ip !== entry.ip);
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // localStorage unavailable
  }
}
