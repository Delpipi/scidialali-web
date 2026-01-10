import * as React from "react";
import { cn } from "../lib/utils"; // Assuming cn is a utility for combining class names
import Link from "next/link";

type ButtonProps = {
  href?: string; // Optional href for navigation (if you want to support <a> links)
  onClick?: () => void; // Optional click handler
  variant?: "default" | "outline" | "hero"; // Button style variants
  size?: "sm" | "md" | "lg"; // Button size options
  className?: string; // Custom className
  children: React.ReactNode; // Button content
};

export function LinkButton({
  onClick,
  variant = "default",
  size = "md",
  className,
  children,
  href,
}: ButtonProps) {
  const commonClasses =
    "inline-flex items-center justify-center font-semibold transition cursor-pointer rounded-sm";

  const variantClasses = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border-2 border-primary text-primary hover:text-white hover:bg-primary",
    hero: "bg-primary text-white shadow-lg hover:scale-105",
  };

  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-8 text-base",
  };

  const buttonClasses = cn(
    commonClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return href ? (
    <a href={href} className={buttonClasses}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
}
