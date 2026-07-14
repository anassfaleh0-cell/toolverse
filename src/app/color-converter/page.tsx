import type { Metadata } from "next";
import { ColorConverter } from "@/components/color-converter/color-converter";
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

const slug = "color-converter";
const pageTitle = "Color Converter - Convert HEX, RGB, HSL Colors Online";
const pageDescription =
  "Convert colors between HEX, RGB, and HSL formats instantly. Preview color swatches and understand color models. Free online color converter for web developers and designers.";

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
  { label: "Color Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between HEX, RGB, and HSL color models?",
    answer:
      "HEX (hexadecimal) represents colors as a 6-character code (#RRGGBB) using base-16 digits 0-9 and A-F. Each pair represents the red, green, and blue channels, with values from 00 (0) to FF (255). RGB (red, green, blue) is the same information in decimal notation: rgb(255, 0, 0) equals #FF0000. HSL (hue, saturation, lightness) is a cylindrical model: hue is the color's position on the color wheel (0-360 degrees), saturation is the intensity (0-100% gray to full), and lightness is brightness (0-100% black to white). HSL is often more intuitive for humans because it separates the color type (hue) from its vividness (saturation) and brightness (lightness). Modern CSS supports all three formats plus newer spaces like HWB, LAB, and LCH.",
  },
  {
    question: "When should I use HEX vs RGB vs HSL in CSS?",
    answer:
      "HEX is the most concise and is the traditional standard for CSS colors. It is best for static, known color values like brand colors and design tokens. RGB is useful when you need opacity via rgba() (e.g., rgba(255, 0, 0, 0.5)), though modern browsers support the same with hex: #FF000080 (8-digit hex with alpha). HSL is best when you need to programmatically adjust colors — for example, generating a lighter variant of a button color by increasing lightness, or creating a complementary color scheme by adding 180 to the hue. HSL makes color relationships intuitive: analogous colors have similar hue values, while complementary colors are 180 degrees apart. CSS supports all formats equally, so choose based on readability and the nature of the color transformations you need.",
  },
  {
    question: "How do I convert a hex color to RGB manually?",
    answer:
      "Split the 6-character hex code (excluding #) into three 2-character pairs: RR, GG, BB. Convert each pair from base-16 (hexadecimal) to base-10 (decimal). For #FF5733: FF = 15x16 + 15 = 255, 57 = 5x16 + 7 = 87, 33 = 3x16 + 3 = 51. Result: rgb(255, 87, 51). For shorthand hex (#F53), expand each digit to two: #FF5533 then convert. The reverse conversion (RGB to hex) takes each decimal value, divides by 16 to get the first hex digit (integer division), and takes the remainder as the second hex digit, then converts each 0-15 value to its hex character.",
  },
  {
    question: "What is color space and why does it matter for web development?",
    answer:
      "A color space defines the range (gamut) of colors that a device can display or that a file format can represent. sRGB is the standard color space for web content and most consumer displays, covering approximately 35% of the visible spectrum. Display P3 (used by Apple devices) covers about 45% and is increasingly supported in CSS and modern browsers. Rec. 2020 (used for HDR video) covers about 75%. CSS Color Level 4 introduces the color() function that lets developers specify colors in any color space: color(display-p3 1 0 0) for a brighter red than sRGB allows. When converting colors between spaces, the values change because the same RGB numbers represent different colors in different spaces.",
  },
  {
    question: "How does HSL make color scheme generation easier?",
    answer:
      "HSL's cylindrical model maps directly to color relationships. A monochromatic scheme varies lightness and saturation at a fixed hue. An analogous scheme uses neighboring hues (e.g., 0, 30, 60 degrees). A complementary scheme adds 180 degrees to the base hue. A triadic scheme uses hues spaced 120 degrees apart. A split-complementary scheme uses the base hue plus two hues adjacent to the complement. All of these are trivial to calculate in HSL — simply add or subtract from the hue value. In HEX or RGB, the same relationships require complex nonlinear transformations. HSL also makes it easy to generate accessible color variants: increase lightness for hover states, decrease saturation for disabled states.",
  },
  {
    question: "What is the 8-digit hex color format with alpha channel?",
    answer:
      "CSS Color Level 4 introduced 8-digit hex (#RRGGBBAA) and 4-digit shorthand (#RGBA) formats that include an alpha (opacity) channel. The alpha value ranges from 00 (fully transparent) to FF (fully opaque). For example, #FF000080 is red at 50% opacity (80 hex = 128 decimal). This format is supported in all modern browsers (Chrome 62+, Firefox 49+, Safari 10+, Edge 79+). The alpha channel in hex is at the end (unlike rgba() where alpha is the fourth parameter). The shorthand #F008 represents full red at 50% opacity.",
  },
  {
    question: "How does color conversion relate to WCAG accessibility?",
    answer:
      "WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (Level AA), or 7:1 and 4.5:1 for Level AAA. Color conversion is the first step in contrast analysis: you convert both foreground and background colors to the same format, then calculate relative luminance using sRGB coefficients: L = 0.2126*R + 0.7152*G + 0.0722*B (where R, G, B are linearized values). The contrast ratio is (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter luminance. HSL is useful for accessibility because you can adjust lightness while keeping the same hue, making it easier to find accessible variants of brand colors.",
  },
  {
    question: "What are CSS color functions like color-mix(), oklch(), and lab()?",
    answer:
      "Modern CSS (Color Level 4 and 5) introduces powerful color functions. color-mix(in srgb, red, blue) mixes two colors in a specified color space with no JavaScript needed. oklch() is a perceptually uniform color space that better matches human vision: same chroma produces the same perceived colorfulness regardless of hue. lab() is a device-independent color space based on how humans perceive color, with L (lightness 0-100), a (green-red axis), and b (blue-yellow axis). These newer spaces solve the perceptual non-uniformity of HSL: in HSL, a 30-degree hue shift at different lightness levels produces dramatically different perceived color changes, while OKLCH maintains perceptual consistency.",
  },
  {
    question: "What is the difference between sRGB and display P3?",
    answer:
      "sRGB (standard Red Green Blue) is the default color space for the web created in 1996 by HP and Microsoft. Display P3 is a wider color gamut developed by Apple, used in their displays starting with the iMac 2015. P3 covers approximately 45% of the visible spectrum (vs sRGB's 35%), with particularly noticeable improvements in reds and greens. CSS color(display-p3 r g b) allows specifying colors in P3. When converting from sRGB to P3, colors look the same on P3 displays. When converting from P3 to sRGB, colors outside the sRGB gamut are clipped or remapped, losing vibrancy.",
  },
  {
    question: "How does gamma correction affect color values?",
    answer:
      "Gamma correction accounts for the nonlinear relationship between a pixel's digital value and its actual physical brightness on a display. Human perception of brightness is roughly logarithmic, while display hardware is roughly exponential. Without gamma correction, 8-bit color would show noticeable banding in dark areas. sRGB uses a gamma curve of approximately 2.2. When performing color calculations (like contrast ratios or color mixing), you must first linearize the RGB values (undo the gamma curve), perform the calculation, then reapply gamma. Color spaces like OKLCH and LAB handle this internally, producing perceptually accurate results from simple arithmetic.",
  },
  {
    question: "What are HWB, CMYK, and HSV color models used for?",
    answer:
      "HWB (Hue, Whiteness, Blackness) is a CSS Color Level 4 format that is intuitive for picking colors: start with a hue, then add white or black. CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard for print using subtractive color mixing. HSV/HSB (Hue, Saturation, Value/Brightness) is similar to HSL but uses value instead of lightness — value is the maximum of R, G, B while lightness is the average. HSV is commonly used in graphics software color pickers. CSS does not support CMYK natively — print conversion is done in design tools or dedicated converters.",
  },
  {
    question: "How do I programmatically check if a color is light or dark?",
    answer:
      "The standard technique calculates relative luminance using sRGB coefficients. First, convert the color to linear RGB (undo gamma): for each channel, if val <= 0.04045, linear = val / 12.92; else linear = ((val + 0.055) / 1.055) ^ 2.4. Then relative luminance L = 0.2126*R_linear + 0.7152*G_linear + 0.0722*B_linear. If L > 0.5, the color is considered light; otherwise dark. This threshold matches WCAG's distinction and is used by Tailwind, Bootstrap, and most design systems. A simpler but less accurate heuristic: luminance = 0.299*R + 0.587*G + 0.114*B in raw 8-bit values.",
  },
];

