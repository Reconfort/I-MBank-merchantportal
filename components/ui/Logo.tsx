import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/cn";

type LogoProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  alt?: string;
};

/**
 * Official I&M Bank logo, served untouched from /public/brand.
 * `unoptimized` keeps the original file instead of a re-encoded copy.
 */
export function Logo({ alt = "I&M Bank", className, ...props }: LogoProps) {
  return (
    <Image
      src="/brand/im-bank-logo.png"
      alt={alt}
      width={235}
      height={59}
      unoptimized
      className={cn("h-auto w-[235px] max-w-full", className)}
      {...props}
    />
  );
}
