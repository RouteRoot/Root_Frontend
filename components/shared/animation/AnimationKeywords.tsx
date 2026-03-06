"use client";

import { useEffect, useState } from "react";

const keywords = ["컴퓨터", "IT", "디자인", "데이터", "개발", "AI"];

export default function AnimatedKeyword() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % keywords.length);
        setAnimate(true);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block transition-all duration-500 ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      {keywords[index]}
    </span>
  );
}
