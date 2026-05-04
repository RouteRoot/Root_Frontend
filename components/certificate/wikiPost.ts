import type { Post } from "@/app/api/community/types";

export const WIKI_POST_CATEGORY = "자격증 위키";

export function isWikiPost(post: Post) {
  return post.category === WIKI_POST_CATEGORY;
}
