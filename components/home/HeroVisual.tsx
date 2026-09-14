/**
 * Product illustration for the hero: an I&M payment terminal with an
 * approved payment, the merchant's collections overview and a payment
 * notification. Drawn as a single scalable SVG so it stays crisp at every
 * breakpoint. All figures are illustrative.
 */

const CHART = {
  left: 76,
  width: 268,
  baseline: 238,
  barWidth: 22,
  heights: [40, 56, 48, 66, 58, 76, 88],
  days: ["M", "T", "W", "T", "F", "S", "S"],
};

const KEYPAD_COLUMNS = [14, 78, 142];
const KEYPAD_ROWS = [
  { y: 244, keys: ["1", "2", "3"] },
  { y: 278, keys: ["4", "5", "6"] },
  { y: 312, keys: ["7", "8", "9"] },
  { y: 346, keys: ["*", "0", "#"] },
];

const PAYMENTS = [
  { y: 310, time: "10:42", amount: "RWF 25,000" },
  { y: 352, time: "10:18", amount: "RWF 8,500" },
];

const RECEIPT_PATH = `M44 18V-50${"l7.5-8l7.5 8".repeat(8)}V18Z`;

export function HeroVisual() {
  const slot = CHART.width / CHART.days.length;

  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[40%] -bottom-28 top-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_40%)] lg:hidden"
      >
        <div className="absolute inset-y-0 left-[46%] w-full -skew-x-[14deg] bg-[linear-gradient(180deg,#ffffff_0%,#eef3fb_55%,#e8eef8_100%)]" />
        <div className="absolute inset-y-0 left-[45%] w-1.5 -skew-x-[14deg] bg-brand-gradient" />
      </div>
      <svg
        viewBox="0 0 580 540"
        role="img"
        aria-labelledby="hero-visual-title"
        className="h-auto w-full overflow-visible font-sans"
      >
        <title id="hero-visual-title">
          Illustration of an I&amp;M Bank payment terminal showing an approved
          payment, next to a merchant overview of today&apos;s collections
        </title>
        <defs>
          <linearGradient id="hv-terminal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#12306f" />
            <stop offset="1" stopColor="#061437" />
          </linearGradient>
          <linearGradient id="hv-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00beaf" />
            <stop offset="1" stopColor="#0059b1" />
          </linearGradient>
          <filter
            id="hv-shadow-lg"
            x="-30%"
            y="-20%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy="26"
              stdDeviation="22"
              floodColor="#010826"
              floodOpacity="0.45"
            />
          </filter>
          <filter
            id="hv-shadow-md"
            x="-30%"
            y="-50%"
            width="160%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="14"
              floodColor="#010826"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        {/* Merchant overview card */}
        <g className="animate-fade-up [animation-delay:150ms]">
          <g transform="translate(196 8)">
            <rect width="372" height="392" rx="24" fill="#fff" filter="url(#hv-shadow-lg)" />
            <text x="76" y="46" fontSize="13" fontWeight="700" fill="#5a6478">
              Collections today
            </text>
            <rect x="284" y="26" width="60" height="26" rx="13" fill="#e6f6f7" />
            <text x="314" y="43.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#007a86">
              Today
            </text>
            <text x="76" y="92" fontWeight="700">
              <tspan fontSize="15" fill="#5a6478">RWF</tspan>
              <tspan dx="7" fontSize="34" fill="#041333">1,284,500</tspan>
            </text>
            <text x="76" y="118" fontSize="12.5" fill="#5a6478">
              48 payments · Updated 10:42
            </text>

            {CHART.heights.map((height, index) => {
              const x = CHART.left + index * slot + (slot - CHART.barWidth) / 2;
              const isToday = index === CHART.heights.length - 1;
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={CHART.baseline - height}
                    width={CHART.barWidth}
                    height={height}
                    rx="6"
                    fill={isToday ? "url(#hv-bar)" : "#dde6f6"}
                  />
                  <text
                    x={x + CHART.barWidth / 2}
                    y={CHART.baseline + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isToday ? 700 : 400}
                    fill={isToday ? "#041333" : "#5a6478"}
                  >
                    {CHART.days[index]}
                  </text>
                </g>
              );
            })}

            <line x1="76" x2="344" y1="280" y2="280" stroke="#e3e7ef" />

            {PAYMENTS.map((payment) => (
              <g key={payment.time}>
                <circle cx="92" cy={payment.y} r="17" fill="#eef3fb" />
                <path
                  d={`M97 ${payment.y - 5}L87 ${payment.y + 5}M87 ${payment.y - 2}V${payment.y + 5}H94`}
                  fill="none"
                  stroke="#0033a1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x="120" y={payment.y - 4} fontSize="13.5" fontWeight="700" fill="#041333">
                  Customer payment
                </text>
                <text x="120" y={payment.y + 14} fontSize="12" fill="#5a6478">
                  {payment.time}
                </text>
                <text x="344" y={payment.y - 4} textAnchor="end" fontSize="13.5" fontWeight="700" fill="#041333">
                  {payment.amount}
                </text>
                <text x="344" y={payment.y + 14} textAnchor="end" fontSize="12" fontWeight="700" fill="#007a86">
                  Successful
                </text>
              </g>
            ))}
          </g>
        </g>

        {/* Payment terminal */}
        <g className="animate-fade-up [animation-delay:300ms]">
          <g transform="translate(24 112)">
            <path d={RECEIPT_PATH} fill="#f8fafd" />
            <rect x="58" y="-40" width="54" height="5" rx="2.5" fill="#d5dce8" />
            <rect x="58" y="-29" width="92" height="5" rx="2.5" fill="#e3e7ef" />
            <text x="58" y="-9" fontSize="11" fontWeight="700" fill="#041333">
              RWF 25,000
            </text>

            <rect width="208" height="424" rx="32" fill="url(#hv-terminal)" filter="url(#hv-shadow-lg)" />
            <rect
              x="0.75"
              y="0.75"
              width="206.5"
              height="422.5"
              rx="31.25"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.12"
              strokeWidth="1.5"
            />
            <rect x="36" y="12" width="136" height="6" rx="3" fill="#020a22" />

            {/* Screen */}
            <rect x="14" y="30" width="180" height="196" rx="18" fill="#fff" />
            <text x="30" y="52" fontSize="10.5" fontWeight="700" fill="#5a6478">
              10:42
            </text>
            <rect x="148" y="47" width="3" height="5" rx="1" fill="#5a6478" />
            <rect x="153" y="45" width="3" height="7" rx="1" fill="#5a6478" />
            <rect x="158" y="43" width="3" height="9" rx="1" fill="#5a6478" />
            <rect x="165" y="44" width="15" height="8" rx="2" fill="none" stroke="#5a6478" strokeWidth="1.2" />
            <rect x="166.6" y="45.6" width="9" height="4.8" rx="1" fill="#0098a7" />
            <rect x="180.6" y="46.5" width="1.6" height="3" rx="0.8" fill="#5a6478" />
            <image href="/brand/im-bank-logo.png" x="45" y="62" width="118" height="29.6" />
            <text x="104" y="122" textAnchor="middle" fontSize="11" fill="#5a6478">
              Amount
            </text>
            <text x="104" y="150" textAnchor="middle" fontSize="22" fontWeight="700" fill="#041333">
              RWF 25,000
            </text>
            <rect x="50" y="168" width="108" height="30" rx="15" fill="#e6f6f7" />
            <circle cx="69" cy="183" r="9" fill="#0098a7" />
            <path
              d="M64.8 183.2l2.9 2.9 5.4-5.6"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="84" y="187.5" fontSize="12" fontWeight="700" fill="#007a86">
              Approved
            </text>

            {/* Keypad */}
            {KEYPAD_ROWS.map((row) =>
              row.keys.map((key, index) => (
                <g key={`${row.y}-${key}`}>
                  <rect x={KEYPAD_COLUMNS[index]} y={row.y} width="52" height="26" rx="9" fill="#1a2f63" />
                  <text
                    x={KEYPAD_COLUMNS[index] + 26}
                    y={row.y + 17.5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#c9d3ea"
                  >
                    {key}
                  </text>
                </g>
              )),
            )}
            <rect x="14" y="382" width="52" height="26" rx="9" fill="#e0566b" />
            <rect x="78" y="382" width="52" height="26" rx="9" fill="#e9ae3c" />
            <rect x="142" y="382" width="52" height="26" rx="9" fill="#18a999" />
            <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M35.5 390.5l9 9M44.5 390.5l-9 9" />
              <path d="M106.5 389.5l-5.5 5.5 5.5 5.5" />
              <path d="M162.5 395.5l4 4 8-8.5" />
            </g>
          </g>
        </g>

        {/* Payment notification */}
        <g className="animate-fade-up [animation-delay:600ms]">
          <g transform="translate(308 426)">
            <rect width="260" height="70" rx="20" fill="#fff" filter="url(#hv-shadow-md)" />
            <circle cx="36" cy="35" r="18" fill="#0098a7" />
            <path
              d="M28.5 35.5l5 5 10-10.5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="66" y="31" fontSize="14.5" fontWeight="700" fill="#041333">
              Payment received
            </text>
            <text x="66" y="51" fontSize="12.5" fill="#5a6478">
              RWF 25,000 · Just now
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
