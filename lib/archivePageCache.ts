import {
  getArchivePopularPosts,
  getArchivePostDetail,
  getArchivePosts,
} from "@/app/api/archive/archive";
import type {
  ArchiveBoardType,
  ArchivePost,
  ArchivePostPage,
  ArchiveSort,
} from "@/app/api/archive/types";
import {
  getAllCertificates,
  type CertificateDetail,
} from "@/app/api/certificate/certificate";

const CACHE_TTL = 5 * 60 * 1000;
const TOP_CERTIFICATE_SIZE = 10;

type CacheEntry<T> = {
  expiresAt: number;
  promise: Promise<T>;
};

const archivePageCache = new Map<string, CacheEntry<ArchivePostPage>>();
const archiveDetailCache = new Map<number, CacheEntry<ArchivePost>>();
const archivePopularCache = new Map<number, CacheEntry<ArchivePost[]>>();
let topCertificatesCache: CacheEntry<CertificateDetail[]> | null = null;

function isFresh<T>(entry: CacheEntry<T> | undefined | null) {
  return Boolean(entry && entry.expiresAt > Date.now());
}

function withExpiry<T>(promise: Promise<T>): CacheEntry<T> {
  return {
    expiresAt: Date.now() + CACHE_TTL,
    promise,
  };
}

export function getCachedArchivePosts({
  boardType,
  sort = "latest",
  page = 0,
  size = 6,
}: {
  boardType?: ArchiveBoardType;
  sort?: ArchiveSort;
  page?: number;
  size?: number;
}) {
  const key = `${boardType ?? "all"}:${sort}:${page}:${size}`;
  const cached = archivePageCache.get(key);
  if (isFresh(cached)) return cached!.promise;

  const entry = withExpiry(getArchivePosts({ boardType, sort, page, size }));
  archivePageCache.set(key, entry);
  return entry.promise;
}

export function getCachedArchivePostDetail(postId: number) {
  const cached = archiveDetailCache.get(postId);
  if (isFresh(cached)) return cached!.promise;

  const entry = withExpiry(getArchivePostDetail(postId));
  archiveDetailCache.set(postId, entry);
  return entry.promise;
}

export function getCachedArchivePopularPosts(limit = 10) {
  const cached = archivePopularCache.get(limit);
  if (isFresh(cached)) return cached!.promise;

  const entry = withExpiry(getArchivePopularPosts(limit));
  archivePopularCache.set(limit, entry);
  return entry.promise;
}

export function getCachedTopCertificates() {
  if (isFresh(topCertificatesCache)) return topCertificatesCache!.promise;

  topCertificatesCache = withExpiry(
    getAllCertificates(0, TOP_CERTIFICATE_SIZE).then((page) =>
      [...page.content]
        .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        .slice(0, 10)
    )
  );

  return topCertificatesCache.promise;
}
