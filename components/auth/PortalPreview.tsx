import { cn } from "@/lib/cn";

const BARS = [30, 42, 36, 50, 44, 58, 68];
const CHART = { left: 28, width: 344, baseline: 206, barWidth: 26 };

/** Compact, illustrative preview of the merchant portal for the sign-in page. */
export function PortalPreview({ className }: { className?: string }) {
  const slot = CHART.width / BARS.length;

  return (
    <svg
      viewBox="0 0 440 300"
      role="img"
      aria-labelledby="portal-preview-title"
      className={cn("h-auto overflow-visible font-sans", className)}
    >
      <title id="portal-preview-title">
        Illustration of the merchant portal showing today&apos;s collections
        and a payment notification
      </title>
      <defs>
        <linearGradient id="pp-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00beaf" />
          <stop offset="1" stopColor="#0059b1" />
        </linearGradient>
        <filter
          id="pp-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="20"
            stdDeviation="18"
            floodColor="#010826"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      <g>
        <rect width="400" height="236" rx="22" fill="#fff" filter="url(#pp-shadow)" />
        <text x="28" y="42" fontSize="13" fontWeight="700" fill="#5a6478">
          Collections today
        </text>
        <rect x="312" y="24" width="60" height="26" rx="13" fill="#e6f6f7" />
        <text x="342" y="41.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#007a86">
          Today
        </text>
        <text x="28" y="88" fontWeight="700">
          <tspan fontSize="15" fill="#5a6478">RWF</tspan>
          <tspan dx="7" fontSize="32" fill="#041333">1,284,500</tspan>
        </text>
        <text x="28" y="112" fontSize="12.5" fill="#5a6478">
          48 payments · Updated 10:42
        </text>
        {BARS.map((height, index) => (
          <rect
            key={index}
            x={CHART.left + index * slot + (slot - CHART.barWidth) / 2}
            y={CHART.baseline - height}
            width={CHART.barWidth}
            height={height}
            rx="6"
            fill={index === BARS.length - 1 ? "url(#pp-bar)" : "#dde6f6"}
          />
        ))}
      </g>

      <g transform="translate(150 212)">
        <rect width="270" height="68" rx="20" fill="#fff" filter="url(#pp-shadow)" />
        <circle cx="36" cy="34" r="18" fill="#0098a7" />
        <path
          d="M28.5 34.5l5 5 10-10.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="66" y="30" fontSize="14.5" fontWeight="700" fill="#041333">
          Payment received
        </text>
        <text x="66" y="50" fontSize="12.5" fill="#5a6478">
          RWF 25,000 · Just now
        </text>
      </g>
    </svg>
  );
}
