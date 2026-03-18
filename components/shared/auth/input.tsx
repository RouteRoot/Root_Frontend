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
    <div className="flex w-86 items-center border-b-2 border-[#000000] pb-2">
      {icon && <div className=" text-gray-400">{icon}</div>}

      <input
        {...props}
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-[14px]"
      />
    </div>
  );
}
