const NODES = [
  { label: "Your Browser", sub: "Chrome, Safari, curl", icon: "🌐", x: 20 },
  { label: "DNS Recursor", sub: "8.8.8.8, 1.1.1.1", icon: "🔄", x: 195 },
  { label: "Root Server", sub: ". (13 clusters)", icon: "🌳", x: 370 },
  { label: "TLD Server", sub: ".com, .org, .net", icon: "🏛️", x: 545 },
  { label: "Authoritative NS", sub: "ns1.example.com", icon: "🏢", x: 720 },
  { label: "DNS Records", sub: "A, AAAA, MX, TXT…", icon: "📋", x: 895 },
];

const NODE_W = 135;
const NODE_H = 64;
const NODE_Y = 110;
const CENTERS = NODES.map((n) => n.x + NODE_W / 2);
const ARROW_Y = NODE_Y + NODE_H / 2;

export function DnsVisualization() {
  return (
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          How DNS Resolution Works
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Tracing the iterative query path from your browser through the DNS hierarchy.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
          <svg
            viewBox="0 0 1050 290"
            className="w-full h-auto"
            role="img"
            aria-label="Diagram showing the DNS resolution flow from browser through recursive resolver, root server, TLD server, authoritative name server, to DNS records"
          >
            <defs>
              <marker
                id="arrow-emerald"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" className="fill-emerald-500" />
              </marker>
              <marker
                id="arrow-zinc"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" className="fill-zinc-400 dark:fill-zinc-500" />
              </marker>
            </defs>

            {NODES.map((node, i) => (
              <g key={node.label}>
                <text
                  x={CENTERS[i]}
                  y={NODE_Y - 30}
                  textAnchor="middle"
                  fontSize="24"
                  aria-hidden="true"
                >
                  {node.icon}
                </text>
                <rect
                  x={node.x}
                  y={NODE_Y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  className="fill-white stroke-zinc-200 dark:fill-zinc-800 dark:stroke-zinc-700"
                />
                <text
                  x={CENTERS[i]}
                  y={NODE_Y + 26}
                  textAnchor="middle"
                  className="fill-zinc-900 text-[13px] font-semibold dark:fill-zinc-50"
                >
                  {node.label}
                </text>
                <text
                  x={CENTERS[i]}
                  y={NODE_Y + 48}
                  textAnchor="middle"
                  className="fill-zinc-500 text-[11px] dark:fill-zinc-400"
                >
                  {node.sub}
                </text>
              </g>
            ))}

            {NODES.slice(0, -1).map((node, i) => {
              const sx = node.x + NODE_W;
              const ex = NODES[i + 1].x;
              const mx = (sx + ex) / 2;
              return (
                <g key={`step-${i}`}>
                  <line
                    x1={sx}
                    y1={ARROW_Y}
                    x2={ex}
                    y2={ARROW_Y}
                    strokeWidth={2}
                    className="stroke-emerald-500"
                    markerEnd="url(#arrow-emerald)"
                  />
                  <circle
                    cx={mx}
                    cy={ARROW_Y - 22}
                    r={11}
                    className="fill-emerald-500"
                  />
                  <text
                    x={mx}
                    y={ARROW_Y - 18}
                    textAnchor="middle"
                    className="fill-white text-[11px] font-bold"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}

            <path
              d={`M ${NODES[NODES.length - 1].x} ${ARROW_Y + 85} L ${NODES[0].x + NODE_W} ${ARROW_Y + 85}`}
              fill="none"
              strokeWidth={2}
              strokeDasharray="6 4"
              className="stroke-zinc-400 dark:stroke-zinc-500"
              markerEnd="url(#arrow-zinc)"
            />

            <text
              x={CENTERS[0] + (CENTERS[CENTERS.length - 1] - CENTERS[0]) / 2}
              y={ARROW_Y + 105}
              textAnchor="middle"
              className="fill-zinc-500 text-[12px] dark:fill-zinc-400"
            >
              Response: resolved IP addresses and DNS records
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
