import { axiosInstance } from "../axios/axiosInstance";

export type UploadPostImageResponse = {
  imageUrl: string;
};

type RawUploadPostImageResponse =
  | string
  | {
      imageUrl?: string;
      url?: string;
      imagePath?: string;
      fileUrl?: string;
      path?: string;
      data?: {
        imageUrl?: string;
        url?: string;
        imagePath?: string;
        fileUrl?: string;
        path?: string;
      };
    };

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://13.239.246.72:8080";

export function normalizePostImageUrl(url: string) {
  const nextUrl = url.trim();

  if (!nextUrl) return "";
  if (/^https?:\/\//i.test(nextUrl)) {
    try {
      const parsed = new URL(nextUrl);
      const apiOrigin = new URL(API_ORIGIN);

      if (
        parsed.origin === apiOrigin.origin &&
        (parsed.pathname.startsWith("/images/") ||
          parsed.pathname.startsWith("/uploads/"))
      ) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return nextUrl;
    }

    return nextUrl;
  }
  if (nextUrl.startsWith("/api/")) return nextUrl;
  if (nextUrl.startsWith("/images/") || nextUrl.startsWith("/uploads/")) {
    return nextUrl;
  }
  if (nextUrl.startsWith("images/") || nextUrl.startsWith("uploads/")) {
    return `/${nextUrl}`;
  }
  if (nextUrl.startsWith("/")) return `${API_ORIGIN}${nextUrl}`;

  return `${API_ORIGIN}/${nextUrl}`;
}

function extractImageUrl(data: RawUploadPostImageResponse) {
  if (typeof data === "string") return data;

  return (
    data.imageUrl ??
    data.url ??
    data.imagePath ??
    data.fileUrl ??
    data.path ??
    data.data?.imageUrl ??
    data.data?.url ??
    data.data?.imagePath ??
    data.data?.fileUrl ??
    data.data?.path ??
    ""
  );
}

async function postImage(fieldName: "image" | "file", image: File) {
  const formData = new FormData();
  formData.append(fieldName, image);

  const response = await axiosInstance.post<RawUploadPostImageResponse>(
    "/posts/images",
    formData
  );
  const imageUrl = normalizePostImageUrl(extractImageUrl(response.data));

  if (!imageUrl) {
    throw new Error("Image upload response does not include an image url.");
  }

  return { imageUrl };
}

export const uploadPostImage = async (
  image: File
): Promise<UploadPostImageResponse> => {
  try {
    return await postImage("image", image);
  } catch (error: unknown) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "status" in error.response
        ? error.response.status
        : undefined;

    if (status === 400 || status === 415 || status === 500) {
      return postImage("file", image);
    }

    throw error;
  }
};
