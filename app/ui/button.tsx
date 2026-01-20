import * as React from "react";
import { cn } from "../lib/utils";

type Variant = "default" | "outline" | "hero";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type LinkButtonProps = AnchorProps | ButtonProps;

export function LinkButton(props: LinkButtonProps) {
  const { variant = "default", size = "md", className, children } = props;

  const commonClasses =
    "inline-flex items-center justify-center font-semibold transition cursor-pointer rounded-sm";

  const variantClasses: Record<Variant, string> = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border-2 border-primary text-primary hover:text-white hover:bg-primary",
    hero: "bg-primary text-white shadow-lg hover:scale-105",
  };

  const sizeClasses: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-8 text-base",
  };

  const classes = cn(
    commonClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props) {
    const { href, ...anchorProps } = props as AnchorProps; // ✅ CAST CLAIR

    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonProps; // ✅ CAST CLAIR

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
