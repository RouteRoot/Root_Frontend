"use client";

import { InputHTMLAttributes } from "react";

interface UnderlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export default function Input({
  icon,
  ...props
}: UnderlineInputProps) {
  return (
    <div className="flex w-full items-center border-b-2 border-[#8B6B55] pb-2">
      {icon && <div className=" text-gray-400">{icon}</div>}

      <input
        {...props}
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg"
      />
    </div>
  );
}
