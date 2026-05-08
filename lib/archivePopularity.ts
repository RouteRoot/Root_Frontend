import type { ArchivePost } from "@/app/api/archive/types";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function popularityScore(post: ArchivePost): number {
  return post.viewCount * 1 + post.likeCount * 8 + post.commentCount * 4;
}

function isWithinSevenDays(post: ArchivePost): boolean {
  const createdAt = new Date(post.createdAt).getTime();
  return Date.now() - createdAt <= SEVEN_DAYS_MS;
}

/**
 * 7일 이내 게시글이 있으면 그것만, 없으면 전체를 가중치 점수로 정렬해 반환.
 * score = viewCount × 1 + likeCount × 8 + commentCount × 4
 */
export function getWeightedPopularPosts(posts: ArchivePost[]): ArchivePost[] {
  if (posts.length === 0) return [];

  const recentPosts = posts.filter(isWithinSevenDays);
  const source = recentPosts.length > 0 ? recentPosts : posts;

  return [...source].sort((a, b) => popularityScore(b) - popularityScore(a));
}
