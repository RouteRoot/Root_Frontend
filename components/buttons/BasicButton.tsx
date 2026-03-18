"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface BasicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function BasicButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: BasicButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyle = {
    primary: "bg-[#000000] text-white hover:opacity-90",
    outline:
      "border border-[#000000] bg-white text-[rgb(255, 255, 255)] hover:bg-[#f8f3ef]",
    ghost: "bg-transparent text-[#000000] hover:bg-[#f8f3ef]",
  };

  const sizeStyle = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-5 text-base",
    lg: "h-14 px-6 text-lg",
  };

  const widthStyle = fullWidth ? "w-86" : "";

  return (
    <button
      {...props}
      className={`${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
}
