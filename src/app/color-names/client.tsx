"use client";

import { useState, useMemo } from "react";

const COLORS = [
  { name: "AliceBlue", hex: "#F0F8FF", rgb: "rgb(240, 248, 255)", family: "whites" },
  { name: "AntiqueWhite", hex: "#FAEBD7", rgb: "rgb(250, 235, 215)", family: "whites" },
  { name: "Aqua", hex: "#00FFFF", rgb: "rgb(0, 255, 255)", family: "cyans" },
  { name: "Aquamarine", hex: "#7FFFD4", rgb: "rgb(127, 255, 212)", family: "greens" },
  { name: "Azure", hex: "#F0FFFF", rgb: "rgb(240, 255, 255)", family: "whites" },
  { name: "Beige", hex: "#F5F5DC", rgb: "rgb(245, 245, 220)", family: "whites" },
  { name: "Bisque", hex: "#FFE4C4", rgb: "rgb(255, 228, 196)", family: "oranges" },
  { name: "Black", hex: "#000000", rgb: "rgb(0, 0, 0)", family: "grays" },
  { name: "BlanchedAlmond", hex: "#FFEBCD", rgb: "rgb(255, 235, 205)", family: "oranges" },
  { name: "Blue", hex: "#0000FF", rgb: "rgb(0, 0, 255)", family: "blues" },
  { name: "BlueViolet", hex: "#8A2BE2", rgb: "rgb(138, 43, 226)", family: "purples" },
  { name: "Brown", hex: "#A52A2A", rgb: "rgb(165, 42, 42)", family: "browns" },
  { name: "BurlyWood", hex: "#DEB887", rgb: "rgb(222, 184, 135)", family: "browns" },
  { name: "CadetBlue", hex: "#5F9EA0", rgb: "rgb(95, 158, 160)", family: "blues" },
  { name: "Chartreuse", hex: "#7FFF00", rgb: "rgb(127, 255, 0)", family: "greens" },
  { name: "Chocolate", hex: "#D2691E", rgb: "rgb(210, 105, 30)", family: "oranges" },
  { name: "Coral", hex: "#FF7F50", rgb: "rgb(255, 127, 80)", family: "oranges" },
  { name: "CornflowerBlue", hex: "#6495ED", rgb: "rgb(100, 149, 237)", family: "blues" },
  { name: "Cornsilk", hex: "#FFF8DC", rgb: "rgb(255, 248, 220)", family: "whites" },
  { name: "Crimson", hex: "#DC143C", rgb: "rgb(220, 20, 60)", family: "reds" },
  { name: "Cyan", hex: "#00FFFF", rgb: "rgb(0, 255, 255)", family: "cyans" },
  { name: "DarkBlue", hex: "#00008B", rgb: "rgb(0, 0, 139)", family: "blues" },
  { name: "DarkCyan", hex: "#008B8B", rgb: "rgb(0, 139, 139)", family: "cyans" },
  { name: "DarkGoldenRod", hex: "#B8860B", rgb: "rgb(184, 134, 11)", family: "oranges" },
  { name: "DarkGray", hex: "#A9A9A9", rgb: "rgb(169, 169, 169)", family: "grays" },
  { name: "DarkGrey", hex: "#A9A9A9", rgb: "rgb(169, 169, 169)", family: "grays" },
  { name: "DarkGreen", hex: "#006400", rgb: "rgb(0, 100, 0)", family: "greens" },
  { name: "DarkKhaki", hex: "#BDB76B", rgb: "rgb(189, 183, 107)", family: "yellows" },
  { name: "DarkMagenta", hex: "#8B008B", rgb: "rgb(139, 0, 139)", family: "purples" },
  { name: "DarkOliveGreen", hex: "#556B2F", rgb: "rgb(85, 107, 47)", family: "greens" },
  { name: "DarkOrange", hex: "#FF8C00", rgb: "rgb(255, 140, 0)", family: "oranges" },
  { name: "DarkOrchid", hex: "#9932CC", rgb: "rgb(153, 50, 204)", family: "purples" },
  { name: "DarkRed", hex: "#8B0000", rgb: "rgb(139, 0, 0)", family: "reds" },
  { name: "DarkSalmon", hex: "#E9967A", rgb: "rgb(233, 150, 122)", family: "reds" },
  { name: "DarkSeaGreen", hex: "#8FBC8F", rgb: "rgb(143, 188, 143)", family: "greens" },
  { name: "DarkSlateBlue", hex: "#483D8B", rgb: "rgb(72, 61, 139)", family: "purples" },
  { name: "DarkSlateGray", hex: "#2F4F4F", rgb: "rgb(47, 79, 79)", family: "grays" },
  { name: "DarkSlateGrey", hex: "#2F4F4F", rgb: "rgb(47, 79, 79)", family: "grays" },
  { name: "DarkTurquoise", hex: "#00CED1", rgb: "rgb(0, 206, 209)", family: "cyans" },
  { name: "DarkViolet", hex: "#9400D3", rgb: "rgb(148, 0, 211)", family: "purples" },
  { name: "DeepPink", hex: "#FF1493", rgb: "rgb(255, 20, 147)", family: "pinks" },
  { name: "DeepSkyBlue", hex: "#00BFFF", rgb: "rgb(0, 191, 255)", family: "blues" },
  { name: "DimGray", hex: "#696969", rgb: "rgb(105, 105, 105)", family: "grays" },
  { name: "DimGrey", hex: "#696969", rgb: "rgb(105, 105, 105)", family: "grays" },
  { name: "DodgerBlue", hex: "#1E90FF", rgb: "rgb(30, 144, 255)", family: "blues" },
  { name: "FireBrick", hex: "#B22222", rgb: "rgb(178, 34, 34)", family: "reds" },
  { name: "FloralWhite", hex: "#FFFAF0", rgb: "rgb(255, 250, 240)", family: "whites" },
  { name: "ForestGreen", hex: "#228B22", rgb: "rgb(34, 139, 34)", family: "greens" },
  { name: "Fuchsia", hex: "#FF00FF", rgb: "rgb(255, 0, 255)", family: "purples" },
  { name: "Gainsboro", hex: "#DCDCDC", rgb: "rgb(220, 220, 220)", family: "grays" },
  { name: "GhostWhite", hex: "#F8F8FF", rgb: "rgb(248, 248, 255)", family: "whites" },
  { name: "Gold", hex: "#FFD700", rgb: "rgb(255, 215, 0)", family: "yellows" },
  { name: "GoldenRod", hex: "#DAA520", rgb: "rgb(218, 165, 32)", family: "yellows" },
  { name: "Gray", hex: "#808080", rgb: "rgb(128, 128, 128)", family: "grays" },
  { name: "Grey", hex: "#808080", rgb: "rgb(128, 128, 128)", family: "grays" },
  { name: "Green", hex: "#008000", rgb: "rgb(0, 128, 0)", family: "greens" },
  { name: "GreenYellow", hex: "#ADFF2F", rgb: "rgb(173, 255, 47)", family: "greens" },
  { name: "HoneyDew", hex: "#F0FFF0", rgb: "rgb(240, 255, 240)", family: "whites" },
  { name: "HotPink", hex: "#FF69B4", rgb: "rgb(255, 105, 180)", family: "pinks" },
  { name: "IndianRed", hex: "#CD5C5C", rgb: "rgb(205, 92, 92)", family: "reds" },
  { name: "Indigo", hex: "#4B0082", rgb: "rgb(75, 0, 130)", family: "purples" },
  { name: "Ivory", hex: "#FFFFF0", rgb: "rgb(255, 255, 240)", family: "whites" },
  { name: "Khaki", hex: "#F0E68C", rgb: "rgb(240, 230, 140)", family: "yellows" },
  { name: "Lavender", hex: "#E6E6FA", rgb: "rgb(230, 230, 250)", family: "purples" },
  { name: "LavenderBlush", hex: "#FFF0F5", rgb: "rgb(255, 240, 245)", family: "pinks" },
  { name: "LawnGreen", hex: "#7CFC00", rgb: "rgb(124, 252, 0)", family: "greens" },
  { name: "LemonChiffon", hex: "#FFFACD", rgb: "rgb(255, 250, 205)", family: "yellows" },
  { name: "LightBlue", hex: "#ADD8E6", rgb: "rgb(173, 216, 230)", family: "blues" },
  { name: "LightCoral", hex: "#F08080", rgb: "rgb(240, 128, 128)", family: "reds" },
  { name: "LightCyan", hex: "#E0FFFF", rgb: "rgb(224, 255, 255)", family: "cyans" },
  { name: "LightGoldenRodYellow", hex: "#FAFAD2", rgb: "rgb(250, 250, 210)", family: "yellows" },
  { name: "LightGray", hex: "#D3D3D3", rgb: "rgb(211, 211, 211)", family: "grays" },
  { name: "LightGrey", hex: "#D3D3D3", rgb: "rgb(211, 211, 211)", family: "grays" },
  { name: "LightGreen", hex: "#90EE90", rgb: "rgb(144, 238, 144)", family: "greens" },
  { name: "LightPink", hex: "#FFB6C1", rgb: "rgb(255, 182, 193)", family: "pinks" },
  { name: "LightSalmon", hex: "#FFA07A", rgb: "rgb(255, 160, 122)", family: "reds" },
  { name: "LightSeaGreen", hex: "#20B2AA", rgb: "rgb(32, 178, 170)", family: "greens" },
  { name: "LightSkyBlue", hex: "#87CEFA", rgb: "rgb(135, 206, 250)", family: "blues" },
  { name: "LightSlateGray", hex: "#778899", rgb: "rgb(119, 136, 153)", family: "grays" },
  { name: "LightSlateGrey", hex: "#778899", rgb: "rgb(119, 136, 153)", family: "grays" },
  { name: "LightSteelBlue", hex: "#B0C4DE", rgb: "rgb(176, 196, 222)", family: "blues" },
  { name: "LightYellow", hex: "#FFFFE0", rgb: "rgb(255, 255, 224)", family: "yellows" },
  { name: "Lime", hex: "#00FF00", rgb: "rgb(0, 255, 0)", family: "greens" },
  { name: "LimeGreen", hex: "#32CD32", rgb: "rgb(50, 205, 50)", family: "greens" },
  { name: "Linen", hex: "#FAF0E6", rgb: "rgb(250, 240, 230)", family: "whites" },
  { name: "Magenta", hex: "#FF00FF", rgb: "rgb(255, 0, 255)", family: "purples" },
  { name: "Maroon", hex: "#800000", rgb: "rgb(128, 0, 0)", family: "reds" },
  { name: "MediumAquaMarine", hex: "#66CDAA", rgb: "rgb(102, 205, 170)", family: "greens" },
  { name: "MediumBlue", hex: "#0000CD", rgb: "rgb(0, 0, 205)", family: "blues" },
  { name: "MediumOrchid", hex: "#BA55D3", rgb: "rgb(186, 85, 211)", family: "purples" },
  { name: "MediumPurple", hex: "#9370DB", rgb: "rgb(147, 112, 219)", family: "purples" },
  { name: "MediumSeaGreen", hex: "#3CB371", rgb: "rgb(60, 179, 113)", family: "greens" },
  { name: "MediumSlateBlue", hex: "#7B68EE", rgb: "rgb(123, 104, 238)", family: "purples" },
  { name: "MediumSpringGreen", hex: "#00FA9A", rgb: "rgb(0, 250, 154)", family: "greens" },
  { name: "MediumTurquoise", hex: "#48D1CC", rgb: "rgb(72, 209, 204)", family: "cyans" },
  { name: "MediumVioletRed", hex: "#C71585", rgb: "rgb(199, 21, 133)", family: "pinks" },
  { name: "MidnightBlue", hex: "#191970", rgb: "rgb(25, 25, 112)", family: "blues" },
  { name: "MintCream", hex: "#F5FFFA", rgb: "rgb(245, 255, 250)", family: "whites" },
  { name: "MistyRose", hex: "#FFE4E1", rgb: "rgb(255, 228, 225)", family: "pinks" },
  { name: "Moccasin", hex: "#FFE4B5", rgb: "rgb(255, 228, 181)", family: "oranges" },
  { name: "NavajoWhite", hex: "#FFDEAD", rgb: "rgb(255, 222, 173)", family: "oranges" },
  { name: "Navy", hex: "#000080", rgb: "rgb(0, 0, 128)", family: "blues" },
  { name: "OldLace", hex: "#FDF5E6", rgb: "rgb(253, 245, 230)", family: "whites" },
  { name: "Olive", hex: "#808000", rgb: "rgb(128, 128, 0)", family: "yellows" },
  { name: "OliveDrab", hex: "#6B8E23", rgb: "rgb(107, 142, 35)", family: "greens" },
  { name: "Orange", hex: "#FFA500", rgb: "rgb(255, 165, 0)", family: "oranges" },
  { name: "OrangeRed", hex: "#FF4500", rgb: "rgb(255, 69, 0)", family: "oranges" },
  { name: "Orchid", hex: "#DA70D6", rgb: "rgb(218, 112, 214)", family: "purples" },
  { name: "PaleGoldenRod", hex: "#EEE8AA", rgb: "rgb(238, 232, 170)", family: "yellows" },
  { name: "PaleGreen", hex: "#98FB98", rgb: "rgb(152, 251, 152)", family: "greens" },
  { name: "PaleTurquoise", hex: "#AFEEEE", rgb: "rgb(175, 238, 238)", family: "cyans" },
  { name: "PaleVioletRed", hex: "#DB7093", rgb: "rgb(219, 112, 147)", family: "pinks" },
  { name: "PapayaWhip", hex: "#FFEFD5", rgb: "rgb(255, 239, 213)", family: "oranges" },
  { name: "PeachPuff", hex: "#FFDAB9", rgb: "rgb(255, 218, 185)", family: "oranges" },
  { name: "Peru", hex: "#CD853F", rgb: "rgb(205, 133, 63)", family: "oranges" },
  { name: "Pink", hex: "#FFC0CB", rgb: "rgb(255, 192, 203)", family: "pinks" },
  { name: "Plum", hex: "#DDA0DD", rgb: "rgb(221, 160, 221)", family: "purples" },
  { name: "PowderBlue", hex: "#B0E0E6", rgb: "rgb(176, 224, 230)", family: "blues" },
  { name: "Purple", hex: "#800080", rgb: "rgb(128, 0, 128)", family: "purples" },
  { name: "RebeccaPurple", hex: "#663399", rgb: "rgb(102, 51, 153)", family: "purples" },
  { name: "Red", hex: "#FF0000", rgb: "rgb(255, 0, 0)", family: "reds" },
  { name: "RosyBrown", hex: "#BC8F8F", rgb: "rgb(188, 143, 143)", family: "browns" },
  { name: "RoyalBlue", hex: "#4169E1", rgb: "rgb(65, 105, 225)", family: "blues" },
  { name: "SaddleBrown", hex: "#8B4513", rgb: "rgb(139, 69, 19)", family: "browns" },
  { name: "Salmon", hex: "#FA8072", rgb: "rgb(250, 128, 114)", family: "reds" },
  { name: "SandyBrown", hex: "#F4A460", rgb: "rgb(244, 164, 96)", family: "oranges" },
  { name: "SeaGreen", hex: "#2E8B57", rgb: "rgb(46, 139, 87)", family: "greens" },
  { name: "SeaShell", hex: "#FFF5EE", rgb: "rgb(255, 245, 238)", family: "whites" },
  { name: "Sienna", hex: "#A0522D", rgb: "rgb(160, 82, 45)", family: "browns" },
  { name: "Silver", hex: "#C0C0C0", rgb: "rgb(192, 192, 192)", family: "grays" },
  { name: "SkyBlue", hex: "#87CEEB", rgb: "rgb(135, 206, 235)", family: "blues" },
  { name: "SlateBlue", hex: "#6A5ACD", rgb: "rgb(106, 90, 205)", family: "purples" },
  { name: "SlateGray", hex: "#708090", rgb: "rgb(112, 128, 144)", family: "grays" },
  { name: "SlateGrey", hex: "#708090", rgb: "rgb(112, 128, 144)", family: "grays" },
  { name: "Snow", hex: "#FFFAFA", rgb: "rgb(255, 250, 250)", family: "whites" },
  { name: "SpringGreen", hex: "#00FF7F", rgb: "rgb(0, 255, 127)", family: "greens" },
  { name: "SteelBlue", hex: "#4682B4", rgb: "rgb(70, 130, 180)", family: "blues" },
  { name: "Tan", hex: "#D2B48C", rgb: "rgb(210, 180, 140)", family: "browns" },
  { name: "Teal", hex: "#008080", rgb: "rgb(0, 128, 128)", family: "cyans" },
  { name: "Thistle", hex: "#D8BFD8", rgb: "rgb(216, 191, 216)", family: "purples" },
  { name: "Tomato", hex: "#FF6347", rgb: "rgb(255, 99, 71)", family: "oranges" },
  { name: "Turquoise", hex: "#40E0D0", rgb: "rgb(64, 224, 208)", family: "cyans" },
  { name: "Violet", hex: "#EE82EE", rgb: "rgb(238, 130, 238)", family: "purples" },
  { name: "Wheat", hex: "#F5DEB3", rgb: "rgb(245, 222, 179)", family: "yellows" },
  { name: "White", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)", family: "whites" },
  { name: "WhiteSmoke", hex: "#F5F5F5", rgb: "rgb(245, 245, 245)", family: "whites" },
  { name: "Yellow", hex: "#FFFF00", rgb: "rgb(255, 255, 0)", family: "yellows" },
  { name: "YellowGreen", hex: "#9ACD32", rgb: "rgb(154, 205, 50)", family: "greens" },
];

