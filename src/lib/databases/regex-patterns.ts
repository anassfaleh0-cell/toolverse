export interface RegexPattern {
  pattern: string;
  name: string;
  description: string;
  example: string;
  matches: string;
  category: string;
}

export const REGEX_PATTERNS: RegexPattern[] = [
  // Email & URLs
  { pattern: "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", name: "Email Address", description: "Validates standard email address format", example: "[\\w.-]+@[\\w.-]+\\.\\w{2,}", matches: "user@example.com", category: "validation" },
  { pattern: "https?:\\/\\/[\\w.-]+(:\\d+)?(\\/[\\w.-]*)*", name: "HTTP/HTTPS URL", description: "Matches HTTP or HTTPS URLs", example: "https?://[\\w.-]+(:\\d+)?(/[\\w.-]*)*", matches: "https://example.com/page", category: "validation" },
  { pattern: "^(http|https)://[^\\s/$.?#].[^\\s]*$", name: "Full URL", description: "Validates complete URLs with protocol", example: "^(http|https)://[^\\s/$.?#].[^\\s]*$", matches: "https://example.com/path?q=1", category: "validation" },
  { pattern: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$", name: "IPv4 Address", description: "Basic IPv4 address format validation", example: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$", matches: "192.168.1.1", category: "validation" },
  { pattern: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", name: "IPv6 Address", description: "Full IPv6 address format", example: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", matches: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", category: "validation" },
  // Text processing
  { pattern: "\\b\\w+\\b", name: "Word Match", description: "Matches individual words in text", example: "\\b\\w+\\b", matches: "each word separately", category: "text" },
  { pattern: "^[A-Z].*[.!?]$", name: "Sentence Detection", description: "Matches complete sentences starting with capital letter", example: "^[A-Z].*[.!?]$", matches: "This is a sentence.", category: "text" },
  { pattern: "\\s+", name: "Whitespace", description: "Matches one or more whitespace characters", example: "\\s+", matches: "spaces, tabs, newlines", category: "text" },
  { pattern: "\\r?\\n", name: "Line Break", description: "Matches Unix and Windows line breaks", example: "\\r?\\n", matches: "\\n or \\r\\n", category: "text" },
  { pattern: "^\\s*$", name: "Empty Line", description: "Matches empty or whitespace-only lines", example: "^\\s*$", matches: "blank lines", category: "text" },
  { pattern: "<!--[\\s\\S]*?-->", name: "HTML Comments", description: "Matches HTML/XML comments", example: "<!--[\\s\\S]*?-->", matches: "<!-- comment -->", category: "text" },
  { pattern: "<[^>]+>", name: "HTML Tags", description: "Matches any HTML tags", example: "<[^>]+>", matches: "<div class=\"main\">", category: "text" },
  { pattern: "\\[([^\\[\\]]+)\\]\\(([^)]+)\\)", name: "Markdown Links", description: "Matches Markdown link syntax", example: "\\[([^\\[\\]]+)\\]\\(([^)]+)\\)", matches: "[text](url)", category: "text" },
  { pattern: "\\*\\*(.+?)\\*\\*", name: "Markdown Bold", description: "Matches Markdown bold text", example: "\\*\\*(.+?)\\*\\*", matches: "**bold text**", category: "text" },
  { pattern: "`[^`]+`", name: "Inline Code", description: "Matches inline code in Markdown", example: "`[^`]+`", matches: "`code snippet`", category: "text" },
  // Numbers
  { pattern: "^\\d+$", name: "Digits Only", description: "Matches strings containing only digits", example: "^\\d+$", matches: "12345", category: "numbers" },
  { pattern: "^\\d{3}-\\d{3}-\\d{4}$", name: "US Phone Number", description: "Validates US phone number format XXX-XXX-XXXX", example: "^\\d{3}-\\d{3}-\\d{4}$", matches: "555-123-4567", category: "numbers" },
  { pattern: "^\\$?\\d+(\\.\\d{2})?$", name: "Currency Amount", description: "Matches dollar amounts with optional cents", example: "^\\$?\\d+(\\.\\d{2})?$", matches: "$49.99", category: "numbers" },
  { pattern: "^\\d{4}-\\d{2}-\\d{2}$", name: "ISO Date", description: "Matches YYYY-MM-DD date format", example: "^\\d{4}-\\d{2}-\\d{2}$", matches: "2026-07-07", category: "numbers" },
  { pattern: "^\\d{2}:\\d{2}:\\d{2}$", name: "Time (HH:MM:SS)", description: "Validates 24-hour time format", example: "^\\d{2}:\\d{2}:\\d{2}$", matches: "23:59:59", category: "numbers" },
  { pattern: "^(0x|0X)?[0-9a-fA-F]+$", name: "Hexadecimal", description: "Matches hex numbers with optional prefix", example: "^(0x|0X)?[0-9a-fA-F]+$", matches: "0xFFA3", category: "numbers" },
  { pattern: "^(\\d{1,3}\\.){3}\\d{1,3}$", name: "IPv4 Octets", description: "Validates IPv4 with number range check", example: "^(\\d{1,3}\\.){3}\\d{1,3}$", matches: "10.0.0.1", category: "numbers" },
  // Security
  { pattern: "^[A-Za-z0-9+/=]+$", name: "Base64", description: "Matches base64-encoded strings", example: "^[A-Za-z0-9+/=]+$", matches: "SGVsbG8gV29ybGQ=", category: "security" },
  { pattern: "^[0-9a-fA-F]{32}$", name: "MD5 Hash", description: "Matches 32-character MD5 hash", example: "^[0-9a-fA-F]{32}$", matches: "d41d8cd98f00b204e9800998ecf8427e", category: "security" },
  { pattern: "^[0-9a-fA-F]{40}$", name: "SHA-1 Hash", description: "Matches 40-character SHA-1 hash", example: "^[0-9a-fA-F]{40}$", matches: "da39a3ee5e6b4b0d3255bfef95601890afd80709", category: "security" },
  { pattern: "^[0-9a-fA-F]{64}$", name: "SHA-256 Hash", description: "Matches 64-character SHA-256 hash", example: "^[0-9a-fA-F]{64}$", matches: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", category: "security" },
  { pattern: "^[A-Z0-9_]+$", name: "API Key (Simple)", description: "Matches uppercase alphanumeric API key formats", example: "^[A-Z0-9_]+$", matches: "API_KEY_12345", category: "security" },
  { pattern: "^(\\$2[aby]?\\$\\d{2}\\$[./A-Za-z0-9]{53})$", name: "bcrypt Hash", description: "Matches bcrypt password hashes", example: "^(\\$2[aby]?\\$\\d{2}\\$[./A-Za-z0-9]{53})$", matches: "$2b$10$...", category: "security" },
  { pattern: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$", name: "JWT Token", description: "Matches JWT token structure (3 parts separated by dots)", example: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$", matches: "header.payload.signature", category: "security" },
  // Log analysis
  { pattern: "\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}", name: "Log Timestamp", description: "Matches ISO log timestamps", example: "\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}", matches: "2026-07-07 12:00:00", category: "logs" },
  { pattern: "\\b(ERROR|WARN|INFO|DEBUG|TRACE)\\b", name: "Log Level", description: "Matches log severity levels", example: "\\b(ERROR|WARN|INFO|DEBUG|TRACE)\\b", matches: "ERROR", category: "logs" },
  { pattern: "^\\S+ \\S+ \\S+ \\[.*\\] \".*\" \\d{3} \\d+", name: "Apache/NCSA Log", description: "Matches standard Apache access log format", example: "^\\S+ \\S+ \\S+ \\[.*\\] \".*\" \\d{3} \\d+", matches: "127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] \"GET /apache_pb.gif HTTP/1.0\" 200 2326", category: "logs" },
  { pattern: "\\b\\d{3}\\b", name: "HTTP Status Code", description: "Matches 3-digit HTTP status codes", example: "\\b\\d{3}\\b", matches: "200, 404, 500", category: "logs" },
  // Code
  { pattern: "['\"]use strict['\"]", name: "Strict Mode", description: "Finds JavaScript strict mode declarations", example: "['\"]use strict['\"]", matches: "\"use strict\"", category: "code" },
  { pattern: "function\\s+\\w+\\s*\\([^)]*\\)", name: "JS Function", description: "Matches JavaScript function declarations", example: "function\\s+\\w+\\s*\\([^)]*\\)", matches: "function myFunc(a, b)", category: "code" },
  { pattern: "import\\s+.*\\s+from\\s+['\"].+['\"]", name: "ES Module Import", description: "Matches ES module import statements", example: "import\\s+.*\\s+from\\s+['\"].+['\"]", matches: "import { something } from 'module'", category: "code" },
  { pattern: "export\\s+(default\\s+)?(function|class|const|let|var)", name: "ES Module Export", description: "Matches ES module export statements", example: "export\\s+(default\\s+)?(function|class|const|let|var)", matches: "export default function", category: "code" },
  { pattern: "#\\s*include\\s+<[^>]+>", name: "C Include", description: "Matches C/C++ include directives", example: "#\\s*include\\s+<[^>]+>", matches: "#include <stdio.h>", category: "code" },
  // Files & paths
  { pattern: "^[\\w.-]+\\.[A-Za-z]{2,4}$", name: "File Name", description: "Matches file names with extension", example: "^[\\w.-]+\\.[A-Za-z]{2,4}$", matches: "document.pdf", category: "files" },
  { pattern: "^\\.\\w+$", name: "Hidden File", description: "Matches hidden files (starting with dot)", example: "^\\.\\w+$", matches: ".gitignore", category: "files" },
  { pattern: "^/([\\w.-]+/)*[\\w.-]+$", name: "Unix Path", description: "Matches Unix-style file paths", example: "^/([\\w.-]+/)*[\\w.-]+$", matches: "/home/user/docs/file.txt", category: "files" },
  { pattern: "^[A-Za-z]:\\\\[\\w.\\\\-]+$", name: "Windows Path", description: "Matches Windows-style file paths", example: "^[A-Za-z]:\\\\[\\w.\\\\-]+$", matches: "C:\\Users\\user\\file.txt", category: "files" },
  { pattern: "\\.(jpg|jpeg|png|gif|webp|svg)$", name: "Image File Ext", description: "Matches common image file extensions", example: "\\.(jpg|jpeg|png|gif|webp|svg)$", matches: "photo.jpg", category: "files" },
];