export default function ColorConverterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Color Converter"
            description={pageDescription}
            introText="Convert colors between HEX, RGB, HSL, HSV, CMYK, and named color formats. Get CSS-ready values and preview the color instantly. Perfect for web design and development."
            breadcrumbs={breadcrumbs}
          >
            <ColorConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Color Models for the Web
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The web platform supports multiple color models because different tasks benefit from different representations. HEX format is the most compact and has been the CSS standard since the beginning — every web developer recognizes #FF5733 as a specific color. RGB is more explicit about the channel values and supports the rgba() function for opacity. HSL is the most intuitive for humans: if you want a darker variant of a color, you lower the lightness; if you want a less vibrant version, you lower the saturation. The same operation in HEX or RGB requires calculating new channel values, which is not straightforward because the relationship between channels and perceived brightness is nonlinear.
            </p>
            <p>
              CSS now supports even more color models including HWB (hue, whiteness, blackness), LAB (perceptually uniform lightness and color axes), OKLCH (a more perceptually uniform variant of HSL), and the color() function that can specify colors in any color space including Display P3 and Rec. 2020. These newer models address the fundamental issue with RGB-based models: they are device-dependent and perceptually non-uniform. OKLCH, in particular, has gained rapid adoption because it provides perceptually uniform color manipulation — the same delta in L, C, or H values produces the same perceived color difference, regardless of the starting hue. This makes it ideal for generating color scales and accessible color palettes. The <Link href="/css-minifier" className="text-blue-600 hover:underline dark:text-blue-400">CSS Minifier</Link> can help optimize stylesheets using these modern color functions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Color Conversion for Accessibility and WCAG Compliance
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Converting between color formats is the first step in any accessibility audit. WCAG 2.1 contrast ratio calculations require the relative luminance of each color, which demands linearizing the sRGB values — a conversion that is most easily performed on the RGB representation. Starting from HEX, you decode to RGB, linearize, calculate luminance, and compute the contrast ratio. Many automated accessibility tools handle this internally, but understanding the conversion process helps you make informed design decisions. If your brand color fails contrast requirements on a white background, converting to HSL lets you find the minimum lightness increase needed to pass WCAG AA (4.5:1) while staying close to the original brand color.
            </p>
            <p>
              Color accessibility goes beyond contrast ratios. Some users have color vision deficiencies (color blindness) that affect their ability to distinguish between specific hues. Deuteranopia (red-green) affects about 6% of males, making red/green status indicators indistinguishable. When designing data visualizations or UI indicators, convert your colors to HSL and ensure they differ in lightness (not just hue) so that users with any form of color vision deficiency can perceive the difference. For organizing your color tokens during design system creation, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps standardize color token names across your design tokens and CSS custom properties.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Color in CSS: From Hex to Modern Color Functions
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              CSS color specification has evolved dramatically. CSS1 (1996) supported 16 named colors and rgb(). CSS2 added more named colors totaling 147. CSS3 introduced rgba(), hsl(), hsla(), and 3-digit hex shorthands. CSS Color Level 4 (2022+) added 8-digit hex (#RRGGBBAA), 4-digit hex shorthand (#RGBA), the color() function for specifying colors in any color space, and new functions like lab(), lch(), oklab(), and oklch(). The hwb() function was also standardized. These additions reflect the growing needs of modern design: high-DPI displays with wider gamuts, dark mode theming, and design token systems that need programmatic color manipulation.
            </p>
            <p>
              The trend in CSS is toward perceptually uniform color spaces. OKLCH, in particular, has become the preferred format for design tokens because it makes color scaling predictable. A scale from light to dark in OKLCH maintains consistent hue and chroma, producing clean, uniform color progressions. Tools like Tailwind CSS have adopted OKLCH for their color palette generation. When working with color values in other contexts like hash representation or data encoding, the <Link href="/number-base-converter" className="text-blue-600 hover:underline dark:text-blue-400">Number Base Converter</Link> helps with the underlying hexadecimal arithmetic that powers color conversion.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Color Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Palette", title: "CSS Minifier", description: "Minify and beautify CSS stylesheets for production", href: "/css-minifier" },
              { icon: "CaseSensitive", title: "Case Converter", description: "Convert text between camelCase, snake_case, and more", href: "/case-converter" },
              { icon: "Hash", title: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal", href: "/number-base-converter" },
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="color-converter" />
    </>
  );
}
