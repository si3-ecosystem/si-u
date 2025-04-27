import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface TextProps {
  variant?: "base" | "xl" | "2xl";
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export const Text = ({
  variant = "base",
  as: Tag = "p",
  children,
  className,
}: TextProps) => {
  const variantStyles = {
    base: "text-[#454545] [font-size:clamp(1rem,0.95rem+0.11vw,1rem)] [line-height:clamp(1.4rem,1.35rem+0.14vw,1.4rem)]",
    xl: " text-[#454545] [font-size:clamp(1rem,1rem+0.09vw,1.25rem)] [line-height:clamp(1.4rem,1.4rem+0.13vw,1.75rem)]",
    "2xl":
      " text-black [font-size:clamp(1rem,1rem+0.18vw,1.5rem)] [line-height:clamp(1.4rem,1.4rem+0.21vw,2.1rem)]",
  };

  return (
    <Tag
      className={cn(
        "!font-roobert font-normal",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
};
