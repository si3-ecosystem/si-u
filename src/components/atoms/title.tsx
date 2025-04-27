import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TitleProps {
  variant?: "huge" | "large" | "medium" | "sm";
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  children: ReactNode;
  className?: string;
}

export const Title = ({
  variant = "medium",
  as: Tag = "h2",
  children,
  className,
}: TitleProps) => {
  const variantStyles = {
    huge: "text-[40px] lg:text-6xl",
    large: " [font-size:clamp(2.5rem,2.5rem+0.43vw,4rem)]",
    medium: " text-2xl lg:text-4xl",
    sm: "[font-size:clamp(1.75rem,1.75rem+0.07vw,2rem)] font-semibold",
  };

  return (
    <Tag
      className={cn(
        "font-clesmont leading-normal font-normal text-black uppercase",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
};
