"use client";

type Props = {
  targetId: string;
};

export default function ScrollDownButton({ targetId }: Props) {
  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <button
        onClick={handleScroll}
        aria-label="scroll down"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 hover:opacity-80 transition"
      >
        <svg
          width="56"
          height="22"
          viewBox="0 0 56 22"
          fill="none"
          className="scroll-arrow"
        >
          <path
            d="M10 7 L28 17 L46 7"
            stroke="#949494"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <style jsx>{`
        .scroll-arrow {
          animation: scrollArrow 1.6s ease-in-out infinite;
        }

        @keyframes scrollArrow {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-6px);
            opacity: 0.25;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
