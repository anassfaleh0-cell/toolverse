export interface UserAgentEntry {
  ua: string;
  browser: string;
  engine: string;
  os: string;
  category: string;
  year: number;
}

export const USER_AGENTS: UserAgentEntry[] = [
  // Chrome
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", browser: "Chrome 125", engine: "Blink", os: "Windows 10", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", browser: "Chrome 124", engine: "Blink", os: "Windows 10", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36", browser: "Chrome 123", engine: "Blink", os: "Windows 10", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", browser: "Chrome 125", engine: "Blink", os: "macOS 10.15", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", browser: "Chrome 125", engine: "Blink", os: "Linux", category: "desktop", year: 2024 },
  // Firefox
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0", browser: "Firefox 126", engine: "Gecko", os: "Windows 10", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0", browser: "Firefox 126", engine: "Gecko", os: "macOS 10.15", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0", browser: "Firefox 126", engine: "Gecko", os: "Linux (Ubuntu)", category: "desktop", year: 2024 },
  // Safari
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15", browser: "Safari 17.5", engine: "WebKit", os: "macOS 10.15", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15", browser: "Safari 17.5", engine: "WebKit", os: "macOS 14", category: "desktop", year: 2024 },
  // Edge
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0", browser: "Edge 125", engine: "Blink", os: "Windows 10", category: "desktop", year: 2024 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0", browser: "Edge 125", engine: "Blink", os: "macOS 10.15", category: "desktop", year: 2024 },
  // Opera
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0", browser: "Opera 111", engine: "Blink", os: "Windows 10", category: "desktop", year: 2024 },
  // Mobile - Chrome
  { ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.4692.98 Mobile Safari/537.36", browser: "Chrome Mobile 125", engine: "Blink", os: "Android 14", category: "mobile", year: 2024 },
  { ua: "Mozilla/5.0 (Linux; Android 14; Samsung Galaxy S24) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.4692.98 Mobile Safari/537.36", browser: "Chrome Mobile 125", engine: "Blink", os: "Android 14 (Samsung)", category: "mobile", year: 2024 },
  { ua: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.179 Mobile Safari/537.36", browser: "Chrome Mobile 124", engine: "Blink", os: "Android 13", category: "mobile", year: 2024 },
  // Mobile - Safari
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1", browser: "Safari iOS 17.5", engine: "WebKit", os: "iOS 17.5", category: "mobile", year: 2024 },
  { ua: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1", browser: "Safari iPadOS 17.5", engine: "WebKit", os: "iPadOS 17.5", category: "mobile", year: 2024 },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1", browser: "Safari iOS 17.4", engine: "WebKit", os: "iOS 17.4", category: "mobile", year: 2024 },
  // Mobile - Samsung Internet
  { ua: "Mozilla/5.0 (Linux; Android 14; Samsung Galaxy S24) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.6167.164 Mobile Safari/537.36", browser: "Samsung Internet 25", engine: "Blink", os: "Android 14", category: "mobile", year: 2024 },
  // Mobile - Firefox
  { ua: "Mozilla/5.0 (Android 14; Mobile; rv:126.0) Gecko/126.0 Firefox/126.0", browser: "Firefox Mobile 126", engine: "Gecko", os: "Android 14", category: "mobile", year: 2024 },
  // Mobile - Opera
  { ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.4692.98 Mobile Safari/537.36 OPR/84.0.0.0", browser: "Opera Mobile 84", engine: "Blink", os: "Android 14", category: "mobile", year: 2024 },
  // Tablet
  { ua: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.4692.98 Mobile/15E148 Safari/604.1", browser: "Chrome iPad 125", engine: "Blink", os: "iPadOS 17.5", category: "tablet", year: 2024 },
  { ua: "Mozilla/5.0 (Linux; Android 14; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.4692.98 Safari/537.36", browser: "Chrome Tablet 125", engine: "Blink", os: "Android 14 (Tablet)", category: "tablet", year: 2024 },
  // Bots & Crawlers
  { ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", browser: "Googlebot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", browser: "Googlebot Smartphone", engine: "Blink", os: "Android 6.0", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/125.0.0.0 Safari/537.36", browser: "Bingbot", engine: "Blink", os: "N/A", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 (compatible; DuckDuckBot-Https/1.1; +https://duckduckgo.com/duckduckbot)", browser: "DuckDuckBot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)", browser: "YandexBot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)", browser: "Baiduspider", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)", browser: "SemrushBot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)", browser: "AhrefsBot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Twitterbot/1.0", browser: "Twitterbot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)", browser: "Facebook External Hit", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)", browser: "Slackbot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  { ua: "Discordbot/2.0 (+https://discordapp.com)", browser: "Discordbot", engine: "Custom", os: "N/A", category: "bot", year: 2024 },
  // Legacy browsers
  { ua: "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko", browser: "Internet Explorer 11", engine: "Trident", os: "Windows 7", category: "legacy", year: 2013 },
  { ua: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)", browser: "Internet Explorer 10", engine: "Trident", os: "Windows 8", category: "legacy", year: 2012 },
  { ua: "Mozilla/5.0 (Windows NT 5.1; rv:52.0) Gecko/20100101 Firefox/52.0", browser: "Firefox 52 (ESR)", engine: "Gecko", os: "Windows XP", category: "legacy", year: 2017 },
  // Library & tool UAs
  { ua: "curl/8.7.1", browser: "curl", engine: "N/A", os: "Multi-platform", category: "tool", year: 2024 },
  { ua: "Wget/1.24.5", browser: "Wget", engine: "N/A", os: "Multi-platform", category: "tool", year: 2024 },
  { ua: "python-requests/2.32.3", browser: "Python Requests", engine: "N/A", os: "Multi-platform", category: "tool", year: 2024 },
  { ua: "Go-http-client/2.0", browser: "Go HTTP Client", engine: "N/A", os: "Multi-platform", category: "tool", year: 2024 },
  { ua: "PostmanRuntime/7.40.0", browser: "Postman", engine: "N/A", os: "Multi-platform", category: "tool", year: 2024 },
  { ua: "Amazon CloudFront", browser: "CloudFront", engine: "N/A", os: "N/A", category: "tool", year: 2024 },
  { ua: "Pingdom.com_bot_version_1.4_(http://www.pingdom.com/)", browser: "Pingdom", engine: "Custom", os: "N/A", category: "tool", year: 2024 },
  // Smart TV & Console
  { ua: "Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/5.0 Chrome/95.0.4638.54 TV Safari/537.36", browser: "Samsung Smart TV", engine: "Blink", os: "Tizen 6.0", category: "tv", year: 2024 },
  { ua: "Mozilla/5.0 (PlayStation 4 10.00) AppleWebKit/605.1.15 (KHTML, like Gecko)", browser: "PS4 Browser", engine: "WebKit", os: "PS4 10.00", category: "console", year: 2024 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox Series X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edge/125.0.0.0", browser: "Xbox Edge", engine: "Blink", os: "Xbox OS", category: "console", year: 2024 },
];
