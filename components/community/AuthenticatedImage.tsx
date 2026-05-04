"use client";

import { ImgHTMLAttributes, useEffect, useMemo, useState } from "react";

type AuthenticatedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

function shouldFetchWithToken(src: string) {
  return (
    src.startsWith("/images/") ||
    src.startsWith("/uploads/") ||
    /^https?:\/\/13\.239\.246\.72:8080\/(?:images|uploads)\//i.test(src)
  );
}

function toRequestUrl(src: string) {
  if (!/^https?:\/\//i.test(src)) return src;

  try {
    const parsed = new URL(src);
    if (
      parsed.hostname === "13.239.246.72" &&
      parsed.port === "8080" &&
      (parsed.pathname.startsWith("/images/") ||
        parsed.pathname.startsWith("/uploads/"))
    ) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return src;
  }

  return src;
}

export default function AuthenticatedImage({
  src,
  alt,
  ...props
}: AuthenticatedImageProps) {
  const requestUrl = useMemo(() => toRequestUrl(src), [src]);
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    if (!shouldFetchWithToken(src)) {
      setDisplaySrc(src);
      return;
    }

    let objectUrl = "";
    let cancelled = false;

    async function loadImage() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(requestUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
          throw new Error(`Image request failed with ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setDisplaySrc(objectUrl);
        }
      } catch {
        if (!cancelled) {
          setDisplaySrc(src);
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [requestUrl, src]);

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={displaySrc} alt={alt} {...props} />;
}
