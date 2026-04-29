import { axiosInstance } from "../axios/axiosInstance";

type UploadPostImageResponse = {
  imageUrl: string;
};

export const uploadPostImage = async (
  image: File
): Promise<UploadPostImageResponse> => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axiosInstance.post("/posts/images", formData);
  return response.data;
};
