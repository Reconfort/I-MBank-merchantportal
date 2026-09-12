import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Base 24×24 stroke icon. Icons are decorative unless given a title. */
function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...props}
    >
      {children}
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.75a4 4 0 0 1 8 0v2.75" />
      <path d="M12 14.5v2" />
    </Icon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3 5 5.75v5.5c0 4.35 2.9 8.1 7 9.75 4.1-1.65 7-5.4 7-9.75v-5.5L12 3Z" />
      <path d="m9 12 2.1 2.1L15.25 10" />
    </Icon>
  );
}

export function StorefrontIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 10.5V19a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-8.5" />
      <path d="M3.5 6.25 5 3.5h14l1.5 2.75v1.25a2.75 2.75 0 0 1-5.1 1.4A2.75 2.75 0 0 1 12 10.25 2.75 2.75 0 0 1 8.6 8.9a2.75 2.75 0 0 1-5.1-1.4V6.25Z" />
      <path d="M9.75 20v-4.25a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1V20" />
    </Icon>
  );
}

export function BankIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 9.25 12 4l8.5 5.25" />
      <path d="M5 9.75h14" />
      <path d="M6.5 10v7.5M10 10v7.5M14 10v7.5M17.5 10v7.5" />
      <path d="M4 20h16" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 5.5 6.5 6.5L9 18.5" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 12h-15" />
      <path d="m10.5 6-6 6 6 6" />
    </Icon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 12S6 5.25 12 5.25 21.5 12 21.5 12 18 18.75 12 18.75 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3.5 3.5 17 17" />
      <path d="M10.6 5.35A9.4 9.4 0 0 1 12 5.25c6 0 9.5 6.75 9.5 6.75a17.2 17.2 0 0 1-2.85 3.75" />
      <path d="M6.65 6.7C4.05 8.4 2.5 12 2.5 12s3.5 6.75 9.5 6.75c1.8 0 3.4-.55 4.75-1.35" />
      <path d="M9.9 9.95a3 3 0 0 0 4.15 4.15" />
    </Icon>
  );
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.75v5" />
      <path d="M12 16.25h.01" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.25" />
      <path d="M12 7.75h.01" />
    </Icon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.2 3.5H5.75A1.75 1.75 0 0 0 4 5.3c.3 8.05 6.65 14.4 14.7 14.7a1.75 1.75 0 0 0 1.8-1.75V15.8a1 1 0 0 0-.7-.95l-3.2-1a1 1 0 0 0-1.05.3l-1.4 1.6a12.5 12.5 0 0 1-5.95-5.95l1.6-1.4a1 1 0 0 0 .3-1.05l-1-3.2a1 1 0 0 0-.95-.65Z" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </Icon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </Icon>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 4.5h5.5V10" />
      <path d="m19.5 4.5-8 8" />
      <path d="M17 13.5v4.25a1.75 1.75 0 0 1-1.75 1.75h-9A1.75 1.75 0 0 1 4.5 17.75v-9A1.75 1.75 0 0 1 6.25 7h4.25" />
    </Icon>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 9.5a6 6 0 1 0-12 0c0 3.5-.9 5.3-1.7 6.2a.75.75 0 0 0 .55 1.25h14.3a.75.75 0 0 0 .55-1.25c-.8-.9-1.7-2.7-1.7-6.2Z" />
      <path d="M10 20.25a2.4 2.4 0 0 0 4 0" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </Icon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 4.5h3.25A1.75 1.75 0 0 1 19.5 6.25v11.5a1.75 1.75 0 0 1-1.75 1.75H14.5" />
      <path d="M10 8.5 6.5 12l3.5 3.5" />
      <path d="M6.5 12h8" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </Icon>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 20V5.5A1.5 1.5 0 0 1 6 4h7a1.5 1.5 0 0 1 1.5 1.5V20" />
      <path d="M14.5 9.5H18A1.5 1.5 0 0 1 19.5 11v9" />
      <path d="M3.5 20h17M8 8h3M8 12h3M8 16h3" />
    </Icon>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5.5" y="2.5" width="13" height="19" rx="2.5" />
      <rect x="8.5" y="5.5" width="7" height="4.5" rx="1" />
      <path d="M9 14h.01M12 14h.01M15 14h.01M9 17.5h.01M12 17.5h.01M15 17.5h.01" />
    </Icon>
  );
}

export function CardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M6.5 14.5h3" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.4 2.4L15.5 9.8" />
    </Icon>
  );
}

export function XCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </Icon>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 9.5h9a5 5 0 0 1 0 10H9" />
      <path d="m8 5.5-3.5 4L8 13" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h9" />
    </Icon>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 7.5h9M17.5 7.5h2M4.5 16.5h3M11.5 16.5h8" />
      <circle cx="15" cy="7.5" r="2.2" />
      <circle cx="9" cy="16.5" r="2.2" />
    </Icon>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.6-5.7" />
      <path d="M19.5 4.5V9h-4.5" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.5 16.5 16.5 7.5" />
      <path d="M9 7.5h7.5V15" />
    </Icon>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 15.5 5-5 3.5 3.5 6-6.5" />
      <path d="M14.5 7.5h5v5" />
    </Icon>
  );
}

export function TrendDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 8.5 5 5 3.5-3.5 6 6.5" />
      <path d="M14.5 16.5h5v-5" />
    </Icon>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h7L18 8v12.5H6.5z" />
      <path d="M13 3.5V8h4.5M9.5 12.5h5M9.5 16h5" />
    </Icon>
  );
}
