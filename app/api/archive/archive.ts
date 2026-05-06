import { axiosInstance } from "../axios/axiosInstance";
import type {
  ArchiveBoardType,
  ArchivePost,
  ArchivePostPage,
  ArchivePostRequest,
  ArchivePostUpdateRequest,
  ArchiveSort,
} from "./types";

type GetArchivePostsParams = {
  boardType?: ArchiveBoardType;
  sort?: ArchiveSort;
  page?: number;
  size?: number;
  keyword?: string;
};

function toArchiveFormData(
  data: ArchivePostRequest | ArchivePostUpdateRequest
) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("boardType", data.boardType);
  formData.append("category", data.category);

  return formData;
}

export async function getArchivePosts({
  boardType,
  sort = "latest",
  page = 0,
  size = 6,
  keyword,
}: GetArchivePostsParams = {}): Promise<ArchivePostPage> {
  const response = await axiosInstance.get("/archive", {
    params: { boardType, sort, page, size, keyword },
  });
  return response.data;
}

export async function getArchivePopularPosts(
  limit = 5
): Promise<ArchivePost[]> {
  const response = await axiosInstance.get("/archive/popular", {
    params: { limit },
  });
  return response.data;
}

export async function getMyArchivePosts(): Promise<ArchivePost[]> {
  const response = await axiosInstance.get("/archive/my");
  return response.data;
}

export async function getArchivePostDetail(
  postId: number
): Promise<ArchivePost> {
  const response = await axiosInstance.get(`/archive/${postId}`);
  return response.data;
}

export async function createArchivePost(
  data: ArchivePostRequest
): Promise<ArchivePost> {
  const response = await axiosInstance.post("/archive", toArchiveFormData(data));
  return response.data;
}

export async function updateArchivePost(
  postId: number,
  data: ArchivePostUpdateRequest
): Promise<ArchivePost> {
  const response = await axiosInstance.put(
    `/archive/${postId}`,
    toArchiveFormData(data)
  );
  return response.data;
}

export async function deleteArchivePost(postId: number): Promise<string> {
  const response = await axiosInstance.delete(`/archive/${postId}`);
  return response.data;
}