const FAMILIES: Record<string, string> = {
  reds: "Reds",
  pinks: "Pinks",
  oranges: "Oranges",
  yellows: "Yellows",
  greens: "Greens",
  cyans: "Cyans",
  blues: "Blues",
  purples: "Purples",
  browns: "Browns",
  whites: "Whites",
  grays: "Grays",
};

function getTextColor(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 140 ? "#1a1a1a" : "#ffffff";
}

export function ColorNamesClient() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return COLORS;
    return COLORS.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.hex.toLowerCase().includes(s) ||
        c.family.includes(s),
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof COLORS> = {};
    for (const color of filtered) {
      if (!groups[color.family]) groups[color.family] = [];
      groups[color.family].push(color);
    }
    return groups;
  }, [filtered]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by color name, hex, or family..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 sm:max-w-md"
          aria-label="Search colors"
        />
      </div>

      {Object.entries(grouped).map(([family, colors]) => (
        <div key={family} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {FAMILIES[family] || family}
            <span className="ml-2 text-sm font-normal text-zinc-500">
              ({colors.length})
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {colors.map((color) => (
              <div
                key={color.name}
                className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <div
                  className="mb-2 h-16 rounded-md"
                  style={{ backgroundColor: color.hex }}
                />
                <div
                  className="text-xs font-medium"
                  style={{ color: getTextColor("#ffffff") }}
                >
                  <p className="text-zinc-900 dark:text-zinc-100">
                    {color.name}
                  </p>
                  <p className="font-mono text-zinc-500">{color.hex}</p>
                  <p className="hidden font-mono text-zinc-500 sm:block">
                    {color.rgb}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {Object.keys(grouped).length === 0 && (
        <p className="py-8 text-center text-zinc-500">
          No colors found matching your search.
        </p>
      )}
    </div>
  );
}
