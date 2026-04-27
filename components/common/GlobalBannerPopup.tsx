"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "bburi-global-top-banner-dismissed-v2";
const STORAGE_EVENT = "bburi-global-banner-storage";
const BANNER_HEIGHT = "52px";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

export default function GlobalBannerPopup() {
  const isDismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--global-banner-height",
      isDismissed ? "0px" : BANNER_HEIGHT
    );

    return () => {
      document.documentElement.style.removeProperty("--global-banner-height");
    };
  }, [isDismissed]);

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Community banner"
      className="fixed inset-x-0 top-0 z-[80] bg-[#00273A]"
      style={{ height: "var(--global-banner-height)" }}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[1920px] items-center justify-center">
        <Link href="/community" className="block h-full w-full">
          <Image
            src="/main-banner.svg"
            alt="Go to community"
            width={1200}
            height={104}
            priority
            className="h-full w-full object-fill"
          />
        </Link>

        <button
          type="button"
          aria-label="Close banner"
          onClick={handleClose}
          className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
