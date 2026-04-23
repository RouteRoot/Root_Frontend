import { axiosInstance } from "@/shared/api/axiosInstance";

export type MeResponse = {
  loginId: string;
  name: string;
};

export const getMe = async (): Promise<MeResponse> => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};
