import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({
  src = "/logo.svg",
  alt = "Logo",
  title,
  width = 83,
  height = 33,
  className,
}: LogoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={cn(className)}
    />
  );
}

export default Logo;
