"use client";

import { useEffect, useState } from "react";

type BubuFloatProps = {
  size?: number;
  className?: string;
};

export default function BubuBounce({
  size = 100,
  className = "",
}: BubuFloatProps) {
  const fullText = "Today plan text";
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    let paused = false;

    const interval = setInterval(() => {
      if (paused) return;

      setText(fullText.slice(0, i + 1));
      i++;

      if (i === fullText.length) {
        paused = true;

        setTimeout(() => {
          setText("");
          i = 0;
          paused = false;
        }, 1500);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return <pre>{JSON.stringify({ text, size, className }, null, 2)}</pre>;
}
