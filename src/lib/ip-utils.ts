export interface IpGeoData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export interface BrowserData {
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: string;
  screenResolution: string;
  language: string;
  userAgent: string;
}

export interface PrivacyData {
  type: string;
  score: number;
  grade: string;
  isVpn: boolean;
  isDatacenter: boolean;
  isResidential: boolean;
  proxy: boolean | null;
  hosting: boolean | null;
  mobile: boolean | null;
}

export interface IpInfoData {
  geo: IpGeoData | null;
  privacy: PrivacyData | null;
  browser: BrowserData | null;
  ipv4: string | null;
  ipv6: string | null;
  error?: string;
}

export function getBrowserData(): BrowserData {
  const ua = navigator.userAgent;
  const screenRes = `${window.screen.width}x${window.screen.height}`;

  let browser = "Unknown";
  let browserVersion = "";
  if (ua.includes("Firefox/")) {
    browser = "Firefox";
    browserVersion = ua.split("Firefox/")[1]?.split(" ")[0] ?? "";
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    browser = "Chrome";
    browserVersion = ua.split("Chrome/")[1]?.split(" ")[0] ?? "";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    browser = "Safari";
    browserVersion = ua.split("Version/")[1]?.split(" ")[0] ?? "";
  } else if (ua.includes("Edg/")) {
    browser = "Edge";
    browserVersion = ua.split("Edg/")[1]?.split(" ")[0] ?? "";
  }

  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad"))
    os = "iOS";

  let deviceType = "Desktop";
  if (
    /Mobi|Android|iPhone|iPad|iPod/i.test(ua) &&
    !ua.includes("Windows NT")
  ) {
    deviceType = "Mobile";
  }

  return {
    browser,
    browserVersion,
    os,
    deviceType,
    screenResolution: screenRes,
    language: navigator.language,
    userAgent: ua,
  };
}

export function getDeviceEmoji(deviceType: string): string {
  if (deviceType === "Mobile") return "📱";
  return "💻";
}

export function getOsEmoji(os: string): string {
  switch (os) {
    case "Windows":
      return "🪟";
    case "macOS":
      return "🍎";
    case "Linux":
      return "🐧";
    case "Android":
      return "🤖";
    case "iOS":
      return "📱";
    default:
      return "❓";
  }
}

export function getBrowserEmoji(browser: string): string {
  switch (browser) {
    case "Chrome":
      return "🌐";
    case "Firefox":
      return "🦊";
    case "Safari":
      return "🧭";
    case "Edge":
      return "📎";
    default:
      return "🌍";
  }
}
