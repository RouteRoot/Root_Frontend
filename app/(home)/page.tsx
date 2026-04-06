"use client";

import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
        
        <section className="flex items-center justify-center px-8 py-16 lg:px-20">
          <div className="w-full max-w-[460px]">

            {/* Title */}
            <h1
              className={`
                ${playfair.className}
                text-[88px]
                leading-[0.85]
                tracking-[-0.05em]
                font-bold
                italic
                text-black
              `}
            >
              BBuri
            </h1>

            <h1
              className={`
                ${playfair.className}
                text-[88px]
                leading-[0.85]
                tracking-[-0.05em]
                font-bold
                italic
                text-black
              `}
            >
              Service
            </h1>

            {/* Description */}
            <p className="mt-6 text-[20px] leading-[1.6] text-[#222222]">
              AI-powered personalized career roadmap
              <br />
              and exam scheduling automation.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              
              <Link
                href="/login"
                className="
                  inline-flex h-[54px] min-w-[160px]
                  items-center justify-center
                  bg-black text-white
                  px-8 text-[15px] font-semibold
                  transition hover:opacity-90
                "
              >
                Use for Free
              </Link>

              <Link
                href="/signup"
                className="
                  inline-flex h-[54px] min-w-[160px]
                  items-center justify-center
                  border border-2 border-black
                  text-black
                  px-8 text-[15px] font-semibold
                  transition hover:bg-black hover:text-white
                "
              >
                Sign up
              </Link>
            </div>

            {/* Footer text */}
            <p className="mt-14 text-[14px] leading-[1.7] text-[#555]">
              <span className="font-semibold">BBuri</span> helps you design a realistic
              career roadmap based on your goals, major, available study time,
              and current skill level. Manage your exam schedule automatically
              and stay on track.
            </p>

          </div>
        </section>

        <section className="relative hidden min-h-screen lg:block">
          
          <div className="absolute inset-0 bg-black" />

          <div className="relative h-full w-full">
            <Image
              src="/main-hero.png" 
              alt="people"
              fill
              priority
              className="object-cover grayscale"
            />
          </div>

          <div className="absolute inset-0 bg-black/10" />
        </section>

      </div>
    </main>
  );
}